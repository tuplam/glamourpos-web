import {
  CreditCard,
  CalendarDays,
  Users,
  UserCheck,
  BarChart3,
  Building2,
} from "lucide-react"

const features = [
  {
    icon: CreditCard,
    title: "POS & Payments",
    description:
      "Accept cards, cash, and digital wallets. Stripe-powered with instant settlements and split-payment support.",
    gradient: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    description:
      "Drag-and-drop calendar, online booking, automated SMS reminders, and waitlist management that runs itself.",
    gradient: "from-purple-400 to-violet-500",
    bg: "bg-purple-50",
  },
  {
    icon: Users,
    title: "Customer CRM",
    description:
      "Full client profiles, visit history, loyalty points, nail preference notes, and birthday campaigns.",
    gradient: "from-pink-500 to-purple-500",
    bg: "bg-fuchsia-50",
  },
  {
    icon: UserCheck,
    title: "Team Management",
    description:
      "Schedules, commissions, performance tracking, and role-based permissions per employee.",
    gradient: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Daily sales dashboards, revenue trends, service popularity, employee performance — all exportable to CSV.",
    gradient: "from-rose-400 to-pink-600",
    bg: "bg-rose-50",
  },
  {
    icon: Building2,
    title: "Multi-Location",
    description:
      "Manage all your branches from one login. Cross-location transfers, reports, and unified staff management.",
    gradient: "from-purple-500 to-indigo-600",
    bg: "bg-indigo-50",
  },
]

export default function FeaturesGrid() {
  return (
    <section id="features" className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-500 mb-3">
            Everything You Need
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for how salons actually work
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From the front desk to the back office — GlamourPOS covers every corner of your beauty business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="group bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
