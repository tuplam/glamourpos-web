import type { Metadata } from "next"
import Nav from "@/components/marketing/nav"
import Hero from "@/components/marketing/hero"
import SocialProofBar from "@/components/marketing/social-proof-bar"
import FeaturesGrid from "@/components/marketing/features-grid"
import FeatureSpotlight from "@/components/marketing/feature-spotlight"
import SignupSection from "@/components/signup/signup-section"
import Testimonials from "@/components/marketing/testimonials"
import FAQ from "@/components/marketing/faq"
import CTABanner from "@/components/marketing/cta-banner"
import Footer from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "GlamourPOS — Nail Salon & Beauty Business POS System",
  description:
    "The all-in-one platform for nail salons. POS, scheduling, CRM, team management, and analytics — built for beauty.",
  keywords: ["nail salon POS", "beauty salon software", "nail salon management", "salon scheduling", "salon CRM"],
  openGraph: {
    title: "GlamourPOS — Nail Salon & Beauty Business POS System",
    description:
      "The all-in-one platform for nail salons. POS, scheduling, CRM, team management, and analytics — built for beauty.",
    type: "website",
    url: "https://glamourpos.com",
  },
}

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <SocialProofBar />
      <FeaturesGrid />
      <FeatureSpotlight />
      <SignupSection />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  )
}
