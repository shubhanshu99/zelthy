import { NextResponse } from "next/server"
import { Prescription } from '@/lib/types';
import { deletePrescription, updatePrescription} from "@/lib/db"



export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> })
{
  try {
    const { id } = await params
    const PrescriptionId = parseInt(id, 10)
    
    if (isNaN(PrescriptionId)) {
      return NextResponse.json(
        { error: "Invalid prescription ID" },
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
    const updates: Partial<Prescription> = {}
    if (body.medication !== undefined) {
      updates.medication = body.medication
    }
    if (body.dosage !== undefined) {
      updates.dosage = body.dosage
    }
    if (body.quantity !== undefined) {
      const quantity = parseInt(body.quantity, 10)
      if (isNaN(quantity) || quantity < 0) {
        return NextResponse.json(
          { error: "Invalid quantity value" },
          { status: 400 }
        )
      }
      updates.quantity = quantity
    }
    if (body.refill_on !== undefined) {
      updates.refill_on = body.refill_on
    } 
  const updated = await updatePrescription(userId, PrescriptionId, updates)
  if (!updated) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      )
    }
  return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update prescription" },
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
    const PrescriptionId = parseInt(id, 10)

    if (isNaN(PrescriptionId)) {
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

    const deleted = await deletePrescription(userId, PrescriptionId)

    if (!deleted) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      )
    }


    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete prescription" },
      { status: 500 }
    )
  }
}