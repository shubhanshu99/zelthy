import { NextResponse } from "next/server"
import { createUser, getAllUsers } from "@/lib/db"

export async function GET() {
  try {
    const users = await getAllUsers()
    const safeUsers = users.map(({ password, ...user }) => user)
    return NextResponse.json(safeUsers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}


export async function POST(request: Request) {
try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Call the createUser function from db.ts
    const newUser = await createUser(name, email, password)

    const { password: _, ...safeUser } = newUser
    return NextResponse.json(safeUser, { status: 201 })
      
} catch (error) {
    return NextResponse.json(
      { error: "Failed to create new patient" },
      { status: 500 }
    )
  }
}