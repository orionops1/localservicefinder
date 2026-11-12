import Link from "next/link";
import { searchProviders } from "@/features/discovery/search-service";
import { CATEGORIES, DISTRICTS } from "@/lib/data/seed-data";
import { ProviderCard } from "@/components/ui/provider-card";

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
  title: "Find Verified Professionals in Sri Lanka — LocalServices.lk",
  description: "Search and compare local tradespeople, electricians, plumbers, AC technicians, and repair services across Sri Lanka.",
};

export default async function ProfessionalsPage({ searchParams }: SearchPageProps) {
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
    pageSize: 12,
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Find Professionals</span>
      </nav>

      {/* Main Header */}
      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Find Professionals
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Showing {result.total} {result.total === 1 ? "professional" : "professionals"} in Sri Lanka
            {district ? ` in ${district}` : ""}
            {town ? ` (${town})` : ""}
          </p>
        </div>

        {/* Action to Request */}
        <Link
          href={`/post-request?${new URLSearchParams({ category, district, town }).toString()}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0a2540] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400 shrink-0"
        >
          <span>Need custom quotes? Post a Request</span>
          <span>&rarr;</span>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <form method="GET" action="/professionals" className="rounded-2xl border border-zinc-200/90 bg-white p-5 dark:border-zinc-800 dark:bg-[#0d1726] space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Filter Options
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
                placeholder="e.g. Electrician, Leak, Inverter"
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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
                District
              </label>
              <select
                id="district"
                name="district"
                defaultValue={district}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">All 25 Districts</option>
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.slug}>
                    {d.name_en} ({d.name_si})
                  </option>
                ))}
              </select>
            </div>

            {/* Town Input */}
            <div>
              <label htmlFor="town" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Town or Locality
              </label>
              <input
                id="town"
                type="text"
                name="town"
                defaultValue={town}
                placeholder="e.g. Kollupitiya, Galle Fort"
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Verified Only Filter */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="verifiedOnly"
                  value="true"
                  defaultChecked={verifiedOnly}
                  className="rounded border-zinc-300 text-[#0a2540] focus:ring-[#0a2540]"
                />
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  Verified evidence only
                </span>
              </label>
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="sort" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rating</option>
                <option value="name">Provider Name (A-Z)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#0a2540] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
            >
              Apply Filters
            </button>

            <Link
              href="/professionals"
              className="block text-center text-[11px] font-medium text-zinc-500 hover:underline pt-1"
            >
              Reset all filters
            </Link>
          </form>
        </aside>

        {/* Results Main Column */}
        <main className="lg:col-span-3">
          {result.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {result.items.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700 bg-white dark:bg-[#0d1726]">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                No matching professionals found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-zinc-500 dark:text-zinc-400">
                Try broadening your search keywords, clearing specific town filters, or post a service request so matching providers can contact you.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/professionals"
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Clear Filters
                </Link>
                <Link
                  href="/post-request"
                  className="rounded-xl bg-[#0a2540] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
                >
                  Post a Service Request
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
