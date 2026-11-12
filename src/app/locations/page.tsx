import Link from "next/link";
import { PROVINCES, DISTRICTS, LOCALITIES } from "@/lib/data/seed-data";

export const metadata = {
  title: "Service Locations across Sri Lanka — LocalServices.lk",
  description: "Browse verified local service professionals across all 9 provinces, 25 districts, and over 100+ commercial towns in Sri Lanka.",
};

export default function LocationsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540] dark:hover:text-sky-400">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Locations</span>
      </nav>

      {/* Header */}
      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Service Locations in Sri Lanka
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Discover local tradespeople, electricians, plumbers, and technicians across all 25 districts and commercial towns.
        </p>
      </div>

      {/* Provinces & Districts Grid */}
      <div className="mt-10 space-y-12">
        {PROVINCES.map((prov) => {
          const provDistricts = DISTRICTS.filter((d) => d.province_id === prov.id);

          return (
            <div key={prov.id} className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
              {/* Province Header */}
              <div className="border-b border-zinc-100 pb-4 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {prov.name_en}
                  </h2>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    <span>{prov.name_si}</span>
                    <span className="mx-1.5">•</span>
                    <span>{prov.name_ta}</span>
                  </div>
                </div>
                <span className="mt-2 sm:mt-0 text-xs font-medium text-zinc-400">
                  {provDistricts.length} {provDistricts.length === 1 ? "District" : "Districts"}
                </span>
              </div>

              {/* Districts in this Province */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {provDistricts.map((district) => {
                  const towns = LOCALITIES.filter((l) => l.district_id === district.id);

                  return (
                    <div
                      key={district.id}
                      className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/40"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/locations/${district.slug}`}
                            className="font-bold text-sm text-zinc-900 hover:text-[#0a2540] dark:text-white dark:hover:text-sky-400"
                          >
                            {district.name_en} District
                          </Link>
                          <div className="text-[11px] text-zinc-500">
                            {district.name_si} • {district.name_ta}
                          </div>
                        </div>
                        <Link
                          href={`/professionals?district=${district.slug}`}
                          className="text-[11px] font-semibold text-[#0f766e] dark:text-sky-400 hover:underline shrink-0 ml-2"
                        >
                          Find Pros &rarr;
                        </Link>
                      </div>

                      {/* Towns List */}
                      {towns.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex flex-wrap gap-1.5">
                          {towns.map((town) => (
                            <Link
                              key={town.id}
                              href={`/locations/${district.slug}/${town.slug}`}
                              className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-700 shadow-xs hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            >
                              {town.name_en}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
