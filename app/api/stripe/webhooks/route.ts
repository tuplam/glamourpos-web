import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe-server"
import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "customer.subscription.trial_will_end",
  "setup_intent.succeeded",
  "payment_method.attached",
  "customer.created",
  "invoice.created",
  "invoice.finalized",
])

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripe = getStripe()
  const supabaseAdmin = getSupabaseAdmin()

  let event

  try {
    if (!signature || !webhookSecret) return new Response("Webhook secret not found", { status: 400 })
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.log(`❌ Error message: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const eventType = event.type

  if (!relevantEvents.has(eventType)) {
    console.log("Irrelevant event:", eventType)
    return new Response("Irrelevant event", { status: 200 })
  }

  console.log("Relevant event:", eventType)

  try {
    switch (eventType) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as any
        await supabaseAdmin
          .from("subscriptions")
          .upsert({
            id: subscription.id,
            business_id: subscription.metadata.businessId,
            plan_id: subscription.plan.metadata.planId,
            status: subscription.status,
            metadata: subscription.metadata,
            price_id: subscription.plan.id,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            created_at: new Date(subscription.created * 1000).toISOString(),
          })
          .eq("id", subscription.id)
        break
      case "invoice.payment_succeeded":
        const invoice = event.data.object as any
        await supabaseAdmin
          .from("invoices")
          .upsert({
            id: invoice.id,
            business_id: invoice.metadata.businessId,
            subscription_id: invoice.subscription,
            stripe_invoice_id: invoice.id,
            amount_due: invoice.amount_due,
            amount_paid: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status,
            period_start: new Date(invoice.period_start * 1000).toISOString(),
            period_end: new Date(invoice.period_end * 1000).toISOString(),
            hosted_invoice_url: invoice.hosted_invoice_url,
            invoice_pdf: invoice.invoice_pdf,
            created_at: new Date(invoice.created * 1000).toISOString(),
          })
          .eq("id", invoice.id)
        break
      case "invoice.payment_failed":
        const invoiceFailed = event.data.object as any
        await supabaseAdmin
          .from("invoices")
          .upsert({
            id: invoiceFailed.id,
            business_id: invoiceFailed.metadata.businessId,
            subscription_id: invoiceFailed.subscription,
            stripe_invoice_id: invoiceFailed.id,
            amount_due: invoiceFailed.amount_due,
            amount_paid: invoiceFailed.amount_paid,
            currency: invoiceFailed.currency,
            status: invoiceFailed.status,
            period_start: new Date(invoiceFailed.period_start * 1000).toISOString(),
            period_end: new Date(invoiceFailed.period_end * 1000).toISOString(),
            hosted_invoice_url: invoiceFailed.hosted_invoice_url,
            invoice_pdf: invoiceFailed.invoice_pdf,
            created_at: new Date(invoiceFailed.created * 1000).toISOString(),
          })
          .eq("id", invoiceFailed.id)
        break
      case "customer.created":
        const customer = event.data.object as any
        await supabaseAdmin
          .from("businesses")
          .update({
            stripe_customer_id: customer.id,
          })
          .eq("id", customer.metadata.businessId)
        break
      case "setup_intent.succeeded":
        const setupIntent = event.data.object as any
        await supabaseAdmin
          .from("payment_methods")
          .upsert({
            id: setupIntent.payment_method,
            business_id: setupIntent.metadata.businessId,
            stripe_payment_method_id: setupIntent.payment_method,
            is_default: true,
          })
          .eq("id", setupIntent.payment_method)
        break
      case "payment_method.attached":
        const paymentMethod = event.data.object as any
        await supabaseAdmin
          .from("payment_methods")
          .upsert({
            id: paymentMethod.id,
            business_id: paymentMethod.metadata.businessId,
            stripe_payment_method_id: paymentMethod.id,
            card_last_four: paymentMethod.card.last4,
            card_brand: paymentMethod.card.brand,
            card_exp_month: paymentMethod.card.exp_month,
            card_exp_year: paymentMethod.card.exp_year,
            is_default: true,
          })
          .eq("id", paymentMethod.id)
        break
      default:
        throw new Error("Unhandled relevant event!")
    }
  } catch (error) {
    console.error("Error processing event:", error)
    return new NextResponse("Webhook error", { status: 500 })
  }

  console.log("Event processed:", eventType)
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
  })
}
