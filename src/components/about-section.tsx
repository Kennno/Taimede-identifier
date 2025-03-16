import { Leaf, Heart, Globe, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <Leaf className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">About PlantID</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">What We Do</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            PlantID is dedicated to helping plant enthusiasts identify,
            understand, and care for their plants using advanced AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80"
              alt="Plant collection"
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-green-50 p-3 rounded-full mr-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Plant Identification
                </h3>
                <p className="text-gray-600">
                  Our advanced AI can identify thousands of plant species from a
                  single photo, providing accurate results in seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Personalized Care Guides
                </h3>
                <p className="text-gray-600">
                  Get customized care instructions for your specific plants,
                  including watering schedules, light requirements, and soil
                  preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-amber-50 p-3 rounded-full mr-4">
                <Globe className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Global Plant Database
                </h3>
                <p className="text-gray-600">
                  Access our extensive database of plants from around the world,
                  complete with detailed information and care tips.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-50 p-3 rounded-full mr-4">
                <Leaf className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Seasonal Care Tips
                </h3>
                <p className="text-gray-600">
                  Get specialized care advice based on the season to help your
                  plants thrive year-round with changing conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
