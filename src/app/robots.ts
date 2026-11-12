import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localservices.lk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/search", "/providers/"],
        disallow: [
          "/admin",
          "/admin/*",
          "/provider/dashboard",
          "/provider/leads",
          "/provider/verification",
          "/customer/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
