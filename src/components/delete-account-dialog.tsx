"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmText !== "KUSTUTA") {
      setError("Vale kinnitusfraas. Palun sisesta täpselt 'KUSTUTA'.");
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Kasutaja pole sisse logitud");
      }

      // Delete user data from database tables first
      await supabase.from("chat_messages").delete().eq("user_id", user.id);
      await supabase.from("chat_conversations").delete().eq("user_id", user.id);
      await supabase.from("recent_searches").delete().eq("user_id", user.id);
      await supabase.from("subscriptions").delete().eq("user_id", user.id);
      await supabase.from("users").delete().eq("user_id", user.id);

      // Delete the user from auth
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user.id,
      );

      if (deleteError) {
        // If admin delete fails, try to delete user through the API
        const response = await fetch("/api/delete-account", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Konto kustutamine ebaõnnestus");
        }
      }

      // Sign out the user
      await supabase.auth.signOut();

      // Clear all local storage
      localStorage.clear();

      // Close dialog and redirect
      onOpenChange(false);
      router.push("/");

      // Force reload to ensure all state is cleared
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(
        err instanceof Error ? err.message : "Konto kustutamine ebaõnnestus",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 dark:text-red-500">
            Konto kustutamine
          </AlertDialogTitle>
          <AlertDialogDescription>
            See toiming on püsiv ja seda ei saa tagasi võtta. See kustutab kõik
            teie andmed, sealhulgas taimede tuvastamise ajaloo ja vestlused.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            Konto kustutamiseks sisesta allpool olevale väljale sõna{" "}
            <strong>KUSTUTA</strong>.
          </p>

          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Sisesta KUSTUTA"
            className="mb-2"
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-500 mt-2">
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Tühista</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting || confirmText !== "KUSTUTA"}
            className="gap-2"
          >
            {isDeleting ? "Kustutamine..." : "Kustuta konto"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
