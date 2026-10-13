import Stripe from "stripe";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: "Stripe is not configured yet." });
  const sessionId = typeof req.query.session_id === "string" ? req.query.session_id : "";
  if (!sessionId.startsWith("cs_")) return res.status(400).json({ error: "Invalid checkout session." });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" || session.mode !== "payment") return res.status(403).json({ error: "Payment has not been confirmed." });
    const raw = await readFile(path.join(root, "../shop-products.json"), "utf8");
    const products = JSON.parse(raw).products || [];
    const product = products.find((item) => item.id === session.metadata?.productId && item.active === true);
    if (!product || !Array.isArray(product.files) || product.files.length === 0) return res.status(404).json({ error: "Files for this pack have not been migrated yet." });
    const files = product.files.map((file) => ({ name: String(file.name || "Download").replace(/[<>\r\n]/g, "") }));
    return res.status(200).json({ title: product.title, files });
  } catch (error) {
    console.error("Download list error:", error.message);
    return res.status(500).json({ error: "Could not verify this purchase." });
  }
}
