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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/30 dark:to-gray-900">
      <Navbar user={user} isPremium={isPremium} />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-300 font-medium">
                Meie missioon
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-6 dark:text-white">
              Ühendame inimesi taimedega
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meie missioon on aidata inimestel taimi tuvastada, mõista ja
              hooldada, luues sügavama sideme loodusliku maailmaga.
            </p>
          </div>

          <div className="mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-90 rounded-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80"
              alt="Taimed looduses"
              className="w-full h-96 object-cover rounded-xl"
              style={{ opacity: 0.3 }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white p-8">
              <div className="max-w-2xl text-center">
                <h2 className="text-3xl font-bold mb-4">Meie visioon</h2>
                <p className="text-xl">
                  Näeme ette maailma, kus igaühel on teadmised ja tööriistad
                  taimede edukaks tuvastamiseks ja hooldamiseks, luues
                  rohelisemaid ruume ja edendades keskkonnateadlikkust RoheAI
                  abil.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center dark:text-white">
                <Heart className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                Miks taimed on olulised
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300">
                  Taimed on meie eksisteerimiseks hädavajalikud. Nad pakuvad
                  hapnikku, toitu, ravimeid, materjale ja lugematul hulgal
                  ökosüsteemi teenuseid. Lisaks nende praktilistele eelistele
                  parandavad taimed meie heaolu, vähendavad stressi ja toovad
                  ilu meie keskkonda.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Vaatamata nende tähtsusele puuduvad paljudel inimestel
                  teadmised taimede tuvastamiseks või nende õigeks hooldamiseks.
                  See lahknevus on viinud bioloogilise mitmekesisuse
                  vähenemiseni ja inimestel on jäänud kasutamata võimalused
                  taimedega suhete loomiseks.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  RoheAI-s töötame selle lünga ületamiseks, muutes taimede
                  tuvastamise ja hooldusteadmised kõigile kättesaadavaks
                  tehnoloogia abil.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center dark:text-white">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                Meie lähenemine
              </h2>
              <ul className="space-y-4">
                <li className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                  <h3 className="font-semibold mb-1 dark:text-white">
                    Täiustatud tehnoloogia
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Kasutame tipptasemel tehisintellekti, et pakkuda täpseid
                    taimede tuvastamisi lihtsate fotode põhjal.
                  </p>
                </li>
                <li className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <h3 className="font-semibold mb-1 dark:text-white">
                    Ekspertteadmised
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Meie andmebaas ühendab botaanilist ekspertiisi praktiliste
                    hooldusnõuannetega, mis on kohandatud igale liigile.
                  </p>
                </li>
                <li className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
                  <h3 className="font-semibold mb-1 dark:text-white">
                    Kasutajakeskne disain
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Loome intuitiivseid tööriistu, mis teevad taimehoolduse
                    algajatele kättesaadavaks ja ekspertidele väärtuslikuks.
                  </p>
                </li>
                <li className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                  <h3 className="font-semibold mb-1 dark:text-white">
                    Pidev täiustamine
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Täiustame pidevalt oma tuvastamisalgoritme ja laiendame
                    taimeandmebaasi.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl border border-green-100 dark:border-green-800 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
              Meie kohustused
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="bg-green-100 dark:bg-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">
                  Keskkonnaharidus
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Edendame teadmisi taimede bioloogilisest mitmekesisusest ja
                  kaitsest meie platvormi kaudu.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 dark:bg-blue-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">
                  Jätkusuutlikkus
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Juhime oma ettevõtet minimaalse keskkonnamõjuga ja edendame
                  jätkusuutlikke taimehoolduse tavasid.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">
                  Kättesaadavus
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Teeme taimeteadmised kättesaadavaks kõigile, olenemata
                  kogemusest või taustast.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Liitu meie missiooniga
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Olenemata sellest, kas oled taimealgaja või kogenud aednik,
              kutsume sind liituma meiega rohelisema ja ühendatuma maailma
              loomisel.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Alusta taimede tuvastamist
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
