import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormClient } from "@/components/contact-form-client";

export default async function KontaktPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/30 dark:to-gray-900">
      <Navbar user={user} isPremium={isPremium} />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
              <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-300 font-medium">
                Võta meiega ühendust
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-6 dark:text-white">
              Võta ühendust
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Kas sul on küsimusi RoheAI kohta? Oleme siin, et aidata! Võta meie
              meeskonnaga ühendust alloleva vormi kaudu või meie kontaktandmete
              kaudu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="col-span-2 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                Saada meile sõnum
              </h2>
              <form
                className="space-y-6"
                id="contact-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Sinu nimi
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jaan Tamm"
                      required
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      E-posti aadress
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jaan@näide.ee"
                      required
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Teema
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Kuidas saame sind aidata?"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Sõnum
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Sinu sõnum siia..."
                    required
                    className="resize-none bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 w-full md:w-auto"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Saada sõnum
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  Kontaktandmed
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full mr-3">
                      <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        E-post
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        tugi@roheai.näide.ee
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full mr-3">
                      <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Telefon
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        +372 5123 4567
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full mr-3">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Kontor
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Roheline tänav 123
                        <br />
                        Tallinn, 10115
                        <br />
                        Eesti
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                <h2 className="text-xl font-bold mb-4 text-green-800 dark:text-green-300">
                  Tugiteenuse ajad
                </h2>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Esmaspäev - Reede:
                    </span>
                    <span className="font-medium dark:text-white">
                      9:00 - 18:00
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Laupäev:
                    </span>
                    <span className="font-medium dark:text-white">
                      10:00 - 16:00
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Pühapäev:
                    </span>
                    <span className="font-medium dark:text-white">Suletud</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Premium-kasutajad saavad prioriteetse toe kiiremate
                    vastustega.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
              Korduma kippuvad küsimused
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "Kui täpne on taime tuvastamine?",
                  answer:
                    "Meie tehisintellekt suudab tuvastada tuhandeid taimeliike üle 95% täpsusega tavaliste taimede puhul. Foto kvaliteet mõjutab oluliselt täpsust.",
                },
                {
                  question: "Mitu tuvastust saan tasuta kontoga?",
                  answer:
                    "Tasuta registreeritud kontod sisaldavad 5 taime tuvastust kuus. Premium-tellijad saavad nautida piiramatuid tuvastusi.",
                },
                {
                  question:
                    "Kas saan oma premium-tellimuse igal ajal tühistada?",
                  answer:
                    "Jah, saad oma tellimuse igal ajal tühistada. Sul on jätkuvalt premium-juurdepääs kuni arveldusperioodi lõpuni.",
                },
                {
                  question: "Millist teavet saan pärast taime tuvastamist?",
                  answer:
                    "Saad taime nime, teadusliku nime, hooldusnõuded (vesi, valgus, muld), kasvuharjumused ja tervisehinnangu, kui see on asjakohane.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="font-bold text-lg mb-2 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ContactFormClient />
    </div>
  );
}
