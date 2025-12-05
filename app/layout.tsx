import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, AlertCircle } from "lucide-react"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "نظام إدارة المصنع",
  description: "نظام إدارة الموارد البشرية والعملاء",
  generator: "factory-dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={`font-sans ${cairo.variable}`}>
        <SessionProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#0F111A" }}>
              <div className="w-full max-w-4xl">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <svg className="w-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="none">
            <path d="M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z" fill="#fff"></path>
            <path d="M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z" fill="#fff"></path>
          </svg>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-500 font-medium">Account Suspended</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Payment Required</h1>
                  <p className="text-lg md:text-xl text-gray-400 text-pretty">
                    {"Your account has been suspended. Pay your monthly fee to continue using the deployment."}
                  </p>
                </div>

                {/* Pricing Card */}
                <Card className="border-gray-800" style={{ backgroundColor: "#1A1D29" }}>
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                      {/* Price Info */}
                      <div className="flex-1">
                        <div className="mb-6">
                          <p className="text-gray-400 text-sm mb-2">Monthly Subscription</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl md:text-6xl font-bold text-white">$15</span>
                            <span className="text-gray-400 text-lg">/month</span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">Uninterrupted platform access</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">Premium features included</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">Priority support</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">Cancel anytime</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-col gap-4 md:min-w-[200px]">
                        <Button size="lg" className="w-full text-base font-medium" style={{ backgroundColor: "#8B5CF6" }}>
                          Pay Now & Restore Deployment
                        </Button>
                        <p className="text-sm text-gray-500 text-center">Billed monthly • Secure payment</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Footer Info */}
                <div className="mt-8 text-center space-y-4">
                  <p className="text-gray-400 text-sm">{"Payment will immediately restore your account access."}</p>
                  <p className="text-gray-500 text-xs">{"Need help? Contact our support team at any time."}</p>
                </div>
              </div>
            </div>
            
            <Analytics />
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  )
}
