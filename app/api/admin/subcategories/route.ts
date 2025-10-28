import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: subcategories, error } = await supabase
      .from("subcategories")
      .select(`
        *,
        categories!inner(name)
      `)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 })
    }

    // Transform the data to include category name
    const transformedSubcategories =
      subcategories?.map((subcategory) => ({
        ...subcategory,
        category_name: subcategory.categories.name,
      })) || []

    return NextResponse.json(transformedSubcategories)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("subcategories")
      .insert({
        name: body.name,
        category_id: body.category_id,
        description: body.description || null,
        active: body.active ?? true,
        display_order: body.display_order ?? 0,
        image_url: body.image_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
