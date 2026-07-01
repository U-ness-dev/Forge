"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Trash2,
  Flag,
  Circle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description: string | null
  priority: string
  completed: boolean
  createdAt: Date
}

interface ProjectTasksProps {
  projectId: string
  initialTasks: Task[]
}

const priorityColors: Record<string, string> = {
  Low: "text-blue-500",
  Medium: "text-amber-500",
  High: "text-orange-500",
  Critical: "text-red-500",
}

const priorityLabels: Record<string, string> = {
  Low: "Laag",
  Medium: "Medium",
  High: "Hoog",
  Critical: "Kritiek",
}

const priorities = ["Low", "Medium", "High", "Critical"]

export function ProjectTasks({ projectId, initialTasks }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTitle, setNewTitle] = useState("")
  const [newPriority, setNewPriority] = useState("Medium")
  const [adding, setAdding] = useState(false)

  const addTask = async () => {
    if (!newTitle.trim()) return
    setAdding(true)
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        priority: newPriority,
        projectId,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setTasks([data, ...tasks])
      setNewTitle("")
      setNewPriority("Medium")
    }
    setAdding(false)
  }

  const toggleTask = async (task: Task) => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    })
    if (res.ok) {
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      )
    }
  }

  const deleteTask = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
    if (res.ok) {
      setTasks(tasks.filter((t) => t.id !== taskId))
    }
  }

  const updatePriority = async (task: Task, priority: string) => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    })
    if (res.ok) {
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, priority } : t))
      )
    }
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taken</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nieuwe taak..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTask()
              }
            }}
            className="flex-1"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-2 text-sm"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {priorityLabels[p]}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={addTask} disabled={!newTitle.trim() || adding}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nog geen taken
          </p>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onPriorityChange={updatePriority}
                />
              ))}
            </AnimatePresence>
            {completedTasks.length > 0 && (
              <>
                <div className="flex items-center gap-2 py-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">
                    Afgerond ({completedTasks.length})
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <AnimatePresence>
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onPriorityChange={updatePriority}
                    />
                  ))}
                </AnimatePresence>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TaskItem({
  task,
  onToggle,
  onDelete,
  onPriorityChange,
}: {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
  onPriorityChange: (task: Task, priority: string) => void
}) {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
        task.completed && "bg-muted/50"
      )}
    >
      <button onClick={() => onToggle(task)} className="shrink-0">
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
        )}
      </button>
      <span
        className={cn(
          "flex-1 text-sm",
          task.completed && "text-muted-foreground line-through"
        )}
      >
        {task.title}
      </span>
      <div className="relative">
        <button
          onClick={() => setShowPriorityMenu(!showPriorityMenu)}
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-accent",
            priorityColors[task.priority] ?? "text-muted-foreground"
          )}
        >
          <Flag className="h-3 w-3" />
          {priorityLabels[task.priority] ?? task.priority}
        </button>
        {showPriorityMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPriorityMenu(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-lg border bg-background p-1 shadow-lg">
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onPriorityChange(task, p)
                    setShowPriorityMenu(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
                    priorityColors[p]
                  )}
                >
                  <Flag className="h-3 w-3" />
                  {priorityLabels[p]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
