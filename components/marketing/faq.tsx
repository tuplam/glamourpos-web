"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — every plan starts with a 14-day free trial. No credit card required. You get full access to all features on your selected plan from day one.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle. No fees, no friction.",
  },
  {
    q: "Does GlamourPOS work offline?",
    a: "Yes. GlamourPOS is a Progressive Web App (PWA) with offline support built in. Your team can process transactions and manage appointments even without internet — changes sync automatically when you reconnect.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support all major credit and debit cards via Stripe, plus cash, check, and gift cards. Split payments across multiple methods are supported on all plans.",
  },
  {
    q: "Can I manage multiple salon locations?",
    a: "Multi-location support is available on the Professional (2 locations) and Enterprise (unlimited) plans. You get a unified dashboard, cross-location reporting, and the ability to move inventory and staff between locations.",
  },
  {
    q: "How does the turn management system work?",
    a: "Turn management is our standout feature for nail salons. It maintains a digital queue, automatically assigns customers to the next available technician, tracks service times, and sends SMS notifications to customers when their technician is ready.",
  },
  {
    q: "Is there a contract or can I cancel anytime?",
    a: "No contracts. Month-to-month billing, cancel anytime with no cancellation fees. Annual plans are paid upfront but can be refunded on a pro-rated basis within 30 days.",
  },
  {
    q: "What support is included?",
    a: "Starter includes email support. Professional adds phone support and priority response times. Enterprise includes 24/7 priority support and a dedicated account manager who knows your business.",
  },
]

const half = Math.ceil(faqs.length / 2)
const left = faqs.slice(0, half)
const right = faqs.slice(half)

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-500 mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to know
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Can&apos;t find an answer? Email us at{" "}
            <a href="mailto:hello@glamourpos.com" className="text-pink-500 hover:underline">
              hello@glamourpos.com
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <Accordion type="single" collapsible className="space-y-2">
            {left.map((item, i) => (
              <AccordionItem key={i} value={`left-${i}`} className="border border-gray-100 rounded-xl px-4 data-[state=open]:border-pink-200 transition-colors">
                <AccordionTrigger className="text-left text-sm font-semibold text-gray-900 hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion type="single" collapsible className="space-y-2 mt-2 md:mt-0">
            {right.map((item, i) => (
              <AccordionItem key={i} value={`right-${i}`} className="border border-gray-100 rounded-xl px-4 data-[state=open]:border-pink-200 transition-colors">
                <AccordionTrigger className="text-left text-sm font-semibold text-gray-900 hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
