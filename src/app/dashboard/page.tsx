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
import { SubscriptionButtonHandler } from "./client-components";

export default async function Dashboard() {
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
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col items-center text-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Plant Dashboard</h1>
              <p className="text-gray-600 max-w-lg mx-auto mt-2">
                Manage your identified plants and track their care
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 mt-2" asChild>
              <a href="/">
                <Upload className="mr-2 h-4 w-4" />
                Identify New Plant
              </a>
            </Button>
          </header>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="flex justify-center mb-8 border-b w-full max-w-2xl mx-auto">
              <TabsTrigger value="account" className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger
                value="collection"
                className="flex items-center"
                disabled
              >
                <Leaf className="mr-2 h-4 w-4" />
                My Collection
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center"
                disabled
              >
                <History className="mr-2 h-4 w-4" />
                Recent Searches
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-green-600" />
                        <span>Profile</span>
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
                            <a href="/dashboard/reset-password">
                              Change Password
                            </a>
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
                        <span>Account Settings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="pt-4 border-t">
                          <h3 className="text-lg font-medium mb-2">
                            Connected Accounts
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Connect your account with other services
                          </p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Google</span>
                              <Button variant="outline" size="sm">
                                Connect
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h3 className="text-lg font-medium mb-2 text-red-600">
                            Danger Zone
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Permanent actions that cannot be undone
                          </p>

                          <Button variant="destructive">Delete Account</Button>
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
                    Collections Feature Unavailable
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    This feature is currently under maintenance. Please check
                    back later.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-center h-64 flex-col space-y-4">
                  <Lock className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                    Recent Searches Unavailable
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    This feature is currently under maintenance. Please check
                    back later.
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
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <span>Subscription</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                          {subscription ? "Active" : "Free Plan"}
                        </div>

                        <h3 className="text-2xl font-bold mb-1">
                          {subscription ? "Premium Plan" : "Free Plan"}
                        </h3>

                        {subscription ? (
                          <p className="text-gray-500 mb-6">
                            Renews on{" "}
                            {new Date(
                              subscription.current_period_end * 1000,
                            ).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-gray-500 mb-6">
                            Limited features available
                          </p>
                        )}

                        <Button className="w-full" asChild>
                          <a href="#" data-action="manage-subscription">
                            {subscription
                              ? "Manage Subscription"
                              : "Upgrade to Premium"}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {subscription ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Premium Plan</p>
                              <p className="text-sm text-gray-500">
                                {new Date(
                                  subscription.current_period_start * 1000,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="font-medium">
                              ${subscription.amount / 100}.00
                            </p>
                          </div>

                          <div className="text-center mt-8">
                            <Button variant="outline">
                              View All Transactions
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">
                            No payment history available
                          </p>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            asChild
                          >
                            <a href="#" data-action="view-pricing-plans">
                              View Pricing Plans
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
