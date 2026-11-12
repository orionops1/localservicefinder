import { SearchFilters, SearchResult, ProviderCardView, ProviderDetailView } from "@/types/database";
import { DEMO_PROVIDERS, CATEGORIES, DISTRICTS } from "@/lib/data/seed-data";

export async function searchProviders(filters: SearchFilters): Promise<SearchResult> {
  const {
    q,
    category,
    district,
    town,
    verifiedOnly,
    minRating,
    sort = "relevance",
    page = 1,
    pageSize = 10,
  } = filters;

  let filtered = [...DEMO_PROVIDERS];

  // 1. Text Search Query
  if (q && q.trim().length > 0) {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter((provider) => {
      const matchName = provider.name.toLowerCase().includes(term);
      const matchDesc = provider.description.toLowerCase().includes(term);
      const matchCategory = provider.categories.some((c) => c.toLowerCase().includes(term));
      const matchServices = provider.featured_services.some((s) => s.toLowerCase().includes(term));
      const matchTowns = provider.towns.some((t) => t.toLowerCase().includes(term));
      return matchName || matchDesc || matchCategory || matchServices || matchTowns;
    });
  }

  // 2. Category Filter
  if (category && category !== "all") {
    const catSlug = category.toLowerCase();
    filtered = filtered.filter((p) => {
      return (
        p.primary_category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === catSlug ||
        p.categories.some((c) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(catSlug)) ||
        p.services.some((s) => s.category_slug === catSlug)
      );
    });
  }

  // 3. District Filter
  if (district && district !== "all") {
    const distSlug = district.toLowerCase();
    filtered = filtered.filter((p) => p.district.toLowerCase() === distSlug || p.district.toLowerCase().replace(/[^a-z0-9]+/g, "-") === distSlug);
  }

  // 4. Town / Locality Filter
  if (town && town !== "all") {
    const townLower = town.toLowerCase();
    filtered = filtered.filter((p) => p.towns.some((t) => t.toLowerCase().includes(townLower)));
  }

  // 5. Verified Filter
  if (verifiedOnly) {
    filtered = filtered.filter((p) => p.badges && p.badges.length > 0);
  }

  // 6. Minimum Rating Filter
  if (minRating && minRating > 0) {
    filtered = filtered.filter((p) => p.rating_summary.average_rating >= minRating);
  }

  // 7. Sorting
  if (sort === "rating") {
    filtered.sort((a, b) => b.rating_summary.average_rating - a.rating_summary.average_rating);
  } else if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Relevance: Providers with more matching keywords and reviews score higher
    filtered.sort((a, b) => b.rating_summary.total_reviews - a.rating_summary.total_reviews);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems: ProviderCardView[] = filtered.slice(startIndex, startIndex + pageSize).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    business_type: p.business_type,
    status: p.status,
    primary_category: p.primary_category,
    categories: p.categories,
    district: p.district,
    towns: p.towns,
    public_phone: p.public_phone,
    public_whatsapp: p.public_whatsapp,
    rating_summary: p.rating_summary,
    starting_price: p.starting_price,
    badges: p.badges,
    featured_services: p.featured_services,
    image_url: p.image_url,
  }));

  return {
    items: paginatedItems,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getProviderBySlug(slug: string): Promise<ProviderDetailView | null> {
  const match = DEMO_PROVIDERS.find((p) => p.slug === slug);
  return match || null;
}

export function getAllCategories() {
  return CATEGORIES;
}

export function getAllDistricts() {
  return DISTRICTS;
}
