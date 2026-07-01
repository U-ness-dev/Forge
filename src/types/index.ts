import type { ProjectStatus, ProjectCategory, ChatMode, TaskPriority } from "@prisma/client"

export type { ProjectStatus, ProjectCategory, ChatMode, TaskPriority }

export interface ProjectWithRelations {
  id: string
  title: string
  description: string | null
  category: ProjectCategory
  status: ProjectStatus
  technologies: string | null
  tags: string | null
  coverImage: string | null
  progress: number
  isFavorite: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  tasks: TaskWithRelations[]
  uploads: UploadWithRelations[]
  timeline: TimelineEventWithRelations[]
  chats: ChatWithRelations[]
  _count?: {
    tasks: number
    uploads: number
    chats: number
  }
}

export interface TaskWithRelations {
  id: string
  title: string
  description: string | null
  priority: TaskPriority
  deadline: Date | null
  completed: boolean
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface UploadWithRelations {
  id: string
  filename: string
  url: string
  type: string
  size: number
  projectId: string
  createdAt: Date
}

export interface TimelineEventWithRelations {
  id: string
  content: string
  date: Date
  projectId: string
}

export interface ChatWithRelations {
  id: string
  title: string | null
  mode: ChatMode
  projectId: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessageWithRelations[]
}

export interface ChatMessageWithRelations {
  id: string
  role: string
  content: string
  chatId: string
  createdAt: Date
}

export const PROJECT_CATEGORIES = [
  { value: "Website", label: "Website", icon: "Globe" },
  { value: "MobileApp", label: "Mobile App", icon: "Smartphone" },
  { value: "DesktopApp", label: "Desktop App", icon: "Monitor" },
  { value: "Branding", label: "Branding", icon: "Palette" },
  { value: "Logo", label: "Logo", icon: "Fingerprint" },
  { value: "Game", label: "Game", icon: "Gamepad2" },
  { value: "BlenderProject", label: "Blender Project", icon: "Cube" },
  { value: "ThreeDScene", label: "3D Scene", icon: "Box" },
  { value: "MotionDesign", label: "Motion Design", icon: "Wind" },
  { value: "Poster", label: "Poster", icon: "Image" },
  { value: "Video", label: "Video", icon: "Video" },
  { value: "Animation", label: "Animatie", icon: "Clapperboard" },
  { value: "Other", label: "Andere", icon: "Sparkles" },
] as const

export const PROJECT_STATUSES = [
  { value: "Idea", label: "Idee" },
  { value: "Research", label: "Research" },
  { value: "Planning", label: "Planning" },
  { value: "Design", label: "Design" },
  { value: "Development", label: "Development" },
  { value: "Testing", label: "Testing" },
  { value: "Finished", label: "Afgerond" },
] as const

export const AI_MODES = [
  { value: "Brainstorm", label: "Brainstorm", description: "Nieuwe ideeën en inspiratie" },
  { value: "Planning", label: "Planning", description: "Roadmap en MVP planning" },
  { value: "Feedback", label: "Feedback", description: "Sterke en zwakke punten" },
  { value: "Reflection", label: "Reflectie", description: "Terugblikken en volgende stappen" },
] as const
