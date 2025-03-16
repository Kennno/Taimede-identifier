import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Leaf, Droplets, Sun, Sprout, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function CareGuidesPage() {
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

  // Sample care guides
  const careGuides = [
    {
      title: "Complete Guide to Watering Houseplants",
      excerpt:
        "Learn the proper techniques for watering different types of houseplants to keep them thriving.",
      image:
        "https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=500&q=80",
      category: "Watering",
      readTime: "8 min read",
    },
    {
      title: "Understanding Light Requirements for Indoor Plants",
      excerpt:
        "Discover how to provide the right amount of light for your indoor plants based on their specific needs.",
      image:
        "https://images.unsplash.com/photo-1526397751294-331021109fbd?w=500&q=80",
      category: "Lighting",
      readTime: "10 min read",
    },
    {
      title: "Soil Mixtures for Different Plant Types",
      excerpt:
        "Create the perfect soil mix for your plants with this comprehensive guide to soil components and ratios.",
      image:
        "https://images.unsplash.com/photo-1631528858266-56a9a3b30d0c?w=500&q=80",
      category: "Soil",
      readTime: "12 min read",
    },
    {
      title: "Diagnosing and Treating Common Plant Diseases",
      excerpt:
        "Learn to identify and treat the most common plant diseases to keep your green friends healthy.",
      image:
        "https://images.unsplash.com/photo-1611211232932-da3113c5b960?w=500&q=80",
      category: "Health",
      readTime: "15 min read",
      premium: true,
    },
    {
      title: "Propagation Techniques for Beginners",
      excerpt:
        "Start growing your plant collection with these simple propagation methods that anyone can master.",
      image:
        "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=500&q=80",
      category: "Propagation",
      readTime: "9 min read",
    },
    {
      title: "Seasonal Care Calendar for Houseplants",
      excerpt:
        "Adjust your plant care routine throughout the year with this seasonal guide to houseplant maintenance.",
      image:
        "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=500&q=80",
      category: "Seasonal",
      readTime: "11 min read",
      premium: true,
    },
  ];

  // Featured categories
  const categories = [
    { name: "Watering", icon: <Droplets className="h-5 w-5 text-blue-500" /> },
    { name: "Lighting", icon: <Sun className="h-5 w-5 text-yellow-500" /> },
    {
      name: "Soil & Fertilizer",
      icon: <Sprout className="h-5 w-5 text-green-600" />,
    },
    { name: "Pest Control", icon: <Leaf className="h-5 w-5 text-red-500" /> },
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
                Plant Care Guides
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Expert Care Advice</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Discover comprehensive guides to help you care for your plants and
              keep them thriving year-round.
            </p>

            <div className="max-w-2xl mx-auto relative mb-8">
              <Input
                placeholder="Search care guides..."
                className="pl-10 py-6 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="border-green-200 hover:border-green-300 hover:bg-green-50"
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Featured Care Guides</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {careGuides.map((guide, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all hover:translate-y-[-5px] flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                    {guide.premium && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                        PREMIUM
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="text-white text-sm font-medium bg-green-600/90 px-2 py-1 rounded">
                        {guide.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg mb-2">{guide.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {guide.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">
                        {guide.readTime}
                      </span>
                      <Button
                        variant="link"
                        className="text-green-600 p-0 h-auto font-normal"
                        disabled={guide.premium && !isPremium}
                      >
                        {guide.premium && !isPremium
                          ? "Premium Content"
                          : "Read Guide →"}
                      </Button>
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
                View All Care Guides
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-xl border border-blue-100">
              <h2 className="text-2xl font-bold mb-4">Beginner's Corner</h2>
              <p className="text-gray-600 mb-6">
                New to plant care? Start with our collection of
                beginner-friendly guides covering the basics of plant
                parenthood.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Explore Beginner Guides
              </Button>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-xl border border-amber-100">
              <h2 className="text-2xl font-bold mb-4">Seasonal Care Tips</h2>
              <p className="text-gray-600 mb-6">
                Adjust your plant care routine with the changing seasons using
                our specialized seasonal care guides.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700">
                View Seasonal Guides
              </Button>
            </div>
          </div>

          {!isPremium && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-100 mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Unlock Premium Care Guides
                  </h2>
                  <p className="text-gray-600">
                    Upgrade to premium for access to our complete library of
                    expert care guides, including advanced techniques and
                    specialized plant care.
                  </p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
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
