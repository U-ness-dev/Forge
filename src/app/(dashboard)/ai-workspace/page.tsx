"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, FolderOpen, Bot, Sparkles } from "lucide-react"
import { useChatStore } from "@/stores/use-chat-store"
import { ChatInterface } from "@/components/ai/chat-interface"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ProjectWithRelations } from "@/types"

const DEMO_PROJECTS: ProjectWithRelations[] = [
  {
    id: "demo-1",
    title: "Pixel Quest",
    description: "Een retro platformer game met pixel art",
    category: "Game",
    status: "Idea",
    technologies: "Unity, C#",
    tags: "pixelart, platformer, retro",
    coverImage: null,
    progress: 0,
    isFavorite: false,
    userId: "demo",
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
    uploads: [],
    timeline: [],
    chats: [],
  },
  {
    id: "demo-2",
    title: "Portfolio Website",
    description: "Modern portfolio met projecten showcase",
    category: "Website",
    status: "Planning",
    technologies: "Next.js, Tailwind CSS",
    tags: "portfolio, modern, responsive",
    coverImage: null,
    progress: 15,
    isFavorite: true,
    userId: "demo",
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
    uploads: [],
    timeline: [],
    chats: [],
  },
  {
    id: "demo-3",
    title: "Brand Identity Pack",
    description: "Complete branding voor een koffiebar",
    category: "Branding",
    status: "Design",
    technologies: "Figma, Illustrator",
    tags: "branding, koffie, logo",
    coverImage: null,
    progress: 60,
    isFavorite: false,
    userId: "demo",
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
    uploads: [],
    timeline: [],
    chats: [],
  },
]

const PROJECT_ICONS: Record<string, string> = {
  Game: "🎮",
  Website: "🌐",
  Branding: "🎨",
  Logo: "🔤",
  MobileApp: "📱",
  DesktopApp: "💻",
  BlenderProject: "🧊",
  ThreeDScene: "📦",
  MotionDesign: "💨",
  Poster: "🖼️",
  Video: "🎬",
  Animation: "🎭",
  Other: "✨",
}

export default function AIWorkspacePage() {
  const {
    messages,
    currentProjectId,
    projectContext,
    isStreaming,
    addMessage,
    setProject,
    setProjectId,
    setStreaming,
    appendToLastMessage,
  } = useChatStore()

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [showCategorySelector, setShowCategorySelector] = React.useState(false)
  const [showQuestions, setShowQuestions] = React.useState(false)
  const [chatHistory, setChatHistory] = React.useState<{ role: "user" | "assistant"; content: string }[]>([])

  // Show category selector on first load if no project
  React.useEffect(() => {
    if (!currentProjectId && messages.length === 0) {
      setShowCategorySelector(true)
    }
  }, [currentProjectId, messages.length])

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowQuestions(true)
  }

  const handleQuestionAnswer = (question: string, answer: string) => {
    setShowQuestions(false)
    setShowCategorySelector(false)

    const contextMessage = `Categorie: ${selectedCategory}\nVraag: ${question}\nAntwoord: ${answer}`

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: contextMessage,
      createdAt: new Date(),
    }
    addMessage(userMsg)

    // Send to AI automatically
    sendToAI(contextMessage)
  }

  const sendToAI = async (message: string) => {
    setStreaming(true)

    const assistantMsg = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content: "",
      createdAt: new Date(),
    }
    addMessage(assistantMsg)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProjectId,
          message,
          mode: "Brainstorm",
          chatHistory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      const decoder = new TextDecoder()
      let fullContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        fullContent += text
        appendToLastMessage(text)
      }
    } catch (error) {
      appendToLastMessage("\n\nSorry, er ging iets mis. Probeer het opnieuw.")
    } finally {
      setStreaming(false)
    }
  }

  const handleSendMessage = async (message: string) => {
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: message,
      createdAt: new Date(),
    }
    addMessage(userMsg)

    await sendToAI(message)
  }

  const handleSelectProject = (project: ProjectWithRelations) => {
    setProject(project)
    setShowCategorySelector(false)
    setShowQuestions(false)
  }

  const handleBack = () => {
    setProject(null)
    setSelectedCategory(null)
    setShowCategorySelector(true)
    setShowQuestions(false)
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {currentProjectId && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-500" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-zinc-100 dark:text-zinc-900" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                AI Workspace
              </h1>
              <p className="text-[11px] text-zinc-500">
                {projectContext
                  ? `${projectContext.title} — ${projectContext.category}`
                  : "Geen project geselecteerd"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar - project list when no project selected */}
        <AnimatePresence>
          {!currentProjectId && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-r border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0"
            >
              <div className="w-[280px] p-4 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FolderOpen className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Projecten
                  </span>
                </div>
                {DEMO_PROJECTS.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className={cn(
                      "w-full text-left rounded-xl border p-3 transition-all duration-200",
                      "hover:border-zinc-300 dark:hover:border-zinc-600",
                      "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {PROJECT_ICONS[project.category] || "✨"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {project.title}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {project.description || project.category}
                        </p>
                      </div>
                    </div>
                    {project.progress > 0 && (
                      <div className="mt-2 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chat area */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!currentProjectId && !showCategorySelector && messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Welkom bij Forge
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
                  Selecteer een project uit de zijbalk of begin een nieuw idee.
                </p>
                <Button onClick={() => setShowCategorySelector(true)} size="lg">
                  <Sparkles className="w-4 h-4" />
                  Nieuw idee starten
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col"
              >
                <ChatInterface
                  onSendMessage={handleSendMessage}
                  onCategorySelect={handleCategorySelect}
                  onQuestionAnswer={handleQuestionAnswer}
                  selectedCategory={selectedCategory}
                  showCategorySelector={showCategorySelector && !currentProjectId}
                  showQuestions={showQuestions && !currentProjectId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
