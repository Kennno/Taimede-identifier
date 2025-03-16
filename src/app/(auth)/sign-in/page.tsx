import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function SignInPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return redirect("/dashboard");
  }

  // Otherwise redirect to home page where they can use the auth modal
  return redirect("/");
}
