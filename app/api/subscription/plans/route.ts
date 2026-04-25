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

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price_monthly", { ascending: true })

    if (error) {
      console.error("Error fetching plans:", error)
      return NextResponse.json({ error: "Failed to fetch subscription plans" }, { status: 500 })
    }

    // Transform the data to match the frontend interface
    const transformedPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      priceMonthly: plan.price_monthly,
      priceYearly: plan.price_yearly,
      maxLocations: plan.max_locations,
      maxEmployees: plan.max_employees,
      maxCustomers: plan.max_customers,
      features: plan.features || [],
      limitations: plan.limitations || [],
      isActive: plan.is_active,
    }))

    return NextResponse.json(transformedPlans)
  } catch (error) {
    console.error("Plans API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const planData = await request.json()

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "priceMonthly",
      "priceYearly",
      "maxLocations",
      "maxEmployees",
      "maxCustomers",
    ]

    for (const field of requiredFields) {
      if (planData[field] === undefined || planData[field] === null) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const { data: plan, error } = await supabase
      .from("subscription_plans")
      .insert({
        name: planData.name,
        description: planData.description,
        price_monthly: planData.priceMonthly,
        price_yearly: planData.priceYearly,
        max_locations: planData.maxLocations,
        max_employees: planData.maxEmployees,
        max_customers: planData.maxCustomers,
        features: planData.features || [],
        limitations: planData.limitations || [],
        is_active: planData.isActive !== false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating plan:", error)
      return NextResponse.json({ error: "Failed to create subscription plan" }, { status: 500 })
    }

    return NextResponse.json({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      priceMonthly: plan.price_monthly,
      priceYearly: plan.price_yearly,
      maxLocations: plan.max_locations,
      maxEmployees: plan.max_employees,
      maxCustomers: plan.max_customers,
      features: plan.features || [],
      limitations: plan.limitations || [],
      isActive: plan.is_active,
    })
  } catch (error) {
    console.error("Plan creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
