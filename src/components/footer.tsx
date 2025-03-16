import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources/encyclopedia"
                  className="text-gray-600 hover:text-green-600"
                >
                  Plant Encyclopedia
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/care-guides"
                  className="text-gray-600 hover:text-green-600"
                >
                  Care Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/seasonal-tips"
                  className="text-gray-600 hover:text-green-600"
                >
                  Seasonal Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/blog"
                  className="text-gray-600 hover:text-green-600"
                >
                  Plant Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-green-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/mission"
                  className="text-gray-600 hover:text-green-600"
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-gray-600 hover:text-green-600"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-green-600"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {currentYear} RoheAI. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-green-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-500">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
