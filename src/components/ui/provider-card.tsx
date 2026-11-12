import Link from "next/link";
import { ProviderCardView } from "@/types/database";
import { VerificationBadge } from "./verification-badge";

interface ProviderCardProps {
  provider: ProviderCardView;
  highlightMatch?: boolean;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const hasReviews = provider.rating_summary && provider.rating_summary.total_reviews > 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-[#0d1726] dark:hover:border-zinc-700">
      <div>
        {/* Top Header: Location tag + Rating */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            📍 {provider.district}
            {provider.towns && provider.towns.length > 0 && ` • ${provider.towns[0]}`}
          </span>

          {hasReviews ? (
            <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
              <span>★</span>
              <span>{provider.rating_summary.average_rating.toFixed(1)}</span>
              <span className="text-[10px] text-zinc-400">
                ({provider.rating_summary.total_reviews})
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-400 font-medium">New pro</span>
          )}
        </div>

        {/* Pro Info */}
        <div className="mt-4">
          <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#0a2540] dark:text-white dark:group-hover:text-sky-400 transition">
            <Link href={`/professional/${provider.slug}`}>
              {provider.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-[#0f766e] dark:text-sky-400">
            {provider.primary_category}
          </p>

          <p className="mt-2.5 text-xs leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-400">
            {provider.description}
          </p>
        </div>

        {/* Verification Indicators */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {provider.badges && provider.badges.length > 0 ? (
            provider.badges.map((b) => (
              <VerificationBadge
                key={b.type}
                type={b.type}
                label={b.label}
              />
            ))
          ) : (
            <span className="text-[10px] text-zinc-400 italic">Self-listed pro</span>
          )}
        </div>
      </div>

      {/* Footer Area: Pricing + CTA */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            Rate Guidance
          </span>
          <span className="text-xs font-bold text-zinc-900 dark:text-white">
            {provider.starting_price
              ? `${provider.starting_price.currency} ${provider.starting_price.amount.toLocaleString()}`
              : "Contact for quote"}
          </span>
        </div>

        <Link
          href={`/professional/${provider.slug}`}
          className="inline-flex items-center gap-1 rounded-xl bg-[#0a2540] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400"
        >
          <span>View Profile</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
