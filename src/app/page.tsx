import Link from "next/link"
import { Sparkles, ArrowRight, Lightbulb, Route, MessageSquare, Clock } from "lucide-react"

const features = [
  {
    icon: Lightbulb,
    title: "Brainstorm",
    description: "Ontwikkel ideeën met AI die vragen stelt, niet alleen antwoorden geeft.",
  },
  {
    icon: Route,
    title: "Planning",
    description: "Van idee naar actie met slimme roadmaps en MVP planning.",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    description: "Krijg eerlijke, constructieve feedback op je werk.",
  },
  {
    icon: Clock,
    title: "Project Memory",
    description: "Forge onthoudt al je keuzes, zodat je nooit opnieuw hoeft uit te leggen.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Forge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Inloggen
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-all hover:bg-zinc-200"
            >
              Starten
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-sm text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Je persoonlijke AI Creative Companion
            </div>
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Creëer met focus.
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Laat Forge je begeleiden.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Forge is geen AI die het werk overneemt. Het is je creatieve partner die
              scherpe vragen stelt, structuur biedt en je helpt om jouw beste werk te maken.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-medium text-black transition-all hover:bg-zinc-200"
              >
                Gratis beginnen
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-8 text-sm font-medium text-white transition-all hover:bg-white/[0.08]"
              >
                Inloggen
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Ontworpen voor jouw creatieve proces
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Van eerste idee tot afgewerkt project — Forge groeit met je mee.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20">
                      <Icon className="h-5 w-5 text-violet-400" />
                    </div>
                    <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-500">
          Forge — Je persoonlijke AI Creative Companion
        </div>
      </footer>
    </div>
  )
}
