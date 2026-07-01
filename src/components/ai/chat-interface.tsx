"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SendHorizonal, Sparkles, MessageSquare, RotateCcw } from "lucide-react"
import { useChatStore, type Message } from "@/stores/use-chat-store"
import { ChatMessage } from "./chat-message"
import { ProjectTypeSelector } from "./project-type-selector"
import { BrainstormingQuestions } from "./brainstorming-questions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AI_MODES } from "@/types"
import type { ChatMode } from "@/types"

const MODE_STYLES: Record<string, { border: string; bg: string; accent: string }> = {
  Brainstorm: {
    border: "border-violet-200 dark:border-violet-800/50",
    bg: "bg-violet-50/50 dark:bg-violet-950/20",
    accent: "text-violet-600 dark:text-violet-400",
  },
  Planning: {
    border: "border-blue-200 dark:border-blue-800/50",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    accent: "text-blue-600 dark:text-blue-400",
  },
  Feedback: {
    border: "border-amber-200 dark:border-amber-800/50",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    accent: "text-amber-600 dark:text-amber-400",
  },
  Reflection: {
    border: "border-emerald-200 dark:border-emerald-800/50",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>
  onCategorySelect: (category: string) => void
  onQuestionAnswer: (question: string, answer: string) => void
  selectedCategory: string | null
  showCategorySelector: boolean
  showQuestions: boolean
}

export function ChatInterface({
  onSendMessage,
  onCategorySelect,
  onQuestionAnswer,
  selectedCategory,
  showCategorySelector,
  showQuestions,
}: ChatInterfaceProps) {
  const { messages, currentMode, isStreaming, setMode, clearChat } = useChatStore()
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  React.useEffect(() => {
    if (!isStreaming && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isStreaming])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const message = input.trim()
    setInput("")
    await onSendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const styles = MODE_STYLES[currentMode]

  return (
    <div className={cn("flex flex-col h-full rounded-2xl border overflow-hidden", styles.border)}>
      {/* Header with mode selector */}
      <div className={cn("flex items-center justify-between px-4 py-3 border-b", styles.bg)}>
        <div className="flex items-center gap-2">
          <Sparkles className={cn("w-4 h-4", styles.accent)} />
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Forge — {AI_MODES.find((m) => m.value === currentMode)?.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {AI_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setMode(mode.value as ChatMode)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50",
                currentMode === mode.value
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {mode.label}
            </button>
          ))}
          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-all"
            title="Nieuw gesprek"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
      >
        {messages.length === 0 && !showCategorySelector && !showQuestions ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Wat wil je bespreken?
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              Stel een vraag, deel een idee, of vraag om feedback. Forge is er om je te helpen.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
        )}

        {showCategorySelector && (
          <div className="py-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Wat wil je vandaag maken?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Kies een categorie om te beginnen.
              </p>
            </motion.div>
            <ProjectTypeSelector
              selected={selectedCategory}
              onSelect={onCategorySelect}
            />
          </div>
        )}

        {showQuestions && selectedCategory && (
          <div className="py-4">
            <BrainstormingQuestions
              category={selectedCategory}
              onAnswer={onQuestionAnswer}
            />
          </div>
        )}

        {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
          <ChatMessage
            message={messages[messages.length - 1]}
            isStreaming={isStreaming}
          />
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                autoResize(e as unknown as React.ChangeEvent<HTMLTextAreaElement>)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Typ je bericht..."
              rows={1}
              disabled={isStreaming}
              className={cn(
                "w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 px-4 py-3 pr-12 text-sm",
                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 rounded-xl h-10 w-10"
          >
            <SendHorizonal className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-[11px] text-zinc-400 mt-1.5 text-center">
          Forge is een creative companion. Druk Shift+Enter voor een nieuwe regel.
        </p>
      </div>
    </div>
  )
}
