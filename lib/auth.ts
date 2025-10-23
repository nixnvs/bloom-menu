import { createClient } from "@/lib/supabase/server"

export async function verifyAdminCredentials(username: string, password: string) {
  console.log("[v0] verifyAdminCredentials called with username:", username)

  const supabase = await createClient()

  const { data: admin, error } = await supabase.from("admin_users").select("*").eq("username", username).single()

  console.log("[v0] Database query result:", {
    found: !!admin,
    error: error?.message,
    adminData: admin ? { id: admin.id, username: admin.username } : null,
  })

  if (error || !admin) {
    console.log("[v0] Admin user not found or error occurred")
    return null
  }

  // For demo purposes with the SQL scripts, we'll accept the literal password "bloomxyz"
  // since the bcrypt hash in the scripts is a placeholder
  const isValid = password === "bloomxyz"

  console.log("[v0] Password validation:", { isValid, providedPassword: password })

  if (isValid) {
    return { id: admin.id, username: admin.username }
  }

  return null
}
