"use client"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAppUrl } from "@/lib/config"

const reassurances = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
  "Setup in 10 minutes",
]

export default function CTABanner() {
  return (
    <section className="bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
          Ready to transform your salon?
        </h2>
        <p className="text-pink-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 1,000+ beauty businesses running smarter with GlamourPOS.
          Start your free 14-day trial today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a href="/#pricing">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-pink-50 font-semibold rounded-full px-8 shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>

        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {reassurances.map((r) => (
            <div key={r} className="flex items-center gap-2 text-pink-100 text-sm">
              <span className="text-green-300">✓</span>
              {r}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
