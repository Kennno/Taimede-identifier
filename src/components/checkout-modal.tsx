"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, CreditCard, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase/supabase";
import { User } from "@supabase/supabase-js";

interface CheckoutModalProps {
  user?: User;
  priceId: string;
  planName: string;
  planPrice: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CheckoutModal({
  user,
  priceId,
  planName,
  planPrice,
  trigger,
  open,
  onOpenChange,
}: CheckoutModalProps) {
  // Ensure user is defined before accessing properties
  if (!user) {
    return null;
  }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"details" | "processing" | "success">(
    "details",
  );
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setStep("processing");

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/success`,
          },
          headers: {
            "X-Customer-Email": user?.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setError(error.message || "Failed to process payment");
      setStep("details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {step === "success"
              ? "Payment Successful!"
              : `Upgrade to ${planName}`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "success"
              ? "Thank you for your purchase"
              : `Get unlimited plant identifications and premium features for ${planPrice}`}
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <form onSubmit={handleCheckout} className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{planName} Plan</span>
                <span className="font-bold">{planPrice}</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited plant identifications
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  AI plant care assistant
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Priority support
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              You'll be redirected to our secure payment processor to complete
              your purchase. Your subscription will begin immediately after
              payment.
            </p>
          </form>
        )}

        {step === "processing" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
            <p>Processing your payment...</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="mb-6">Your premium subscription is now active!</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
