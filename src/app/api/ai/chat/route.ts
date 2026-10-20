import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOpenAIClient } from "@/lib/openai"
import { getSystemPrompt } from "@/lib/ai-prompts"
import type { ChatMode } from "@/types"

const DEMO_PROJECT_PREFIX = "demo-"

function isDemoProject(id: string) {
  return id.startsWith(DEMO_PROJECT_PREFIX)
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, message, mode, chatHistory } = await req.json() as {
      projectId: string | null
      message: string
      mode: ChatMode
      chatHistory: { role: "user" | "assistant"; content: string }[]
    }

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let project = null
    if (projectId && !isDemoProject(projectId)) {
      project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
        include: {
          tasks: true,
          uploads: true,
          notes: true,
          timeline: true,
          chats: {
            include: {
              messages: {
                orderBy: { createdAt: "desc" },
                take: 20,
              },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      })

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      const encoder = new TextEncoder()
      const demoResponse = getDemoResponse(mode || "Brainstorm", message)
      const stream = new ReadableStream({
        async start(controller) {
          for (const char of demoResponse) {
            controller.enqueue(encoder.encode(char))
            await new Promise((r) => setTimeout(r, 15))
          }
          controller.close()
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      })
    }

    const systemPrompt = getSystemPrompt(mode || "Brainstorm", project)

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ]

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true,
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices?.[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (error) {
          console.error("Stream error:", error)
          controller.enqueue(encoder.encode("\n\nEr ging iets mis. Probeer het opnieuw."))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 }
    )
  }
}

function getDemoResponse(mode: ChatMode, message: string) {
  const lower = message.toLowerCase()

  if (mode === "Brainstorm") {
    if (lower.includes("game") || lower.includes("pixel")) {
      return `**Leuk, een pixel art platformer!** 🎮

Hier zijn wat ideeën om mee te starten:

**Core Mechanic:** Laat de speler niet alleen rennen en springen, maar ook kort **de tijd vertragen**. Dit opent coole puzzle mogelijkheden en geeft je game een unieke twist.

**Art Style:** Ga voor een **twee-tints kleurenpalet** per wereld (bijv. rood/zwart voor vulcan levels, blauw/wit voor ijswerelden). Dit geeft een sterke visuele identiteit.

**Vertel eens:** Wat voor **verhaal** wil je vertellen? Een klassieke "red de prinses" of iets originelers?`
    }

    if (lower.includes("website") || lower.includes("portfolio")) {
      return `**Een portfolio website, goede keuze!** 🌐

**Doelgroep:** Wie wil je bereiken? Potentiële werkgevers, freelancers, of een breder publiek?

**Must-have pagina's:**
- 🏠 Home met een sterke intro
- 💼 Projecten grid met filters
- 📄 Over mij + skills
- ✉️ Contactformulier

**Tip:** Voeg een **interactieve element** toe zoals een cursor trail of scroll-animaties om je design skills te tonen.`
    }

    if (lower.includes("brand") || lower.includes("koffie")) {
      return `**Een brand identity voor een koffiebar — nice!** ☕

**Persoonlijkheid:** Wat voor vibes moet het merk uitstralen?
- 🟤 **Rustiek & warm** — aardetinten, handgetekende elementen
- ⚫ **Modern & minimalistisch** — strakke lijnen, monochroom
- 🟢 **Duurzaam & natuurlijk** — groentinten, organische vormen

**Concurrentieanalyse:** Wie zijn de andere koffiebars in de buurt? Wat doen zij goed en wat kan jij anders doen?`
    }
  }

  if (mode === "Planning") {
    return `**Laten we een planning maken.** 📋

**Stap 1: Doelstellingen**
Wat zijn de belangrijkste doelen voor dit project? Schrijf er 3 op.

**Stap 2: MVP**
Wat is de minimale versie die werkt? Focus op de kernfunctionaliteit.

**Stap 3: Tijdlijn**
- Week 1-2: Research & concept
- Week 3-4: Eerste versie
- Week 5-6: Verfijnen & testen

**Wat is jouw deadline?**`
  }

  if (mode === "Feedback") {
    return `**Laten we eens kritisch kijken.** 🔍

**Sterke punten:**
- Je hebt een duidelijk doel voor ogen
- De technologiekeuze lijkt solide

**GroeiKansen:**
- Probeer de scope klein te houden
- Documenteer je keuzes voor later

**Vraag:** Waar ben je zelf het meest onzeker over in dit project? Daar beginnen we.`
  }

  if (mode === "Reflection") {
    return `**Tijd om terug te blikken.** 💭

**Wat heb je geleerd** tijdens dit project tot nu toe?
**Wat zou je de volgende keer anders doen?**
**Waar ben je het meest trots op?**

Neem even de tijd om deze vragen te beantwoorden. Vaak zit de grootste groei in de lessen die we onderweg leren.`
  }

  return `**Hallo!** 👋

Ik ben Forge, jouw creative companion. Ik help je met brainstormen, plannen, feedback geven en reflecteren.

**Vertel me meer over wat je aan het maken bent.** Waar loop je tegenaan? Wat heb je nodig? Hoe verder ik je verhaal ken, hoe beter ik je kan helpen.`
}
