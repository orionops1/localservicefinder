import Link from "next/link";
import { searchProviders } from "@/features/discovery/search-service";
import { CATEGORIES, DISTRICTS } from "@/lib/data/seed-data";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    district?: string;
    town?: string;
    verifiedOnly?: string;
    minRating?: string;
    sort?: "relevance" | "rating" | "name";
    page?: string;
  }>;
}

export const metadata = {
  title: "Search Local Service Providers — LocalServices.lk",
  description: "Search and filter verified local plumbers, electricians, AC repairers, cleaners, and mechanics across all 25 districts of Sri Lanka.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "";
  const district = params.district || "";
  const town = params.town || "";
  const verifiedOnly = params.verifiedOnly === "true";
  const minRating = params.minRating ? Number(params.minRating) : undefined;
  const sort = params.sort || "relevance";
  const page = params.page ? Number(params.page) : 1;

  const result = await searchProviders({
    q,
    category,
    district,
    town,
    verifiedOnly,
    minRating,
    sort,
    page,
    pageSize: 10,
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-300 font-medium">Search</span>
      </nav>

      {/* Main Header */}
      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
          Local Service Discovery
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-500">
          Showing {result.total} verified {result.total === 1 ? "provider" : "providers"} in Sri Lanka
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <form method="GET" action="/search" className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Filter Results
            </h2>

            {/* Keyword Input */}
            <div>
              <label htmlFor="q" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Service Keyword
              </label>
              <input
                id="q"
                type="text"
                name="q"
                defaultValue={q}
                placeholder="e.g. Plumber, Leak, Wiring"
                className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Category Select */}
            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={category}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <optgroup key={cat.id} label={cat.name_en}>
                    <option value={cat.slug}>{cat.name_en} (All)</option>
                    {cat.subcategories?.map((sub) => (
                      <option key={sub.id} value={sub.slug}>
                        — {sub.name_en}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* District Select */}
            <div>
              <label htmlFor="district" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                District (Location)
              </label>
              <select
                id="district"
                name="district"
                defaultValue={district}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">All 25 Districts</option>
                <optgroup label="Southern Province">
                  <option value="galle">Galle</option>
                  <option value="matara">Matara</option>
                  <option value="hambantota">Hambantota</option>
                </optgroup>
                <optgroup label="Western Province">
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                </optgroup>
                <optgroup label="Other Districts">
                  {DISTRICTS.filter((d) => ![1, 2, 3, 7, 8, 9].includes(d.id)).map((d) => (
                    <option key={d.id} value={d.slug}>
                      {d.name_en}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label htmlFor="minRating" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Customer Rating
              </label>
              <select
                id="minRating"
                name="minRating"
                defaultValue={minRating || ""}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">Any Rating</option>
                <option value="4">4.0 Stars & above</option>
                <option value="4.5">4.5 Stars & above</option>
              </select>
            </div>

            {/* Verified Only Checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                id="verifiedOnly"
                type="checkbox"
                name="verifiedOnly"
                value="true"
                defaultChecked={verifiedOnly}
                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="verifiedOnly" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer">
                Verified Providers Only
              </label>
            </div>

            {/* Sort Select */}
            <div>
              <label htmlFor="sort" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="relevance">Most Relevant</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Provider Name (A-Z)</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
              >
                Apply Filters
              </button>
              <Link
                href="/search"
                className="w-full rounded-xl border border-zinc-200 py-2 text-center text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Reset Filters
              </Link>
            </div>
          </form>
        </aside>

        {/* Results Stream */}
        <main className="lg:col-span-3">
          {result.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="text-4xl">🔍</div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">
                No matching service providers found
              </h3>
              <p className="mt-2 text-xs text-zinc-500 max-w-md mx-auto">
                Try widening your search terms, selecting a broader district, or unchecking the verified filter.
              </p>
              <div className="mt-6">
                <Link
                  href="/search"
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                >
                  Clear All Filters
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {result.items.map((provider) => (
                <article
                  key={provider.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/providers/${provider.slug}`}
                          className="text-lg font-bold text-zinc-900 hover:text-emerald-700 dark:text-white dark:hover:text-emerald-400"
                        >
                          {provider.name}
                        </Link>
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {provider.business_type === "registered_company" ? "Company" : "Tradesperson"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">
                        {provider.primary_category} • {provider.district} (Serves {provider.towns.join(", ")})
                      </p>

                      {/* Trust Badges */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {provider.badges.map((b) => (
                          <span
                            key={b.type}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          >
                            <span>✓</span> {b.label}
                          </span>
                        ))}
                      </div>

                      <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {provider.description}
                      </p>

                      {/* Services Pills */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {provider.featured_services.map((srv) => (
                          <span
                            key={srv}
                            className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rating & Starting Price Side Box */}
                    <div className="sm:text-right shrink-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                      <div className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        <span>★</span>
                        <span>{provider.rating_summary.average_rating.toFixed(1)}</span>
                        <span className="text-zinc-400 font-normal">({provider.rating_summary.total_reviews})</span>
                      </div>

                      {provider.starting_price && (
                        <div className="text-xs">
                          <span className="text-zinc-400">From </span>
                          <span className="font-bold text-zinc-900 dark:text-white">
                            Rs. {provider.starting_price.amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      {provider.public_phone && (
                        <a
                          href={`tel:${provider.public_phone}`}
                          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                        >
                          📞 Call
                        </a>
                      )}
                      {provider.public_whatsapp && (
                        <a
                          href={`https://wa.me/${provider.public_whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          💬 WhatsApp
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/providers/${provider.slug}`}
                      className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition"
                    >
                      View Profile &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800 text-xs text-zinc-500">
              <div>
                Page {result.page} of {result.totalPages}
              </div>
              <div className="flex items-center gap-2">
                {result.page > 1 && (
                  <Link
                    href={`/search?q=${q}&category=${category}&district=${district}&page=${result.page - 1}`}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-50 dark:border-zinc-700"
                  >
                    Previous
                  </Link>
                )}
                {result.page < result.totalPages && (
                  <Link
                    href={`/search?q=${q}&category=${category}&district=${district}&page=${result.page + 1}`}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-50 dark:border-zinc-700"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
