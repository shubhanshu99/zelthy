import { NextResponse } from "next/server"
import { createAppointment } from "@/lib/db"
import type { Appointment } from "@/lib/types"

const VALID_REPEATS: Appointment["repeat"][] = ["weekly","biweekly", "monthly", "quarterly", "yearly", "none"]
const VALID_STATUSES: NonNullable<Appointment["status"]>[] = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "No Show",
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, provider, datetime, repeat, status, notes } = body

    if (!user_id || !provider || !datetime || !repeat) {
      return NextResponse.json(
        { error: "Missing required fields: user_id, provider, datetime, repeat" },
        { status: 400 }
      )
    }

    if (!VALID_REPEATS.includes(repeat)) {
      return NextResponse.json(
        { error: "Invalid repeat value" },
        { status: 400 }
      )
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      )
    }

    const appointmentData: Omit<Appointment, "id"> = {
      provider,
      datetime,
      repeat,
      status,
    }

    const newAppointment = await createAppointment(user_id, appointmentData)

    if (!newAppointment) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    )
  }
}
