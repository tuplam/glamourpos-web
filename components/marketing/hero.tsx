"use client"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAppUrl } from "@/lib/config"

function DashboardPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-3xl blur-2xl scale-110" />

      {/* Main card */}
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-black/30">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <div className="flex-1 mx-4 h-5 bg-white/5 rounded-full" />
        </div>

        <div className="p-4 space-y-3">
          {/* Revenue stat row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Today's Revenue", value: "$1,842", change: "+12%", color: "text-green-400" },
              { label: "Appointments", value: "24", change: "8 done", color: "text-blue-400" },
              { label: "Active Queue", value: "6", change: "2 waiting", color: "text-pink-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-gray-400 text-[10px] mb-1 leading-tight">{s.label}</div>
                <div className="text-white font-bold text-base">{s.value}</div>
                <div className={`text-[10px] ${s.color}`}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Mini bar chart */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-gray-400 text-[10px] mb-2">Weekly Sales</div>
            <div className="flex items-end gap-1.5 h-12">
              {[45, 68, 52, 80, 91, 74, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background: i === 6
                      ? "linear-gradient(to top, #ec4899, #9333ea)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} className="text-[9px] text-gray-500 flex-1 text-center">{d}</span>
              ))}
            </div>
          </div>

          {/* Appointment list */}
          <div className="space-y-1.5">
            {[
              { name: "Emma R.", service: "Gel Manicure", status: "In Service", color: "bg-pink-400" },
              { name: "Sophie L.", service: "Acrylic Full Set", status: "Waiting", color: "bg-yellow-400" },
              { name: "Chloe W.", service: "Pedicure Deluxe", status: "Scheduled", color: "bg-blue-400" },
            ].map((a) => (
              <div key={a.name} className="flex items-center gap-2.5 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full ${a.color} flex-shrink-0`} />
                <span className="text-white text-[11px] font-medium flex-1">{a.name}</span>
                <span className="text-gray-400 text-[11px]">{a.service}</span>
                <span className="text-gray-500 text-[10px] ml-auto">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-pink-500/30 border border-white/20">
        ★ 4.9 / 5.0
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="marketing-hero-bg min-h-screen flex items-center pt-16 px-6">
      <div className="max-w-7xl mx-auto w-full py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-pink-300 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              The All-in-One Nail Salon Platform
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
              Run Your Salon Like a{" "}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Beauty Empire
              </span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              GlamourPOS brings appointment scheduling, POS, customer loyalty,
              employee management, and analytics into one stunning platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <a href="/#pricing">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-pink-500/30 w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>

            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start text-gray-400 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1.5">
                  {["JT", "MS", "LN"].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 border border-gray-900 flex items-center justify-center text-[8px] text-white font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span>1,000+ salons trust GlamourPOS</span>
              </div>
              <div className="text-yellow-400 text-sm">
                ★★★★★ <span className="text-gray-400">4.9 rating</span>
              </div>
              <div className="text-gray-500 text-xs">No credit card required</div>
            </div>
          </div>

          {/* Visual */}
          <div className="flex-1 w-full max-w-lg">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
