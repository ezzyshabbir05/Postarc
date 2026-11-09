import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })

  const cookieOptions = {
    path: "/",
    maxAge: 0,
    sameSite: "lax" as const,
  }

  response.cookies.set("postarc_session_token", "", cookieOptions)
  response.cookies.set("postarc_session_email", "", cookieOptions)
  response.cookies.set("postarc_session_name", "", cookieOptions)
  response.cookies.set("postarc_session_role", "", cookieOptions)

  return response
}
