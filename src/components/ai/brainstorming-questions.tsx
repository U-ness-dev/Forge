"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const categoryQuestions: Record<string, { question: string; hint: string }[]> = {
  Game: [
    { question: "Wat voor genre game wordt het?", hint: "Platformer, RPG, puzzle, simulation..." },
    { question: "Wie is de doelgroep?", hint: "Leeftijd, ervaring, interesses" },
    { question: "Welke engine gebruik je?", hint: "Unity, Unreal, Godot, custom..." },
    { question: "Voor welk platform?", hint: "PC, console, mobiel, browser" },
    { question: "Wat is de art style?", hint: "Pixelart, low-poly, realistisch, stylized..." },
    { question: "Zijn er inspiratiebronnen?", hint: "Specifieke games of artiesten" },
    { question: "Hoe ziet de core gameplay eruit?", hint: "Wat doet de speler de meeste tijd?" },
    { question: "Is er een verhaal of setting?", hint: "Wereld, personages, plot" },
  ],
  Website: [
    { question: "Wat voor website wordt het?", hint: "Portfolio, webshop, landing page, webapp..." },
    { question: "Wie is de doelgroep?", hint: "Wie bezoekt de website?" },
    { question: "Welke stijl zoek je?", hint: "Modern, minimalistisch, speels, professioneel..." },
    { question: "Zijn er kleurenschema's of merkelementen?", hint: "Bestaande branding of vrij ontwerp" },
    { question: "Hoeveel pagina's worden het?", hint: "Eénpagina of meerdere pagina's" },
    { question: "Welke functionaliteiten zijn essentieel?", hint: "Contactformulier, CMS, winkelmand..." },
    { question: "Heb je een technologie voorkeur?", hint: "Next.js, Astro, WordPress, custom..." },
  ],
  Branding: [
    { question: "Wie is de doelgroep van het merk?", hint: "Demografie, waarden, leefstijl" },
    { question: "Welke persoonlijkheid moet het merk uitstralen?", hint: "Speels, luxe, betrouwbaar, innovatief..." },
    { question: "Heb je een kleurenpalet in gedachten?", hint: "Specifieke kleuren of open" },
    { question: "Wie zijn de concurrenten?", hint: "Andere merken in dezelfde ruimte" },
    { question: "Wat zijn de kernwaarden?", hint: "Waar staat het merk voor?" },
  ],
  Logo: [
    { question: "Waar is het logo voor?", hint: "Bedrijf, product, event, persoonlijk merk" },
    { question: "Welke stijl zoek je?", hint: "Modern, klassiek, minimalistisch, illustratief..." },
    { question: "Moet het aansluiten bij bestaande branding?", hint: "Kleuren, fonts, stijl" },
    { question: "Zijn er symbolen die je wilt verwerken?", hint: "Abstracte iconen of herkenbare vormen" },
    { question: "Heb je voorbeelden van logo's die je mooi vindt?", hint: "Referenties helpen enorm" },
  ],
  MobileApp: [
    { question: "Wat voor app wordt het?", hint: "Utility, social, game, productivity..." },
    { question: "Voor iOS, Android of beide?", hint: "Platformkeuze" },
    { question: "Wie is de doelgroep?", hint: "Wie gaat de app gebruiken?" },
    { question: "Wat is het kernprobleem?", hint: "Welk probleem lost de app op?" },
    { question: "Welke design stijl?", hint: "Material Design, iOS, custom..." },
  ],
  DesktopApp: [
    { question: "Wat voor applicatie wordt het?", hint: "Tool, editor, viewer, management..." },
    { question: "Voor welk besturingssysteem?", hint: "Windows, macOS, Linux, cross-platform" },
    { question: "Wie gaat het gebruiken?", hint: "Developers, designers, algemeen publiek..." },
    { question: "Wat zijn de hoofdfunctionaliteiten?", hint: "Core features" },
    { question: "Moet het offline werken?", hint: "Volledig offline of cloud-based" },
  ],
}

const defaultQuestions = [
  { question: "Wat is het doel van dit project?", hint: "Wat wil je bereiken?" },
  { question: "Wie is de doelgroep?", hint: "Voor wie maak je dit?" },
  { question: "Heb je al een duidelijke visie?", hint: "Of ben je nog aan het verkennen?" },
  { question: "Zijn er inspiratiebronnen?", hint: "Referenties voor stijl of functie" },
  { question: "Wat maakt dit project bijzonder?", hint: "Unique selling points" },
]

interface BrainstormingQuestionsProps {
  category: string
  onAnswer: (question: string, answer: string) => void
}

export function BrainstormingQuestions({ category, onAnswer }: BrainstormingQuestionsProps) {
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [activeQuestion, setActiveQuestion] = React.useState<number | null>(null)

  const questions = categoryQuestions[category] || defaultQuestions

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }))
  }

  const handleSubmit = (index: number) => {
    const question = questions[index]
    const answer = answers[index]
    if (answer?.trim()) {
      onAnswer(question.question, answer.trim())
      setAnswers((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
      if (index < questions.length - 1) {
        setActiveQuestion(index + 1)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Laten we je project beter leren kennen. Beantwoord een paar vragen:
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {questions.map((q, i) => {
          if (activeQuestion !== null && i > activeQuestion) return null
          if (answers[i]?.trim() && activeQuestion === i) return null

          return (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "rounded-xl border p-4 transition-all duration-200",
                activeQuestion === i || activeQuestion === null
                  ? "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50"
                  : "border-transparent opacity-40"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {q.question}
                  </p>
                  <input
                    type="text"
                    value={answers[i] || ""}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit(i)
                    }}
                    placeholder={q.hint}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary/30 transition-all"
                    autoFocus={activeQuestion === i || (activeQuestion === null && i === 0)}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSubmit(i)}
                      disabled={!answers[i]?.trim()}
                      className="text-xs gap-1"
                    >
                      Verder <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {Object.keys(answers).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-1"
        >
          <MessageCircle className="w-4 h-4 text-green-500" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Je antwoorden worden naar Forge gestuurd voor een beter advies.
          </p>
        </motion.div>
      )}
    </div>
  )
}
