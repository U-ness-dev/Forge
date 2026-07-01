"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Fingerprint,
  Gamepad2,
  Package,
  Box,
  Wind,
  Image,
  Video,
  Clapperboard,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PROJECT_CATEGORIES } from "@/types"

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Monitor: <Monitor className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Fingerprint: <Fingerprint className="w-6 h-6" />,
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
  Cube: <Package className="w-6 h-6" />,
  Box: <Box className="w-6 h-6" />,
  Wind: <Wind className="w-6 h-6" />,
  Image: <Image className="w-6 h-6" />,
  Video: <Video className="w-6 h-6" />,
  Clapperboard: <Clapperboard className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
}

interface ProjectTypeSelectorProps {
  selected: string | null
  onSelect: (value: string) => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function ProjectTypeSelector({ selected, onSelect }: ProjectTypeSelectorProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
    >
      {PROJECT_CATEGORIES.map((cat) => {
        const isSelected = selected === cat.value
        return (
          <motion.button
            key={cat.value}
            variants={item}
            layout
            onClick={() => onSelect(cat.value)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
              "hover:border-zinc-300 dark:hover:border-zinc-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
            )}
          >
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
                />
              )}
            </AnimatePresence>
            <div
              className={cn(
                "transition-colors duration-200",
                isSelected ? "text-primary" : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {iconMap[cat.icon] || <Sparkles className="w-6 h-6" />}
            </div>
            <span
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                isSelected
                  ? "text-primary"
                  : "text-zinc-700 dark:text-zinc-300"
              )}
            >
              {cat.label}
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
