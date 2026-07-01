import { create } from "zustand"
import type { ChatMode } from "@/types"
import type { ProjectWithRelations } from "@/types"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

interface ChatState {
  messages: Message[]
  currentMode: ChatMode
  isStreaming: boolean
  currentProjectId: string | null
  projectContext: ProjectWithRelations | null
  addMessage: (message: Message) => void
  setMode: (mode: ChatMode) => void
  setStreaming: (streaming: boolean) => void
  setProject: (project: ProjectWithRelations | null) => void
  setProjectId: (id: string | null) => void
  clearChat: () => void
  appendToLastMessage: (content: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentMode: "Brainstorm" as ChatMode,
  isStreaming: false,
  currentProjectId: null,
  projectContext: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMode: (mode) =>
    set({ currentMode: mode }),

  setStreaming: (streaming) =>
    set({ isStreaming: streaming }),

  setProject: (project) =>
    set({
      projectContext: project,
      currentProjectId: project?.id ?? null,
    }),

  setProjectId: (id) =>
    set({ currentProjectId: id }),

  clearChat: () =>
    set({ messages: [] }),

  appendToLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages]
      const last = messages[messages.length - 1]
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = {
          ...last,
          content: last.content + content,
        }
      }
      return { messages }
    }),
}))
