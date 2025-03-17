import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Milestone, RoadmapTimeline } from "@/components/roadmap-timeline";
import { RocketIcon, MapIcon } from "lucide-react";

export default async function TegevuskavaPage() {
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
      title: "Taime tuvastamine",
      description:
        "Tehisintellektil põhinev taimetuvastus koos üksikasjaliku hooldusteabega",
      status: "completed",
      icon: "Leaf",
    },
    {
      title: "Taimede kogu",
      description: "Jälgi ja korralda oma taimi digitaalses raamatukogus",
      status: "in-progress",
      icon: "Sprout",
    },
    {
      title: "Taimede hoolduse ajakava",
      description:
        "Isikupärastatud meeldetuletused SMS-i, e-posti või telefoni teavituste kaudu",
      status: "planned",
      icon: "Bell",
    },
    {
      title: "Isikupärastatud kasvusoovitused",
      description:
        "Kohandatud nõuanded vastavalt teie taime konkreetsetele vajadustele ja keskkonnale",
      status: "planned",
      icon: "LineChart",
    },
    {
      title: "Ilmastikupõhised hoiatused",
      description: "Nutikad teavitused kohalike ilmastikutingimuste põhjal",
      status: "planned",
      icon: "Cloud",
    },
    {
      title: "Taimede entsüklopeedia",
      description: "Põhjalik taimede andmebaas üksikasjaliku teabega",
      status: "planned",
      icon: "BookOpen",
    },
    {
      title: "Mitme kasutaja ja perekonna juurdepääs",
      description: "Jaga taimede hooldamise kohustusi pereliikmete vahel",
      status: "planned",
      icon: "Users",
    },
    {
      title: "Mängustamine ja saavutused",
      description: "Teeni auhindu ja jälgi edusamme, kui sinu taimed õitsevad",
      status: "planned",
      icon: "Trophy",
    },
    {
      title: "Liitreaalsuse taimede paigutus",
      description:
        "Visualiseeri, kuidas taimed näevad välja sinu ruumis enne ostmist",
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
                Meie visioon
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-6 dark:text-white">
              Toote tegevuskava
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tutvu meie teekonnaga, et luua parim taimede hooldamise kogemus.
              Vaata, millised funktsioonid on praegu saadaval ja mis on peagi
              tulemas RoheAI-sse.
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
                Aita kujundada meie tulevikku
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Töötame pidevalt RoheAI parendamisel ja uute funktsioonide
              lisamisel, mis muudavad taimede hooldamise lihtsamaks ja
              nauditavamaks. Sinu tagasiside on hindamatu, aidates meil
              prioriseerida, mida järgmisena ehitada.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Kas sul on funktsiooni soov?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Meil oleks hea meel kuulda sinu ideid uute funktsioonide või
                  olemasolevate parenduste kohta.
                </p>
                <a
                  href="/kontakt"
                  className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  Esita oma ideed
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
                  Liitu meie kogukonnaga
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Ühenda teiste taimeentusiastidega ja jaga oma kogemusi
                  RoheAI-ga.
                </p>
                <a
                  href="/kontakt"
                  className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  Võta meiega ühendust
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
