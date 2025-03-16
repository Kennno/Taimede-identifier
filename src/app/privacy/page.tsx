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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar user={user} isPremium={isPremium} />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Privacy Policy</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: July 10, 2024</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              At PlantID, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our plant identification service.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when using
              our service, including:
            </p>
            <ul>
              <li>
                <strong>Account Information:</strong> When you create an
                account, we collect your name, email address, and password.
              </li>
              <li>
                <strong>User Content:</strong> This includes plant images you
                upload for identification and any information you provide about
                your plants.
              </li>
              <li>
                <strong>Payment Information:</strong> If you subscribe to our
                premium service, we collect payment details, which are processed
                by our secure payment processor.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about how
                you interact with our service, including the features you use
                and the time spent on the platform.
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
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

            <h2>Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> We work with third-party
                service providers who perform services on our behalf, such as
                payment processing, data analysis, email delivery, and hosting
                services.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we are involved in a
                merger, acquisition, or sale of assets, your information may be
                transferred as part of that transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your
                information if required to do so by law or in response to valid
                requests by public authorities.
              </li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect the security of your personal information. However, please
              be aware that no method of transmission over the Internet or
              method of electronic storage is 100% secure.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul>
              <li>
                The right to access and receive a copy of your personal
                information
              </li>
              <li>The right to rectify or update your personal information</li>
              <li>The right to delete your personal information</li>
              <li>
                The right to restrict processing of your personal information
              </li>
              <li>The right to data portability</li>
              <li>
                The right to object to processing of your personal information
              </li>
            </ul>

            <h2>Children's Privacy</h2>
            <p>
              Our service is not directed to children under the age of 13, and
              we do not knowingly collect personal information from children
              under 13. If we learn that we have collected personal information
              from a child under 13, we will take steps to delete such
              information.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last Updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p>
              Email: privacy@plantid.example.com
              <br />
              Address: 123 Green Street, San Francisco, CA 94158, United States
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
