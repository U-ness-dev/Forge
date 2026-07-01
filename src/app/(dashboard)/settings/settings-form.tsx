"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { toast } from "sonner"
import { User, Palette, Bell, Shield } from "lucide-react"

interface SettingsFormProps {
  name: string
  email: string
  image: string
}

const sections = [
  { id: "profile", label: "Profiel", icon: User },
  { id: "appearance", label: "Weergave", icon: Palette },
  { id: "notifications", label: "Notificaties", icon: Bell },
  { id: "security", label: "Beveiliging", icon: Shield },
]

export function SettingsForm({ name, email, image }: SettingsFormProps) {
  const [activeSection, setActiveSection] = useState("profile")
  const [displayName, setDisplayName] = useState(name)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName }),
      })
      if (!res.ok) throw new Error()
      toast.success("Instellingen opgeslagen")
    } catch {
      toast.error("Er ging iets mis")
    } finally {
      setIsSaving(false)
    }
  }

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email.slice(0, 2).toUpperCase()

  return (
    <div className="flex gap-8">
      <nav className="hidden w-48 shrink-0 flex-col gap-1 lg:flex">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          )
        })}
      </nav>

      <div className="flex-1 space-y-6">
        {activeSection === "profile" && (
          <Card className="overflow-hidden border bg-card">
            <CardHeader>
              <CardTitle>Profiel</CardTitle>
              <CardDescription>
                Je persoonlijke informatie en hoe anderen je zien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar size="xl" src={image || undefined} alt={displayName} fallback={initials} />
                  <div>
                    <p className="text-sm font-medium">{displayName || "Gebruiker"}</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam</Label>
                    <Input
                      id="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Je naam"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" value={email} disabled />
                    <p className="text-xs text-muted-foreground">
                      E-mail kan niet worden gewijzigd
                    </p>
                  </div>
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Opslaan..." : "Wijzigingen opslaan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeSection === "appearance" && (
          <Card className="border bg-card">
            <CardHeader>
              <CardTitle>Weergave</CardTitle>
              <CardDescription>Pas de look & feel van Forge aan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Thema voorkeuren worden beheerd via het icoon rechtsboven.
              </p>
            </CardContent>
          </Card>
        )}

        {activeSection === "notifications" && (
          <Card className="border bg-card">
            <CardHeader>
              <CardTitle>Notificaties</CardTitle>
              <CardDescription>Beheer je notificatievoorkeuren</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notificatie-instellingen zijn binnenkort beschikbaar.
              </p>
            </CardContent>
          </Card>
        )}

        {activeSection === "security" && (
          <Card className="border bg-card">
            <CardHeader>
              <CardTitle>Beveiliging</CardTitle>
              <CardDescription>Beheer je wachtwoord en beveiligingsinstellingen</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Beveiligingsinstellingen zijn binnenkort beschikbaar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
