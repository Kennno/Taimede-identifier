import { createClient as createClientBrowser } from "../supabase/client";
import { createServerClient } from "../supabase/server";

// Use this for client components
export const createClient = createClientBrowser;

// Use this for server components
export const createServerSideClient = async () => {
  return createServerClient();
};
