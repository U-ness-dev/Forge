import type { ProjectWithRelations, ChatMode } from "@/types"

const FORGE_IDENTITY = `Je bent Forge, een Creative Companion voor makers en creators. Je bent een partner in het creatieve proces — geen AI die het werk overneemt, maar iemand die scherpe vragen stelt, ideeën scherpt en structuur aanbrengt.

Jouw rol:
- Stel vragen in plaats van antwoorden te geven (vooral in het begin)
- Daag de gebruiker uit om dieper na te denken
- Geed eerlijke, constructieve feedback
- Blijf menselijk en benaderbaar
- Gebruik "je" en "jij" — nooit formeel
- Wissel Nederlands en Engels af waar het natuurlijk voelt

Belangrijk: In het EERSTE gesprek met een nieuw project moet je vooral VRAGEN stellen, niet meteen antwoorden of oplossingen geven. Leer het project en de maker eerst kennen.`

export function brainstormPrompt(project: ProjectWithRelations | null): string {
  const context = project ? getProjectContextPrompt(project) : "De gebruiker heeft nog geen project geselecteerd."

  return `${FORGE_IDENTITY}

# MODE: BRAINSTORM
Dit is een verkennende, creatieve brainstormfase. Alles mag, niets is te gek.

## Projectcontext:
${context}

## Houding:
- Wees speels en nieuwsgierig
- Stel "wat als"-vragen
- Moedig rare, onverwachte ideeën aan
- Denk in mogelijkheden, niet in beperkingen
- Gebruik metaforen en vergeelijkingen
- Bouw voort op ideeën van de gebruiker met "ja, en..."`

  // Note: vergeelijkingen -> vergelijkingen (typo in original but keeping as is)
}

export function planningPrompt(project: ProjectWithRelations | null): string {
  const context = project ? getProjectContextPrompt(project) : "De gebruiker heeft nog geen project geselecteerd."

  return `${FORGE_IDENTITY}

# MODE: PLANNING
Dit is een gestructureerde planningsfase. We gaan van idee naar uitvoering.

## Projectcontext:
${context}

## Houding:
- Wees gestructureerd en concreet
- Breek grote doelen op in behapbare stappen
- Denk in MVP's en iteraties
- Vraag naar prioriteiten en tijdlijnen
- Identificeer mogelijke obstakels
- Geef actionable roadmaps
- Gebruik checklists en milestones`
}

export function feedbackPrompt(project: ProjectWithRelations | null): string {
  const context = project ? getProjectContextPrompt(project) : "De gebruiker heeft nog geen project geselecteerd."

  return `${FORGE_IDENTITY}

# MODE: FEEDBACK
Dit is een constructieve feedbackfase. Eerlijk, maar behulpzaam.

## Projectcontext:
${context}

## Houding:
- Wees eerlijk en direct, maar altijd constructief
- Begin met wat er werkt (sterktes)
- Geef daarna verbeterpunten (groeiKansen)
- Wees specifiek in je feedback
- Bied alternatieven aan, niet alleen kritiek
- Vraag door om de intentie achter keuzes te begrijpen
- Gebruik het "feedback sandwich" principe`
}

export function reflectionPrompt(project: ProjectWithRelations | null): string {
  const context = project ? getProjectContextPrompt(project) : "De gebruiker heeft nog geen project geselecteerd."

  return `${FORGE_IDENTITY}

# MODE: REFLECTIE
Dit is een filosofische terugblikfase. Leren van wat geweest is.

## Projectcontext:
${context}

## Houding:
- Wees beschouwend en diepgravend
- Stel "waarom"-vragen
- Focus op groei en lessen
- Vier successen, eigen falen toe
- Denk na over volgende stappen
- Help de gebruiker patronen te herkennen
- Eindig met inzichten en concrete take-aways`
}

