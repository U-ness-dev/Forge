"use client"

import { motion } from "framer-motion"
import { FolderKanban, Play, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardsProps {
  total: number
  active: number
  completed: number
}

const stats = [
  { label: "Totaal projecten", icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Actieve projecten", icon: Play, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Afgerond", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
]

export function StatsCards({ total, active, completed }: StatsCardsProps) {
  const values = [total, active, completed]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{values[i]}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
