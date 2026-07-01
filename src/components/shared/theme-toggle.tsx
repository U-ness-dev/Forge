"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted",
        className
      )}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
