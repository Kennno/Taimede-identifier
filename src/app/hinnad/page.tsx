import { Metadata } from "next";
import PricingPlans from "@/components/pricing-plans";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Hinnad | TaimeTark",
  description:
    "Vaata meie soodsaid tellimisplaane ja vali endale sobiv pakett.",
};

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Hinnad</h1>
          <p className="text-center text-muted-foreground mb-8">
            Vali endale sobiv pakett ja alusta taimede tuvastamist juba täna.
          </p>
          <PricingPlans user={null} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
