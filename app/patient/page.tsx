import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/patient/login-form";

export default async function PatientLoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/patient/dashboard");
  }

  return (
    <>
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need help accessing your account?
          <br />
          Contact your healthcare provider for assistance.
        </p>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        <p>Demo credentials for Patient Portal:</p>
        <p className="mt-1">
          Email: <strong>mark@some-email-provider.net</strong>, Password:{" "}
          <strong>Password123!</strong>
        </p>
        <p className="mt-1">
          Email: <strong>lisa@some-email-provider.net</strong>, Password:{" "}
          <strong>Password123!</strong>
        </p>
      </div>
    </>
  );
}
