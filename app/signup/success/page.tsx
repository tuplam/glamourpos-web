import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-green-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">You&apos;re all set!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your 14-day free trial has started. We&apos;ve sent your login instructions
          to your email — check your inbox to get started.
        </p>

        <a
          href="https://app.glamourpos.com"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full px-8 py-4 shadow-lg shadow-pink-500/25 transition-all mb-4"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </a>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to glamourpos.com
        </Link>
      </div>
    </div>
  )
}
