import { AddPatientForm } from "@/components/admin/add-patient-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function AddPatient() {
  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ChevronLeft className="size-4" />
            Back to Patients
          </Link>
        </Button>
      </div>
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <AddPatientForm />
      </div>
    </>
  );
}
