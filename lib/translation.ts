// Translation utility for client-side use
export async function translateText(text: string, targetLanguage: string, sourceLanguage = "es"): Promise<string> {
  if (!text || sourceLanguage === targetLanguage) {
    return text
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage, sourceLanguage }),
    })

    if (!response.ok) {
      console.error("[v0] Translation request failed:", response.status)
      return text // Return original text on error
    }

    const data = await response.json()
    return data.translatedText || text
  } catch (error) {
    console.error("[v0] Translation error:", error)
    return text // Return original text on error
  }
}

// Batch translation for multiple texts
export async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage = "es",
): Promise<string[]> {
  if (sourceLanguage === targetLanguage) {
    return texts
  }

  try {
    const translations = await Promise.all(texts.map((text) => translateText(text, targetLanguage, sourceLanguage)))
    return translations
  } catch (error) {
    console.error("[v0] Batch translation error:", error)
    return texts // Return original texts on error
  }
}
