"use client"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, X, CreditCard, Shield, ArrowLeft, Crown, Zap, TrendingUp } from "lucide-react"
import { pricingTiers } from "@/lib/pricing-data"
import Nav from "@/components/marketing/nav"

const planIcons = { starter: Zap, professional: TrendingUp, enterprise: Crown }

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
  initialBilling?: "monthly" | "yearly"
  embedded?: boolean
  onPlanSelected?: (tier: string, billingCycle: "monthly" | "yearly") => void
}

export default function PricingPage({ onSignup, onBack, initialPlan = "", initialBilling = "monthly", embedded = false, onPlanSelected }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(initialBilling)
  const [selectedTier, setSelectedTier] = useState<string>(initialPlan)
  const [currentStep, setCurrentStep] = useState<"pricing" | "business" | "owner" | "billing" | "payment" | "review">(
    initialPlan ? "business" : "pricing",
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

    if (currentStep === "pricing" && embedded && onPlanSelected) {
      onPlanSelected(selectedTier, billingCycle)
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
  const selectedTierPrice = billingCycle === "yearly" ? selectedTierData?.yearlyPrice : selectedTierData?.monthlyPrice

  if (currentStep === "pricing") {
    const pricingCards = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {pricingTiers.map((tier) => {
            const Icon = planIcons[tier.id as keyof typeof planIcons]
            const price = billingCycle === "yearly" ? tier.yearlyPrice : tier.monthlyPrice
            const period = billingCycle === "yearly" ? "/ year" : "/ month"
            const isSelected = selectedTier === tier.id

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative flex flex-col bg-white rounded-2xl p-8 border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-pink-500 ring-2 ring-pink-500 shadow-xl scale-[1.03]"
                    : tier.popular
                    ? "border-pink-400 ring-2 ring-pink-400 shadow-xl scale-[1.03]"
                    : "border-gray-200 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-4 py-1 text-xs font-semibold shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tier.popular
                        ? "bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${tier.popular ? "text-white" : "text-gray-600"}`} />
                  </div>
                  <div className="font-bold text-gray-900">{tier.name}</div>
                </div>

                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{tier.description}</p>

                <div className="mb-2">
                  <span className="text-4xl font-extrabold text-gray-900">${price}</span>
                  <span className="text-gray-400 text-sm ml-1">{period}</span>
                </div>
                <p className="text-xs text-gray-400 mb-6">{tier.limits}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          tier.popular ? "text-pink-500" : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-full font-semibold ${
                    isSelected || tier.popular
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-pink-500/20"
                      : "bg-gray-900 hover:bg-gray-800 text-white border-0"
                  }`}
                  onClick={(e) => { e.stopPropagation(); setSelectedTier(tier.id) }}
                >
                  {isSelected ? "Selected ✓" : "Select Plan"}
                </Button>
              </div>
            )
          })}
        </div>

        {errors.selectedTier && (
          <Alert variant="destructive" className="mt-6 max-w-md mx-auto">
            <AlertDescription>{errors.selectedTier}</AlertDescription>
          </Alert>
        )}

        <div className="text-center mt-10">
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!selectedTier}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-8 font-semibold shadow-lg shadow-pink-500/20 disabled:opacity-50"
          >
            {selectedTierData ? `Continue with ${selectedTierData.name} Plan →` : "Select a Plan to Continue"}
          </Button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          All plans include a 14-day free trial · No credit card required · Cancel anytime
        </p>

        {/* Feature Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Feature Comparison</h2>
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-gray-700 font-semibold">Feature</th>
                  {pricingTiers.map((tier) => (
                    <th key={tier.id} className="text-center p-4 text-gray-700 font-semibold">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-700">Locations</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4 text-sm text-gray-600">
                      {tier.maxLocations === 999 ? "Unlimited" : tier.maxLocations}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-700">Employees</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4 text-sm text-gray-600">
                      {tier.maxEmployees === 999 ? "Unlimited" : `Up to ${tier.maxEmployees}`}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-700">Customer Records</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4 text-sm text-gray-600">
                      {tier.maxCustomers >= 50000 ? "50,000+" : tier.maxCustomers.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-700">Advanced Analytics</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">
                      {tier.id === "starter" ? (
                        <X className="h-4 w-4 text-red-400 mx-auto" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-700">Inventory Management</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">
                      {tier.id === "starter" ? (
                        <X className="h-4 w-4 text-red-400 mx-auto" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-700">Marketing Tools</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">
                      {tier.id === "starter" ? (
                        <X className="h-4 w-4 text-red-400 mx-auto" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-700">API Access</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center p-4">
                      {tier.id === "enterprise" ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    )

    if (embedded) {
      return (
        <section className="bg-gray-50 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-pink-500 mb-3">Pricing</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
                Start free for 14 days. No credit card required. Cancel anytime.
              </p>
              {/* Billing toggle */}
              <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-2 py-1.5 shadow-sm">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    billingCycle === "monthly" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    billingCycle === "yearly" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Yearly
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
            {pricingCards}
          </div>
        </section>
      )
    }

    return (
      <div className="min-h-screen">
        {/* Dark header matching home page */}
        <div className="marketing-hero-bg">
          <Nav />
          <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-pink-400 mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
              Start free for 14 days. No credit card required. Cancel anytime.
            </p>
            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-2 py-1.5">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-300 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingCycle === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-300 hover:text-white"
                }`}
              >
                Yearly
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing cards section */}
        <div className="bg-gray-50 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {pricingCards}
          </div>
        </div>
      </div>
    )
  }

  // Multi-step form for other steps
  const stepNames = ["business", "owner", "billing", "payment", "review"] as const
  const stepLabels = ["Business", "Owner", "Billing", "Payment", "Review"]
  const currentStepIndex = stepNames.indexOf(currentStep as typeof stepNames[number])

  const stepTitles: Record<string, string> = {
    business: "Business Information",
    owner: "Owner Information",
    billing: "Billing Address",
    payment: "Payment Information",
    review: "Review & Confirm",
  }

  const PlanPill = () => (
    selectedTierData ? (
      <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm text-sm flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
        <span className="font-medium text-gray-700">{selectedTierData.name}</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-500">${selectedTierPrice}/{billingCycle === "monthly" ? "mo" : "yr"}</span>
      </div>
    ) : null
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark header matching home page */}
      <div className="marketing-hero-bg">
        <Nav />
        <div className="max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Complete Your Signup</h1>
          <p className="text-sm text-gray-400">You're almost there. Fill in the details below to get started.</p>
          {selectedTierData && (
            <div className="inline-flex items-center gap-2 mt-4 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
              <span className="font-medium text-white">{selectedTierData.name}</span>
              <span className="text-white/40">·</span>
              <span className="text-gray-300">${selectedTierPrice}/{billingCycle === "monthly" ? "mo" : "yr"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Progress stepper */}
        <div className="flex items-center mb-8">
          {stepLabels.map((label, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isCompleted
                        ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25"
                        : isCurrent
                        ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25 ring-4 ring-pink-100"
                        : "bg-white border-2 border-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {index < stepLabels.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${isCompleted ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-gray-200"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">{stepTitles[currentStep]}</h2>
          </div>

          <div className="px-8 py-6 space-y-5">

            {/* ── Business ── */}
            {currentStep === "business" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">Business Name <span className="text-pink-500">*</span></Label>
                  <Input
                    id="businessName"
                    value={signupData.businessName}
                    onChange={(e) => updateSignupData("businessName", e.target.value)}
                    placeholder="Your Salon Name"
                    className={errors.businessName ? "border-red-400 focus-visible:ring-red-400" : ""}
                  />
                  {errors.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">Business Type <span className="text-pink-500">*</span></Label>
                  <Select value={signupData.businessType} onValueChange={(value) => updateSignupData("businessType", value)}>
                    <SelectTrigger className={errors.businessType ? "border-red-400" : ""}>
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
                  {errors.businessType && <p className="text-xs text-red-500">{errors.businessType}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="numberOfLocations" className="text-sm font-medium text-gray-700">Locations <span className="text-pink-500">*</span></Label>
                    <Input
                      id="numberOfLocations"
                      type="number"
                      min="1"
                      value={signupData.numberOfLocations}
                      onChange={(e) => updateSignupData("numberOfLocations", Number.parseInt(e.target.value) || 1)}
                      className={errors.numberOfLocations ? "border-red-400" : ""}
                    />
                    {errors.numberOfLocations && <p className="text-xs text-red-500">{errors.numberOfLocations}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="numberOfEmployees" className="text-sm font-medium text-gray-700">Employees <span className="text-pink-500">*</span></Label>
                    <Input
                      id="numberOfEmployees"
                      type="number"
                      min="1"
                      value={signupData.numberOfEmployees}
                      onChange={(e) => updateSignupData("numberOfEmployees", Number.parseInt(e.target.value) || 1)}
                      className={errors.numberOfEmployees ? "border-red-400" : ""}
                    />
                    {errors.numberOfEmployees && <p className="text-xs text-red-500">{errors.numberOfEmployees}</p>}
                  </div>
                </div>
              </>
            )}

            {/* ── Owner ── */}
            {currentStep === "owner" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name <span className="text-pink-500">*</span></Label>
                    <Input
                      id="firstName"
                      value={signupData.firstName}
                      onChange={(e) => updateSignupData("firstName", e.target.value)}
                      placeholder="John"
                      className={errors.firstName ? "border-red-400" : ""}
                    />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name <span className="text-pink-500">*</span></Label>
                    <Input
                      id="lastName"
                      value={signupData.lastName}
                      onChange={(e) => updateSignupData("lastName", e.target.value)}
                      placeholder="Doe"
                      className={errors.lastName ? "border-red-400" : ""}
                    />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address <span className="text-pink-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => updateSignupData("email", e.target.value)}
                    placeholder="john@yoursalon.com"
                    className={errors.email ? "border-red-400" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number <span className="text-pink-500">*</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => updateSignupData("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? "border-red-400" : ""}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </>
            )}

            {/* ── Billing ── */}
            {currentStep === "billing" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="billingAddress" className="text-sm font-medium text-gray-700">Street Address <span className="text-pink-500">*</span></Label>
                  <Input
                    id="billingAddress"
                    value={signupData.billingAddress}
                    onChange={(e) => updateSignupData("billingAddress", e.target.value)}
                    placeholder="123 Main Street"
                    className={errors.billingAddress ? "border-red-400" : ""}
                  />
                  {errors.billingAddress && <p className="text-xs text-red-500">{errors.billingAddress}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City <span className="text-pink-500">*</span></Label>
                    <Input
                      id="city"
                      value={signupData.city}
                      onChange={(e) => updateSignupData("city", e.target.value)}
                      placeholder="New York"
                      className={errors.city ? "border-red-400" : ""}
                    />
                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">State <span className="text-pink-500">*</span></Label>
                    <Input
                      id="state"
                      value={signupData.state}
                      onChange={(e) => updateSignupData("state", e.target.value)}
                      placeholder="NY"
                      className={errors.state ? "border-red-400" : ""}
                    />
                    {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">ZIP Code <span className="text-pink-500">*</span></Label>
                    <Input
                      id="zipCode"
                      value={signupData.zipCode}
                      onChange={(e) => updateSignupData("zipCode", e.target.value)}
                      placeholder="10001"
                      className={errors.zipCode ? "border-red-400" : ""}
                    />
                    {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
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

            {/* ── Payment ── */}
            {currentStep === "payment" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="cardholderName" className="text-sm font-medium text-gray-700">Cardholder Name <span className="text-pink-500">*</span></Label>
                  <Input
                    id="cardholderName"
                    value={signupData.cardholderName}
                    onChange={(e) => updateSignupData("cardholderName", e.target.value)}
                    placeholder="John Doe"
                    className={errors.cardholderName ? "border-red-400" : ""}
                  />
                  {errors.cardholderName && <p className="text-xs text-red-500">{errors.cardholderName}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">Card Number <span className="text-pink-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      value={signupData.cardNumber}
                      onChange={(e) => updateSignupData("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))}
                      placeholder="1234 5678 9012 3456"
                      className={`pr-10 ${errors.cardNumber ? "border-red-400" : ""}`}
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">Expiry Date <span className="text-pink-500">*</span></Label>
                    <Input
                      id="expiryDate"
                      value={signupData.expiryDate}
                      onChange={(e) => updateSignupData("expiryDate", e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={errors.expiryDate ? "border-red-400" : ""}
                    />
                    {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">CVV <span className="text-pink-500">*</span></Label>
                    <Input
                      id="cvv"
                      value={signupData.cvv}
                      onChange={(e) => updateSignupData("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className={errors.cvv ? "border-red-400" : ""}
                    />
                    {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 mt-2">
                  <Shield className="h-5 w-5 text-pink-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                  </span>
                </div>
              </>
            )}

            {/* ── Review ── */}
            {currentStep === "review" && (
              <div className="space-y-4">
                {/* Plan */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Selected Plan</p>
                  </div>
                  <div className="flex justify-between items-center px-4 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{selectedTierData?.name}</p>
                      <p className="text-sm text-gray-500">{selectedTierData?.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">${selectedTierPrice}</p>
                      <p className="text-xs text-gray-400">/{billingCycle === "monthly" ? "month" : "year"}</p>
                    </div>
                  </div>
                </div>

                {/* Business */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Business</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-4 py-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Business Name</p>
                      <p className="font-medium text-gray-900">{signupData.businessName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Business Type</p>
                      <p className="font-medium text-gray-900">{signupData.businessType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Locations</p>
                      <p className="font-medium text-gray-900">{signupData.numberOfLocations}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Employees</p>
                      <p className="font-medium text-gray-900">{signupData.numberOfEmployees}</p>
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Owner</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-4 py-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Name</p>
                      <p className="font-medium text-gray-900">{signupData.firstName} {signupData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Email</p>
                      <p className="font-medium text-gray-900">{signupData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Phone</p>
                      <p className="font-medium text-gray-900">{signupData.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Payment Method</p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">•••• •••• •••• {signupData.cardNumber.slice(-4)}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={signupData.agreeToTerms}
                      onCheckedChange={(checked) => updateSignupData("agreeToTerms", checked)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <a href="#" className="text-pink-500 hover:underline font-medium">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-pink-500 hover:underline font-medium">Privacy Policy</a>
                      {" "}<span className="text-pink-500">*</span>
                    </Label>
                  </div>
                  {errors.agreeToTerms && <p className="text-xs text-red-500 ml-7">{errors.agreeToTerms}</p>}

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agreeToMarketing"
                      checked={signupData.agreeToMarketing}
                      onCheckedChange={(checked) => updateSignupData("agreeToMarketing", checked)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="agreeToMarketing" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                      I'd like to receive emails about new features and updates
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep === "review" ? (
              <div className="flex flex-col items-end gap-2">
                {submitError && <p className="text-xs text-red-500">{submitError}</p>}
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-full px-6 font-semibold shadow-lg shadow-pink-500/20 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Complete Signup →"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-full px-6 font-semibold shadow-lg shadow-pink-500/20"
              >
                Continue →
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          14-day free trial · Cancel anytime · No credit card charged until trial ends
        </p>
      </div>
    </div>
  )
}
