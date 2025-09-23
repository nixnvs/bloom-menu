import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    const { key } = params
    const supabase = await createClient()

    const { data, error } = await supabase.from("configuration").select("*").eq("key", key).single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    const { key } = params
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("configuration")
      .update({
        value: body.value || null,
        image_url: body.image_url || null,
        description: body.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("key", key)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
