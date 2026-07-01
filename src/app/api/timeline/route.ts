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

  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    })
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const events = await prisma.timelineEvent.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
    })
    return NextResponse.json(events)
  }

  const events = await prisma.timelineEvent.findMany({
    where: { project: { userId: session.user.id } },
    include: { project: { select: { title: true } } },
    orderBy: { date: "desc" },
    take: 50,
  })

  return NextResponse.json(events)
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
    select: { userId: true },
  })

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const event = await prisma.timelineEvent.create({
    data: { content, projectId },
  })

  return NextResponse.json(event, { status: 201 })
}
