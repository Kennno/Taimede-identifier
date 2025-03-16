import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Leaf, Users, Globe, Award } from "lucide-react";

export default async function AboutPage() {
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
      <Navbar user={user} isPremium={isPremium} />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
              <Leaf className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">About Us</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Our Story</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              PlantID was founded by a team of plant enthusiasts and technology
              experts with a shared mission: to make plant identification and
              care accessible to everyone.
            </p>
          </div>

          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1542728928-1413d1894ed1?w=600&q=80"
                  alt="Team working with plants"
                  className="rounded-xl shadow-md w-full h-auto"
                />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1530968464165-7a1861cbaf9a?w=600&q=80"
                  alt="Plant research"
                  className="rounded-xl shadow-md w-full h-auto"
                />
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p>
                RoheAI was founded with a clear mission: to make plant
                identification and care accessible to everyone through
                innovative technology.
              </p>
              <p>
                Our team of botanists, machine learning engineers, and plant
                care specialists work together to create tools that not only
                identify plants with high accuracy but also provide tailored
                care instructions based on the specific needs of each species.
              </p>
              <p>
                Today, RoheAI has helped millions of users around the world
                identify and care for their plants, contributing to greener
                homes and a deeper connection with nature.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Award className="h-6 w-6 text-green-600 mr-2" />
                Our Values
              </h2>
              <ul className="space-y-4">
                <li className="flex">
                  <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded mr-3">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold">Accuracy</h3>
                    <p className="text-gray-600">
                      We continuously improve our AI to ensure the most accurate
                      plant identifications possible.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded mr-3">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold">Accessibility</h3>
                    <p className="text-gray-600">
                      We believe plant knowledge should be accessible to
                      everyone, regardless of experience level.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded mr-3">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold">Education</h3>
                    <p className="text-gray-600">
                      We're committed to helping users learn about their plants
                      and become better caretakers.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Globe className="h-6 w-6 text-green-600 mr-2" />
                Our Impact
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    10M+
                  </div>
                  <div className="text-gray-600">Plants Identified</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    150+
                  </div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    25K+
                  </div>
                  <div className="text-gray-600">Plant Species</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    4.8
                  </div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-xl border border-green-100 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Our Expertise
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-green-100 flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg">Botanical Knowledge</h3>
                <p className="text-gray-600">
                  Our team includes experts in plant taxonomy and care
                  requirements
                </p>
              </div>
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-blue-100 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg">Global Database</h3>
                <p className="text-gray-600">
                  Comprehensive information on thousands of plant species
                  worldwide
                </p>
              </div>
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-amber-100 flex items-center justify-center">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg">AI Excellence</h3>
                <p className="text-gray-600">
                  State-of-the-art machine learning models for accurate plant
                  identification
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
