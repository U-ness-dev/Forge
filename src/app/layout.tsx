import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import ThemeProvider from "@/providers/theme-provider"
import SessionProviderWrapper from "@/providers/session-provider"
import QueryProvider from "@/providers/query-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Forge",
  description: "Your creative project workspace",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          <SessionProviderWrapper>
            <QueryProvider>
              {children}
              <Toaster richColors position="top-right" />
            </QueryProvider>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
