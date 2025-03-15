"use client";

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

interface PricingPlansProps {
  user: User | null;
}

export default function PricingPlans({ user }: PricingPlansProps) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Basic plant identification for casual gardeners",
      features: [
        "10 plant identification requests per month",
        "Basic plant information",
        "Health status assessment",
        "Care recommendations",
        "Origin and habitat information",
      ],
      buttonText: user ? "Current Plan" : "Get Started",
      buttonLink: user ? "/dashboard" : "/sign-up",
      highlighted: false,
      current: false,
    },
    {
      name: "Registered",
      price: "$0",
      period: "forever",
      description: "Enhanced features for registered users",
      features: [
        "20 plant identification requests per month",
        "All Free plan features",
        "Save plants to your collection",
        "View identification history",
        "Personalized dashboard",
      ],
      buttonText: user ? "Current Plan" : "Sign Up",
      buttonLink: user ? "/dashboard" : "/sign-up",
      highlighted: false,
      current: user ? true : false, // Only show as current plan for registered users
    },
    {
      name: "Premium",
      price: "$10",
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
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your plant identification needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              {plan.current && (
                <div className="absolute top-4 left-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                  Current Plan
                </div>
              )}
              <CardHeader
                className={`pb-8 ${plan.highlighted ? "bg-green-50" : ""}`}
              >
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
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
                <Button
                  className={`w-full ${plan.highlighted ? "bg-green-600 hover:bg-green-700" : plan.current ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-gray-800 hover:bg-gray-900"}`}
                  asChild
                  disabled={plan.current}
                >
                  <a href={plan.buttonLink}>{plan.buttonText}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Need more information about our plans?
          </p>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <a href="/pricing">View Detailed Pricing</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
