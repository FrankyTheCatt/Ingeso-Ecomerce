import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { StoreHeader } from "@/components/store-header"
import { CartProvider } from "@/lib/cart-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "noporolos store - Tu tienda universitaria",
  description: "Todo lo que necesitas para tu vida universitaria",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <CartProvider>
          <StoreHeader />
          <main className="w-full mx-auto">{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
