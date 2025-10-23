import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminCredentials } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Admin login attempt:", { username, passwordLength: password?.length })

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const admin = await verifyAdminCredentials(username, password)

    console.log("[v0] Admin verification result:", admin ? "Success" : "Failed")

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
