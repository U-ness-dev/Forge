"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Info,
  StickyNote,
  Bot,
  CheckSquare,
  Upload,
  Edit3,
  Trash2,
  ExternalLink,
} from "lucide-react"
import type { LucideIcon, LucideProps } from "lucide-react"
import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/projects/badge"
import { cn, formatDate } from "@/lib/utils"
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/types"
import { ProjectTasks } from "@/components/projects/project-tasks"
import { ProjectUploads } from "@/components/projects/project-uploads"
import { ProjectTimeline } from "@/components/projects/project-timeline"


interface ProjectData {
  id: string
  title: string
  description: string | null
  category: string
  status: string
  technologies: string | null
  tags: string | null
  coverImage: string | null
  progress: number
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  tasks: Array<{
    id: string
    title: string
    description: string | null
    priority: string
    completed: boolean
    createdAt: Date
  }>
  uploads: Array<{
    id: string
    filename: string
    url: string
    type: string
    size: number
    createdAt: Date
  }>
  notes: Array<{
    id: string
    content: string
    createdAt: Date
    updatedAt: Date
  }>
  timeline: Array<{
    id: string
    content: string
    date: Date
  }>
  _count: {
    tasks: number
    uploads: number
    notes: number
    chats: number
  }
}

interface ProjectDetailClientProps {
  project: ProjectData
}

const TimelineIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <circle cx="4" cy="4" r="2" />
        <circle cx="12" cy="4" r="2" />
        <circle cx="20" cy="4" r="2" />
        <path d="M4 6v14" />
        <path d="M12 6v10" />
        <path d="M20 6v6" />
      </svg>
    )
  }
)
TimelineIcon.displayName = "TimelineIcon"

const tabs: Array<{ id: string; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Overzicht", icon: Info },
  { id: "notes", label: "Notities", icon: StickyNote },
  { id: "chat", label: "AI Chat", icon: Bot },
  { id: "tasks", label: "Taken", icon: CheckSquare },
  { id: "uploads", label: "Uploads", icon: Upload },
  { id: "timeline", label: "Tijdlijn", icon: TimelineIcon },
]

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

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(project.title)
  const [editDescription, setEditDescription] = useState(project.description ?? "")
  const [deleting, setDeleting] = useState(false)

  const category = PROJECT_CATEGORIES.find((c) => c.value === project.category)
  const status = PROJECT_STATUSES.find((s) => s.value === project.status)
  const gradient = categoryGradients[project.category] ?? "from-zinc-600 to-zinc-400"

  const handleDelete = async () => {
    if (!confirm("Weet je zeker dat je dit project wilt verwijderen?")) return
    setDeleting(true)
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" })
    router.push("/dashboard")
  }

  const handleSaveEdit = async () => {
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    })
    setEditing(false)
    router.refresh()
  }

  const tagList = project.tags ? project.tags.split(",").filter(Boolean) : []
  const techList = project.technologies
    ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-lg font-semibold"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <Button size="sm" onClick={handleSaveEdit}>Opslaan</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Annuleren</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {project.title}
                </h1>
                <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/ai-workspace?project=${project.id}`}>
            <Button variant="outline" size="sm">
              <Bot className="h-4 w-4" />
              AI Workspace
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4" />
            Verwijderen
          </Button>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg border bg-muted p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Project informatie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Beschrijving</label>
                    <textarea
                      className="min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {project.description ?? "Geen beschrijving"}
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Categorie</span>
                    <p className="text-sm font-medium">{category?.label ?? project.category}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Status</span>
                    <p className="text-sm font-medium">{status?.label ?? project.status}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Aangemaakt</span>
                    <p className="text-sm font-medium">{formatDate(project.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Bijgewerkt</span>
                    <p className="text-sm font-medium">{formatDate(project.updatedAt)}</p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-muted-foreground">Voortgang</span>
                  <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="rounded-full bg-primary"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{project.progress}%</p>
                </div>

                {techList.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Technologieën</span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {techList.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-full border bg-accent px-2 py-0.5 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tagList.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Tags</span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {tagList.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "notes" && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <NotesSection projectId={project.id} notes={project.notes} />
          </motion.div>
        )}

        {activeTab === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                <Bot className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-medium">AI Workspace</h3>
                  <p className="text-sm text-muted-foreground">
                    Gebruik de AI workspace om met dit project te brainstormen.
                  </p>
                </div>
                <Link href={`/ai-workspace?project=${project.id}`}>
                  <Button>
                    <ExternalLink className="h-4 w-4" />
                    Open AI Workspace
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "tasks" && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProjectTasks projectId={project.id} initialTasks={project.tasks} />
          </motion.div>
        )}

        {activeTab === "uploads" && (
          <motion.div
            key="uploads"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProjectUploads projectId={project.id} initialUploads={project.uploads} />
          </motion.div>
        )}

        {activeTab === "timeline" && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProjectTimeline
              projectId={project.id}
              projectTitle={project.title}
              initialEvents={project.timeline}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NotesSection({
  projectId,
  notes,
}: {
  projectId: string
  notes: ProjectData["notes"]
}) {
  const [noteList, setNoteList] = useState(notes)
  const [newNote, setNewNote] = useState("")
  const [adding, setAdding] = useState(false)

  const addNote = async () => {
    if (!newNote.trim()) return
    setAdding(true)
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote, projectId }),
    })
    const data = await res.json()
    if (res.ok) {
      setNoteList([data, ...noteList])
      setNewNote("")
    }
    setAdding(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <textarea
            className="min-h-[80px] flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Nieuwe notitie..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button size="sm" onClick={addNote} disabled={!newNote.trim() || adding}>
            Toevoegen
          </Button>
        </div>
        {noteList.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nog geen notities
          </p>
        ) : (
          <div className="space-y-3">
            {noteList.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border bg-accent/30 p-3 text-sm"
              >
                <p className="whitespace-pre-wrap">{note.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


