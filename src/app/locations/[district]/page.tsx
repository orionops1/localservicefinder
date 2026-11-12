import Link from "next/link";
import { notFound } from "next/navigation";
import { DISTRICTS, PROVINCES, LOCALITIES, DEMO_PROVIDERS } from "@/lib/data/seed-data";
import { ProviderCard } from "@/components/ui/provider-card";

interface DistrictPageProps {
  params: Promise<{
    district: string;
  }>;
}

export async function generateMetadata({ params }: DistrictPageProps) {
  const { district: slug } = await params;
  const district = DISTRICTS.find((d) => d.slug === slug.toLowerCase());
  if (!district) return { title: "Location Not Found" };

  return {
    title: `Local Services in ${district.name_en} District — LocalServices.lk`,
    description: `Discover verified plumbers, electricians, cleaners, and tradespeople serving ${district.name_en} District, Sri Lanka.`,
  };
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { district: slug } = await params;
  const district = DISTRICTS.find((d) => d.slug === slug.toLowerCase());

  if (!district) {
    notFound();
  }

  const province = PROVINCES.find((p) => p.id === district.province_id);
  const towns = LOCALITIES.filter((l) => l.district_id === district.id);

  // Providers serving this district
  const providers = DEMO_PROVIDERS.filter(
    (p) => p.district.toLowerCase() === district.slug || p.district.toLowerCase() === district.name_en.toLowerCase()
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <Link href="/locations" className="hover:text-[#0a2540]">Locations</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">{district.name_en}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <div className="inline-block rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {province?.name_en}
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Local Services in {district.name_en}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {district.name_si} • {district.name_ta}
        </p>
      </div>

      {/* Towns in District */}
      <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Commercial Towns & Service Areas in {district.name_en}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {towns.length > 0 ? (
            towns.map((town) => (
              <Link
                key={town.id}
                href={`/locations/${district.slug}/${town.slug}`}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition hover:border-[#0a2540] hover:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {town.name_en}
              </Link>
            ))
          ) : (
            <span className="text-xs text-zinc-500">All locations across {district.name_en} District.</span>
          )}
        </div>
      </div>

      {/* Providers Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Available Verified Professionals ({providers.length})
          </h2>
          <Link
            href={`/post-request?district=${district.slug}`}
            className="text-xs font-bold text-[#0f766e] dark:text-sky-400 hover:underline"
          >
            Post a Request for {district.name_en} &rarr;
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
              No directly registered providers in {district.name_en} yet.
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Submit a service request and our matching engine will invite nearby mobile providers who travel to {district.name_en}.
            </p>
            <Link
              href={`/post-request?district=${district.slug}`}
              className="mt-5 inline-flex items-center rounded-xl bg-[#0a2540] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246]"
            >
              Post a Request in {district.name_en}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
