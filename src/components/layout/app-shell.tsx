"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import Navbar from "./navbar"
import Sidebar from "./sidebar"

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-30 w-60 animate-in slide-in-from-left lg:hidden">
            <Sidebar
              collapsed={false}
              onCollapse={() => setMobileMenuOpen(false)}
            />
          </div>
        </>
      )}

      <Navbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main
        className={cn(
          "pt-16 transition-all duration-300",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
