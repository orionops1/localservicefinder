import Link from "next/link";
import { HeroSearch } from "@/components/home/hero-search";
import { ProviderCard } from "@/components/ui/provider-card";
import { DEMO_PROVIDERS } from "@/lib/data/seed-data";

// Section 2: Popular services (6–8 categories at most per Section 13)
const POPULAR_SERVICES = [
  { name: "Electrical", slug: "electrical", icon: "⚡", count: 2 },
  { name: "Plumbing", slug: "plumbing", icon: "🔧", count: 2 },
  { name: "AC Services", slug: "ac-repair", icon: "❄️", count: 1 },
  { name: "Home Cleaning", slug: "cleaning", icon: "🧹", count: 1 },
  { name: "Carpentry & Repairs", slug: "carpentry", icon: "🪚", count: 1 },
  { name: "Painting", slug: "painting", icon: "🎨", count: 1 },
  { name: "CCTV & Security", slug: "cctv", icon: "📹", count: 1 },
  { name: "Masonry", slug: "masonry", icon: "🧱", count: 1 },
];

// Section 4: How it works (3 clear steps per Section 13)
const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Tell us what you need",
    description: "Describe the work, your preferred timeline, and where the service is required.",
    icon: "📝",
  },
  {
    step: "2",
    title: "Compare your options",
    description: "Review suitable professionals, check human-verified credentials, and compare response details.",
    icon: "⚖️",
  },
  {
    step: "3",
    title: "Connect with confidence",
    description: "Choose the provider that best fits your job, communicate directly, and pay with zero hidden platform cut.",
    icon: "🤝",
  },
];

// Section 6: Verification indicators breakdown
const TRUST_CHECKS = [
  {
    badge: "Phone confirmed",
    icon: "📞",
    meaning: "Phone number verified via direct confirmation before public listing.",
  },
  {
    badge: "Identity checked",
    icon: "🪪",
    meaning: "National Identity Card (NIC) or government document reviewed by platform staff.",
  },
  {
    badge: "Business checked",
    icon: "🏛️",
    meaning: "Official Business Registration (BR) or relevant commercial evidence reviewed.",
  },
  {
    badge: "Qualification checked",
    icon: "📜",
    meaning: "Trade certificate, vocational licence, or CEB/technical credential reviewed.",
  },
];

// Section 7: Popular towns for quick discovery
const POPULAR_TOWNS = [
  { name: "Colombo 03", district: "Colombo", slug: "kollupitiya" },
  { name: "Dehiwala", district: "Colombo", slug: "dehiwala" },
  { name: "Negombo", district: "Gampaha", slug: "negombo" },
  { name: "Kandy City", district: "Kandy", slug: "kandy-city" },
  { name: "Galle Fort", district: "Galle", slug: "galle-fort" },
  { name: "Panadura", district: "Kalutara", slug: "panadura" },
  { name: "Matara Town", district: "Matara", slug: "matara-town" },
  { name: "Jaffna Town", district: "Jaffna", slug: "jaffna-town" },
  { name: "Kurunegala", district: "Kurunegala", slug: "kurunegala-town" },
];

