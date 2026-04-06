"use client";

import { useState, useEffect, use } from "react";
import { Plus, Loader2 } from "lucide-react";
import type { Prescription } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "../ui/use-toast";

interface AddPrescriptionDialogProps {
  userId: number;
  onAdd: (prescription: Prescription) => void;
}

const REFILL_SCHEDULES = ["weekly", "monthly", "quarterly"] as const;

export function AddPrescriptionDialog({
  userId,
  onAdd,
}: AddPrescriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medications, setMedications] = useState<string[]>([]);
  const [dosages, setDosages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    quantity: "1",
    refill_on: "",
    refill_schedule: "" as "weekly" | "monthly" | "quarterly" | "",
  });

  useEffect(() => {
    // Fetch medications and dosages when dialog opens
    if (open) {
      fetch("/api/prescriptions")
        .then((res) => res.json())
        .then((data) => {
          setMedications(data.medications || []);
          setDosages(data.dosages || []);
        })
        .catch((error) => {
          useToast().toast(error);
        });
    }
  }, [open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          ...formData,
          quantity: parseInt(formData.quantity, 10),
        }),
      });

      if (!response.ok) throw new Error("Failed to create prescription");

      const newPrescription = await response.json();
      onAdd(newPrescription);
      setOpen(false);
      setFormData({
        medication: "",
        dosage: "",
        quantity: "1",
        refill_on: "",
        refill_schedule: "",
      });
    } catch (error) {
      useToast().toast({
        title: "Error",
        description:
          "There was an issue creating the appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.medication &&
    formData.dosage &&
    formData.quantity &&
    formData.refill_on &&
    formData.refill_schedule;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Add Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Prescription</DialogTitle>
          <DialogDescription>
            Enter the prescription details for this patient.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="medication">Medication</Label>
              <Select
                value={formData.medication}
                onValueChange={(value) => handleChange("medication", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  {medications.map((med) => (
                    <SelectItem key={med} value={med}>
                      {med}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Select
                  value={formData.dosage}
                  onValueChange={(value) => handleChange("dosage", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dosage" />
                  </SelectTrigger>
                  <SelectContent>
                    {dosages.map((dose) => (
                      <SelectItem key={dose} value={dose}>
                        {dose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="refill_on">Refill Date</Label>
                <Input
                  id="refill_on"
                  type="date"
                  value={formData.refill_on}
                  onChange={(e) => handleChange("refill_on", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="refill_schedule">Refill Schedule</Label>
                <Select
                  value={formData.refill_schedule}
                  onValueChange={(value) =>
                    handleChange("refill_schedule", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFILL_SCHEDULES.map((schedule) => (
                      <SelectItem key={schedule} value={schedule}>
                        <span className="capitalize">{schedule}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Add Prescription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
