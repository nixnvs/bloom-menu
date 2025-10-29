import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const { data: subcategory, error } = await supabase.from("subcategories").select("*").eq("id", id).single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 })
    }

    return NextResponse.json(subcategory)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("subcategories")
      .update({
        name: body.name,
        name_en: body.name_en || null,
        category_id: body.category_id,
        description: body.description || null,
        description_en: body.description_en || null,
        active: body.active,
        display_order: body.display_order,
        image_url: body.image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const { error } = await supabase.from("subcategories").delete().eq("id", id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
