import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const signupData = await request.json()

    // Validate required fields
    const requiredFields = [
      "businessName",
      "businessType",
      "firstName",
      "lastName",
      "email",
      "phone",
      "selectedTier",
      "billingCycle",
    ]

    for (const field of requiredFields) {
      if (!signupData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if email already exists
    const { data: existingBusiness } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_email", signupData.email)
      .single()

    if (existingBusiness) {
      return NextResponse.json({ error: "A business with this email already exists" }, { status: 409 })
    }

    // Get the selected plan
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("name", signupData.selectedTier)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Invalid subscription plan" }, { status: 400 })
    }

    // Create business record
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        name: signupData.businessName,
        business_type: signupData.businessType,
        number_of_locations: signupData.numberOfLocations || 1,
        number_of_employees: signupData.numberOfEmployees || 1,
        owner_first_name: signupData.firstName,
        owner_last_name: signupData.lastName,
        owner_email: signupData.email,
        owner_phone: signupData.phone,
        billing_address: signupData.billingAddress,
        billing_city: signupData.city,
        billing_state: signupData.state,
        billing_zip_code: signupData.zipCode,
        billing_country: signupData.country || "US",
      })
      .select()
      .single()

    if (businessError) {
      console.error("Business creation error:", businessError)
      return NextResponse.json({ error: "Failed to create business account" }, { status: 500 })
    }

    // Create subscription record
    const trialDays = 14
    const currentPeriodStart = new Date()
    const currentPeriodEnd = new Date()
    const trialEnd = new Date()

    if (signupData.billingCycle === "yearly") {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
    }

    trialEnd.setDate(trialEnd.getDate() + trialDays)

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        business_id: business.id,
        plan_id: plan.id,
        status: "active",
        billing_cycle: signupData.billingCycle,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        trial_start: currentPeriodStart.toISOString(),
        trial_end: trialEnd.toISOString(),
      })
      .select()
      .single()

    if (subscriptionError) {
      console.error("Subscription creation error:", subscriptionError)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }

    // Initialize usage tracking
    const usageTypes = ["locations", "employees", "customers", "appointments"]
    const usageInserts = usageTypes.map((type) => ({
      business_id: business.id,
      subscription_id: subscription.id,
      usage_type: type,
      current_count: 0,
      limit_count:
        type === "locations"
          ? plan.max_locations
          : type === "employees"
            ? plan.max_employees
            : type === "customers"
              ? plan.max_customers
              : 1000,
      period_start: currentPeriodStart.toISOString(),
      period_end: currentPeriodEnd.toISOString(),
    }))

    const { error: usageError } = await supabase.from("subscription_usage").insert(usageInserts)

    if (usageError) {
      console.error("Usage tracking creation error:", usageError)
      // Don't fail the signup for this, just log it
    }

    // In a real implementation, you would:
    // 1. Create Stripe customer
    // 2. Set up payment method
    // 3. Create Stripe subscription
    // 4. Send welcome email
    // 5. Set up initial salon data

    // For demo purposes, we'll simulate payment processing
    if (signupData.cardNumber) {
      // Simulate payment method creation
      const { error: paymentError } = await supabase.from("payment_methods").insert({
        business_id: business.id,
        card_last_four: signupData.cardNumber.slice(-4),
        card_brand: "visa", // In real implementation, detect from card number
        card_exp_month: Number.parseInt(signupData.expiryDate.split("/")[0]),
        card_exp_year: Number.parseInt("20" + signupData.expiryDate.split("/")[1]),
        is_default: true,
      })

      if (paymentError) {
        console.error("Payment method creation error:", paymentError)
      }
    }

    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        name: business.name,
        email: business.owner_email,
      },
      subscription: {
        id: subscription.id,
        plan: plan.name,
        status: subscription.status,
        trialEnd: subscription.trial_end,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
