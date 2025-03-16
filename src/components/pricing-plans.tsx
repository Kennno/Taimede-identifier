"use client";

import { useState, useEffect } from "react";
import { Check, Zap, Users, Leaf, MessageSquare, Ban } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { User } from "@supabase/supabase-js";
import AuthButton from "./auth-button";
import UpgradeButton from "./upgrade-button";

interface PricingPlansProps {
  user: User | null;
}

export default function PricingPlans({ user }: PricingPlansProps) {
  const plans = [
    {
      name: "Registered",
      price: "$0",
      period: "forever",
      description: "Enhanced features for registered users",
      features: [
        "5 plant identifications per month",
        "Save plants to your collection",
        "Detailed plant care information",
        "No credit card required",
      ],
      buttonText: "Current Plan",
      buttonLink: "/dashboard",
      highlighted: false,
      current: user && !user.app_metadata?.subscription,
    },
    {
      name: "Premium",
      price: "$14.99",
      originalPrice: "$24.99",
      period: "per month",
      description: "Advanced features for plant enthusiasts",
      features: [
        "Unlimited plant identifications",
        "All Registered plan features",
        "Ad-free experience",
        "Personalized AI plant care assistant",
        "Priority support",
      ],
      buttonText: "Upgrade",
      buttonLink: "/pricing",
      highlighted: true,
      current: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${plan.highlighted ? "border-green-500 shadow-lg relative overflow-hidden" : "border-gray-200"} ${plan.current ? "ring-2 ring-green-500" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rotate-45">
                  Popular
                </div>
              )}

              <CardHeader
                className={`pb-8 ${plan.highlighted ? "bg-green-50" : ""}`}
              >
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  {plan.originalPrice ? (
                    <div>
                      <span className="text-gray-400 text-lg line-through mr-2">
                        {plan.originalPrice}
                      </span>
                      <span className="text-3xl font-bold text-green-600">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-500 ml-2">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-500 ml-2">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.name === "Registered" ? (
                  <AuthButton
                    mode="sign-up"
                    className={`w-full ${plan.highlighted ? "bg-green-600 hover:bg-green-700" : plan.current ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-gray-800 hover:bg-gray-900"}`}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : "Sign Up"}
                  </AuthButton>
                ) : user ? (
                  <UpgradeButton
                    userId={user.id}
                    className={`w-full ${plan.highlighted ? "bg-green-600 hover:bg-green-700" : plan.current ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-gray-800 hover:bg-gray-900"}`}
                  >
                    {plan.buttonText}
                  </UpgradeButton>
                ) : (
                  <AuthButton
                    mode="sign-up"
                    className={`w-full ${plan.highlighted ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-gray-900"}`}
                  >
                    Sign Up First
                  </AuthButton>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