export default function Home() {
  const verifiedPros = DEMO_PROVIDERS.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-white to-white py-16 sm:py-24 dark:from-[#0a121e] dark:via-[#090e17] dark:to-[#090e17] border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Positioning Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            Good help is closer than you think.
          </h1>

          {/* Supporting Copy */}
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
            Find local professionals, compare your options and connect with the right person for the job.
          </p>

          {/* Primary Dual Search Controls */}
          <div className="mt-8 sm:mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: POPULAR SERVICES (6-8 Categories per Section 13)                */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Popular Services
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                Browse high-demand residential and commercial trade categories.
              </p>
            </div>
            <Link
              href="/services"
              className="text-xs sm:text-sm font-semibold text-[#0a2540] dark:text-sky-400 hover:underline"
            >
              All Categories &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
            {POPULAR_SERVICES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-5 shadow-sm transition-all hover:border-[#0a2540] hover:shadow-md dark:border-zinc-800 dark:bg-[#0d1726] dark:hover:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                    {cat.count} {cat.count === 1 ? "pro" : "pros"}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#0a2540] dark:text-white dark:group-hover:text-sky-400">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: PROFESSIONALS NEAR YOU (Main Discovery Section)                 */}
      {/* ========================================================================= */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/60 py-16 sm:py-20 dark:border-zinc-800 dark:bg-[#070d17]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Professionals Near You
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                Vetted service professionals with human-reviewed identity and qualification evidence.
              </p>
            </div>
            <Link
              href="/professionals"
              className="mt-3 sm:mt-0 text-xs sm:text-sm font-semibold text-[#0a2540] dark:text-sky-400 hover:underline"
            >
              Browse all professionals &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {verifiedPros.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: HOW IT WORKS (3 Clear Steps)                                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              A simpler, clearer way to discover local professionals and connect with confidence.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl dark:bg-zinc-800">
                    {step.icon}
                  </span>
                  <span className="text-2xl font-black text-zinc-300 dark:text-zinc-700">
                    0{step.step}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-zinc-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: REQUEST A PROFESSIONAL (Major Marketplace Workflow)            */}
      {/* ========================================================================= */}
      <section className="border-t border-zinc-200/80 bg-[#0a2540] py-16 sm:py-20 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200">
              Request a Professional
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight">
              Not sure who to contact? Let professionals come to you.
            </h2>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              Describe your job, set your preferred date, and invite suitable vetted providers in your area to respond with quotations. Compare availability and contact details in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/post-request"
                className="rounded-xl bg-white px-6 py-3.5 text-center text-sm font-bold text-[#0a2540] shadow-sm transition hover:bg-zinc-100 active:scale-95"
              >
                Post a Service Request
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Learn How Requests Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: TRUST & TRANSPARENCY                                           */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Evidence-Based Verification
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              We do not use one generic &quot;Verified&quot; badge for every check. We display exactly what was reviewed.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_CHECKS.map((check) => (
              <div
                key={check.badge}
                className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]"
              >
                <div className="text-xl">{check.icon}</div>
                <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">
                  {check.badge}
                </h3>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
                  {check.meaning}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-zinc-50 p-4 border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">
              A checked identity verifies documentation, not guaranteed future conduct. Always review scope and terms before hiring.
            </span>
            <Link
              href="/safety"
              className="font-bold text-[#0f766e] dark:text-sky-400 hover:underline shrink-0 ml-4"
            >
              Trust & Safety Standards &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: EXPLORE BY LOCATION (Clean town-level discovery)                */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-zinc-50/50 dark:bg-[#070d17]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Explore by Location
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                Discover service coverage by town, district, or province across Sri Lanka.
              </p>
            </div>
            <Link
              href="/locations"
              className="text-xs sm:text-sm font-semibold text-[#0a2540] dark:text-sky-400 hover:underline mt-2 sm:mt-0"
            >
              Browse all 25 districts & towns &rarr;
            </Link>
          </div>

          {/* Popular Town Shortcuts */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {POPULAR_TOWNS.map((town) => (
              <Link
                key={town.slug}
                href={`/locations/${town.district.toLowerCase()}/${town.slug}`}
                className="rounded-xl border border-zinc-200/80 bg-white p-3.5 text-xs transition hover:border-[#0a2540] hover:shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]"
              >
                <div className="font-bold text-zinc-900 dark:text-white">
                  {town.name}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {town.district} District
                </div>
              </Link>
            ))}
            <Link
              href="/locations"
              className="flex items-center justify-center rounded-xl border border-dashed border-zinc-300 p-3.5 text-xs font-semibold text-[#0f766e] dark:border-zinc-700 dark:text-sky-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              + All 25 Districts
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: FOR PROFESSIONALS                                              */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-8 sm:p-12 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e] dark:text-sky-400">
                For Service Providers & Businesses
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
                Your skills deserve to be discovered.
              </h2>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
                Create a professional profile, showcase your verified credentials and portfolio, and connect with customers looking for your services in your designated travel towns.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/for-professionals"
                  className="rounded-xl bg-[#0a2540] px-6 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400"
                >
                  Join as a Professional
                </Link>
                <Link
                  href="/provider/onboarding"
                  className="rounded-xl border border-zinc-300 px-6 py-3 text-center text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Create Free Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
