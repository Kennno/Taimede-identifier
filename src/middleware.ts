import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl.clone();

  // Check for language query parameter
  const languageParam = url.searchParams.get("language");
  if (languageParam === "en" || languageParam === "et") {
    // Set the language cookie based on query parameter
    response.cookies.set("language", languageParam, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    // Remove the language parameter from URL and redirect
    url.searchParams.delete("language");
    return NextResponse.redirect(url);
  }

  // Check if language cookie exists
  const languageCookie = request.cookies.get("language");

  // If no language cookie is set, try to detect from Accept-Language header
  if (!languageCookie) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const userCountry = request.geo?.country || "";

    // Set language based on country or Accept-Language header
    let language = "en";

    // If user is from Estonia, set language to Estonian
    if (userCountry === "EE") {
      language = "et";
    }
    // Otherwise check Accept-Language header
    else if (acceptLanguage.includes("et")) {
      language = "et";
    }

    // Set the language cookie
    response.cookies.set("language", language, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
