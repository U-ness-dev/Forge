import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

  const notes = await prisma.note.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(notes)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { content, projectId } = body

  if (!content || !projectId) {
    return NextResponse.json(
      { error: "Content and projectId are required" },
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

  const note = await prisma.note.create({
    data: { content, projectId },
  })

  await prisma.timelineEvent.create({
    data: {
      content: `Notitie toegevoegd aan "${project.title}"`,
      projectId,
    },
  })

  return NextResponse.json(note, { status: 201 })
}
