"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PROJECT_CATEGORIES } from "@/types"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  Globe: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Smartphone: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
  ),
  Monitor: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
  ),
  Palette: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.6 1.5-1.5 0-.33-.13-.65-.38-.9a1.5 1.5 0 0 1 0-2.12c.25-.25.58-.38.88-.38H14c3.31 0 6-2.69 6-6C20 5.5 16.42 2 12 2Z"/></svg>
  ),
  Fingerprint: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-5 8.66"/><path d="M12 2a10 10 0 0 0-7.07 3"/><path d="M12 2v4"/><path d="M12 6v4"/><path d="M12 10v4"/><path d="M12 14v4"/><path d="M12 18v4"/></svg>
  ),
  Gamepad2: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
  ),
  Cube: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="M3 8l9 5 9-5"/><path d="M12 22V13"/></svg>
  ),
  Box: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Wind: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2.5 2.5 0 1 1 11.5 8H2"/><path d="M12.6 19.4A2.5 2.5 0 1 0 14.5 16H2"/></svg>
  ),
  Image: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  ),
  Video: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 11 5 3-5 3v-6Z"/></svg>
  ),
  Clapperboard: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z"/><path d="m4 11 2-7"/><path d="m10 11 2-7"/><path d="m16 11 2-7"/><path d="M2 11h20"/></svg>
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m5.64 5.64 12.72 12.72"/><path d="m18.36 5.64-12.72 12.72"/></svg>
  ),
}

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

const steps = ["Categorie", " Basis info", "Technologieën"]

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [technologies, setTechnologies] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const addTag = () => {
    const trimmed = tagsInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagsInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          technologies,
          tags: tags.join(","),
        }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/projects/${data.id}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Nieuw project
        </h1>
        <p className="text-sm text-muted-foreground">
          Doorloop de stappen om een nieuw project aan te maken.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm",
                i === step ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-12 rounded",
                  i < step ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Kies een categorie</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {PROJECT_CATEGORIES.map((cat) => {
                const Icon = iconMap[cat.icon] ?? iconMap.Sparkles
                const gradient = categoryGradients[cat.value] ?? "from-zinc-600 to-zinc-400"
                const isSelected = category === cat.value
                return (
                  <motion.button
                    key={cat.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-muted-foreground/30 hover:bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br",
                        gradient
                      )}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium">{cat.label}</span>
                    {isSelected && (
                      <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Project informatie</h2>
            <Input
              label="Titel"
              placeholder="Mijn project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Beschrijving
              </label>
              <textarea
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Beschrijf je project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Technologieën & Tags</h2>
            <Input
              label="Technologieën"
              placeholder="React, Node.js, Python..."
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Voeg een tag toe..."
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button variant="outline" onClick={addTag} type="button">
                  Toevoegen
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border bg-accent px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => step > 0 ? setStep(step - 1) : router.back()}
          disabled={submitting}
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 0 ? "Annuleren" : "Vorige"}
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !category}>
            Volgende
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!title || submitting}>
            {submitting ? (
              "Bezig..."
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Project aanmaken
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
