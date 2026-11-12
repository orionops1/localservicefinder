import { MetadataRoute } from "next";
import { CATEGORIES, DEMO_PROVIDERS } from "@/lib/data/seed-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localservices.lk";
  const now = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/safety`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Category pages
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/services/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Provider profile pages
  const providerRoutes: MetadataRoute.Sitemap = DEMO_PROVIDERS.map((p) => ({
    url: `${baseUrl}/providers/${p.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...providerRoutes];
}
