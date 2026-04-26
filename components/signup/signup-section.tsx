"use client"

import { useRouter } from "next/navigation"
import PricingPage from "@/components/signup/pricing-page"

export default function SignupSection() {
  const router = useRouter()

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
    <div id="pricing">
      <PricingPage
        embedded
        initialPlan=""
        onSignup={handleSignup}
        onBack={() => {}}
        onPlanSelected={(tier, cycle) => router.push(`/signup?plan=${tier}&billing=${cycle}`)}
      />
    </div>
  )
}
