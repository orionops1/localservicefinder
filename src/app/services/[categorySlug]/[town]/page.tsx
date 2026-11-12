import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, LOCALITIES, DISTRICTS, DEMO_PROVIDERS } from "@/lib/data/seed-data";
import { ProviderCard } from "@/components/ui/provider-card";

interface CategoryTownProps {
  params: Promise<{
    categorySlug: string;
    town: string;
  }>;
}

export async function generateMetadata({ params }: CategoryTownProps) {
  const { categorySlug, town: townSlug } = await params;

  let categoryName = categorySlug;
  for (const cat of CATEGORIES) {
    if (cat.slug === categorySlug) categoryName = cat.name_en;
    if (cat.subcategories) {
      const match = cat.subcategories.find((s) => s.slug === categorySlug);
      if (match) categoryName = match.name_en;
    }
  }

  const town = LOCALITIES.find((l) => l.slug === townSlug.toLowerCase());
  const townName = town ? town.name_en : townSlug;

  return {
    title: `${categoryName} Services in ${townName} — LocalServices.lk`,
    description: `Compare verified ${categoryName} professionals and request quotes in ${townName}, Sri Lanka.`,
  };
}

export default async function CategoryTownPage({ params }: CategoryTownProps) {
  const { categorySlug, town: townSlug } = await params;

  let category = CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    for (const cat of CATEGORIES) {
      const sub = cat.subcategories?.find((s) => s.slug === categorySlug);
      if (sub) {
        category = sub;
        break;
      }
    }
  }

  const town = LOCALITIES.find((l) => l.slug === townSlug.toLowerCase());
  const district = town ? DISTRICTS.find((d) => d.id === town.district_id) : null;

  if (!category || !town) {
    notFound();
  }

  // Filter providers matching category and town
  const providers = DEMO_PROVIDERS.filter((p) => {
    const catMatch =
      p.primary_category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === categorySlug ||
      p.categories.some((c) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(categorySlug)) ||
      p.services.some((s) => s.category_slug === categorySlug);

    const townMatch =
      (p.towns && p.towns.some((t) => t.toLowerCase().includes(town.slug) || t.toLowerCase().includes(town.name_en.toLowerCase()))) ||
      (district && p.district.toLowerCase() === district.slug);

    return catMatch && townMatch;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-[#0a2540]">Services</Link>
        <span>/</span>
        <Link href={`/services/${category.slug}`} className="hover:text-[#0a2540]">{category.name_en}</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">{town.name_en}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {category.name_en} in {town.name_en}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              {district ? `${district.name_en} District` : ""} • {town.name_si} • {town.name_ta}
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Available {category.name_en} Professionals ({providers.length})
          </h2>
          <Link
            href={`/post-request?category=${category.slug}&town=${town.slug}&district=${district?.slug || ""}`}
            className="text-xs font-bold text-[#0f766e] dark:text-sky-400 hover:underline"
          >
            Request a Quote in {town.name_en} &rarr;
          </Link>
        </div>

        {providers.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              No direct {category.name_en} listings currently published in {town.name_en}.
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Post a service request to invite matching mobile professionals from nearby areas.
            </p>
            <Link
              href={`/post-request?category=${category.slug}&town=${town.slug}&district=${district?.slug || ""}`}
              className="mt-5 inline-flex items-center rounded-xl bg-[#0a2540] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246]"
            >
              Post a Request for {category.name_en}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
