import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { PatientDashboard } from "@/components/patient/patient-dashboard"

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect("/patient")
  }

  return (
    <PatientDashboard
      user={user}
      appointments={user.appointments}
      prescriptions={user.prescriptions}
    />
  )
}
