import Stripe from "stripe";
import { get } from "@vercel/blob";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

async function loadProducts() {
  const raw = await readFile(path.join(root, "../shop-products.json"), "utf8");
  return JSON.parse(raw).products || [];
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: "Stripe is not configured yet." });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: "Secure download storage is not configured yet." });

  const sessionId = typeof req.query.session_id === "string" ? req.query.session_id : "";
  const fileIndex = Number.parseInt(req.query.file || "0", 10);
  if (!sessionId.startsWith("cs_") || !Number.isInteger(fileIndex) || fileIndex < 0) {
    return res.status(400).json({ error: "Invalid download request." });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" || session.mode !== "payment") {
      return res.status(403).json({ error: "Payment has not been confirmed." });
    }

    const productId = session.metadata?.productId;
    const products = await loadProducts();
    const product = products.find((item) => item.id === productId && item.active === true);
    if (!product || !Array.isArray(product.files) || !product.files[fileIndex]) {
      return res.status(404).json({ error: "Download not found." });
    }

    const file = product.files[fileIndex];
    if (typeof file.path !== "string" || !file.path.startsWith("packs/") || file.path.includes("..")) {
      return res.status(404).json({ error: "This product's files are not configured yet." });
    }

    const blob = await get(file.path, { access: "private" });
    if (!blob || !blob.stream) return res.status(404).json({ error: "File not found." });

    const safeName = String(file.name || path.basename(file.path)).replace(/[\r\n"\\]/g, "_");
    res.setHeader("Content-Type", file.type || "application/octet-stream");
    res.setHeader("Content-Disposition", 'attachment; filename="' + safeName + '"');
    res.setHeader("Cache-Control", "private, no-store, max-age=0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const reader = blob.stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!res.write(Buffer.from(value))) await new Promise((resolve) => res.once("drain", resolve));
      }
      return res.end();
    } catch (streamError) {
      console.error("Private download stream error:", streamError.message);
      if (!res.headersSent) return res.status(500).json({ error: "Download failed. Please contact support." });
      return res.end();
    }
  } catch (error) {
    console.error("Download verification error:", error.message);
    return res.status(500).json({ error: "Could not verify this download." });
  }
}
