"use client"

import { User, Cpu } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { nl } from "date-fns/locale"
import type { Message } from "@/stores/use-chat-store"

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

function renderMarkdown(text: string) {
  const parts: React.ReactNode[] = []
  let remaining = text

  const boldRegex = /\*\*(.*?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {renderInlineCode(text.slice(lastIndex, match.index))}
        </span>
      )
    }
    parts.push(
      <strong key={`bold-${match.index}`} className="font-semibold">
        {match[1]}
      </strong>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {renderInlineCode(text.slice(lastIndex))}
      </span>
    )
  }

  return parts
}

function renderInlineCode(text: string) {
  const parts: React.ReactNode[] = []
  const codeRegex = /`([^`]+)`/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <code
        key={`code-${match.index}`}
        className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
      >
        {match[1]}
      </code>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function renderContent(text: string) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeBlockContent = ""
  let codeBlockLang = ""

  lines.forEach((line, i) => {
    const trimmed = line.trim()

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`codeblock-${i}`}
            className="my-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"
          >
            <code>{codeBlockContent}</code>
          </pre>
        )
        codeBlockContent = ""
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeBlockLang = trimmed.slice(3).trim()
      }
      return
    }

    if (inCodeBlock) {
      codeBlockContent += (codeBlockContent ? "\n" : "") + line
      return
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="mt-4 mb-2 text-lg font-semibold">
          {trimmed.slice(4)}
        </h3>
      )
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="mt-5 mb-2 text-xl font-semibold">
          {trimmed.slice(3)}
        </h2>
      )
    } else if (trimmed.startsWith("- ")) {
      elements.push(
        <li key={`li-${i}`} className="ml-4 list-disc text-zinc-700 dark:text-zinc-300">
          {renderMarkdown(trimmed.slice(2))}
        </li>
      )
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <li key={`ol-${i}`} className="ml-4 list-decimal text-zinc-700 dark:text-zinc-300">
          {renderMarkdown(trimmed.replace(/^\d+\.\s/, ""))}
        </li>
      )
    } else if (trimmed === "") {
      elements.push(<div key={`br-${i}`} className="h-2" />)
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {renderMarkdown(trimmed)}
        </p>
      )
    }
  })

  if (inCodeBlock) {
    elements.push(
      <pre
        key="codeblock-unclosed"
        className="my-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"
      >
        <code>{codeBlockContent}</code>
      </pre>
    )
  }

  return elements
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-3 w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
          isUser
            ? "bg-primary/10 text-primary"
            : "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
      </div>

      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-zinc-100 dark:bg-zinc-800/50 rounded-tl-md border border-zinc-200/50 dark:border-zinc-700/50"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none">
              {renderContent(message.content)}
              {isStreaming && (
                <span className="inline-flex ml-0.5">
                  <span className="w-1.5 h-4 bg-zinc-500 dark:bg-zinc-400 rounded-full animate-pulse" />
                </span>
              )}
            </div>
          )}
        </div>
        <span className="text-[11px] text-zinc-400 mt-1 px-1">
          {format(new Date(message.createdAt), "HH:mm", { locale: nl })}
        </span>
      </div>
    </motion.div>
  )
}
