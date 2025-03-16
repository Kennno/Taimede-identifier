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
import { X } from "lucide-react";
import CheckoutModal from "./checkout-modal";
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

  useEffect(() => {
    if (open) {
      fetchPlans();
    }
  }, [open]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-get-plans",
        {
          body: {},
        },
      );

      if (error) throw error;

      if (data && Array.isArray(data)) {
        // Filter out free plans
        const paidPlans = data.filter((plan) => plan.amount > 0);
        setPlans(paidPlans);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Error fetching plans:", err);
      setError(err.message || "Failed to load pricing plans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: any) => {
    if (!user) {
      // Handle not logged in case
      return;
    }

    // Open checkout modal for the selected plan
    // This will be handled by the CheckoutModal component
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              Upgrade to Premium
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Get unlimited plant identifications and premium features
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {isLoading ? (
            <div className="col-span-2 text-center py-8">
              <p>Loading plans...</p>
            </div>
          ) : error ? (
            <div className="col-span-2 text-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">
                  ${plan.amount / 100}
                  <span className="text-sm font-normal text-gray-500">
                    /{plan.interval}
                  </span>
                </div>
                <ul className="space-y-2 mb-6 flex-grow">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Unlimited plant identifications</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>AI plant care assistant</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <CheckoutModal
                  user={user}
                  priceId={plan.id}
                  planName={plan.name}
                  planPrice={`$${plan.amount / 100}/${plan.interval}`}
                  trigger={
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Get Started
                    </Button>
                  }
                />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
