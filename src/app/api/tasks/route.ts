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

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, priority, projectId } = body

  if (!title || !projectId) {
    return NextResponse.json(
      { error: "Title and projectId are required" },
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

  const task = await prisma.task.create({
    data: {
      title,
      priority: priority ?? "Medium",
      projectId,
    },
  })

  await prisma.timelineEvent.create({
    data: {
      content: `Taak "${title}" toegevoegd aan "${project.title}"`,
      projectId,
    },
  })

  return NextResponse.json(task, { status: 201 })
}
