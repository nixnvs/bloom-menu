import { NextResponse } from "next/server"
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
      .eq("active", true)
      .eq("categories.active", true)
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
