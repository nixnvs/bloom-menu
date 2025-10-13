import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    console.log("[v0] Fetching menu products...")

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        categories!inner(name),
        subcategories(name)
      `)
      .eq("active", true)
      .eq("categories.active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("[v0] Database error fetching menu products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    const transformedProducts =
      products?.map((product) => ({
        ...product,
        category_name: product.categories.name,
        subcategory_name: product.subcategories?.name || null,
      })) || []

    console.log("[v0] Menu products fetched:", {
      total: transformedProducts.length,
      products: transformedProducts.map((p) => ({
        name: p.name,
        category_id: p.category_id,
        subcategory_id: p.subcategory_id,
        active: p.active,
      })),
    })

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
