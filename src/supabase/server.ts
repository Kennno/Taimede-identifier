import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/cookies";

// This function should only be used in server components or API routes
export const createServerClient = async () => {
  let cookieStore: ReadonlyRequestCookies | null = null;

  try {
    cookieStore = cookies();
  } catch (error) {
    console.error("Error accessing cookies store:", error);
    // Return a client with minimal functionality when cookies are not available
    return createSupabaseServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {
            return false;
          },
        },
      },
    );
  }

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return (
              cookieStore?.getAll().map(({ name, value }) => ({
                name,
                value,
              })) || []
            );
          } catch (error) {
            // If cookies() is called in an environment where it's not allowed
            console.error("Error accessing cookies:", error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          // Don't attempt to set cookies in server components
          // Only middleware, server actions, and route handlers can set cookies
          // Return false to indicate cookies weren't set, but don't throw an error
          // This prevents the auth refresh errors from appearing in the console
          return false;
        },
      },
    },
  );
};
