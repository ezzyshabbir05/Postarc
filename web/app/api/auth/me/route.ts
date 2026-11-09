import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("postarc_session_token")?.value
  const email = cookieStore.get("postarc_session_email")?.value
  const fullName = cookieStore.get("postarc_session_name")?.value
  const role = cookieStore.get("postarc_session_role")?.value

  if (!token || !email) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email,
      fullName: fullName || email.split("@")[0],
      role: role || "member",
    },
  })
}
