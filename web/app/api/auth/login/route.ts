import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      )
    }

    const trimmedUser = String(username).trim()
    const plain = `${trimmedUser}:${password}`
    const basicToken = Buffer.from(plain).toString("base64")
    const authHeader = `Basic ${basicToken}`

    const engineUrl = process.env.POSTARC_INTERNAL_API_URL || "http://127.0.0.1:8080"
    const envAdminUser = (process.env.ADMIN_USER || process.env.POSTARC_ADMIN_USER || "admin@example.com").toLowerCase().trim()
    const envAdminPass = process.env.ADMIN_PASSWORD || process.env.POSTARC_ADMIN_PASSWORD || "ChangeMe#AdminSecret2026"

    let isAuthenticated = false
    let isRoleAdmin = false

    // 1. Check against Postarc Engine JMAP protocol
    try {
      const res = await fetch(`${engineUrl}/jmap/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
          methodCalls: [["Mailbox/get", { accountId: "self", ids: [] }, "0"]],
        }),
      })

      if (res.ok) {
        isAuthenticated = true
      }
    } catch {
      // Engine might be offline or still starting
    }

    // 2. Check against environment fallback administrator
    if (!isAuthenticated) {
      if (
        (trimmedUser.toLowerCase() === envAdminUser || trimmedUser.toLowerCase() === "admin") &&
        password === envAdminPass
      ) {
        isAuthenticated = true
        isRoleAdmin = true
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password. Please verify your credentials." },
        { status: 401 }
      )
    }

    // Role detection
    if (!isRoleAdmin) {
      isRoleAdmin =
        trimmedUser.toLowerCase().startsWith("admin") ||
        trimmedUser.toLowerCase() === envAdminUser ||
        trimmedUser.toLowerCase().includes("owner")
    }

    const role = isRoleAdmin ? "admin" : "member"
    const namePart = trimmedUser.split("@")[0]
    const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1)

    const response = NextResponse.json({
      success: true,
      user: {
        email: trimmedUser,
        fullName,
        role,
      },
    })

    // Set secure HTTP session cookies
    const cookieOptions = {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax" as const,
      httpOnly: false, // Accessible to client SDK
    }

    response.cookies.set("postarc_session_token", authHeader, cookieOptions)
    response.cookies.set("postarc_session_email", trimmedUser, cookieOptions)
    response.cookies.set("postarc_session_name", fullName, cookieOptions)
    response.cookies.set("postarc_session_role", role, cookieOptions)

    return response
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Authentication service error." },
      { status: 500 }
    )
  }
}
