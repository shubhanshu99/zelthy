import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PrescriptionDashboard } from "@/components/patient/prescription-dashboard";

export default async function DashboardPage() {
  const user = await getSession();

  if (!user) {
    redirect("/patient");
  }

  return (
    <PrescriptionDashboard user={user} prescriptions={user.prescriptions} />
  );
}
