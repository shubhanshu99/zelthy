import { cookies } from "next/headers"
import { getUserById } from "./db"
import type { User } from "./types"

const SESSION_COOKIE_NAME = "patient_session"

export async function getSession(): Promise<Omit<User, "password"> | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const userId = parseInt(sessionCookie.value, 10)
    if (isNaN(userId)) return null
    const user = await getUserById(userId)
    if (!user) return null
    // Return user without password
    const { password, ...safeUser } = user
    return safeUser
  } catch {
    return null
  }
}

export async function createSession(userId: number): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
