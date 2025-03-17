import { Metadata } from "next";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Meist | TaimeTark",
  description: "Loe lähemalt TaimeTarga meeskonnast ja meie missioonist.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Meist</h1>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Meie lugu</h2>
            <p className="mb-4">
              TaimeTark sündis armastusest taimede vastu ja soovist muuta
              taimede tuvastamine ja hooldamine kõigile kättesaadavaks. Meie
              meeskond koosneb taimeentusiastidest ja tehnoloogiahuvilistest,
              kes usuvad, et tehisintellekt võib aidata inimestel luua paremat
              sidet loodusega.
            </p>
            <p>
              Alustasime 2023. aastal lihtsa ideega: luua rakendus, mis aitaks
              inimestel tuvastada taimi ja saada personaalseid hooldusnõuandeid.
              Täna oleme kasvanud Eesti juhtivaks taimetuvastuse platvormiks,
              mis ühendab kaasaegse tehisintellekti ja põhjalikud teadmised
              taimedest.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Meie missioon</h2>
            <p>
              Meie missioon on aidata inimestel luua tervislikum ja rohelisem
              elukeskkond, pakkudes lihtsasti kasutatavat tööriista taimede
              tuvastamiseks ja hooldamiseks. Usume, et igaüks väärib võimalust
              nautida taimede kasvatamise rõõmu, olenemata varasemast kogemusest
              või teadmistest.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Meie väärtused</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Keskkonnateadlikkus</strong> - Edendame jätkusuutlikku
                eluviisi ja austust looduse vastu.
              </li>
              <li>
                <strong>Kättesaadavus</strong> - Teeme taimetarkuse
                kättesaadavaks kõigile, olenemata kogemusest.
              </li>
              <li>
                <strong>Innovatsioon</strong> - Kasutame kaasaegseid
                tehnoloogiaid, et pakkuda parimat kasutajakogemust.
              </li>
              <li>
                <strong>Täpsus</strong> - Püüdleme pidevalt täpsema
                taimetuvastuse ja kvaliteetsema info poole.
              </li>
              <li>
                <strong>Kogukond</strong> - Loome taimesõprade kogukonda, kus
                teadmisi ja kogemusi jagada.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Võta meiega ühendust
            </h2>
            <p className="mb-4">
              Kui sul on küsimusi, tagasisidet või koostööettepanekuid, siis
              võta meiega julgelt ühendust. Oleme alati avatud uutele ideedele
              ja võimalustele.
            </p>
            <p>
              <a href="/kontakt" className="text-primary hover:underline">
                Kirjuta meile &rarr;
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
