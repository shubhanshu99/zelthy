import { NextResponse } from "next/server"
import { createPrescription, getMedications, getDosages } from "@/lib/db"

export async function GET() {
  try {
    const [medications, dosages] = await Promise.all([
      getMedications(),
      getDosages(),
    ])
    return NextResponse.json({ medications, dosages })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch prescription options" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, medication, dosage, quantity, refill_on, refill_schedule } =
      body

    if (
      !user_id ||
      !medication ||
      !dosage ||
      quantity === undefined ||
      !refill_on ||
      !refill_schedule
    ) {
      return NextResponse.json(
        { error: "All prescription fields are required" },
        { status: 400 }
      )
    }

    const newPrescription = await createPrescription(user_id, {
      medication,
      dosage,
      quantity: parseInt(quantity, 10),
      refill_on,
      refill_schedule,
    })

    if (!newPrescription) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(newPrescription, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create prescription" },
      { status: 500 }
    )
  }
}
