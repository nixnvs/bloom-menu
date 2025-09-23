import { createClient } from "@/lib/supabase/server"

export async function verifyAdminCredentials(username: string, password: string) {
  const supabase = await createClient()

  const { data: admin, error } = await supabase.from("admin_users").select("*").eq("username", username).single()

  if (error || !admin) {
    return null
  }

  // For demo purposes, we'll use a simple password check
  // In production, use proper bcrypt comparison
  const isValid = password === "bloomxyz"

  if (isValid) {
    return { id: admin.id, username: admin.username }
  }

  return null
}
