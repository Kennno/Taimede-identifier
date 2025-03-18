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
  const [isOneTime, setIsOneTime] = useState(false);
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
          name: "Premium Igakuiselt",
          amount: 699,
          interval: "month",
        },
        {
          id: "price_yearly",
          name: "Premium Aastas",
          amount: 4890,
          interval: "year",
        },
      ]);
    } catch (err: any) {
      console.error("Error fetching plans:", err);
      setError(err.message || "Hindade laadimine ebaõnnestus");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;

    try {
      setIsCheckoutLoading(true);
      setError(null);

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
            price_id: isOneTime
              ? "price_1R3lESGHhC3hdJSUsqe2a4Rp"
              : isYearly
                ? "price_1R3lB3GHhC3hdJSUBgQYNNqu"
                : "price_1R3MoIGHhC3hdJSUu4I0zaJ6",
            return_url: window.location.origin + "/success",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Maksmine ebaõnnestus");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error instanceof Error ? error.message : "Ootamatu viga");
      setIsCheckoutLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gray-950 text-white border-gray-800">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-white">
              Ava täielik ligipääs RoheAI-le
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Saa piiramatu ligipääs taimede tuvastamisele ja personaalsele AI
            abile
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-white">
              Premium Plaan
            </h3>

            <div className="my-6 flex justify-center">
              <div className="bg-gray-800 p-1 rounded-full flex items-center gap-2 relative max-w-[300px]">
                <div
                  className={`absolute inset-y-1 ${
                    isOneTime
                      ? "right-1 left-[calc(66.6%+4px)]"
                      : isYearly
                        ? "left-[calc(33.3%+4px)] right-[calc(33.3%+4px)]"
                        : "left-1 right-[calc(66.6%+4px)]"
                  } bg-green-600 rounded-full transition-all duration-300 ease-in-out`}
                ></div>
                <button
                  onClick={() => {
                    setIsYearly(false);
                    setIsOneTime(false);
                  }}
                  className={`px-3 py-1 rounded-full relative z-10 transition-colors text-sm ${!isYearly && !isOneTime ? "text-white font-medium" : "text-gray-400"}`}
                >
                  Igakuiselt
                </button>
                <button
                  onClick={() => {
                    setIsYearly(true);
                    setIsOneTime(false);
                  }}
                  className={`px-3 py-1 rounded-full relative z-10 transition-colors text-sm ${isYearly && !isOneTime ? "text-white font-medium" : "text-gray-400"}`}
                >
                  Aastas
                </button>
                <button
                  onClick={() => {
                    setIsYearly(false);
                    setIsOneTime(true);
                  }}
                  className={`px-3 py-1 rounded-full relative z-10 transition-colors text-sm ${isOneTime ? "text-white font-medium" : "text-gray-400"}`}
                >
                  Ühekordne
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">Premium Tellimus</span>
                <div className="text-right">
                  {isOneTime ? (
                    <div className="font-bold text-green-400">
                      €63.99
                      <span className="text-sm font-normal"> ühekordselt</span>
                    </div>
                  ) : isYearly ? (
                    <>
                      <div className="font-bold text-green-400">
                        €4.89<span className="text-sm font-normal">/kuus</span>
                      </div>
                      <div className="text-xs text-gray-400">€58.68 aastas</div>
                      <div className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full inline-block mt-1">
                        Säästa 30%
                      </div>
                    </>
                  ) : (
                    <span className="font-bold text-green-400">
                      €6.99<span className="text-sm font-normal">/kuus</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Piiramatu taimede tuvastamine</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>AI taimehoolduse assistent</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Reklaamivaba kogemus</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Eksklusiivne juurdepääs uutele funktsioonidele</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-4 pt-3 border-t border-gray-800">
                {isOneTime
                  ? "Ühekordne makse, eluaegne juurdepääs."
                  : `Tühista igal ajal. ${isYearly ? "Aastane" : "Igakuine"} tellimus.`}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 text-red-300 rounded-md text-sm border border-red-800">
              {error}
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={isCheckoutLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isCheckoutLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Töötleb...
              </>
            ) : (
              `Jätka ${isOneTime ? "ühekordse" : isYearly ? "aastase" : "igakuise"} maksega`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
