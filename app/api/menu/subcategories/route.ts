import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: subcategories, error } = await supabase
      .from("subcategories")
      .select(`
        *,
        categories!inner(name, active)
      `)
      .eq("active", true)
      .eq("categories.active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 })
    }

    return NextResponse.json(subcategories || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
