"use client";

import { useState } from "react";
import { Loader2, Pencil, Save, Trash } from "lucide-react";
import type {
  Appointment,
  AppointmentRepeat,
  AppointmentStatus,
} from "@/lib/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "../ui/use-toast";

interface AppointmentRowProps {
  appointment: Appointment;
  userId: number;
  onUpdate: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

const STATUS_OPTIONS: AppointmentStatus[] = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "No Show",
];
const Repeat_OPTIONS: AppointmentRepeat[] = [
  "none",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "yearly",
];

function getStatusBadgeClass(status: AppointmentStatus): string {
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

function formatDateTime(datetime: string): string {
  const d = new Date(datetime);
  return `${d.toLocaleDateString()} at ${d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export function AppointmentRow({
  appointment,
  userId,
  onUpdate,
  onDelete,
}: AppointmentRowProps) {
  const [status, setStatus] = useState<AppointmentStatus>(
    appointment.status || "Scheduled",
  );
  const [repeat, setRepeat] = useState<Appointment["repeat"]>(
    appointment.repeat || "none",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleStatusChange = (newStatus: AppointmentStatus) => {
    setStatus(newStatus);
  };
  const handleRepeatChange = (newRepeat: AppointmentRepeat) => {
    setRepeat(newRepeat);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repeat, status, userId }),
      });

      if (!response.ok) throw new Error("Failed to update appointment");

      const updated = await response.json();
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      useToast().toast({
        title: "Error",
        description:
          "There was an issue updating the appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to delete appointment");

      onDelete({ ...appointment, status: "Cancelled" });
    } catch (error) {
      useToast().toast({
        title: "Error",
        description:
          "There was an issue deleting the appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{formatDateTime(appointment.datetime)}</TableCell>
        <TableCell className="font-medium">{appointment.provider}</TableCell>
        <TableCell>
          {isEditing ? (
            <Select value={repeat} onValueChange={handleRepeatChange}>
              <SelectTrigger className="w-32">
                <SelectValue>{repeat}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Repeat_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="font-medium">{repeat}</div>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32">
                <SelectValue>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeClass(status)}
                  >
                    {status}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(option)}
                    >
                      {option}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="outline" className={getStatusBadgeClass(status)}>
              {status}
            </Badge>
          )}
        </TableCell>

        <TableCell>
          {isEditing && (
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4 stroke-white-300 hover:cursor-pointer" />
              )}
            </Button>
          )}
          {!isEditing && (
            <Pencil
              onClick={handleEdit}
              className="size-4 stroke-amber-600 hover:cursor-pointer"
            />
          )}
        </TableCell>
        <TableCell>
          {isDeleting ? (
            <Button size="sm" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "confirm"
              )}
            </Button>
          ) : (
            <Trash
              className="size-4 stroke-red-600 hover:cursor-pointer"
              onClick={() => setIsDeleting(true)}
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