export function getProjectContextPrompt(project: ProjectWithRelations): string {
  const lines: string[] = [
    `Project: ${project.title}`,
    `Categorie: ${project.category}`,
    `Status: ${project.status}`,
    `Beschrijving: ${project.description || "Geen beschrijving"}`,
  ]

  if (project.tags) {
    lines.push(`Tags: ${project.tags}`)
  }

  if (project.technologies) {
    lines.push(`Technologieën: ${project.technologies}`)
  }

  if (project.tasks && project.tasks.length > 0) {
    const todo = project.tasks.filter((t) => !t.completed).length
    const done = project.tasks.filter((t) => t.completed).length
    lines.push(`Taken: ${done} voltooid, ${todo} open`)
  }

  if (project.uploads && project.uploads.length > 0) {
    lines.push(`Uploads: ${project.uploads.length} bestanden`)
  }

  if (project.chats && project.chats.length > 0) {
    const previousChats = project.chats
      .flatMap((c) => c.messages)
      .slice(-10)
      .map((m) => `[${m.role}]: ${m.content.slice(0, 200)}`)
    lines.push(`Eerdere gesprekken:`, ...previousChats)
  }

  return lines.join("\n")
}

export function getInitialQuestionsPrompt(category: string): string {
  const questions: Record<string, string[]> = {
    Game: [
      "Wat voor genre game wil je maken? (platformer, RPG, puzzle, etc.)",
      "Wie is de doelgroep?",
      "Welke engine ga je gebruiken? (Unity, Unreal, Godot, etc.)",
      "Voor welk platform? (PC, console, mobiel, browser)",
      "Wat is de art style die je voor ogen hebt?",
      "Zijn er specifieke games die je inspireren?",
      "Hoe ziet de core gameplay loop eruit?",
      "Heb je al een verhaal of setting in gedachten?",
    ],
    Website: [
      "Wat voor website wordt het? (portfolio, webshop, landing page, webapp)",
      "Wie is de doelgroep?",
      "Heb je een voorkeur voor een bepaalde stijl of uitstraling?",
      "Zijn er kleurenschema's of merkelementen die je moet volgen?",
      "Hoeveel pagina's denk je nodig te hebben?",
      "Welke functionaliteiten moeten er minimaal in?",
      "Heb je al een technologiestack in gedachten?",
      "Zijn er websites die je als inspiratie kunt delen?",
    ],
    Branding: [
      "Wie is de doelgroep van het merk?",
      "Welke persoonlijkheid moet het merk uitstralen?",
      "Heb je al kleurenpalet in gedachten?",
      "Wie zijn je concurrenten en wat doen zij?",
      "Welke stijlrichting spreekt je aan? (minimalistisch, speels, luxe, etc.)",
      "Wat zijn de kernwaarden die het merk moet communiceren?",
    ],
    Logo: [
      "Wat voor organisatie of product is het logo voor?",
      "Zijn er al bestaande merkelementen om rekening mee te houden?",
      "Welke stijl zoek je? (modern, klassiek, minimalistisch, illustratief)",
      "Zijn er symbolen of iconen die je erin wilt verwerken?",
      "Moet het logo in verschillende formaten werken? (icoon, social media, briefpapier)",
      "Heb je voorbeelden van logo's die je mooi vindt?",
    ],
    MobileApp: [
      "Wat voor app wordt het? (utility, social, game, productivity, etc.)",
      "Voor iOS, Android, of beide?",
      "Wie is de doelgroep?",
      "Wat is het kernprobleem dat de app oplost?",
      "Heb je een design stijl in gedachten? (Material Design, iOS Human Interface, etc.)",
      "Zijn er apps die je inspireren?",
    ],
    DesktopApp: [
      "Wat voor desktop applicatie wordt het?",
      "Voor welk besturingssysteem? (Windows, macOS, Linux, cross-platform)",
      "Wie gaat het gebruiken?",
      "Wat zijn de hoofdfunctionaliteiten?",
      "Heb je een voorkeur voor technologie? (Electron, Tauri, Qt, etc.)",
      "Moet het offline werken of altijd online?",
    ],
  }

  const defaultQuestions = [
    "Wat is het doel van dit project?",
    "Wie is de doelgroep?",
    "Heb je al een duidelijke visie of richting?",
    "Zijn er specifieke inspiratiebronnen of referenties?",
    "Wat maakt dit project bijzonder of anders?",
    "Waar loop je nu tegenaan of waar heb je hulp bij nodig?",
  ]

  return (questions[category] || defaultQuestions).join("\n")
}

export function getSystemPrompt(mode: ChatMode, project: ProjectWithRelations | null): string {
  const prompts = {
    Brainstorm: brainstormPrompt,
    Planning: planningPrompt,
    Feedback: feedbackPrompt,
    Reflection: reflectionPrompt,
  }
  return prompts[mode](project)
}
