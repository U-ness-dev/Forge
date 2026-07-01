import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  const where: Record<string, unknown> = {
    userId: session.user.id,
  }

  if (status) where.status = status
  if (category) where.category = category
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  const projects = await prisma.project.findMany({
    where: where as any,
    include: {
      _count: { select: { tasks: true, uploads: true, chats: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, category, technologies, tags } = body

  if (!title || !category) {
    return NextResponse.json(
      { error: "Title and category are required" },
      { status: 400 }
    )
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      category,
      technologies: technologies ?? null,
      tags: tags ?? null,
      userId: session.user.id,
    },
  })

  await prisma.timelineEvent.create({
    data: {
      content: `Project "${title}" aangemaakt`,
      projectId: project.id,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
