"use client";

import { useState } from "react";
import { Loader2, Pencil, RefreshCw, Trash } from "lucide-react";
import type { Prescription } from "@/lib/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditPrescriptionDialog } from "./edit-prescription-dialog";
import { useToast } from "../ui/use-toast";

interface PrescriptionRowProps {
  prescription: Prescription;
  userId: number;
  onUpdate: (prescription: Prescription) => void;
  onDelete: (prescription: Prescription) => void;
}

function formatDateTime(datetime: string): string {
  const d = new Date(datetime);
  return `${d.toLocaleDateString()} at ${d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export function PrescriptionRow({
  prescription,
  userId,
  onUpdate,
  onDelete,
}: PrescriptionRowProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onUpdatePrescription = (updated: Prescription) => {
    onUpdate(updated);
  };
  const handleDelete = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/prescriptions/${prescription.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to delete prescription");

      onDelete({ ...prescription });
    } catch (error) {
      useToast().toast({
        title: "Error",
        description:
          "There was an issue deleting the prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TableRow key={prescription.id}>
        <TableCell className="font-medium">{prescription.medication}</TableCell>
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
        <TableCell>
          <EditPrescriptionDialog
            userId={userId}
            prescription={prescription}
            onUpdate={onUpdatePrescription}
          />
        </TableCell>
        <TableCell>
          {isDeleting ? (
            <Button size="sm" onClick={handleDelete}>
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
      {/* <TableRow>
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
        <TableCell className="max-w-xs">
          {isEditing ? (
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add notes..."
              className="min-h-[60px] resize-none text-sm"
            />
          ) : appointment.notes ? (
            appointment.notes
          ) : (
            "No notes"
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
      </TableRow> */}
    </>
  );
}
