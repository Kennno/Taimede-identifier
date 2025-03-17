import { Leaf, Heart, Globe, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-300 font-medium">
              RoheAI-st
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            Millega me tegeleme?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            RoheAI on pühendunud taimeentusiastide abistamisele taimede
            tuvastamisel, mõistmisel ja hooldamisel, kasutades täiustatud
            tehisintellekti tehnoloogiat.
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
                  Tehisintellektil põhinev analüüs taimest
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Lae üles pilt ja saa kohene taime tuvastamine ja
                  terviseülevaade, täpsete tulemustega sekunditega.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Personaalsed hooldusgraafikud{" "}
                  <span className="text-xs font-normal text-amber-600 dark:text-amber-400 ml-2">
                    TULEB VARSTI
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Saa automaatseid meeldetuletusi SMS-i, e-posti või telefoni
                  teavituste kaudu kastmise, väetamise ja muude
                  hooldustoimingute jaoks.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-full mr-4">
                <Globe className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Taimekollektsiooni jälgimine{" "}
                  <span className="text-xs font-normal text-amber-600 dark:text-amber-400 ml-2">
                    TULEB VARSTI
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Digitaalne raamatukogu taimede haldamiseks ja jälgimiseks,
                  koos kasvu jälgimise ja hooldusajalooga.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <Leaf className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  Hariduslikud ressursid{" "}
                  <span className="text-xs font-normal text-amber-600 dark:text-amber-400 ml-2">
                    TULEB VARSTI
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Juurdepääs kasvatamise nõuannetele, kahjuritõrje juhenditele
                  ja ekspertide teadmistele, et aidata sinu taimedel õitseda
                  aastaringselt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
