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
  Globe,
} from "lucide-react";
import { HomeClientHandler } from "@/components/home-client";
import PlantIdentifier from "@/components/plant-identifier";
import PricingPlans from "@/components/pricing-plans";
import AIAssistant from "@/components/ai-assistant";
import AboutSection from "@/components/about-section";
import RecentSearchesShowcase from "@/components/recent-searches-showcase";
import { Metadata } from "next";
import AuthButton from "@/components/auth-button";

export const metadata: Metadata = {
  title: "RoheAI - Tehisintellektil põhinev taimede tuvastamine",
  description:
    "Tuvasta taimed koheselt meie tehisintellekti tehnoloogiaga. Saa üksikasjalikud hooldusjuhised, kastmisgraafikud ja kasvunõuanded iga taime jaoks.",
  keywords:
    "taimede tuvastamine, taimehooldus, tehisintellektiga taimetuvastus, taimerakendus, taimehoolduse nõuanded, toataimed, aiataimed",
  openGraph: {
    title: "RoheAI - Tehisintellektil põhinev taimede tuvastamine",
    description:
      "Tuvasta taimed koheselt meie tehisintellekti tehnoloogiaga. Saa üksikasjalikud hooldusjuhised iga taime jaoks.",
    url: "https://roheai.com",
    siteName: "RoheAI",
    images: [
      {
        url: "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9a?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "RoheAI Taimede Tuvastamine",
      },
    ],
    locale: "et_EE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoheAI - Tehisintellektil põhinev taimede tuvastamine",
    description:
      "Tuvasta taimed koheselt meie tehisintellekti tehnoloogiaga. Saa üksikasjalikud hooldusjuhised iga taime jaoks.",
    images: [
      "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9a?w=1200&q=80",
    ],
  },
};

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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <HomeClientHandler />
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-32 sm:pt-24 sm:pb-40 flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/30 dark:via-gray-900 dark:to-emerald-950/30 opacity-70" />
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-green-100 dark:bg-green-900/30 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/30 rounded-full opacity-50 blur-3xl" />

        <div className="relative container mx-auto px-4 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-center mb-12 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-6">
              <Leaf className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-300 font-medium">
                Tehisintellektil põhinev taimede tuvastamine
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight max-w-4xl">
              Tuvasta{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                taim
              </span>{" "}
              sekunditega
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Lae üles foto ükskõik millisest taimest ja saa koheselt
              üksikasjalikku teavet selle nime, hooldusnõuete ja muu kohta,
              kasutades meie tehisintellektil põhinevat tuvastamistööriista.
            </p>
          </div>

          <div className="w-full max-w-3xl mx-auto">
            <PlantIdentifier user={user} isPremium={isPremium} />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-green-950/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
              <Sprout className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-300 font-medium">
                Lihtne tuvastus
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 dark:text-white">
              Kuidas see töötab
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meie taimede tuvastamise rakendus teeb lihtsaks taimede
              tuvastamise ja nende kohta õppimise vaid mõne lihtsa sammuga.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="w-8 h-8" />,
                title: "Tee foto",
                description:
                  "Kasuta oma seadme kaamerat või lae üles olemasolev pilt ükskõik millisest taimest",
                color: "bg-blue-50 dark:bg-blue-900/30",
                textColor: "text-blue-600 dark:text-blue-300",
              },
              {
                icon: <Sprout className="w-8 h-8" />,
                title: "Kohene tuvastamine",
                description:
                  "Meie tehisintellekt analüüsib pilti ja tuvastab taimeliigi",
                color: "bg-green-50 dark:bg-green-900/30",
                textColor: "text-green-600 dark:text-green-300",
              },
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "Saa üksikasjalikku teavet",
                description:
                  "Õpi tundma hooldusest, kasvutingimustest ja paljust muust",
                color: "bg-emerald-50 dark:bg-emerald-900/30",
                textColor: "text-emerald-600 dark:text-emerald-300",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:translate-y-[-5px] border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 ${feature.textColor}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 ">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Care Info Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full opacity-20 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Kõik, mida sul on vaja teada
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              Saa põhjalik taimede hoolduse teave mõne klikiga
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg hover:transform hover:scale-105 hover:bg-white/20 transition-all duration-300 group">
              <div className="text-4xl font-bold mb-4 flex justify-center">
                <div className="bg-white/10 p-4 rounded-full group-hover:bg-white/20 transition-all duration-300">
                  <Droplets className="h-10 w-10 text-white group-hover:text-green-100 transition-colors" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Vee vajadused</h3>
              <div className="text-green-100 group-hover:text-white transition-colors">
                Õpi täpselt, kui palju ja kui tihti oma taimi kasta
              </div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg hover:transform hover:scale-105 hover:bg-white/20 transition-all duration-300 group">
              <div className="text-4xl font-bold mb-4 flex justify-center">
                <div className="bg-white/10 p-4 rounded-full group-hover:bg-white/20 transition-all duration-300">
                  <Sun className="h-10 w-10 text-white group-hover:text-green-100 transition-colors" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Valgustingimused</h3>
              <div className="text-green-100 group-hover:text-white transition-colors">
                Avasta ideaalsed valgustingimused optimaalseks kasvuks
              </div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg hover:transform hover:scale-105 hover:bg-white/20 transition-all duration-300 group">
              <div className="text-4xl font-bold mb-4 flex justify-center">
                <div className="bg-white/10 p-4 rounded-full group-hover:bg-white/20 transition-all duration-300">
                  <Sprout className="h-10 w-10 text-white group-hover:text-green-100 transition-colors" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Kasvunõuanded</h3>
              <div className="text-green-100 group-hover:text-white transition-colors">
                Ekspertnõuanded mulla, väetise ja hooajalise hoolduse kohta
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <AboutSection />
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
            <Sprout className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-300 font-medium">
              Liitu Meiega!
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            Alusta oma taimede hoolitsusteekonda juba täna!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Loo konto, et salvestada tuvastatud taimed ja luua oma isiklik
            kollektsioon.
          </p>
          <AuthButton
            mode="sign-up"
            className="inline-flex items-center px-6 py-3 text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Loo tasuta konto
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </AuthButton>
        </div>
      </section>
      {/* Pricing Plans Section */}
      <PricingPlans user={user} />
      <Footer />
      {user && <AIAssistant user={user} isPremium={isPremium} />}
    </div>
  );
}
