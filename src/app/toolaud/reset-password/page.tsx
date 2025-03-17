import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { resetPasswordAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { FormMessage } from "@/components/form-message";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { message?: string; status?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar />
      <main className="container max-w-md mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
              <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-center dark:text-white">
              Muuda parooli
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Sisesta oma uus parool allpool
            </p>
          </div>

          {searchParams?.message && (
            <FormMessage
              message={searchParams.message}
              type={searchParams?.status || "error"}
              className="mb-4"
            />
          )}

          <form action={resetPasswordAction} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Uus parool
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="w-full"
                placeholder="Vähemalt 8 tähemärki"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Kinnita uus parool
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full"
                placeholder="Korda parooli"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Uuenda parool
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
