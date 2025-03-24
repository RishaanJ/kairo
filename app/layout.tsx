import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import "./globals.css"

export const metadata: Metadata = {
  title: "ICU Patient Monitoring",
  description: "ICU Patient Deterioration Prediction Dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}



import './globals.css'