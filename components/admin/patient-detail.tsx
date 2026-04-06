"use client";

import { useState } from "react";
import { Mail, User, Pill, CalendarDays } from "lucide-react";
import type { User as UserType, Appointment, Prescription } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentRow } from "./appointment-row";
import { AddAppointmentDialog } from "./add-appointment-dialog";
import { AddPrescriptionDialog } from "./add-prescription-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { PrescriptionRow } from "./prescription-row";

interface PatientDetailProps {
  user: Omit<UserType, "password">;
  appointments: Appointment[];
  prescriptions: Prescription[];
}

export function PatientDetail({
  user,
  appointments: initialAppointments,
  prescriptions: initialPrescriptions,
}: PatientDetailProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [patient, setPatient] = useState(user);

  const handleUserUpdate = (updated: UserType) => {
    setPatient((prev) => (prev.id === updated.id ? updated : prev));
  };

  const handleAppointmentAdd = (newAppointment: Appointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
  };
  const handleAppointmentUpdate = (updatedPrescription: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === updatedPrescription.id ? updatedPrescription : a,
      ),
    );
  };
  const handlePrescriptionUpdate = (updatedPrescription: Prescription) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === updatedPrescription.id ? updatedPrescription : p,
      ),
    );
  };
  const handleAppointmentDelete = (deleted: Appointment) => {
    setAppointments((prev) => prev.filter((a) => a.id !== deleted.id));
  };

  const handlePrescriptionAdd = (newPrescription: Prescription) => {
    setPrescriptions((prev) => [...prev, newPrescription]);
  };
  const handlePrescriptionDelete = (deleted: Prescription) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== deleted.id));
  };
  return (
    <div className="space-y-6">
      {/* Patient Info Card */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="size-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{patient.name}</CardTitle>
              <CardDescription>Patient ID: {patient.id}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-4 text-muted-foreground" />
            <span className="truncate">{patient.email}</span>
            <EditUserDialog
              userId={patient.id}
              name={patient.name}
              email={patient.email}
              onUpdate={handleUserUpdate}
              password={""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Appointments and Prescriptions */}
      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments" className="gap-2">
            <CalendarDays className="size-4" />
            Appointments ({appointments.length})
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="gap-2">
            <Pill className="size-4" />
            Prescriptions ({prescriptions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>
                  View and update appointment status and notes.
                </CardDescription>
              </div>
              <AddAppointmentDialog
                userId={user.id}
                onAdd={handleAppointmentAdd}
              />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Repeat</TableHead>
                    <TableHead>Status</TableHead>

                    <TableHead className="w-16">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((appointment) => (
                      <AppointmentRow
                        key={appointment.id}
                        appointment={appointment}
                        userId={user.id}
                        onUpdate={handleAppointmentUpdate}
                        onDelete={handleAppointmentDelete}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>
                  View current prescriptions and add new ones.
                </CardDescription>
              </div>
              <AddPrescriptionDialog
                userId={user.id}
                onAdd={handlePrescriptionAdd}
              />
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
                  {prescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No prescriptions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    prescriptions.map((prescription) => (
                      <PrescriptionRow
                        key={prescription.id}
                        prescription={prescription}
                        userId={user.id}
                        onUpdate={handlePrescriptionUpdate}
                        onDelete={handlePrescriptionDelete}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
