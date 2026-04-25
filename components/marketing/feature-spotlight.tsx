import { CheckCircle2 } from "lucide-react"

interface SpotlightItem {
  tag: string
  headline: string
  body: string
  bullets: string[]
  side: "left" | "right"
  mockup: React.ReactNode
}

function QueueMockup() {
  const customers = [
    { name: "Sarah M.", service: "Gel Manicure", status: "In Service", tech: "Lisa", color: "bg-green-500" },
    { name: "Jenny T.", service: "Pedicure Deluxe", status: "Waiting", tech: "—", color: "bg-yellow-400" },
    { name: "Maria K.", service: "Acrylic Full Set", status: "Waiting", tech: "—", color: "bg-yellow-400" },
    { name: "Alice B.", service: "Nail Art Design", status: "Done", tech: "Amy", color: "bg-gray-400" },
  ]
  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-2xl border border-white/10 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold text-sm">Today&apos;s Queue</span>
        <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full">3 Active</span>
      </div>
      <div className="space-y-2.5">
        {customers.map((c) => (
          <div key={c.name} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
            <div className={`w-2 h-2 rounded-full ${c.color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{c.name}</div>
              <div className="text-gray-400 text-xs truncate">{c.service}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-gray-300 text-xs">{c.status}</div>
              <div className="text-gray-500 text-xs">{c.tech}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarMockup() {
  const slots = [
    { time: "9:00", name: "Emma R.", color: "bg-pink-500/30 border-pink-400", text: "Gel Manicure" },
    { time: "10:30", name: "Olivia S.", color: "bg-purple-500/30 border-purple-400", text: "Pedicure" },
    { time: "11:00", name: "Sophie L.", color: "bg-violet-500/30 border-violet-400", text: "Acrylic Set" },
    { time: "1:00", name: "Chloe W.", color: "bg-pink-500/30 border-pink-400", text: "Nail Art" },
    { time: "2:30", name: "Ava M.", color: "bg-purple-500/30 border-purple-400", text: "Spa Pedicure" },
  ]
  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-2xl border border-white/10 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold text-sm">Thursday, Apr 25</span>
        <span className="text-xs text-gray-400">5 appointments</span>
      </div>
      <div className="space-y-2">
        {slots.map((s) => (
          <div key={s.name} className={`flex gap-3 items-start border-l-2 ${s.color} pl-3 py-1.5 rounded-r-lg`}>
            <span className="text-gray-400 text-xs w-10 flex-shrink-0 pt-0.5">{s.time}</span>
            <div>
              <div className="text-white text-xs font-medium">{s.name}</div>
              <div className="text-gray-400 text-xs">{s.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SMSMockup() {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-2xl border border-white/10 w-full max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          G
        </div>
        <div>
          <div className="text-white text-sm font-medium">GlamourNails Campaign</div>
          <div className="text-gray-400 text-xs">Sending to 247 customers</div>
        </div>
        <span className="ml-auto text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Live</span>
      </div>
      <div className="bg-white/5 rounded-xl p-3 mb-3 border border-white/10">
        <p className="text-gray-200 text-xs leading-relaxed">
          💅 Hey [Name]! It&apos;s been a while. Come back this week and get <span className="text-pink-300 font-semibold">20% off</span> any service. Book now: glamournails.com/book
        </p>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Delivered: <span className="text-green-400">231</span></span>
        <span>Opened: <span className="text-blue-400">89</span></span>
        <span>Booked: <span className="text-pink-400">14</span></span>
      </div>
    </div>
  )
}

const spotlights: SpotlightItem[] = [
  {
    tag: "Turn Management",
    headline: "No More Waiting Room Chaos",
    body: "GlamourPOS's intelligent turn management system automatically assigns the next available technician, tracks service durations, and sends SMS updates when ready — so your front desk runs itself.",
    bullets: [
      "Auto-assign customers to available technicians",
      "Real-time queue status for the whole team",
      "SMS notifications when a tech is ready",
      "Daily turn reports per technician",
    ],
    side: "left",
    mockup: <QueueMockup />,
  },
  {
    tag: "Appointment Scheduling",
    headline: "A Calendar That Actually Works",
    body: "Color-coded by technician, drag-and-drop rescheduling, automated SMS reminders, and online booking that syncs in real-time across all your locations.",
    bullets: [
      "Visual calendar with technician color-coding",
      "Automated 24-hour appointment reminders",
      "Online self-booking for customers",
      "Conflict detection and smart suggestions",
    ],
    side: "right",
    mockup: <CalendarMockup />,
  },
  {
    tag: "SMS & Email Marketing",
    headline: "Turn Quiet Days into Full Books",
    body: "Schedule campaigns, automate birthday messages, and re-engage lapsed clients. Integrated directly with your customer database — no third-party tools needed.",
    bullets: [
      "Built-in customer segmentation",
      "Automated birthday & anniversary messages",
      "Win-back campaigns for inactive clients",
      "Real-time delivery and booking tracking",
    ],
    side: "left",
    mockup: <SMSMockup />,
  },
]

export default function FeatureSpotlight() {
  return (
    <section className="bg-[#0f0a1a] py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-28">
        {spotlights.map((item) => (
          <div
            key={item.tag}
            className={`flex flex-col ${
              item.side === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-12 lg:gap-20`}
          >
            {/* Text */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-3">
                {item.tag}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                {item.headline}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">{item.body}</p>
              <ul className="space-y-3">
                {item.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockup */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">{item.mockup}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
