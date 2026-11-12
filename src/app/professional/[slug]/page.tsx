import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviderBySlug } from "@/features/discovery/search-service";
import { ProviderContactCard } from "@/components/leads/provider-contact-card";
import { VerificationBadge } from "@/components/ui/verification-badge";

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return { title: "Provider Not Found — LocalServices.lk" };
  }

  return {
    title: `${provider.name} (${provider.primary_category} in ${provider.district}) — LocalServices.lk`,
    description: provider.description,
  };
}

export default async function ProviderDetailPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <Link href="/professionals" className="hover:text-[#0a2540]">Professionals</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-300 font-medium">{provider.name}</span>
      </nav>

      {/* Main Layout: Profile Header + 2 Column Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 cols): Details, Services, Coverage, Gallery */}
        <div className="space-y-8 lg:col-span-2">
          {/* Profile Header Card */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726] sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl dark:text-white">
                  {provider.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span className="font-semibold text-[#0f766e] dark:text-sky-400">
                    {provider.primary_category}
                  </span>
                  <span>•</span>
                  <span>{provider.district} District</span>
                  <span>•</span>
                  <span className="capitalize">{provider.business_type.replace("_", " ")}</span>
                </div>
              </div>

              {/* Rating pill */}
              <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 self-start">
                <span className="text-amber-500">★</span>
                <span>{provider.rating_summary.average_rating.toFixed(1)}</span>
                <span className="text-zinc-400 font-normal text-xs">
                  ({provider.rating_summary.total_reviews} verified)
                </span>
              </div>
            </div>

            {/* Evidence-Based Verification Badges */}
            <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              {provider.badges.map((b) => (
                <VerificationBadge
                  key={b.type}
                  type={b.type}
                  label={b.label}
                  size="md"
                />
              ))}
            </div>

            {/* About / Description */}
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                About the Professional
              </h2>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {provider.description}
              </p>
            </div>
          </section>

          {/* Services Offered */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726] sm:p-8">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Services Offered ({provider.services.length})
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Standard rates and quotation baselines submitted by provider.
            </p>

            <div className="mt-6 space-y-4">
              {provider.services.map((srv) => (
                <div
                  key={srv.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 gap-3"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {srv.title}
                    </h3>
                    {srv.description && (
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {srv.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    {srv.pricing_type === "fixed" && srv.price_min && (
                      <div className="text-xs">
                        <span className="text-[10px] text-zinc-400 block">Fixed Rate</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {srv.currency} {srv.price_min.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {srv.pricing_type === "starting_at" && srv.price_min && (
                      <div className="text-xs">
                        <span className="text-[10px] text-zinc-400 block">Starting from</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {srv.currency} {srv.price_min.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {srv.pricing_type === "quote" && (
                      <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Custom Quote
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Service Areas */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726] sm:p-8">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Service Areas & Coverage
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Towns and administrative regions where this provider accepts customer jobs.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {provider.coverage_areas.map((area, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  <span className="font-semibold">{area.locality_name}</span>
                  <span className="text-zinc-400"> ({area.district_name})</span>
                  {area.radius_km && (
                    <span className="text-[10px] text-[#0f766e] dark:text-sky-400 ml-1">
                      ~{area.radius_km}km
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Contact / Enquiry Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ProviderContactCard provider={provider} />
          </div>
        </div>
      </div>
    </div>
  );
}
