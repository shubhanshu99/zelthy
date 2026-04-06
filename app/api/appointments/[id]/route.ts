import { NextResponse } from "next/server"
import { deleteAppointment, updateAppointment } from "@/lib/db"
import type { AppointmentRepeat, AppointmentStatus } from "@/lib/types"

const VALID_REPEATS: AppointmentRepeat[] = ["weekly","biweekly", "monthly", "quarterly", "yearly", "none"]

const VALID_STATUSES: AppointmentStatus[] = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "No Show",
]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointmentId = parseInt(id, 10)

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const updates: { repeat?: AppointmentRepeat; status?: AppointmentStatus; } = {}

    if (body.repeat !== undefined) {
      updates.repeat = body.repeat
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        )
      }
      updates.status = body.status
    }
    if (body.repeat !== undefined) {
      if (!VALID_REPEATS.includes(body.repeat)) {
        return NextResponse.json(
          { error: "Invalid repeat value" },
          { status: 400 }
        )
      }
      updates.repeat = body.repeat
    }
    
    const updated = await updateAppointment(userId, appointmentId, updates)

    if (!updated) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointmentId = parseInt(id, 10)

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const deleted = await deleteAppointment(userId, appointmentId)

    if (!deleted) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    )
  }
}
