import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "./settings-form"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) redirect("/login")

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Instellingen</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Beheer je accountinstellingen en voorkeuren
        </p>
      </div>

      <SettingsForm
        name={user.name || ""}
        email={user.email || ""}
        image={user.image || ""}
      />
    </div>
  )
}
