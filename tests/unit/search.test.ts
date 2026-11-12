import { describe, it, expect } from "vitest";
import { searchProviders, getProviderBySlug } from "@/features/discovery/search-service";

describe("Customer Discovery & Search Service", () => {
  it("returns all approved providers when no filter is provided", async () => {
    const result = await searchProviders({});
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.length).toBe(result.total);
    result.items.forEach((item) => {
      expect(item.status).toBe("approved");
    });
  });

  it("filters providers accurately by keyword query", async () => {
    const result = await searchProviders({ q: "plumbing" });
    expect(result.total).toBeGreaterThan(0);
    result.items.forEach((item) => {
      const match =
        item.name.toLowerCase().includes("plumbing") ||
        item.description.toLowerCase().includes("plumbing") ||
        item.categories.some((c) => c.toLowerCase().includes("plumbing")) ||
        item.featured_services.some((s) => s.toLowerCase().includes("plumbing"));
      expect(match).toBe(true);
    });
  });

  it("filters providers by category slug", async () => {
    const result = await searchProviders({ category: "plumbing" });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.some((p) => p.slug === "southern-coastal-plumbing")).toBe(true);
  });

  it("filters providers by district", async () => {
    const result = await searchProviders({ district: "galle" });
    expect(result.total).toBeGreaterThan(0);
    result.items.forEach((p) => {
      expect(p.district.toLowerCase()).toBe("galle");
    });
  });

  it("filters providers with verifiedOnly toggle", async () => {
    const result = await searchProviders({ verifiedOnly: true });
    result.items.forEach((p) => {
      expect(p.badges.length).toBeGreaterThan(0);
    });
  });

  it("filters providers by minimum rating", async () => {
    const result = await searchProviders({ minRating: 4.8 });
    result.items.forEach((p) => {
      expect(p.rating_summary.average_rating).toBeGreaterThanOrEqual(4.8);
    });
  });

  it("sorts providers by highest rating", async () => {
    const result = await searchProviders({ sort: "rating" });
    for (let i = 0; i < result.items.length - 1; i++) {
      expect(result.items[i].rating_summary.average_rating).toBeGreaterThanOrEqual(
        result.items[i + 1].rating_summary.average_rating
      );
    }
  });

  it("retrieves a single provider detail by slug", async () => {
    const provider = await getProviderBySlug("southern-coastal-plumbing");
    expect(provider).not.toBeNull();
    expect(provider?.name).toBe("Southern Coastal Plumbing");
    expect(provider?.services.length).toBeGreaterThan(0);
    expect(provider?.coverage_areas.length).toBeGreaterThan(0);
  });

  it("returns null for non-existent slug", async () => {
    const provider = await getProviderBySlug("non-existent-provider-slug");
    expect(provider).toBeNull();
  });
});
