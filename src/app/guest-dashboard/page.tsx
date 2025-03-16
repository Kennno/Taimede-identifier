import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Leaf, Camera, Upload, ArrowUpRight } from "lucide-react";
import PlantIdentifier from "@/components/plant-identifier";
import { Button } from "@/components/ui/button";
import RecentIdentifications from "@/components/recent-identifications";

export default function GuestDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-3xl font-bold">Guest Dashboard</h1>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <a href="/sign-up">
                  Sign up for free
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
              <p>
                You're using RoheAI as a guest. Your identifications are saved
                locally on this device. Sign up to access your identifications
                from any device and unlock more features!
              </p>
            </div>

            <PlantIdentifier user={null} isPremium={false} />
          </div>
          <div className="space-y-8">
            <RecentIdentifications user={null} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
