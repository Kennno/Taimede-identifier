import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    // If this is a new user from OAuth, create a user profile
    if (data?.user && !error) {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("user_id", data.user.id)
        .single();

      // If user doesn't exist in our users table, create a profile
      if (!existingUser) {
        await supabase.from("users").insert({
          user_id: data.user.id,
          name:
            data.user.user_metadata.full_name || data.user.email?.split("@")[0],
          email: data.user.email,
          token_identifier: data.user.id,
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  // URL to redirect to after sign in process completes
  const redirectTo = redirect_to || "/";
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}
