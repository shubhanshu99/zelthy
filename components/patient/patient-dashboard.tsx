"use client";

import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  CalendarDays,
  Pill,
  LogOut,
  Loader2,
  Clock,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { User as UserType, Appointment, Prescription } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getNext7Days } from "@/lib/reccuringApointments";
import { getRefillsNext7Days } from "@/lib/reccuringPrescriptions";
import { useToast } from "../ui/use-toast";

interface PatientDashboardProps {
  user: Omit<UserType, "password">;
  appointments: Appointment[];
  prescriptions: Prescription[];
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Scheduled":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "No Show":
      return "bg-slate-100 text-slate-800 border-slate-200";
    default:
      return "";
  }
}

function formatDateTime(datetime: string): { date: string; time: string } {
  const d = new Date(datetime);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

export function PatientDashboard({
  user,
  appointments,
  prescriptions,
}: PatientDashboardProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/patient");
      router.refresh();
    } catch (error) {
      useToast().toast({
        title: "Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
      setIsLoggingOut(false);
    }
  };

  const upcomingAppointments = getNext7Days(appointments);
  const activePrescriptions = getRefillsNext7Days(prescriptions);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            View your health information and upcoming appointments.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          Sign Out
        </Button>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <User className="size-6" />
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>Your Personal Information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-4 text-muted-foreground" />
            <span className="truncate">{user.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-sky-600" />
              <CardTitle>Upcoming Appointments</CardTitle>
              {upcomingAppointments.length !== 0 && (
                <div className="flex items-center gap-4 min-w-0 ml-auto">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/patient/appointments">
                      View All
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              Your scheduled appointments Next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No upcoming appointments scheduled.
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => {
                  const { date, time } = formatDateTime(appointment.datetime);
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.provider}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="size-3" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="size-3" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <RefreshCw className="size-3" />
                          <span className="capitalize">
                            Repeats {appointment.repeat}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeClass(
                          appointment.status || "Scheduled",
                        )}
                      >
                        {appointment.status || "Scheduled"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Prescriptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pill className="size-5 text-sky-600" />
              <CardTitle>Active Prescriptions</CardTitle>

              {activePrescriptions.length !== 0 && (
                <div className="flex items-center gap-4  ml-auto">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/patient/prescriptions">
                      View All
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              Your current medications next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activePrescriptions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No active prescriptions.
              </p>
            ) : (
              <div className="space-y-4">
                {activePrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{prescription.medication}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">
                          Dosage:
                        </span>{" "}
                        {prescription.dosage}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Quantity:
                        </span>{" "}
                        {prescription.quantity}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Refill on{" "}
                      {new Date(prescription.refill_on).toLocaleDateString()} |
                      Refills{" "}
                      <span className="capitalize">
                        {prescription.refill_schedule}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
