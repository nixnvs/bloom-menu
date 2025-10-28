import { generateText } from "ai"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { text, targetLanguage, sourceLanguage = "es" } = await request.json()

    if (!text || !targetLanguage) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // If source and target are the same, return original text
    if (sourceLanguage === targetLanguage) {
      return Response.json({ translatedText: text })
    }

    // Check cache first
    const cached = await sql`
      SELECT translated_text 
      FROM translations 
      WHERE source_text = ${text} 
        AND source_language = ${sourceLanguage}
        AND target_language = ${targetLanguage}
      LIMIT 1
    `

    if (cached.length > 0) {
      console.log("[v0] Translation cache hit")
      return Response.json({ translatedText: cached[0].translated_text })
    }

    console.log("[v0] Translating text:", text.substring(0, 50))

    // Translate using AI
    const { text: translatedText } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Translate the following text from ${sourceLanguage === "es" ? "Spanish" : "English"} to ${targetLanguage === "en" ? "English" : "Spanish"}. Only return the translation, nothing else. Preserve any special characters and formatting.

Text to translate: ${text}`,
    })

    // Cache the translation
    await sql`
      INSERT INTO translations (source_text, source_language, target_language, translated_text)
      VALUES (${text}, ${sourceLanguage}, ${targetLanguage}, ${translatedText})
      ON CONFLICT (source_text, source_language, target_language) 
      DO UPDATE SET translated_text = ${translatedText}
    `

    console.log("[v0] Translation complete")
    return Response.json({ translatedText })
  } catch (error) {
    console.error("[v0] Translation error:", error)
    return Response.json(
      { error: "Translation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
