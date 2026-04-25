import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GlamourPOS — Nail Salon & Beauty Business POS System",
  description:
    "The all-in-one platform for nail salons. POS, scheduling, CRM, team management, and analytics — built for beauty.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
