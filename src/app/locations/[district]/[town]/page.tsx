import Link from "next/link";
import { notFound } from "next/navigation";
import { DISTRICTS, LOCALITIES, DEMO_PROVIDERS } from "@/lib/data/seed-data";
import { ProviderCard } from "@/components/ui/provider-card";

interface TownPageProps {
  params: Promise<{
    district: string;
    town: string;
  }>;
}

export async function generateMetadata({ params }: TownPageProps) {
  const { district: distSlug, town: townSlug } = await params;
  const town = LOCALITIES.find((l) => l.slug === townSlug.toLowerCase());
  const district = DISTRICTS.find((d) => d.slug === distSlug.toLowerCase());

  if (!town || !district) return { title: "Town Not Found" };

  return {
    title: `Local Services in ${town.name_en}, ${district.name_en} — LocalServices.lk`,
    description: `Find trusted, verified trade professionals and repair services serving ${town.name_en}, ${district.name_en} District.`,
  };
}

export default async function TownPage({ params }: TownPageProps) {
  const { district: distSlug, town: townSlug } = await params;
  const district = DISTRICTS.find((d) => d.slug === distSlug.toLowerCase());
  const town = LOCALITIES.find((l) => l.slug === townSlug.toLowerCase() && l.district_id === district?.id);

  if (!district || !town) {
    notFound();
  }

  // Find providers matching this town or district
  const providers = DEMO_PROVIDERS.filter((p) => {
    const matchTown = p.towns && p.towns.some((t) => t.toLowerCase().includes(town.slug) || t.toLowerCase().includes(town.name_en.toLowerCase()));
    const matchDistrict = p.district.toLowerCase() === district.slug;
    return matchTown || matchDistrict;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <Link href="/locations" className="hover:text-[#0a2540]">Locations</Link>
        <span>/</span>
        <Link href={`/locations/${district.slug}`} className="hover:text-[#0a2540]">{district.name_en}</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">{town.name_en}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <div className="inline-block rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          📍 {district.name_en} District
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Local Services in {town.name_en}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {town.name_si} • {town.name_ta}
        </p>
      </div>

      {/* Providers Grid */}
      <div className="mt-10">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Available Verified Professionals ({providers.length})
          </h2>
          <Link
            href={`/post-request?district=${district.slug}&town=${town.slug}`}
            className="text-xs font-bold text-[#0f766e] dark:text-sky-400 hover:underline"
          >
            Post a Request for {town.name_en} &rarr;
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
              No directly registered providers in {town.name_en} yet.
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Submit a service request to invite mobile technicians and tradespeople who service {town.name_en}.
            </p>
            <Link
              href={`/post-request?district=${district.slug}&town=${town.slug}`}
              className="mt-5 inline-flex items-center rounded-xl bg-[#0a2540] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246]"
            >
              Post a Request in {town.name_en}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
