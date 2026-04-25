"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, X, CreditCard, Shield, ArrowLeft, Crown, Zap, TrendingUp } from "lucide-react"

interface PricingTier {
  id: string
  name: string
  price: number
  billingPeriod: "monthly" | "yearly"
  description: string
  features: string[]
  limitations: string[]
  popular?: boolean
  icon: React.ReactNode
  maxLocations: number
  maxEmployees: number
  maxCustomers: number
}

interface SignupData {
  // Business Information
  businessName: string
  businessType: string
  numberOfLocations: number
  numberOfEmployees: number

  // Owner Information
  firstName: string
  lastName: string
  email: string
  phone: string

  // Billing Information
  billingAddress: string
  city: string
  state: string
  zipCode: string
  country: string

  // Payment Information
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string

  // Selected Plan
  selectedTier: string
  billingCycle: "monthly" | "yearly"

  // Terms
  agreeToTerms: boolean
  agreeToMarketing: boolean
}

interface PricingPageProps {
  onSignup: (data: SignupData) => Promise<void>
  onBack: () => void
  initialPlan?: string
}

export default function PricingPage({ onSignup, onBack, initialPlan = "" }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedTier, setSelectedTier] = useState<string>(initialPlan)
  const [currentStep, setCurrentStep] = useState<"pricing" | "business" | "owner" | "billing" | "payment" | "review">(
    "pricing",
  )
  const [signupData, setSignupData] = useState<SignupData>({
    businessName: "",
    businessType: "",
    numberOfLocations: 1,
    numberOfEmployees: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    selectedTier: "",
    billingCycle: "monthly",
    agreeToTerms: false,
    agreeToMarketing: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")

  const pricingTiers: PricingTier[] = [
    {
      id: "starter",
      name: "Starter",
      price: billingCycle === "monthly" ? 29 : 290,
      billingPeriod: billingCycle,
      description: "Perfect for small salons just getting started",
      icon: <Zap className="h-6 w-6" />,
      maxLocations: 1,
      maxEmployees: 5,
      maxCustomers: 500,
      features: [
        "1 Location",
        "Up to 5 Employees",
        "500 Customer Records",
        "Basic Appointment Scheduling",
        "Point of Sale System",
        "Basic Reporting",
        "Email Support",
        "Mobile App Access",
        "Payment Processing",
        "Customer SMS Reminders",
      ],
      limitations: ["No advanced analytics", "No inventory management", "No employee management", "No marketing tools"],
    },
    {
      id: "professional",
      name: "Professional",
      price: billingCycle === "monthly" ? 79 : 790,
      billingPeriod: billingCycle,
      description: "Ideal for growing salons with multiple staff",
      icon: <TrendingUp className="h-6 w-6" />,
      maxLocations: 2,
      maxEmployees: 15,
      maxCustomers: 2000,
      popular: true,
      features: [
        "2 Locations",
        "Up to 15 Employees",
        "2,000 Customer Records",
        "Advanced Appointment Scheduling",
        "Complete POS System",
        "Employee Management",
        "Inventory Management",
        "Turn Management System",
        "Advanced Reporting & Analytics",
        "Customer CRM",
        "Marketing Campaigns",
        "Commission Tracking",
        "Priority Email Support",
        "Phone Support",
        "Mobile App Access",
        "Payment Processing",
        "SMS & Email Marketing",
        "Loyalty Programs",
      ],
      limitations: ["Limited to 2 locations", "No white-label options"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingCycle === "monthly" ? 149 : 1490,
      billingPeriod: billingCycle,
      description: "For large salon chains and franchises",
      icon: <Crown className="h-6 w-6" />,
      maxLocations: 999,
      maxEmployees: 999,
      maxCustomers: 50000,
      features: [
        "Unlimited Locations",
        "Unlimited Employees",
        "50,000+ Customer Records",
        "Enterprise Appointment System",
        "Complete POS Suite",
        "Advanced Employee Management",
        "Full Inventory Management",
        "Multi-Location Management",
        "Advanced Turn Management",
        "Comprehensive Analytics",
        "Advanced CRM",
        "Marketing Automation",
        "Commission & Payroll",
        "24/7 Priority Support",
        "Dedicated Account Manager",
        "Mobile App Access",
        "Payment Processing",
        "White-label Options",
        "API Access",
        "Custom Integrations",
        "Advanced Security",
        "Data Export Tools",
      ],
      limitations: [],
    },
  ]

  const validateStep = (step: string): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case "business":
        if (!signupData.businessName.trim()) newErrors.businessName = "Business name is required"
        if (!signupData.businessType) newErrors.businessType = "Business type is required"
        if (signupData.numberOfLocations < 1) newErrors.numberOfLocations = "Must have at least 1 location"
        if (signupData.numberOfEmployees < 1) newErrors.numberOfEmployees = "Must have at least 1 employee"
        break

      case "owner":
        if (!signupData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!signupData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!signupData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(signupData.email)) newErrors.email = "Invalid email format"
        if (!signupData.phone.trim()) newErrors.phone = "Phone number is required"
        break

      case "billing":
        if (!signupData.billingAddress.trim()) newErrors.billingAddress = "Address is required"
        if (!signupData.city.trim()) newErrors.city = "City is required"
        if (!signupData.state.trim()) newErrors.state = "State is required"
        if (!signupData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
        break

      case "payment":
        if (!signupData.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
        if (!signupData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
        if (!signupData.cvv.trim()) newErrors.cvv = "CVV is required"
        if (!signupData.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"
        break

      case "review":
        if (!signupData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms of service"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    const steps = ["pricing", "business", "owner", "billing", "payment", "review"]
    const currentIndex = steps.indexOf(currentStep)

    if (currentStep === "pricing" && !selectedTier) {
      setErrors({ selectedTier: "Please select a plan" })
      return
    }

    if (validateStep(currentStep)) {
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1] as any)
      }
    }
  }

  const handleBack = () => {
    const steps = ["pricing", "business", "owner", "billing", "payment", "review"]
    const currentIndex = steps.indexOf(currentStep)

    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1] as any)
    } else {
      onBack()
    }
  }

  const handleSubmit = async () => {
    if (!validateStep("review")) return

    setIsLoading(true)
    setSubmitError("")

    try {
      const finalData = {
        ...signupData,
        selectedTier,
        billingCycle,
      }
      await onSignup(finalData)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSignupData = (field: keyof SignupData, value: any) => {
    setSignupData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const selectedTierData = pricingTiers.find((tier) => tier.id === selectedTier)
  const yearlyDiscount = billingCycle === "yearly" ? 20 : 0

  if (currentStep === "pricing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button variant="ghost" onClick={onBack} className="absolute left-4 top-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to glamourpos.com
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">💅 Choose Your Plan</h1>
            <p className="text-xl text-gray-600 mb-6">
              Transform your salon management with our comprehensive POS system
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={billingCycle === "monthly" ? "font-semibold" : "text-gray-500"}>Monthly</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="relative"
              >
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${billingCycle === "yearly" ? "bg-pink-600" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform transform ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0.5"} mt-0.5`}
                  />
                </div>
              </Button>
              <span className={billingCycle === "yearly" ? "font-semibold" : "text-gray-500"}>
                Yearly
                {billingCycle === "yearly" && (
                  <Badge variant="secondary" className="ml-2">
                    Save 20%
                  </Badge>
                )}
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  selectedTier === tier.id ? "ring-2 ring-pink-600 shadow-lg" : ""
                } ${tier.popular ? "border-pink-600" : ""}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-pink-600 text-white">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">{tier.icon}</div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-pink-600">
                    ${tier.price}
                    <span className="text-lg text-gray-500">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="text-sm text-green-600">
                      Save ${Math.round((tier.price / 10) * 12 - tier.price)} per year
                    </p>
                  )}
                  <p className="text-gray-600">{tier.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="text-sm font-semibold text-gray-700">Includes:</div>
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}

                    {tier.limitations.length > 0 && (
                      <>
                        <div className="text-sm font-semibold text-gray-700 mt-4">Limitations:</div>
                        {tier.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <Button
                    className={`w-full ${selectedTier === tier.id ? "bg-pink-600 hover:bg-pink-700" : ""}`}
                    variant={selectedTier === tier.id ? "default" : "outline"}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    {selectedTier === tier.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {errors.selectedTier && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.selectedTier}</AlertDescription>
            </Alert>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <Button size="lg" onClick={handleNext} disabled={!selectedTier} className="bg-pink-600 hover:bg-pink-700">
              Continue with {selectedTierData?.name} Plan
            </Button>
          </div>

          {/* Features Comparison */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Feature</th>
                    {pricingTiers.map((tier) => (
                      <th key={tier.id} className="text-center p-4">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Locations</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.maxLocations === 999 ? "Unlimited" : tier.maxLocations}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Employees</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.maxEmployees === 999 ? "Unlimited" : `Up to ${tier.maxEmployees}`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Customer Records</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.maxCustomers === 50000 ? "50,000+" : tier.maxCustomers.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Advanced Analytics</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.id === "starter" ? (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        ) : (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Inventory Management</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.id === "starter" ? (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        ) : (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Marketing Tools</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.id === "starter" ? (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        ) : (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">API Access</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.id === "enterprise" ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Multi-step form for other steps
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Complete Your Signup</h1>
            <div className="w-16" /> {/* Spacer */}
          </div>

          <div className="flex items-center justify-between mb-2">
            {["Business", "Owner", "Billing", "Payment", "Review"].map((step, index) => {
              const stepNames = ["business", "owner", "billing", "payment", "review"]
              const currentIndex = stepNames.indexOf(currentStep)
              const isActive = index <= currentIndex
              const isCurrent = index === currentIndex

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isActive ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                    } ${isCurrent ? "ring-2 ring-pink-300" : ""}`}
                  >
                    {index + 1}
                  </div>
                  {index < 4 && <div className={`w-16 h-1 mx-2 ${isActive ? "bg-pink-600" : "bg-gray-200"}`} />}
                </div>
              )
            })}
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            {["Business", "Owner", "Billing", "Payment", "Review"].map((step) => (
              <span key={step} className="w-8 text-center">
                {step}
              </span>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === "business" && "Business Information"}
              {currentStep === "owner" && "Owner Information"}
              {currentStep === "billing" && "Billing Address"}
              {currentStep === "payment" && "Payment Information"}
              {currentStep === "review" && "Review & Confirm"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {currentStep === "business" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={signupData.businessName}
                    onChange={(e) => updateSignupData("businessName", e.target.value)}
                    placeholder="Your Salon Name"
                  />
                  {errors.businessName && <p className="text-sm text-red-600">{errors.businessName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={signupData.businessType}
                    onValueChange={(value) => updateSignupData("businessType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nail-salon">Nail Salon</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                      <SelectItem value="beauty-salon">Beauty Salon</SelectItem>
                      <SelectItem value="barbershop">Barbershop</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessType && <p className="text-sm text-red-600">{errors.businessType}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfLocations">Number of Locations *</Label>
                    <Input
                      id="numberOfLocations"
                      type="number"
                      min="1"
                      value={signupData.numberOfLocations}
                      onChange={(e) => updateSignupData("numberOfLocations", Number.parseInt(e.target.value) || 1)}
                    />
                    {errors.numberOfLocations && <p className="text-sm text-red-600">{errors.numberOfLocations}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                    <Input
                      id="numberOfEmployees"
                      type="number"
                      min="1"
                      value={signupData.numberOfEmployees}
                      onChange={(e) => updateSignupData("numberOfEmployees", Number.parseInt(e.target.value) || 1)}
                    />
                    {errors.numberOfEmployees && <p className="text-sm text-red-600">{errors.numberOfEmployees}</p>}
                  </div>
                </div>
              </>
            )}

            {currentStep === "owner" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={signupData.firstName}
                      onChange={(e) => updateSignupData("firstName", e.target.value)}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={signupData.lastName}
                      onChange={(e) => updateSignupData("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => updateSignupData("email", e.target.value)}
                    placeholder="john@yoursalon.com"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => updateSignupData("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>
              </>
            )}

            {currentStep === "billing" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Address *</Label>
                  <Input
                    id="billingAddress"
                    value={signupData.billingAddress}
                    onChange={(e) => updateSignupData("billingAddress", e.target.value)}
                    placeholder="123 Main Street"
                  />
                  {errors.billingAddress && <p className="text-sm text-red-600">{errors.billingAddress}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={signupData.city}
                      onChange={(e) => updateSignupData("city", e.target.value)}
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={signupData.state}
                      onChange={(e) => updateSignupData("state", e.target.value)}
                      placeholder="NY"
                    />
                    {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={signupData.zipCode}
                      onChange={(e) => updateSignupData("zipCode", e.target.value)}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={signupData.country} onValueChange={(value) => updateSignupData("country", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {currentStep === "payment" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name *</Label>
                  <Input
                    id="cardholderName"
                    value={signupData.cardholderName}
                    onChange={(e) => updateSignupData("cardholderName", e.target.value)}
                    placeholder="John Doe"
                  />
                  {errors.cardholderName && <p className="text-sm text-red-600">{errors.cardholderName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={signupData.cardNumber}
                    onChange={(e) => updateSignupData("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-sm text-red-600">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      value={signupData.expiryDate}
                      onChange={(e) => updateSignupData("expiryDate", e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiryDate && <p className="text-sm text-red-600">{errors.expiryDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={signupData.cvv}
                      onChange={(e) => updateSignupData("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvv && <p className="text-sm text-red-600">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                  </span>
                </div>
              </>
            )}

            {currentStep === "review" && (
              <>
                <div className="space-y-6">
                  {/* Plan Summary */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Selected Plan</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{selectedTierData?.name}</p>
                        <p className="text-sm text-gray-600">{selectedTierData?.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${selectedTierData?.price}</p>
                        <p className="text-sm text-gray-600">/{billingCycle === "monthly" ? "month" : "year"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Summary */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Business Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Business Name</p>
                        <p className="font-medium">{signupData.businessName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Business Type</p>
                        <p className="font-medium">{signupData.businessType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Locations</p>
                        <p className="font-medium">{signupData.numberOfLocations}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Employees</p>
                        <p className="font-medium">{signupData.numberOfEmployees}</p>
                      </div>
                    </div>
                  </div>

                  {/* Owner Summary */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Owner Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-medium">
                          {signupData.firstName} {signupData.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium">{signupData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium">{signupData.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">•••• •••• •••• {signupData.cardNumber.slice(-4)}</span>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={signupData.agreeToTerms}
                        onCheckedChange={(checked) => updateSignupData("agreeToTerms", checked)}
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the{" "}
                        <a href="#" className="text-pink-600 hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-pink-600 hover:underline">
                          Privacy Policy
                        </a>{" "}
                        *
                      </Label>
                    </div>
                    {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreeToMarketing"
                        checked={signupData.agreeToMarketing}
                        onCheckedChange={(checked) => updateSignupData("agreeToMarketing", checked)}
                      />
                      <Label htmlFor="agreeToMarketing" className="text-sm">
                        I would like to receive marketing emails about new features and updates
                      </Label>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>

              {currentStep === "review" ? (
                <div className="flex flex-col items-end gap-2">
                  {submitError && (
                    <p className="text-sm text-red-600 text-right">{submitError}</p>
                  )}
                  <Button onClick={handleSubmit} disabled={isLoading} className="bg-pink-600 hover:bg-pink-700">
                    {isLoading ? "Processing..." : "Complete Signup"}
                  </Button>
                </div>
              ) : (
                <Button onClick={handleNext} className="bg-pink-600 hover:bg-pink-700">
                  Continue
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
