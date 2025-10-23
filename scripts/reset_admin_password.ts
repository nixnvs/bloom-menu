import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function resetAdminPassword() {
  const username = "costapatagonia"
  const password = "bloomxyz"

  console.log("[v0] Hashing password...")
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log("[v0] Hashed password:", hashedPassword)

  // Check if user exists
  const { data: existingUser } = await supabase.from("admin_users").select("*").eq("username", username).single()

  if (existingUser) {
    console.log("[v0] User exists, updating password...")
    const { error } = await supabase
      .from("admin_users")
      .update({ password_hash: hashedPassword })
      .eq("username", username)

    if (error) {
      console.error("[v0] Error updating password:", error)
    } else {
      console.log("[v0] Password updated successfully!")
    }
  } else {
    console.log("[v0] User does not exist, creating...")
    const { error } = await supabase.from("admin_users").insert({ username, password_hash: hashedPassword })

    if (error) {
      console.error("[v0] Error creating user:", error)
    } else {
      console.log("[v0] User created successfully!")
    }
  }

  // Verify the user
  const { data: verifyUser } = await supabase.from("admin_users").select("*").eq("username", username).single()

  console.log("[v0] Final user state:", verifyUser)
}

resetAdminPassword()
