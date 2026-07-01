import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProjectCard } from "@/components/dashboard/project-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { tasks: true, uploads: true, chats: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const timelineEvents = await prisma.timelineEvent.findMany({
    where: { project: { userId: session.user.id } },
    include: { project: { select: { title: true } } },
    orderBy: { date: "desc" },
    take: 20,
  })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  })

  const totalProjects = projects.length
  const activeProjects = projects.filter(
    (p) => p.status !== "Finished"
  ).length
  const completedProjects = projects.filter(
    (p) => p.status === "Finished"
  ).length
  const favoriteProjects = projects.filter((p) => p.isFavorite)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welkom terug, {user?.name ?? "Gebruiker"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Hier is een overzicht van al je projecten.
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4" />
            Nieuw project
          </Button>
        </Link>
      </div>

      <StatsCards
        total={totalProjects}
        active={activeProjects}
        completed={completedProjects}
      />

      {favoriteProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Favoriete projecten</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProjects.slice(0, 4).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recente projecten</h2>
          <Link
            href="/projects"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Bekijk alle
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <FolderKanbanIcon className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">Nog geen projecten</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Maak je eerste project aan om te beginnen.
            </p>
            <Link href="/projects/new">
              <Button>
                <Plus className="h-4 w-4" />
                Nieuw project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recente activiteit</h2>
        <ActivityFeed events={timelineEvents} />
      </section>
    </div>
  )
}

function FolderKanbanIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </svg>
  )
}
