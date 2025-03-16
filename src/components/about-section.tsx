import { Leaf, Heart, Globe, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-300 font-medium">
              About RoheAI
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            What We Do
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            RoheAI is dedicated to helping plant enthusiasts identify,
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
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-full mr-4">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  AI-Powered Plant Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload a picture and get instant plant identification and
                  health insights, with accurate results in seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Personalized Care Schedules{" "}
                  <span className="text-xs font-normal text-amber-600 dark:text-amber-400 ml-2">
                    Coming Soon
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get automated reminders via SMS, email, or phone notifications
                  for watering, fertilizing, and other care tasks.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-full mr-4">
                <Globe className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Plant Collection Tracking{" "}
                  <span className="text-xs font-normal text-amber-600 dark:text-amber-400 ml-2">
                    Coming Soon
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A digital library for managing and logging your plants,
                  complete with growth tracking and care history.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <Leaf className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Educational Resources{" "}
                  <span className="text-xs font-normal text-amber-600 dark:text-amber-400 ml-2">
                    Coming Soon
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access growing tips, pest management guides, and expert
                  insights to help your plants thrive year-round.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
