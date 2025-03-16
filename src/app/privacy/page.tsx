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
                Privacy Policy
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-6 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last Updated: July 10, 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300">
              At RoheAI, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our plant identification service.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We collect information that you provide directly to us when using
              our service, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 my-4">
              <li>
                <strong className="font-semibold">Account Information:</strong>{" "}
                When you create an account, we collect your name, email address,
                and password.
              </li>
              <li>
                <strong className="font-semibold">User Content:</strong> This
                includes plant images you upload for identification and any
                information you provide about your plants.
              </li>
              <li>
                <strong className="font-semibold">Payment Information:</strong>{" "}
                If you subscribe to our premium service, we collect payment
                details, which are processed by our secure payment processor.
              </li>
              <li>
                <strong className="font-semibold">Usage Data:</strong> We
                collect information about how you interact with our service,
                including the features you use and the time spent on the
                platform.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 my-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze trends and usage</li>
              <li>
                Detect, investigate, and prevent fraudulent transactions and
                other illegal activities
              </li>
              <li>Personalize your experience</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Sharing Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 my-4">
              <li>
                <strong className="font-semibold">Service Providers:</strong>{" "}
                Third-party vendors who provide services on our behalf, such as
                payment processing and data analysis.
              </li>
              <li>
                <strong className="font-semibold">Business Partners:</strong>{" "}
                Companies we partner with to offer integrated services or
                promotions.
              </li>
              <li>
                <strong className="font-semibold">Legal Requirements:</strong>{" "}
                When required by law or to protect our rights and safety.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no method of
              transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 my-4">
              <li>Accessing your personal information</li>
              <li>Correcting inaccurate information</li>
              <li>Deleting your information</li>
              <li>Restricting or objecting to processing</li>
              <li>Data portability</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please
              contact us at privacy@roheai.com.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
