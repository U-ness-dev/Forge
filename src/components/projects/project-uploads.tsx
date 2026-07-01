"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, File, FileImage, FileVideo, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UploadFile {
  id: string
  filename: string
  url: string
  type: string
  size: number
  createdAt: Date
}

interface ProjectUploadsProps {
  projectId: string
  initialUploads: UploadFile[]
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const fileTypeIcons: Record<string, React.ElementType> = {
  "image/": FileImage,
  "video/": FileVideo,
  "application/pdf": File,
}

function getFileIcon(type: string) {
  const key = Object.keys(fileTypeIcons).find((k) => type.startsWith(k))
  return key ? fileTypeIcons[key] : File
}

export function ProjectUploads({ projectId, initialUploads }: ProjectUploadsProps) {
  const [uploads, setUploads] = useState<UploadFile[]>(initialUploads)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    const formData = new FormData()
    formData.append("projectId", projectId)
    Array.from(files).forEach((file) => {
      formData.append("files", file)
    })

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data)) {
        setUploads([...data, ...uploads])
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploads</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8
            transition-colors
            ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}
          `}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {uploading ? "Bezig met uploaden..." : "Sleep bestanden hier of klik om te uploaden"}
          </p>
          <p className="text-xs text-muted-foreground">
            Afbeeldingen, video's, PDF's en meer
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleUpload(e.target.files)
            }}
          />
        </div>

        {uploads.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Nog geen uploads
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {uploads.map((file) => {
                const Icon = getFileIcon(file.type)
                const isImage = file.type.startsWith("image/")
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative overflow-hidden rounded-lg border"
                  >
                    {isImage ? (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-square items-center justify-center bg-muted">
                        <Icon className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex w-full items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-white">
                            {file.filename}
                          </p>
                          <p className="text-xs text-white/70">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <a
                          href={file.url}
                          download
                          className="ml-2 rounded-full bg-white/20 p-1 text-white hover:bg-white/30"
                        >
                          <Download className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
