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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)theme=([^;]+)/);var t=m?decodeURIComponent(m[1]):null;if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`,
          }}
        />
      </head>
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
