import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Leaf, Target, Heart, Globe } from "lucide-react";

export default async function MissionPage() {
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
              <Target className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Our Mission</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">
              Connecting People with Plants
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our mission is to help people identify, understand, and care for
              plants, fostering a deeper connection with the natural world.
            </p>
          </div>

          <div className="mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-90 rounded-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80"
              alt="Plants in nature"
              className="w-full h-96 object-cover rounded-xl"
              style={{ opacity: 0.3 }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white p-8">
              <div className="max-w-2xl text-center">
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-xl">
                  We envision a world where everyone has the knowledge and tools
                  to successfully identify and care for plants, creating greener
                  spaces and fostering environmental stewardship with RoheAI.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Heart className="h-6 w-6 text-green-600 mr-2" />
                Why Plants Matter
              </h2>
              <div className="prose prose-lg">
                <p>
                  Plants are essential to our existence. They provide oxygen,
                  food, medicine, materials, and countless ecosystem services.
                  Beyond their practical benefits, plants enhance our
                  well-being, reduce stress, and bring beauty to our
                  surroundings.
                </p>
                <p>
                  Despite their importance, many people lack the knowledge to
                  identify plants or provide proper care. This disconnect has
                  led to declining biodiversity and missed opportunities for
                  people to benefit from plant relationships.
                </p>
                <p>
                  At RoheAI, we're working to bridge this gap by making plant
                  identification and care knowledge accessible to everyone
                  through technology.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Leaf className="h-6 w-6 text-green-600 mr-2" />
                Our Approach
              </h2>
              <ul className="space-y-4">
                <li className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                  <h3 className="font-semibold mb-1">Advanced Technology</h3>
                  <p className="text-gray-600">
                    We use cutting-edge AI to provide accurate plant
                    identifications from simple photos.
                  </p>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <h3 className="font-semibold mb-1">Expert Knowledge</h3>
                  <p className="text-gray-600">
                    Our database combines botanical expertise with practical
                    care advice tailored to each species.
                  </p>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
                  <h3 className="font-semibold mb-1">User-Centered Design</h3>
                  <p className="text-gray-600">
                    We create intuitive tools that make plant care accessible to
                    beginners and valuable to experts.
                  </p>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                  <h3 className="font-semibold mb-1">Continuous Improvement</h3>
                  <p className="text-gray-600">
                    We constantly refine our identification algorithms and
                    expand our plant database.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-xl border border-green-100 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Our Commitments
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  Environmental Education
                </h3>
                <p className="text-gray-600">
                  Promoting knowledge about plant biodiversity and conservation
                  through our platform.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  Operating our business with minimal environmental impact and
                  promoting sustainable plant care practices.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  Making plant knowledge available to everyone, regardless of
                  experience level or background.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether you're a plant novice or an experienced gardener, we
              invite you to join us in building a greener, more connected world.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Identifying Plants
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
