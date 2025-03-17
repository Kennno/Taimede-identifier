"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Help Column */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Abi
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/kontakt"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Kontakt{" "}
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    const pricingSection = document.getElementById("pricing");
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Hinnad
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Privaatsuspoliitika
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Ettevõte
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#about"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    const aboutSection = document.getElementById("about");
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Meist
                </a>
              </li>
              <li>
                <Link
                  href="/mission"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Missioon
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {currentYear} RoheAI. Kõik õigused kaitstud.
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-primary dark:hover:text-primary/80"
              aria-label="Twitter"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary dark:hover:text-primary/80"
              aria-label="LinkedIn"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary dark:hover:text-primary/80"
              aria-label="GitHub"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
