import { getAllUsers } from "@/lib/db"
import { PatientsTable } from "@/components/admin/patients-table"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const users = await getAllUsers()
  // Remove passwords from users for security (with fallback for empty data)
  const safeUsers = (users ?? []).map(({ password, ...user }) => user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">
          View and manage patient records, appointments, and prescriptions.
        </p>
      </div>
      <PatientsTable users={safeUsers} />
    </div>
  )
}
