import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        categories!inner(name),
        subcategories(name)
      `)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    const transformedProducts =
      products?.map((product) => ({
        ...product,
        category_name: product.categories.name,
        subcategory_name: product.subcategories?.name || null,
      })) || []

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    console.log("[v0] Creating product with data:", {
      name: body.name,
      category_id: body.category_id,
      subcategory_id: body.subcategory_id,
      active: body.active,
    })

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name,
        description: body.description || null,
        price: body.price,
        notes: body.notes || null,
        allergies: body.allergies || null,
        category_id: body.category_id,
        subcategory_id: body.subcategory_id || null,
        has_gluten: body.has_gluten ?? false,
        active: body.active ?? true,
        display_order: body.display_order ?? 0,
        image_url: body.image_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    console.log("[v0] Product created successfully:", {
      id: data.id,
      name: data.name,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
