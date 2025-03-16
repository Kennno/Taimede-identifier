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
        "Basic plant identification",
      ],
      buttonText: "Current Plan",
      buttonLink: "/dashboard",
      highlighted: false,
      current: user && !user.app_metadata?.subscription,
    },
    {
      name: "Premium",
      price: "€6.99",
      originalPrice: "€9.99",
      period: "per month",
      yearlyPrice: "€5.59",
      yearlyTotal: "€67.08",
      yearlySavings: "20%",
      description: "Advanced features for plant enthusiasts",
      freeTrial: "7-day free trial",
      features: [
        "Unlimited plant identifications",
        "All Registered plan features",
        "Ad-free experience",
        "Personalized AI plant care assistant",
        "Priority support",
        "Enhanced plant care information",
      ],

      buttonText: "Upgrade",
      buttonLink: "/pricing",
      highlighted: true,
      current: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 bg-white dark:bg-gray-900 scroll-mt-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${plan.highlighted ? "border-primary shadow-lg relative overflow-hidden" : "border-gray-200 dark:border-gray-700"} ${plan.current ? "ring-2 ring-primary" : ""} dark:bg-gray-800`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 transform translate-x-0 -translate-y-0">
                  Popular
                </div>
              )}

              <CardHeader
                className={`pb-8 ${plan.highlighted ? "bg-green-50 dark:bg-green-900/20" : ""}`}
              >
                <CardTitle className="text-xl dark:text-white">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  {plan.originalPrice ? (
                    <div>
                      <span className="text-gray-400 text-lg line-through mr-2">
                        {plan.originalPrice}
                      </span>
                      <span className="text-3xl font-bold text-primary">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold dark:text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {plan.description}
                </p>
                {plan.freeTrial && (
                  <p className="text-primary font-medium mt-1">
                    {plan.freeTrial}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="dark:text-gray-300 dark:text-opacity-90">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.name === "Registered" ? (
                  <AuthButton
                    mode="sign-up"
                    className={`w-full ${plan.highlighted ? "bg-primary hover:bg-primary/90" : plan.current ? "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white" : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"}`}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : "Sign Up"}
                  </AuthButton>
                ) : user ? (
                  <UpgradeButton
                    userId={user.id}
                    className={`w-full ${plan.highlighted ? "bg-primary hover:bg-primary/90" : plan.current ? "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white" : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"}`}
                  >
                    {plan.buttonText}
                  </UpgradeButton>
                ) : (
                  <AuthButton
                    mode="sign-up"
                    className={`w-full ${plan.highlighted ? "bg-primary hover:bg-primary/90" : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"}`}
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
