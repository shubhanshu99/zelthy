"use client";

import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";

interface EditUserDialogProps {
  userId: number;
  name: string;
  email: string;
  password: string;
  onUpdate: (EditUser: User) => void;
}

export function EditUserDialog({
  userId,
  name,
  email,
  onUpdate,
}: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ischangePassword, setIsChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: name,
    email: email,
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/patients/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          name: formData.name !== "" ? formData.name : name,
          email: formData.email !== "" ? formData.email : email,
          password: formData.password !== "" ? formData.password : undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to update user");
      const updated = await response.json();
      onUpdate(updated);
      setOpen(false);
      setIsChangePassword(false);
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

  const isFormValid = formData.name && formData.email && formData.password;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Pencil className="size-4" />
          Edit Patient Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Patient Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder={name}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={email}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <Checkbox
                id="changePassword"
                label="Change Password"
                checked={ischangePassword}
                onCheckedChange={(checked) => setIsChangePassword(!!checked)}
              />
            </div>
            {ischangePassword && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
