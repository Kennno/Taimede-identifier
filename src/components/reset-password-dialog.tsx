"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ResetPasswordDialog({
  open,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const [message, setMessage] = useState<Message | null>(null);

  const handleFormAction = async (formData: FormData) => {
    try {
      const result = await resetPasswordAction(formData);
      if (result && "message" in result) {
        setMessage(result);
        if (result.type === "success") {
          setTimeout(() => onOpenChange(false), 2000);
        }
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Please enter your new password below.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col space-y-4" action={handleFormAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                New password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="New password"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                required
                className="w-full"
              />
            </div>
          </div>

          <SubmitButton pendingText="Resetting password..." className="w-full">
            Reset password
          </SubmitButton>

          {message && <FormMessage message={message} />}
        </form>
      </DialogContent>
    </Dialog>
  );
}
