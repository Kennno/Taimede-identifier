import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  Leaf,
  Droplets,
  Sun,
  Sprout,
  Camera,
  Upload,
} from "lucide-react";
import PlantIdentifier from "@/components/plant-identifier";
import PricingPlans from "@/components/pricing-plans";
import AIAssistant from "@/components/ai-assistant";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user has premium subscription
  let isPremium = false;
  if (user) {
    const { data: subscriptionData } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    isPremium = !!subscriptionData;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 opacity-70" />

        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Identify{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Plants
              </span>{" "}
              in Seconds
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload a photo of any plant and instantly get detailed information
              about its name, care requirements, and more using our AI-powered
              identification tool.
            </p>

            <PlantIdentifier user={user} isPremium={isPremium} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our plant identification app makes it easy to identify and learn
              about any plant in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="w-6 h-6" />,
                title: "Take a Photo",
                description:
                  "Use your device camera or upload an existing image of any plant",
              },
              {
                icon: <Sprout className="w-6 h-6" />,
                title: "Instant Identification",
                description:
                  "Our AI analyzes the image and identifies the plant species",
              },
              {
                icon: <Leaf className="w-6 h-6" />,
                title: "Get Detailed Info",
                description:
                  "Learn about care requirements, growing conditions, and more",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Info Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              Get comprehensive plant care information at your fingertips
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 flex justify-center">
                <Droplets className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Water Requirements</h3>
              <div className="text-green-100">
                Learn exactly how much and how often to water your plants
              </div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 flex justify-center">
                <Sun className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Light Conditions</h3>
              <div className="text-green-100">
                Discover the ideal light conditions for optimal growth
              </div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 flex justify-center">
                <Sprout className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Tips</h3>
              <div className="text-green-100">
                Expert advice on soil, fertilizer, and seasonal care
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Plant Journey Today
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Create an account to save your identified plants and build your
            personal collection.
          </p>
          <a
            href="/sign-up"
            className="inline-flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Free Account
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <PricingPlans user={user} />

      <Footer />
      {isPremium && <AIAssistant user={user} isPremium={true} />}
    </div>
  );
}
