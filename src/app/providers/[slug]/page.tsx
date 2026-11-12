import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviderBySlug } from "@/features/discovery/search-service";

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
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-emerald-700">Providers</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-300 font-medium">{provider.name}</span>
      </nav>

      {/* Main Layout: Profile Header + 2 Column Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 cols): Details, Services, Coverage, Gallery */}
        <div className="space-y-8 lg:col-span-2">
          {/* Profile Header Card */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl dark:text-white">
                    {provider.name}
                  </h1>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {provider.primary_category}
                  </span>
                  <span>•</span>
                  <span>{provider.district} Province Coverage</span>
                  <span>•</span>
                  <span className="capitalize">{provider.business_type.replace("_", " ")}</span>
                </div>
              </div>

              {/* Rating pill */}
              <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 self-start">
                <span className="text-amber-500">★</span>
                <span>{provider.rating_summary.average_rating.toFixed(1)}</span>
                <span className="text-zinc-400 font-normal text-xs">
                  ({provider.rating_summary.total_reviews} verified reviews)
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              {provider.badges.map((b) => (
                <div
                  key={b.type}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* About / Description */}
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                About the Business
              </h2>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {provider.description}
              </p>
            </div>
          </section>

          {/* Services Offered */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Services Offered ({provider.services.length})
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Prices indicated below are standard estimates and quotation baselines.
            </p>

            <div className="mt-6 space-y-4">
              {provider.services.map((srv) => (
                <div
                  key={srv.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 gap-3"
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
                        <span className="text-zinc-400 font-medium">Fixed Rate: </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          Rs. {srv.price_min.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {srv.pricing_type === "starting_at" && srv.price_min && (
                      <div className="text-xs">
                        <span className="text-zinc-400 font-medium">Starts from </span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          Rs. {srv.price_min.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {srv.pricing_type === "quote" && (
                      <span className="inline-block rounded-md bg-zinc-200/70 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Quote on Inspection
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Service Areas & Coverage */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Coverage & Operating Localities
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Areas where this provider accepts call-outs and onsite jobs.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {provider.coverage_areas.map((area, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  📍 <span className="font-semibold">{area.locality_name}</span> ({area.district_name})
                  {area.radius_km && <span className="text-zinc-400 ml-1">±{area.radius_km}km</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Approved Portfolio Gallery */}
          {provider.media && provider.media.length > 0 && (
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Work Portfolio & Photos
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Verified work samples provided directly by {provider.name}.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provider.media.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-zinc-100 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 flex flex-col justify-end p-4 min-h-[140px]"
                  >
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      📷 {item.alt_text || "Work sample"}
                    </span>
                    <span className="text-[11px] text-zinc-400 mt-1">
                      Verified Portfolio Sample
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (1 col): Contact Box, Enquiry CTA, Safety Reminder */}
        <div className="space-y-6 lg:col-span-1">
          {/* Direct Contact Card */}
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Contact Provider Directly
            </h2>

            <div className="space-y-3">
              {provider.public_phone && (
                <a
                  href={`tel:${provider.public_phone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  <span>📞 Call:</span>
                  <span>{provider.public_phone}</span>
                </a>
              )}

              {provider.public_whatsapp && (
                <a
                  href={`https://wa.me/${provider.public_whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  <span>💬 Chat on WhatsApp</span>
                </a>
              )}
            </div>

            {/* Platform Enquiry CTA */}
            <div className="border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Need a written quotation?
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Send a free platform enquiry. The provider will review your requirements and respond with a price estimate.
              </p>
              <button
                type="button"
                className="w-full rounded-xl border-2 border-emerald-700 bg-emerald-50/50 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                Send Service Request
              </button>
            </div>

            {/* Community Safety Reminder */}
            <div className="rounded-xl bg-zinc-50 p-3.5 text-[11px] leading-relaxed text-zinc-500 dark:bg-zinc-950/70 border border-zinc-100 dark:border-zinc-800">
              <strong className="block text-zinc-700 dark:text-zinc-300 mb-1">
                🛡️ Safety Tips for Customers:
              </strong>
              Always confirm the scope and estimated quotation before work begins. Never pay full amounts upfront before physical inspection.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
