import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Leaf, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function EncyclopediaPage() {
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

  // Sample plant data for the encyclopedia
  const popularPlants = [
    {
      name: "Monstera Deliciosa",
      scientificName: "Monstera deliciosa",
      image:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80",
      category: "Indoor",
      difficulty: "Easy",
    },
    {
      name: "Snake Plant",
      scientificName: "Dracaena trifasciata",
      image:
        "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&q=80",
      category: "Indoor",
      difficulty: "Very Easy",
    },
    {
      name: "Fiddle Leaf Fig",
      scientificName: "Ficus lyrata",
      image:
        "https://images.unsplash.com/photo-1597055181449-b9d2a4598b52?w=400&q=80",
      category: "Indoor",
      difficulty: "Moderate",
    },
    {
      name: "Peace Lily",
      scientificName: "Spathiphyllum",
      image:
        "https://images.unsplash.com/photo-1593482892290-f54927ae2321?w=400&q=80",
      category: "Indoor",
      difficulty: "Easy",
    },
    {
      name: "Pothos",
      scientificName: "Epipremnum aureum",
      image:
        "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=400&q=80",
      category: "Indoor",
      difficulty: "Very Easy",
    },
    {
      name: "Aloe Vera",
      scientificName: "Aloe barbadensis miller",
      image:
        "https://images.unsplash.com/photo-1596547609652-9cf5d8c6a5f5?w=400&q=80",
      category: "Succulent",
      difficulty: "Easy",
    },
  ];

  const categories = [
    { name: "Indoor Plants", count: 250, icon: "🪴" },
    { name: "Outdoor Plants", count: 320, icon: "🌳" },
    { name: "Succulents", count: 150, icon: "🌵" },
    { name: "Flowering Plants", count: 280, icon: "🌸" },
    { name: "Vegetables", count: 120, icon: "🥬" },
    { name: "Herbs", count: 80, icon: "🌿" },
    { name: "Fruit Trees", count: 90, icon: "🍎" },
    { name: "Aquatic Plants", count: 40, icon: "💧" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar user={user} isPremium={isPremium} />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
              <Leaf className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Plant Encyclopedia
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Discover Plants</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Explore our comprehensive database of plants, complete with care
              guides, growing tips, and identification help.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <Input
                placeholder="Search for plants..."
                className="pl-10 py-6 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category.count} plants
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Popular Plants</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPlants.map((plant, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all hover:translate-y-[-5px]"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{plant.name}</h3>
                    <p className="text-gray-500 italic text-sm mb-2">
                      {plant.scientificName}
                    </p>
                    <div className="flex gap-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {plant.category}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {plant.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Load More Plants
              </Button>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-xl border border-green-100 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Can't Find Your Plant?
              </h2>
              <p className="text-gray-600">
                Use our AI-powered plant identification tool to instantly
                recognize any plant from a photo.
              </p>
            </div>
            <div className="flex justify-center">
              <Button className="bg-green-600 hover:bg-green-700">
                <Leaf className="mr-2 h-4 w-4" />
                Identify a Plant
              </Button>
            </div>
          </div>

          {isPremium ? (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Premium Encyclopedia Access
                  </h3>
                  <p className="text-gray-600">
                    As a premium member, you have full access to our entire
                    plant database, including detailed care guides and expert
                    tips.
                  </p>
                </div>
                <div className="bg-amber-100 p-2 rounded-full">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Unlock Full Encyclopedia Access
                  </h3>
                  <p className="text-gray-600">
                    Upgrade to premium for unlimited access to our complete
                    plant database, detailed care guides, and expert tips.
                  </p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap">
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
