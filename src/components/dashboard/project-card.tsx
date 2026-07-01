"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, HeartOff, Clock, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatRelativeDate } from "@/lib/utils"
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/types"
import type { ProjectCategory, ProjectStatus } from "@/types"

interface ProjectCardProject {
  id: string
  title: string
  description: string | null
  category: ProjectCategory
  status: ProjectStatus
  coverImage: string | null
  progress: number
  isFavorite: boolean
  updatedAt: Date
  _count?: {
    tasks: number
    uploads: number
    chats: number
  }
}

interface ProjectCardProps {
  project: ProjectCardProject
}

const categoryGradients: Record<string, string> = {
  Website: "from-blue-600 to-cyan-500",
  MobileApp: "from-purple-600 to-pink-500",
  DesktopApp: "from-slate-600 to-slate-400",
  Branding: "from-rose-600 to-orange-500",
  Logo: "from-violet-600 to-purple-500",
  Game: "from-emerald-600 to-teal-500",
  BlenderProject: "from-amber-600 to-yellow-500",
  ThreeDScene: "from-indigo-600 to-blue-500",
  MotionDesign: "from-pink-600 to-rose-500",
  Poster: "from-orange-600 to-red-500",
  Video: "from-red-600 to-rose-500",
  Animation: "from-teal-600 to-emerald-500",
  Other: "from-zinc-600 to-zinc-400",
}

const categoryIcons: Record<string, string> = {}
PROJECT_CATEGORIES.forEach((c) => {
  categoryIcons[c.value] = c.icon
})

const statusColors: Record<string, string> = {
  Idea: "bg-zinc-500/20 text-zinc-500",
  Research: "bg-blue-500/20 text-blue-500",
  Planning: "bg-amber-500/20 text-amber-500",
  Design: "bg-violet-500/20 text-violet-500",
  Development: "bg-emerald-500/20 text-emerald-500",
  Testing: "bg-orange-500/20 text-orange-500",
  Finished: "bg-green-500/20 text-green-500",
}

const iconMap: Record<string, React.ElementType> = {
  Globe: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Smartphone: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
  ),
  Monitor: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
  ),
  Palette: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.6 1.5-1.5 0-.33-.13-.65-.38-.9a1.5 1.5 0 0 1 0-2.12c.25-.25.58-.38.88-.38H14c3.31 0 6-2.69 6-6C20 5.5 16.42 2 12 2Z"/></svg>
  ),
  Fingerprint: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-5 8.66"/><path d="M12 2a10 10 0 0 0-7.07 3"/><path d="M12 2v4"/><path d="M12 6v4"/><path d="M12 10v4"/><path d="M12 14v4"/><path d="M12 18v4"/></svg>
  ),
  Gamepad2: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
  ),
  Cube: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="M3 8l9 5 9-5"/><path d="M12 22V13"/></svg>
  ),
  Box: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Wind: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2.5 2.5 0 1 1 11.5 8H2"/><path d="M12.6 19.4A2.5 2.5 0 1 0 14.5 16H2"/></svg>
  ),
  Image: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  ),
  Video: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 11 5 3-5 3v-6Z"/></svg>
  ),
  Clapperboard: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z"/><path d="m4 11 2-7"/><path d="m10 11 2-7"/><path d="m16 11 2-7"/><path d="M2 11h20"/></svg>
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m5.64 5.64 12.72 12.72"/><path d="m18.36 5.64-12.72 12.72"/></svg>
  ),
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [favorite, setFavorite] = useState(project.isFavorite)

  const category = PROJECT_CATEGORIES.find(
    (c) => c.value === project.category
  )
  const status = PROJECT_STATUSES.find((s) => s.value === project.status)
  const gradient = categoryGradients[project.category] ?? "from-zinc-600 to-zinc-400"
  const IconComponent = iconMap[categoryIcons[project.category]] ?? iconMap.Sparkles

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card className="group relative h-full overflow-hidden transition-shadow hover:shadow-lg">
          <div
            className={cn(
              "relative flex h-32 items-center justify-center bg-gradient-to-br",
              gradient
            )}
          >
            <IconComponent className="h-12 w-12 text-white/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <button
              onClick={(e) => {
                e.preventDefault()
                setFavorite(!favorite)
                fetch(`/api/projects/${project.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ isFavorite: !favorite }),
                })
              }}
              className="absolute right-3 top-3 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              {favorite ? (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              ) : (
                <HeartOff className="h-4 w-4" />
              )}
            </button>
            <div className="absolute bottom-3 left-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  statusColors[project.status] ?? "bg-zinc-500/20 text-zinc-500"
                )}
              >
                {status?.label ?? project.status}
              </span>
            </div>
          </div>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{project.title}</h3>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            {project.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
            <div className="space-y-1.5">
              <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="rounded-full bg-primary"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{project.progress}%</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeDate(project.updatedAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
