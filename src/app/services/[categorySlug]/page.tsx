import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, DISTRICTS } from "@/lib/data/seed-data";
import { searchProviders } from "@/features/discovery/search-service";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;

  // Find category or subcategory
  let currentCategory = CATEGORIES.find((c) => c.slug === categorySlug);
  let parentCategory = null;

  if (!currentCategory) {
    for (const cat of CATEGORIES) {
      const sub = cat.subcategories?.find((s) => s.slug === categorySlug);
      if (sub) {
        currentCategory = sub;
        parentCategory = cat;
        break;
      }
    }
  }

  if (!currentCategory) {
    notFound();
  }

  // Fetch providers for this category
  const result = await searchProviders({
    category: categorySlug,
    pageSize: 10,
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-[#0a2540]">Categories</Link>
        {parentCategory && (
          <>
            <span>/</span>
            <Link href={`/services/${parentCategory.slug}`} className="hover:text-[#0a2540]">
              {parentCategory.name_en}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-300 font-medium">{currentCategory.name_en}</span>
      </nav>

      {/* Hero Header */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726] sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-3xl dark:bg-zinc-800">
              {currentCategory.icon || "🔧"}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                {currentCategory.name_en} Services in Sri Lanka
              </h1>
              <p className="mt-1 text-xs text-[#0f766e] dark:text-sky-400 font-medium">
                {currentCategory.name_si} • {currentCategory.name_ta}
              </p>
            </div>
          </div>

          <Link
            href={`/search?category=${categorySlug}`}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Search with Filters
          </Link>
        </div>

        <p className="mt-4 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {currentCategory.description_en || "Find trusted, verified specialists offering high quality repairs and installations."}
        </p>
      </div>

      {/* District Shortcuts */}
      <div className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Filter {currentCategory.name_en} by District
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {DISTRICTS.slice(0, 10).map((dist) => (
            <Link
              key={dist.id}
              href={`/search?category=${categorySlug}&district=${dist.slug}`}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-500"
            >
              {dist.name_en}
            </Link>
          ))}
          <Link
            href={`/search?category=${categorySlug}`}
            className="rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 dark:border-zinc-700 dark:text-emerald-400"
          >
            All 25 Districts &rarr;
          </Link>
        </div>
      </div>

      {/* Provider Results */}
      <div className="mt-10">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Available Verified Providers ({result.total})
          </h2>
          <span className="text-xs text-zinc-500">
            Showing approved professionals
          </span>
        </div>

        {result.items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
              No providers listed in this category yet
            </h3>
            <p className="mt-2 text-xs text-zinc-500 max-w-md mx-auto">
              We are currently onboarding verified professionals in this sector.
            </p>
            <Link
              href="/provider/onboarding"
              className="mt-6 inline-flex rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              Register as a {currentCategory.name_en} Provider
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {result.items.map((provider) => (
              <div
                key={provider.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/providers/${provider.slug}`}
                        className="text-lg font-bold text-zinc-900 hover:text-emerald-700 dark:text-white dark:hover:text-emerald-400"
                      >
                        {provider.name}
                      </Link>
                      <p className="text-xs text-zinc-500">
                        {provider.district} • Serving {provider.towns.slice(0, 3).join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                      <span>★</span>
                      <span>{provider.rating_summary.average_rating.toFixed(1)}</span>
                      <span className="text-zinc-400 font-normal">({provider.rating_summary.total_reviews})</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {provider.badges.map((b) => (
                      <span
                        key={b.type}
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                      >
                        <span>✓</span> {b.label}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {provider.description}
                  </p>

                  {/* Featured Services */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {provider.featured_services.slice(0, 2).map((srv) => (
                      <span
                        key={srv}
                        className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <div>
                    {provider.starting_price && (
                      <div className="text-xs">
                        <span className="text-zinc-400">From </span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          Rs. {provider.starting_price.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {provider.public_whatsapp && (
                      <a
                        href={`https://wa.me/${provider.public_whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        WhatsApp
                      </a>
                    )}
                    <Link
                      href={`/providers/${provider.slug}`}
                      className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
