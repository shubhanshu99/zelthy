import Link from "next/link";
import { ClipboardList, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PatientLoginPage from "./patient/page";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-lg font-semibold">Zelthy</span>
        </div>
      </header>
      <PatientLoginPage />

      {/* <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Healthcare Management System
            </h1>
            <p className="text-muted-foreground text-pretty">
              Choose your portal to get started with Zelthy.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            
            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ClipboardList className="size-6" />
                </div>
                <CardTitle className="mt-4">Admin EMR</CardTitle>
                <CardDescription>
                  Staff interface for managing patients, appointments, and
                  prescriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin">
                    Open Admin Portal
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            
            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex size-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                  <Heart className="size-6" />
                </div>
                <CardTitle className="mt-4">Patient Portal</CardTitle>
                <CardDescription>
                  Access your health records, appointments, and prescriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/patient">
                    Patient Login
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main> */}
    </div>
  );
}
