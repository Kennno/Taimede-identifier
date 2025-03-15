"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { supabase } from "../../supabase/supabase";
import CheckoutModal from "./checkout-modal";
import AuthModal from "./auth-modal";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Handle checkout process
  const handleGetStarted = () => {
    if (!user) {
      // Open auth modal if user is not authenticated
      setIsAuthOpen(true);
      return;
    }

    // Open checkout modal
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Card
        className={`w-[350px] relative overflow-hidden ${item.popular ? "border-2 border-green-500 shadow-xl scale-105" : "border border-gray-200"}`}
      >
        {item.popular && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 opacity-30" />
        )}
        <CardHeader className="relative">
          {item.popular && (
            <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-full w-fit mb-4">
              Most Popular
            </div>
          )}
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            {item.name}
          </CardTitle>
          <CardDescription className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-bold text-gray-900">
              ${item?.amount / 100}
            </span>
            <span className="text-gray-600">/{item?.interval}</span>
          </CardDescription>
        </CardHeader>
        <CardFooter className="relative">
          <Button
            onClick={handleGetStarted}
            className={`w-full py-6 text-lg font-medium ${item.popular ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>

      {/* Checkout Modal */}
      {user && (
        <CheckoutModal
          user={user}
          priceId={item.id}
          planName={item.name}
          planPrice={`${item?.amount / 100}/${item?.interval}`}
          open={isCheckoutOpen}
          onOpenChange={setIsCheckoutOpen}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        defaultTab="sign-up"
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        redirectUrl="/pricing"
      />
    </>
  );
}
