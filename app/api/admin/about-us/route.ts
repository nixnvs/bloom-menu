import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Define the About Us configuration keys
const ABOUT_US_KEYS = [
  // Main about text
  "about_text_en",
  "about_text_es",

  // Social media
  "instagram_url",
  "instagram_handle",
  "email_address",
  "website_url",
  "website_display",

  // Restaurant connection
  "restaurant_name",
  "restaurant_url",
  "restaurant_description_en",
  "restaurant_description_es",

  // Museum/Culture
  "museum_name",
  "museum_url",
  "museum_description_en",
  "museum_description_es",

  // Section headers
  "connect_header_en",
  "connect_header_es",
  "restaurant_header_en",
  "restaurant_header_es",
  "culture_header_en",
  "culture_header_es",

  // Action text
  "follow_text_en",
  "follow_text_es",
  "contact_text_en",
  "contact_text_es",
  "website_text_en",
  "website_text_es",
  "visit_text_en",
  "visit_text_es",
]

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: configuration, error } = await supabase
      .from("configuration")
      .select("key, value")
      .in("key", ABOUT_US_KEYS)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch About Us configuration" }, { status: 500 })
    }

    // Transform array of key-value pairs into a single object
    const aboutUsConfig = ABOUT_US_KEYS.reduce(
      (acc, key) => {
        const configItem = configuration?.find((item) => item.key === key)
        acc[key] = configItem?.value || ""
        return acc
      },
      {} as Record<string, string>,
    )

    return NextResponse.json(aboutUsConfig)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Validate that only About Us keys are being updated
    const validKeys = Object.keys(body).filter((key) => ABOUT_US_KEYS.includes(key))

    if (validKeys.length === 0) {
      return NextResponse.json({ error: "No valid About Us configuration keys provided" }, { status: 400 })
    }

    // Update each configuration item
    const updatePromises = validKeys.map(async (key) => {
      const { error } = await supabase
        .from("configuration")
        .update({
          value: body[key] || null,
          updated_at: new Date().toISOString(),
        })
        .eq("key", key)

      if (error) {
        console.error(`Error updating ${key}:`, error)
        throw new Error(`Failed to update ${key}`)
      }
    })

    await Promise.all(updatePromises)

    // Return the updated configuration
    const { data: updatedConfiguration, error: fetchError } = await supabase
      .from("configuration")
      .select("key, value")
      .in("key", validKeys)

    if (fetchError) {
      console.error("Error fetching updated configuration:", fetchError)
      return NextResponse.json({ error: "Configuration updated but failed to fetch updated values" }, { status: 500 })
    }

    // Transform back to object format
    const updatedConfig = validKeys.reduce(
      (acc, key) => {
        const configItem = updatedConfiguration?.find((item) => item.key === key)
        acc[key] = configItem?.value || ""
        return acc
      },
      {} as Record<string, string>,
    )

    return NextResponse.json(updatedConfig)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
