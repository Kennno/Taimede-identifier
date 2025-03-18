import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  Leaf,
  Upload,
  History,
  Settings,
  CreditCard,
  Lock,
} from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AIAssistant from "@/components/ai-assistant";
import { SubscriptionButtonHandler } from "../dashboard/client-components";
import { AccountClient } from "@/components/account-client";

export default async function Toolaud() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get subscription status
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <SubscriptionButtonHandler />
      <AccountClient />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col items-center text-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Minu taimede töölaud</h1>
              <p className="text-gray-600 max-w-lg mx-auto mt-2">
                Halda oma tuvastatud taimi ja jälgi nende hooldust
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 mt-2" asChild>
              <a href="/">
                <Upload className="mr-2 h-4 w-4" />
                Tuvasta uus taim
              </a>
            </Button>
          </header>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="flex justify-center mb-8 border-b w-full max-w-2xl mx-auto">
              <TabsTrigger value="account" className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                Konto
              </TabsTrigger>
              <TabsTrigger
                value="collection"
                className="flex items-center"
                disabled
              >
                <Leaf className="mr-2 h-4 w-4" />
                Minu kogu
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center"
                disabled
              >
                <History className="mr-2 h-4 w-4" />
                Hiljutised otsingud
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Arveldus
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-green-600" />
                        <span>Profiil</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <UserCircle className="w-16 h-16 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold">
                          {profile?.name || user.email?.split("@")[0]}
                        </h3>
                        <p className="text-gray-500">{user.email}</p>

                        <div className="mt-6 w-full">
                          <Button className="w-full" asChild>
                            <a href="/toolaud/reset-password">Muuda parooli</a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-green-600" />
                        <span>Konto seaded</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="pt-4 border-t">
                          <h3 className="text-lg font-medium mb-2">
                            Ühendatud kontod
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Ühenda oma konto teiste teenustega
                          </p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Google</span>
                              <Button variant="outline" size="sm">
                                Ühenda
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="collection" className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-center h-64 flex-col space-y-4">
                  <Lock className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                    Kogu funktsioon pole saadaval
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    See funktsioon on praegu hoolduses. Palun vaata hiljem
                    uuesti.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-center h-64 flex-col space-y-4">
                  <Lock className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                    Hiljutised otsingud pole saadaval
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    See funktsioon on praegu hoolduses. Palun vaata hiljem
                    uuesti.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span>Tellimus</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
                          {subscription ? "Aktiivne" : "Tasuta pakett"}
                        </div>

                        <h3 className="text-2xl font-bold mb-1 dark:text-white">
                          {subscription ? "Premium pakett" : "Tasuta pakett"}
                        </h3>

                        {subscription ? (
                          <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Uueneb{" "}
                            {new Date(
                              subscription.current_period_end * 1000,
                            ).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Piiratud funktsioonid saadaval
                          </p>
                        )}

                        <Button className="w-full" asChild>
                          <a href="#" data-action="manage-subscription">
                            {subscription
                              ? "Halda tellimust"
                              : "Uuenda Premium-paketile"}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="dark:text-white">
                        Maksete ajalugu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {subscription ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium dark:text-white">
                                Premium pakett
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(
                                  subscription.current_period_start * 1000,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="font-medium dark:text-white">
                              ${subscription.amount / 100}.00
                            </p>
                          </div>

                          <div className="text-center mt-8">
                            <Button
                              variant="outline"
                              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                              Vaata kõiki tehinguid
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Maksete ajalugu pole saadaval
                          </p>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            asChild
                          >
                            <a href="#" data-action="view-pricing-plans">
                              Vaata hinnaplaane
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <AIAssistant user={user} isPremium={subscription ? true : false} />
    </SubscriptionCheck>
  );
}
