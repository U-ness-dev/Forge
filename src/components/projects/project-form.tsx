"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PROJECT_CATEGORIES } from "@/types"

const projectSchema = z.object({
  title: z.string().min(1, "Titel is verplicht").max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1, "Categorie is verplicht"),
  technologies: z.string().optional(),
  tags: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  initialData?: {
    id: string
    title: string
    description: string | null
    category: string
    technologies: string | null
    tags: string | null
  }
  mode?: "create" | "edit"
}

export function ProjectForm({ initialData, mode = "create" }: ProjectFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      technologies: initialData?.technologies ?? "",
      tags: initialData?.tags ?? "",
    },
  })

  const selectedCategory = watch("category")

  const onSubmit = async (data: ProjectFormData) => {
    setSubmitting(true)
    try {
      const url =
        mode === "edit" && initialData
          ? `/api/projects/${initialData.id}`
          : "/api/projects"
      const method = mode === "edit" ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const project = await res.json()
        router.push(`/projects/${project.id}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "edit" ? "Project bewerken" : "Nieuw project"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Titel"
            placeholder="Mijn project"
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium leading-none">Beschrijving</label>
            <textarea
              className="min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Beschrijf je project..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Categorie</label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7">
              {PROJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setValue("category", cat.value)}
                  className={`rounded-lg border p-2 text-center text-xs font-medium transition-all ${
                    selectedCategory === cat.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <Input
            label="Technologieën"
            placeholder="React, Node.js, Python..."
            {...register("technologies")}
          />

          <Input
            label="Tags (komma-gescheiden)"
            placeholder="web, frontend, design"
            {...register("tags")}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuleren
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Bezig..."
            : mode === "edit"
              ? "Opslaan"
              : "Project aanmaken"}
        </Button>
      </div>
    </form>
  )
}
