import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { ProjectDetailClient } from "./client"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

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

  if (!project || project.userId !== session.user.id) notFound()

  return <ProjectDetailClient project={project} />
}
