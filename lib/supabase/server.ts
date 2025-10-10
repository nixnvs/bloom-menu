import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function createClient() {
  // since this app doesn't use Supabase auth
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
