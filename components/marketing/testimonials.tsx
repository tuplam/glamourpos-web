"use client"

import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const testimonials = [
  {
    quote:
      "GlamourPOS transformed how we run our two locations. The turn management alone saved us hours every single week. Our technicians love it.",
    name: "Jennifer Tran",
    role: "Owner, Luxe Nails & Spa",
    location: "Houston, TX",
    initials: "JT",
  },
  {
    quote:
      "Finally a POS system that understands how nail salons actually work. The commission tracking is exactly what we needed — no more spreadsheet nightmares.",
    name: "Maria Santos",
    role: "Manager, Bella Beauty Bar",
    location: "Miami, FL",
    initials: "MS",
  },
  {
    quote:
      "We expanded from 1 to 3 locations in 18 months. GlamourPOS's multi-location support made that growth possible without adding admin headaches.",
    name: "Linda Nguyen",
    role: "Franchise Owner, Pink Cloud Nails",
    location: "San Jose, CA",
    initials: "LN",
  },
  {
    quote:
      "The customer CRM is incredible. I know my regulars' favorite services before they even sit down. It's the little things that keep clients coming back.",
    name: "Ashley Kim",
    role: "Owner, Glow Nail Studio",
    location: "Atlanta, GA",
    initials: "AK",
  },
  {
    quote:
      "Setup took less than a day and the support team answered every question within the hour. I wish I'd switched sooner — best decision for my business.",
    name: "Rachel Pham",
    role: "Owner, Rose Garden Nails",
    location: "Dallas, TX",
    initials: "RP",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#0f0a1a] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-400 mb-3">
            Customer Love
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by salon owners everywhere
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Don&apos;t take our word for it — here&apos;s what beauty professionals say.
          </p>
        </div>

        <Carousel
          opts={{ loop: true, align: "start" }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-pink-400 text-pink-400" />
                    ))}
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed mb-6 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{t.name}</div>
                      <div className="text-gray-400 text-xs">{t.role}</div>
                      <div className="text-gray-500 text-xs">{t.location}</div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="hidden md:flex -right-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        </Carousel>
      </div>
    </section>
  )
}
