"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatRelativeDate } from "@/lib/utils"

interface TimelineEvent {
  id: string
  content: string
  date: Date
}

interface ProjectTimelineProps {
  projectId: string
  projectTitle: string
  initialEvents: TimelineEvent[]
}

export function ProjectTimeline({
  projectId,
  projectTitle,
  initialEvents,
}: ProjectTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents)
  const [newEvent, setNewEvent] = useState("")
  const [adding, setAdding] = useState(false)

  const addEvent = async () => {
    if (!newEvent.trim()) return
    setAdding(true)
    const res = await fetch("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newEvent,
        projectId,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setEvents([data, ...events])
      setNewEvent("")
    }
    setAdding(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tijdlijn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Voeg een gebeurtenis toe..."
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addEvent()
              }
            }}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={addEvent}
            disabled={!newEvent.trim() || adding}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nog geen tijdlijn gebeurtenissen
          </p>
        ) : (
          <div className="relative space-y-0">
            <div className="absolute left-[11px] top-2 h-[calc(100%-16px)] w-0.5 bg-border" />
            <AnimatePresence>
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  <div className="relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{event.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeDate(event.date)} · {formatDate(event.date)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
