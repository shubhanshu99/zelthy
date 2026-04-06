import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getUserById } from "@/lib/db";
import { PatientDetail } from "@/components/admin/patient-detail";
import { Button } from "@/components/ui/button";

export default async function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    notFound();
  }

  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  // Remove password for security
  const { password, ...safeUser } = user;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ChevronLeft className="size-4" />
            Back to Patients
          </Link>
        </Button>
      </div>
      <PatientDetail
        user={safeUser}
        appointments={user.appointments}
        prescriptions={user.prescriptions}
      />
    </div>
  );
}
