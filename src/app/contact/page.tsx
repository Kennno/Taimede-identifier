import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function ContactPage() {
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
              <Mail className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Contact Us</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about RoheAI? We're here to help! Reach out to our
              team using the form below or through our contact information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Your message here..."
                    required
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600">
                        support@roheai.example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Office</h3>
                      <p className="text-gray-600">
                        123 Green Street
                        <br />
                        San Francisco, CA 94158
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h2 className="text-xl font-bold mb-4">Support Hours</h2>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-600">
                    Premium users receive priority support with faster response
                    times.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "How accurate is the plant identification?",
                  answer:
                    "Our AI can identify thousands of plant species with over 95% accuracy for common plants. The quality of the photo greatly affects accuracy.",
                },
                {
                  question:
                    "How many identifications do I get with a free account?",
                  answer:
                    "Free registered accounts include 5 plant identifications per month. Premium subscribers enjoy unlimited identifications.",
                },
                {
                  question: "Can I cancel my premium subscription anytime?",
                  answer:
                    "Yes, you can cancel your subscription at any time. You'll continue to have premium access until the end of your billing period.",
                },
                {
                  question:
                    "What information do I get after identifying a plant?",
                  answer:
                    "You'll receive the plant's name, scientific name, care requirements (water, light, soil), growth habits, and health assessment if applicable.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200"
                >
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
