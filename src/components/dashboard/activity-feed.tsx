"use client"

import { motion } from "framer-motion"
import { Clock, FileText } from "lucide-react"
import { formatRelativeDate } from "@/lib/utils"

interface ActivityEvent {
  id: string
  content: string
  date: Date
  project: { title: string }
}

interface ActivityFeedProps {
  events: ActivityEvent[]
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
        Nog geen activiteit
      </div>
    )
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-[11px] top-2 h-[calc(100%-16px)] w-0.5 bg-border" />
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
          className="relative flex gap-4 pb-6"
        >
          <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
            <FileText className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm">{event.content}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeDate(event.date)}</span>
              <span>·</span>
              <span>{event.project.title}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
