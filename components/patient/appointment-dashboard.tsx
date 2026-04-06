"use client";

import {
  Calendar,
  CalendarDays,
  Clock,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { User as UserType, Appointment } from "@/lib/types";
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
import {
  getNext14Days,
  getNext30Days,
  getNext7Days,
  getNext90Days,
} from "@/lib/reccuringApointments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AppointmentDashboardProps {
  user: Omit<UserType, "password">;
  appointments: Appointment[];
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

export function AppointmentDashboard({
  appointments,
}: AppointmentDashboardProps) {
  const [range, setRange] = useState("7");

  const upcomingAppointments = useMemo(() => {
    switch (range) {
      case "14":
        return getNext14Days(appointments);
      case "30":
        return getNext30Days(appointments);
      case "90":
        return getNext90Days(appointments);
      default:
        return getNext7Days(appointments);
    }
  }, [range, appointments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 min-w-0 ml-auto">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/patient/dashboard">
            <ChevronLeft className="size-4" />
            Go Back
          </Link>
        </Button>
      </div>

      {/* All Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-sky-600" />
            <CardTitle>Upcoming Appointments</CardTitle>

            <div className="flex items-center gap-2">
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Next 7 Days</SelectItem>
                  <SelectItem value="14">Next 14 Days (Biweekly)</SelectItem>
                  <SelectItem value="30">Next 30 Days (Monthly)</SelectItem>
                  <SelectItem value="90">Next 90 Days (Quarterly)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => {
              const { date, time } = formatDateTime(appointment.datetime);
              return (
                <div
                  key={index}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.provider}</p>
                    <div className="contents md:flex md:items-center md:gap-6 text-sm text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  );
}
