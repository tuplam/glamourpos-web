const stats = [
  { value: "1,000+", label: "Active Salons" },
  { value: "$2.4M+", label: "Processed Monthly" },
  { value: "4.9 ★", label: "Average Rating" },
  { value: "50K+", label: "Happy Customers" },
  { value: "99.9%", label: "Uptime SLA" },
]

export default function SocialProofBar() {
  return (
    <section className="bg-gradient-to-r from-pink-50 to-purple-50 border-y border-pink-100/50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
