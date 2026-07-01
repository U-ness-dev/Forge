import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOpenAIClient } from "@/lib/openai"
import { getSystemPrompt } from "@/lib/ai-prompts"
import type { ChatMode } from "@prisma/client"

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
    if (projectId) {
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
