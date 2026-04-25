"use client"

import { useState } from "react"
import { Check, Zap, TrendingUp, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { pricingTiers } from "@/lib/pricing-data"
import { APP_URL } from "@/lib/config"

const planIcons = { starter: Zap, professional: TrendingUp, enterprise: Crown }

export default function PricingSection() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="bg-gray-50 py-24 px-6">
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
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !yearly ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                yearly ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {pricingTiers.map((tier) => {
            const Icon = planIcons[tier.id as keyof typeof planIcons]
            const price = yearly ? tier.yearlyPrice : tier.monthlyPrice
            const period = yearly ? "/ year" : "/ month"

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col bg-white rounded-2xl p-8 border transition-all duration-200 ${
                  tier.popular
                    ? "border-pink-400 ring-2 ring-pink-400 shadow-xl scale-105"
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
                  <div>
                    <div className="font-bold text-gray-900">{tier.name}</div>
                  </div>
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

                <a href={APP_URL} className="w-full">
                  <Button
                    className={`w-full rounded-full font-semibold ${
                      tier.popular
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-pink-500/20"
                        : "bg-gray-900 hover:bg-gray-800 text-white border-0"
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </a>
              </div>
            )
          })}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          All plans include a 14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  )
}
