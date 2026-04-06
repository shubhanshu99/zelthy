"use client";

import { Pill, ChevronLeft, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import type { User as UserType, Prescription } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  getRefillsNext14Days,
  getRefillsNext30Days,
  getRefillsNext7Days,
  getRefillsNext90Days,
} from "@/lib/reccuringPrescriptions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PrescriptionDashboardProps {
  user: Omit<UserType, "password">;
  prescriptions: Prescription[];
}

export function PrescriptionDashboard({
  user,
  prescriptions,
}: PrescriptionDashboardProps) {
  const [range, setRange] = useState("7");

  const upcomingPrescriptions = useMemo(() => {
    switch (range) {
      case "14":
        return getRefillsNext14Days(prescriptions);
      case "30":
        return getRefillsNext30Days(prescriptions);
      case "90":
        return getRefillsNext90Days(prescriptions);
      default:
        return getRefillsNext7Days(prescriptions);
    }
  }, [range, prescriptions]);
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
      {/*Prescriptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Pill className="size-5 text-sky-600" />
            <CardTitle>Upcoming Prescriptions</CardTitle>
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
          <CardDescription>Your current medications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Refill Date</TableHead>
                <TableHead>Refill Schedule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingPrescriptions.map((prescription, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {prescription.medication}
                  </TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.quantity}</TableCell>
                  <TableCell>
                    {new Date(prescription.refill_on).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 capitalize">
                      <RefreshCw className="size-3 text-muted-foreground" />
                      {prescription.refill_schedule}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
