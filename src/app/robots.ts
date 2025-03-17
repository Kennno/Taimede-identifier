import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/toolaud/", "/api/", "/resources/"],
    },
    sitemap: "https://roheai.com/sitemap.xml",
  };
}
