import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const originalConsoleWarn = console.warn
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || ""
    if (message.includes("origins don't match")) {
      return // Suppress origin mismatch warnings in preview environments
    }
    originalConsoleWarn.apply(console, args)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
    },
  })
}
