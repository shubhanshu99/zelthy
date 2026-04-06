import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AppointmentDashboard } from "@/components/patient/appointment-dashboard";

export default async function DashboardPage() {
  const user = await getSession();

  if (!user) {
    redirect("/patient");
  }

  return <AppointmentDashboard user={user} appointments={user.appointments} />;
}
