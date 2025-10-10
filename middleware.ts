import type { NextRequest, NextResponse } from "next/server"
import { NextResponse as Response } from "next/server"

// This prevents origin mismatch errors in preview environments
export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Simply pass through the request without any Supabase operations
  // The app uses its own admin authentication system
  return Response.next({
    request: {
      headers: request.headers,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
