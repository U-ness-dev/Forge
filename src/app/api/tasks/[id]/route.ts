import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: { select: { userId: true, title: true } } },
  })

  if (!task || task.project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await request.json()
  const allowedFields = ["title", "description", "priority", "completed", "deadline"]
  const data: Record<string, unknown> = {}

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field]
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 })
  }

  const updated = await prisma.task.update({
    where: { id },
    data,
  })

  if (data.completed !== undefined) {
    await prisma.timelineEvent.create({
      data: {
        content: data.completed
          ? `Taak "${task.title}" afgerond`
          : `Taak "${task.title}" heropend`,
        projectId: task.projectId,
      },
    })
  }

  return NextResponse.json(updated)
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

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: { select: { userId: true, title: true } } },
  })

  if (!task || task.project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.task.delete({ where: { id } })

  await prisma.timelineEvent.create({
    data: {
      content: `Taak "${task.title}" verwijderd`,
      projectId: task.projectId,
    },
  })

  return NextResponse.json({ message: "Task deleted" })
}
