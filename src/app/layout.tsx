import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ScrollToTop from "@/components/scroll-to-top";
import CookieConsent from "@/components/cookie-consent";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://roheai.com"),
  title: {
    default: "RoheAI - Tehisintellektil põhinev taimede tuvastamine",
    template: "%s | RoheAI Taimede Tuvastamine",
  },
  description:
    "Tuvasta taimed koheselt meie tehisintellekti tehnoloogiaga. Saa üksikasjalikud hooldusjuhised, kastmisgraafikud ja kasvunõuanded iga taime jaoks.",
  keywords: [
    "taimede tuvastamine",
    "taimehooldus",
    "tehisintellekti taimede tuvastamine",
    "taimerakendus",
    "taimehoolduse näpunäited",
    "toataimed",
    "aiataimed",
    "taimede kastmisgraafik",
    "taimede valgusnõuded",
    "taimede mullavajadused",
    "taimede kasvunõuanded",
  ],
  authors: [{ name: "RoheAI Meeskond" }],
  creator: "RoheAI",
  publisher: "RoheAI",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "et_EE",
    url: "https://roheai.com",
    title: "RoheAI - Tehisintellektil põhinev taimede tuvastamine",
    description:
      "Tuvasta taimed koheselt meie tehisintellekti tehnoloogiaga. Saa üksikasjalikud hooldusjuhised iga taime jaoks.",
    siteName: "RoheAI",
    images: [
      {
        url: "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9a?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "RoheAI Taimede Tuvastamine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoheAI - Tehisintellektil põhinev taimede tuvastamine",
    description:
      "Tuvasta taimed koheselt meie tehisintellekti tehnoloogiaga. Saa üksikasjalikud hooldusjuhised iga taime jaoks.",
    images: [
      "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9a?w=1200&q=80",
    ],
    creator: "@roheai",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et" suppressHydrationWarning className="dark:bg-gray-950">
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body
        className={`${inter.className} bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen transition-colors duration-200`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {children}
            <TempoInit />
            <ScrollToTop />
            <CookieConsent />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
