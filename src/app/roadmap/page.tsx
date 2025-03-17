import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Milestone, RoadmapTimeline } from "@/components/roadmap-timeline";
import { RocketIcon, MapIcon } from "lucide-react";

import { redirect } from "next/navigation";

export default async function RoadmapPage() {
  // Redirect to Estonian route
  return redirect("/tegevuskava");
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

  // Define roadmap milestones
  const milestones: Milestone[] = [
    {
      title: "Plant Identification",
      description:
        "AI-powered plant recognition with detailed care information",
      status: "completed",
      icon: "Leaf",
    },
    {
      title: "Plant Collection",
      description: "Track and organize your plants in a digital library",
      status: "in-progress",
      icon: "Sprout",
    },
    {
      title: "Plant Care Schedule",
      description:
        "Personalized reminders via SMS, email, or phone notifications",
      status: "planned",
      icon: "Bell",
    },
    {
      title: "Personalized Growth Recommendations",
      description:
        "Custom advice based on your plant's specific needs and environment",
      status: "planned",
      icon: "LineChart",
    },
    {
      title: "Weather-Based Alerts",
      description: "Smart notifications based on local weather conditions",
      status: "planned",
      icon: "Cloud",
    },
    {
      title: "Plant Encyclopedia",
      description: "Comprehensive database of plants with detailed information",
      status: "planned",
      icon: "BookOpen",
    },
    {
      title: "Multi-User & Family Access",
      description: "Share plant care responsibilities with family members",
      status: "planned",
      icon: "Users",
    },
    {
      title: "Gamification & Achievements",
      description: "Earn rewards and track progress as your plants thrive",
      status: "planned",
      icon: "Trophy",
    },
    {
      title: "Augmented Reality Plant Placement",
      description:
        "Visualize how plants will look in your space before purchasing",
      status: "future",
      icon: "Smartphone",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/30 dark:to-gray-900">
      <Navbar user={user} isPremium={isPremium} />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
              <MapIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-300 font-medium">
                Our Vision
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-6 dark:text-white">
              Product Roadmap
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our journey to create the ultimate plant care experience.
              See what features are available now and what's coming soon to
              RoheAI.
            </p>
          </div>

          <div className="mb-16">
            <RoadmapTimeline milestones={milestones} />
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-100 dark:border-green-800 mb-16">
            <div className="flex items-start md:items-center gap-4 mb-6">
              <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                <RocketIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Help Shape Our Future
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We're constantly working to improve RoheAI and add new features
              that will make plant care easier and more enjoyable. Your feedback
              is invaluable in helping us prioritize what to build next.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Have a Feature Request?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We'd love to hear your ideas for new features or improvements
                  to existing ones.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  Submit your ideas
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Join Our Community
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect with other plant enthusiasts and share your
                  experiences with RoheAI.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  Contact us
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
