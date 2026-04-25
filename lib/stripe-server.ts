/**
 * Centralised, singleton Stripe SDK instance for all **server-side** calls.
 *
 * Import with:
 *   import { stripe } from "@/lib/stripe-server"
 */

import Stripe from "stripe"

// ——— Update the API version below when Stripe releases a new stable version ———
const stripeApiVersion: Stripe.LatestApiVersion = "2025-05-28.basil"

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error("Missing required environment variable: STRIPE_SECRET_KEY")
  }

  return new Stripe(secretKey, {
    apiVersion: stripeApiVersion,
    appInfo: {
      name: "GlamourPOS",
      version: "0.1.0",
      url: "https://your-production-url.example", // optional
    },
  })
}
