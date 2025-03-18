import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Shield } from "lucide-react";

export default async function PrivacyPage() {
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-300 font-medium">
                Privaatsuspoliitika
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-6 dark:text-white">
              Privaatsuspoliitika
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Viimati uuendatud: 10. juuli 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300">
              RoheAI-s võtame teie privaatsust tõsiselt. See privaatsuspoliitika
              selgitab, kuidas me kogume, kasutame, avaldame ja kaitseme teie
              teavet, kui kasutate meie taimede tuvastamise teenust.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Teave, mida me kogume
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Kogume teavet, mida te meile otse esitate teenuse kasutamisel,
              sealhulgas:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 my-4">
              <li>
                <strong className="font-semibold">Konto teave:</strong> Konto
                loomisel kogume teie nime, e-posti aadressi ja parooli.
              </li>
              <li>
                <strong className="font-semibold">Kasutaja sisu:</strong> See
                hõlmab taimede pilte, mille te tuvastamiseks üles laadite, ja
                kogu teavet, mida te oma taimede kohta esitate.
              </li>
              <li>
                <strong className="font-semibold">Makseteave:</strong> Kui
                tellite meie premium-teenuse, kogume makseandmeid, mida töötleb
                meie turvaline makseteenuse pakkuja.
              </li>
              <li>
                <strong className="font-semibold">Kasutusandmed:</strong> Kogume
                teavet selle kohta, kuidas te meie teenusega suhtlete,
                sealhulgas kasutatavad funktsioonid ja platvormil veedetud aeg.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Kuidas me teie teavet kasutame
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Kasutame kogutud teavet selleks, et:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 my-4">
              <li>Pakkuda, hooldada ja parandada meie teenuseid</li>
              <li>Töödelda ja lõpetada tehinguid</li>
              <li>Saata teile tehnilisi teateid, uuendusi ja tugisõnumeid</li>
              <li>Vastata teie kommentaaridele ja küsimustele</li>
              <li>Arendada uusi tooteid ja teenuseid</li>
              <li>Jälgida ja analüüsida trende ja kasutust</li>
              <li>
                Tuvastada, uurida ja ennetada pettusi ja muid ebaseaduslikke
                tegevusi
              </li>
              <li>Isikupärastada teie kogemust</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Teie teabe jagamine
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Võime jagada teie teavet:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 my-4">
              <li>
                <strong className="font-semibold">Teenusepakkujad:</strong>{" "}
                Kolmandate osapoolte müüjad, kes pakuvad teenuseid meie nimel,
                näiteks maksete töötlemine ja andmeanalüüs.
              </li>
              <li>
                <strong className="font-semibold">Äripartnerid:</strong>{" "}
                Ettevõtted, kellega teeme koostööd integreeritud teenuste või
                kampaaniate pakkumiseks.
              </li>
              <li>
                <strong className="font-semibold">Seaduslikud nõuded:</strong>{" "}
                Kui seadus seda nõuab või meie õiguste ja turvalisuse
                kaitsmiseks.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Andmete turvalisus
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Rakendame asjakohaseid tehnilisi ja organisatsioonilisi meetmeid
              teie isikuandmete kaitsmiseks. Siiski ei ole ükski Interneti kaudu
              edastamise meetod 100% turvaline ja me ei saa garanteerida
              absoluutset turvalisust.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Teie õigused
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Sõltuvalt teie asukohast võivad teil olla teatud õigused seoses
              oma isikuandmetega, sealhulgas:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 my-4">
              <li>Juurdepääs oma isikuandmetele</li>
              <li>Ebatäpsete andmete parandamine</li>
              <li>Oma andmete kustutamine</li>
              <li>Töötlemise piiramine või sellele vastuväidete esitamine</li>
              <li>Andmete ülekandmine</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Muudatused selles poliitikas
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Võime seda privaatsuspoliitikat aeg-ajalt uuendada. Teavitame teid
              muudatustest, postitades uue poliitika sellele lehele ja uuendades
              "Viimati uuendatud" kuupäeva.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Võtke meiega ühendust
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Kui teil on küsimusi selle privaatsuspoliitika kohta, võtke meiega
              ühendust aadressil contact@roheai.ee.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
