import Stripe from "stripe";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

async function loadProducts() {
  const raw = await readFile(path.join(root, "../shop-products.json"), "utf8");
  return JSON.parse(raw).products || [];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: "Stripe is not configured yet." });
  }

  try {
    const { productId } = req.body || {};
    if (typeof productId !== "string" || !/^[a-z0-9-]{1,80}$/.test(productId)) {
      return res.status(400).json({ error: "Choose a valid product." });
    }

    const products = await loadProducts();
    const product = products.find((item) => item.id === productId && item.active === true);
    if (!product) return res.status(404).json({ error: "Product not found." });

    // Never accept a price from the browser. The server reads the trusted catalogue.
    if (!Array.isArray(product.files) || product.files.length === 0) {
      return res.status(409).json({ error: "This pack is not ready for Stripe delivery yet. Its files must be migrated first." });
    }
    if (!Number.isFinite(product.price) || product.price <= 0 || !/^[a-z]{3}$/i.test(product.currency || "")) {
      return res.status(400).json({ error: "This product has an invalid price configuration." });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const siteUrl = (process.env.SITE_URL || "https://wordbloom.ca").replace(/\/$/, "");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: { name: product.title, description: product.description || undefined },
          unit_amount: Math.round(product.price * 100)
        },
        quantity: 1
      }],
      metadata: { productId: product.id },
      success_url: siteUrl + "/download.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: siteUrl + "/shop.html?checkout=cancelled",
      billing_address_collection: "auto"
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return res.status(500).json({ error: "Could not start checkout. Please try again." });
  }
}
