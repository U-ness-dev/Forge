"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function useTheme() {
  return useContext(ThemeContext)
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement
  if (resolved === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

export default function ThemeProvider({
  children,
  theme: initialTheme = "system",
}: {
  children: React.ReactNode
  theme?: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
    initialTheme === "system" ? getSystemTheme() : initialTheme
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if (theme === "system") {
        const resolved = mediaQuery.matches ? "dark" : "light"
        setResolvedTheme(resolved)
        applyTheme(resolved)
      }
    }
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [theme])

  useEffect(() => {
    const resolved =
      theme === "system" ? getSystemTheme() : (theme as "light" | "dark")
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setCookie("theme", newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
