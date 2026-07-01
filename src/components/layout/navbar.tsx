"use client"

import { Search, ChevronDown, LayoutDashboard, Settings as SettingsIcon, LogOut } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import ThemeToggle from "@/components/shared/theme-toggle"

interface NavbarProps {
  onMenuToggle?: () => void
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <div className="relative flex-1 max-w-md mx-auto lg:mx-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                U
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-card p-1.5 shadow-lg">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-card-foreground transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-card-foreground transition-colors hover:bg-muted"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-1 border-border" />
                  <Link
                    href="/api/auth/signout"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
