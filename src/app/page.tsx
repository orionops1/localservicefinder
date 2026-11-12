import Link from "next/link";

const POPULAR_CATEGORIES = [
  { name: "Plumbing", slug: "plumbing", icon: "🔧", description: "Pipes, leaks, bathroom & pump repairs" },
  { name: "Electrical", slug: "electrical", icon: "⚡", description: "Wiring, fixtures, circuit & power fixes" },
  { name: "AC Repair & Servicing", slug: "ac-repair", icon: "❄️", description: "Inverter AC cleaning, gas top-up & repair" },
  { name: "Cleaning Services", slug: "cleaning", icon: "🧹", description: "Home deep cleaning, sofa & office upkeep" },
  { name: "Carpentry & Woodwork", slug: "carpentry", icon: "🪚", description: "Doors, custom furniture & timber repairs" },
  { name: "Auto & Mechanic", slug: "auto-mechanic", icon: "🚗", description: "Breakdowns, servicing & battery issues" },
];

const TRUST_PILLARS = [
  {
    title: "Verified Identities",
    description: "Every badge represents human-reviewed government identity or registration evidence.",
    icon: "🛡️",
  },
  {
    title: "Real Customer Enquiries",
    description: "Reviews are tied directly to completed platform requests. No fabricated ratings.",
    icon: "⭐",
  },
  {
    title: "Islandwide Coverage",
    description: "Search across all 25 districts, starting with high-density communities in Galle and Colombo.",
    icon: "📍",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 to-white py-16 dark:from-emerald-950/20 dark:to-zinc-950 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span>🇱🇰</span>
            <span>Sri Lanka Local Services Finder</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            Find the right person. <br className="hidden sm:inline" />
            <span className="text-emerald-700 dark:text-emerald-400">Get the job done.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
            Discover verified tradespeople and professional services in your area. Contact directly or submit a service enquiry without hidden fees.
          </p>

          {/* Search Box Shell */}
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-4">
            <form action="/search" method="GET" className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="q"
                  placeholder="What service do you need? (e.g. Plumber, AC Repair)"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div className="sm:w-56 relative">
                <select
                  name="district"
                  aria-label="District"
                  defaultValue=""
                  className="w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="">All Districts</option>
                  <option value="galle">Galle (Pilot Region)</option>
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                  <option value="kandy">Kandy</option>
                  <option value="matara">Matara</option>
                  <option value="jaffna">Jaffna</option>
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Search Services
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                Explore Popular Categories
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Direct access to vetted professionals for everyday residential and commercial needs.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 sm:mt-0"
            >
              View all categories &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="group relative flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-2xl dark:bg-emerald-950/60">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
              Why Sri Lankans Trust LocalServices.lk
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Built on transparency, privacy by default, and verified track records.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TRUST_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 text-center"
              >
                <div className="text-3xl mb-3">{pillar.icon}</div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{pillar.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider Call to Action */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-emerald-800 px-6 py-12 text-center text-white sm:px-12 dark:bg-emerald-900">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Are you a service professional or business in Sri Lanka?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-emerald-100 sm:text-base">
              List your services, showcase approved portfolio photos, receive genuine customer enquiries, and build a verified reputation.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/provider/onboarding"
                className="w-full sm:w-auto rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
              >
                Create Provider Profile
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto rounded-xl border border-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
