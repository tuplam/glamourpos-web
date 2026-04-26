export interface PricingTier {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  limits: string
  features: string[]
  popular?: boolean
  cta: string
  maxLocations: number
  maxEmployees: number
  maxCustomers: number
}

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "Perfect for small salons just getting started",
    limits: "1 location · 5 employees · 500 customers",
    popular: false,
    cta: "Start Free Trial",
    maxLocations: 1,
    maxEmployees: 5,
    maxCustomers: 500,
    features: [
      "Point of Sale System",
      "Basic Appointment Scheduling",
      "500 Customer Records",
      "Payment Processing",
      "Customer SMS Reminders",
      "Basic Reporting",
      "Mobile App Access",
      "Email Support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 79,
    yearlyPrice: 790,
    description: "Ideal for growing salons with multiple staff",
    limits: "2 locations · 15 employees · 2,000 customers",
    popular: true,
    cta: "Start Free Trial",
    maxLocations: 2,
    maxEmployees: 15,
    maxCustomers: 2000,
    features: [
      "Everything in Starter",
      "Turn Management System",
      "Employee Management",
      "Commission Tracking",
      "Inventory Management",
      "Customer CRM",
      "Marketing Campaigns",
      "SMS & Email Marketing",
      "Loyalty Programs",
      "Advanced Analytics",
      "Priority Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    description: "For large salon chains and franchises",
    limits: "Unlimited locations & employees · 50K+ customers",
    popular: false,
    cta: "Start Free Trial",
    maxLocations: 999,
    maxEmployees: 999,
    maxCustomers: 50000,
    features: [
      "Everything in Professional",
      "Unlimited Locations",
      "White-label Options",
      "API Access",
      "Custom Integrations",
      "Advanced Security",
      "Data Export Tools",
      "Dedicated Account Manager",
      "24/7 Priority Support",
    ],
  },
]
