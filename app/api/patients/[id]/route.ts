import { NextResponse } from "next/server"
import { getUserById, updateUser } from "@/lib/db"
import { User } from "@/lib/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user without password, with appointments and prescriptions
    const { password, ...safeUser } = user
    return NextResponse.json({
      user: safeUser,
      appointments: user.appointments,
      prescriptions: user.prescriptions,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }
   
    const body = await request.json()
    const { name, email, password } = body 
    const updatedBody: Partial<Pick<User, "name" | "email" | "password">> = {}

    if (name !== undefined) updatedBody.name = String(name)
    if (email !== undefined) updatedBody.email = String(email)
    if (password !== undefined) updatedBody.password = String(password)

    const updated = await updateUser(userId, updatedBody)
       if (!updated) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(updated)

 
}catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

