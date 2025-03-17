import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  let cookieStore;

  try {
    cookieStore = cookies();
  } catch (error) {
    console.error("Error accessing cookies store:", error);
    // Return a client with minimal functionality when cookies are not available
    return createServerClient(
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

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll().map(({ name, value }) => ({
              name,
              value,
            }));
          } catch (error) {
            // If cookies() is called in an environment where it's not allowed
            console.error("Error accessing cookies:", error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            // Only attempt to set cookies in a server action or route handler context
            // This prevents the error when cookies are accessed in other contexts
            if (typeof cookieStore.set === "function") {
              cookiesToSet.forEach(({ name, value, options }) => {
                try {
                  cookieStore.set(name, value, options);
                } catch (cookieError) {
                  console.error(`Error setting cookie ${name}:`, cookieError);
                }
              });
            } else {
              // In contexts where cookies can't be set, log but don't throw
              console.log(
                "Skipping cookie setting - not in a server action or route handler context",
              );
              return false; // Indicate that cookies weren't set
            }
            return true; // Indicate that cookies were set successfully
          } catch (error) {
            console.error("Error setting cookies:", error);
            return false; // Indicate that cookies weren't set due to an error
          }
        },
      },
    },
  );
};
