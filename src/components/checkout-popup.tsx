"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { X, Check, Loader2 } from "lucide-react";
import { supabase } from "../../supabase/supabase";

interface CheckoutPopupProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutPopup({
  user,
  open,
  onOpenChange,
}: CheckoutPopupProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPlans();
    }
  }, [open]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll use static plans since the function might not be available
      setPlans([
        {
          id: "price_monthly",
          name: "Premium Monthly",
          amount: 699,
          interval: "month",
        },
        {
          id: "price_yearly",
          name: "Premium Yearly",
          amount: 5590,
          interval: "year",
        },
      ]);
    } catch (err: any) {
      console.error("Error fetching plans:", err);
      setError(err.message || "Failed to load pricing plans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;

    try {
      setIsCheckoutLoading(true);
      setError(null);

      // Get the user's email for the checkout
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email;

      const response = await fetch(
        "https://api.tempolabs.ai/proxy-function?url=https://admiring-hypatia8-seytm.supabase.co/functions/v1/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            "X-Customer-Email": userEmail || "",
          },
          body: JSON.stringify({
            user_id: user.id,
            price_id: isYearly ? "price_yearly" : "price_monthly",
            return_url: window.location.origin + "/success",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setIsCheckoutLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              Upgrade to Premium
            </DialogTitle>
          </div>
          <DialogDescription>
            Get unlimited plant identifications and premium features
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Premium Plan</h3>
            <p className="text-gray-600">
              Unlock unlimited plant identifications and premium features
            </p>

            <div className="my-6 flex justify-center">
              <div className="bg-green-50 p-1 rounded-full flex items-center gap-2 relative max-w-[200px]">
                <div
                  className={`absolute inset-y-1 ${isYearly ? "right-1 left-[calc(50%+4px)]" : "left-1 right-[calc(50%+4px)]"} bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out`}
                ></div>
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-3 py-1 rounded-full relative z-10 transition-colors text-sm ${!isYearly ? "text-green-800 font-medium" : "text-green-600"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-3 py-1 rounded-full relative z-10 transition-colors text-sm ${isYearly ? "text-green-800 font-medium" : "text-green-600"}`}
                >
                  Annually
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Premium Subscription</span>
                <div className="text-right">
                  {isYearly ? (
                    <>
                      <div className="font-bold text-green-600">
                        €5.59<span className="text-sm font-normal">/month</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        €67.08 billed annually
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block mt-1">
                        Save 20%
                      </div>
                    </>
                  ) : (
                    <span className="font-bold text-green-600">
                      €6.99<span className="text-sm font-normal">/month</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Unlimited plant identifications</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>AI plant care assistant</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Ad-free experience</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-4 pt-3 border-t border-green-100">
                Cancel anytime. {isYearly ? "Annual" : "Monthly"} subscription.
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={isCheckoutLoading}
            className="w-full bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
          >
            {isCheckoutLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Proceed to ${isYearly ? "Annual" : "Monthly"} Payment`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
