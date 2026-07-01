import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    )
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  })

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const uploads = await prisma.upload.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(uploads)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const projectId = formData.get("projectId") as string
  const files = formData.getAll("files") as File[]

  if (!projectId || files.length === 0) {
    return NextResponse.json(
      { error: "projectId and files are required" },
      { status: 400 }
    )
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true, title: true },
  })

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const uploadDir = join(process.cwd(), "public", "uploads", projectId)
  await mkdir(uploadDir, { recursive: true })

  const uploads = []

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "bin"
    const uniqueName = `${randomUUID()}.${ext}`
    const filePath = join(uploadDir, uniqueName)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const upload = await prisma.upload.create({
      data: {
        filename: file.name,
        url: `/uploads/${projectId}/${uniqueName}`,
        type: file.type,
        size: file.size,
        projectId,
      },
    })

    uploads.push(upload)
  }

  await prisma.timelineEvent.create({
    data: {
      content: `${files.length} bestand(en) geüpload naar "${project.title}"`,
      projectId,
    },
  })

  return NextResponse.json(uploads, { status: 201 })
}
