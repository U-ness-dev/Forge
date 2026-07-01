"use client"

import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  Settings,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "AI Workspace", href: "/ai-workspace", icon: Bot },
  { label: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 flex h-full flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          F
        </div>
        <span
          className={cn(
            "text-lg font-semibold tracking-tight text-card-foreground transition-opacity duration-200",
            collapsed && "pointer-events-none opacity-0"
          )}
        >
          Forge
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "transition-opacity duration-200",
                  collapsed && "pointer-events-none opacity-0"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => onCollapse(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>
    </aside>
  )
}
