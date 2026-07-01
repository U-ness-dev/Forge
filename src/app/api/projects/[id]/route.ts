import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { createdAt: "desc" } },
      uploads: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      timeline: { orderBy: { date: "desc" } },
      _count: { select: { tasks: true, uploads: true, notes: true, chats: true } },
    },
  })

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(project)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await request.json()
  const allowedFields = [
    "title",
    "description",
    "category",
    "status",
    "technologies",
    "tags",
    "coverImage",
    "progress",
    "isFavorite",
  ]

  const data: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field]
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 })
  }

  const project = await prisma.project.update({
    where: { id },
    data,
  })

  if (data.title || data.status) {
    const changes: string[] = []
    if (data.title && data.title !== existing.title) {
      changes.push(`titel gewijzigd naar "${data.title}"`)
    }
    if (data.status && data.status !== existing.status) {
      changes.push(`status gewijzigd naar ${data.status}`)
    }
    if (changes.length > 0) {
      await prisma.timelineEvent.create({
        data: {
          content: `Project ${changes.join(" en ")}`,
          projectId: id,
        },
      })
    }
  }

  return NextResponse.json(project)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.project.delete({ where: { id } })

  return NextResponse.json({ message: "Project deleted" })
}
