"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import PricingPage from "@/components/signup/pricing-page"

function SignupContent() {
  const params = useSearchParams()
  const router = useRouter()
  const initialPlan = params.get("plan") ?? ""

  async function handleSignup(data: Parameters<React.ComponentProps<typeof PricingPage>["onSignup"]>[0]) {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error ?? `Server error ${res.status}`)
    }

    router.push("/signup/success")
  }

  return (
    <PricingPage
      initialPlan={initialPlan}
      onSignup={handleSignup}
      onBack={() => router.push("/")}
    />
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  )
}
