import Link from "next/link";
import { HeroSearch } from "@/components/home/hero-search";
import { DistrictExplorer } from "@/components/home/district-explorer";
import { DEMO_PROVIDERS } from "@/lib/data/seed-data";

const POPULAR_SERVICES = [
  {
    name: "AC Repair & Servicing",
    slug: "ac-repair",
    icon: "❄️",
    badge: "High Demand",
    pricing: "From LKR 3,500",
    description: "Inverter AC chemical cleaning, leak diagnostics, gas refilling & fresh installation.",
    highlights: ["Chemical foam wash", "R32/R410A gas top-up", "No-cooling diagnosis"],
  },
  {
    name: "Electrical & Wiring",
    slug: "electrical",
    icon: "⚡",
    badge: "Emergency Pros",
    pricing: "From LKR 2,000",
    description: "Short circuits, DB board upgrades, full house rewiring, fan mounting & solar inverter sync.",
    highlights: ["CEB licensed electricians", "Trip switch fault finding", "Surge protection"],
  },
  {
    name: "Plumbing & Water Systems",
    slug: "plumbing",
    icon: "🔧",
    badge: "24/7 Available",
    pricing: "From LKR 2,500",
    description: "Pipe burst fixes, water pump repairs, overhead tanks, commode & bathroom fitting replacements.",
    highlights: ["Pressure pump motor fixes", "Concealed leak detection", "Drain unclogging"],
  },
  {
    name: "Deep Cleaning & Sofa Wash",
    slug: "cleaning",
    icon: "🧹",
    badge: "Popular",
    pricing: "From LKR 4,500",
    description: "Move-in deep cleans, fabric & leather sofa shampooing, overhead water tank sanitization.",
    highlights: ["Hospital-grade disinfectants", "Upholstery extraction", "Post-construction dust cleanup"],
  },
  {
    name: "House Painting & Weatherproofing",
    slug: "painting",
    icon: "🎨",
    badge: "Free Inspection",
    pricing: "Free Site Visit",
    description: "Exterior weather-shield painting, interior emulsion, damp wall treatment & roof waterproofing.",
    highlights: ["Monsoon waterproofing", "Color consultation", "Clean masking & drop cloths"],
  },
  {
    name: "Carpentry & Custom Furniture",
    slug: "carpentry",
    icon: "🪚",
    badge: "Custom Crafted",
    pricing: "Custom Quote",
    description: "Custom teak & mahogany pantry cupboards, timber door frames, locks, and antique restoration.",
    highlights: ["Modular kitchen pantries", "Solid timber repairs", "High-durability polyurethane finish"],
  },
  {
    name: "CCTV & Smart Security",
    slug: "cctv",
    icon: "📹",
    badge: "Tech Pro",
    pricing: "From LKR 28,000",
    description: "4 & 8-channel HD CCTV setups, infrared night vision, mobile remote view & security alarm systems.",
    highlights: ["Hikvision & Dahua OEM", "Smartphone remote viewing", "Concealed wiring conduit"],
  },
  {
    name: "Masonry & Bathroom Tiling",
    slug: "masonry",
    icon: "🧱",
    badge: "Verified Trades",
    pricing: "Per Sq.Ft / Day",
    description: "Ceramic & porcelain floor tiling, wall plastering, interlock paving, bathroom renovations.",
    highlights: ["Laser-level precision tiling", "Waterproof membrane base", "Boundary wall plastering"],
  },
  {
    name: "Auto & Roadside Breakdown",
    slug: "auto-mechanic",
    icon: "🚗",
    badge: "Mobile Mechanic",
    pricing: "Fast Dispatch",
    description: "On-site battery jump-start, mobile diagnostic scans, brake pad replacement & flat-bed recovery.",
    highlights: ["Hybrid 12V battery jump", "Engine scanner diagnosis", "Islandwide breakdown support"],
  },
  {
    name: "Gardening & Tree Trimming",
    slug: "gardening",
    icon: "🌿",
    badge: "Eco Friendly",
    pricing: "From LKR 3,000",
    description: "Lawn mowing, high coconut tree trimming, landscaping makeover, weed removal & irrigation.",
    highlights: ["Safety-equipped tree cutters", "Garden debris clearing", "Turf grass laying"],
  },
  {
    name: "Lorry Hire & Moving Labor",
    slug: "movers",
    icon: "📦",
    badge: "Islandwide",
    pricing: "From LKR 6,000",
    description: "10ft, 14ft & 16ft closed container lorries, experienced loading labor & delicate packing supplies.",
    highlights: ["House & office relocation", "Bubble wrap & furniture padding", "Door-to-door transport"],
  },
  {
    name: "Appliance & Washing Machine",
    slug: "appliances",
    icon: "🧰",
    badge: "Same Day",
    pricing: "From LKR 2,000",
    description: "Top & front-load washing machines, double-door refrigerators, microwave ovens & water heaters.",
    highlights: ["Genuine OEM spare parts", "PCB inverter repair", "Motor bearing replacement"],
  },
];

const PLATFORM_STATS = [
  { label: "Verified Tradespeople", value: "1,500+", icon: "🛡️", sub: "NIC & BR checked" },
  { label: "Districts Covered", value: "All 25", icon: "📍", sub: "Islandwide service" },
  { label: "Average Rating", value: "4.9 / 5", icon: "⭐", sub: "From real completed jobs" },
  { label: "Booking Commission", value: "0%", icon: "⚡", sub: "100% direct customer-to-pro" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Find & Compare Local Pros",
    description: "Search by trade, district or town. Compare transparent starting prices, human-verified identity badges, and genuine customer reviews.",
    icon: "🔍",
  },
  {
    step: "02",
    title: "Connect Directly on WhatsApp or Phone",
    description: "No middlemen or call center roadblocks. Call the pro directly, message on WhatsApp, or send a detailed job enquiry with photos.",
    icon: "💬",
  },
  {
    step: "03",
    title: "Get The Job Done & Pay Directly",
    description: "The professional arrives at your location and completes the job. Pay the pro directly with zero hidden platform cut, then leave a verified review.",
    icon: "🤝",
  },
];

const COMPARISON_POINTS = [
  {
    feature: "Identity Verification",
    platform: "Human-reviewed National ID (NIC) & Business Reg (BR)",
    others: "Anonymous profiles, unverified phone numbers",
  },
  {
    feature: "Customer Reviews",
    platform: "100% verified — locked strictly to completed jobs",
    others: "Fake reviews, self-ratings, or easily deleted complaints",
  },
  {
    feature: "Direct Pricing",
    platform: "0% commission — customer and pro deal direct",
    others: "Hidden markups or broker cut added to your bill",
  },
  {
    feature: "Data Privacy",
    platform: "Full compliance with Sri Lanka PDPA (No. 9 of 2022)",
    others: "Numbers shared with unknown third-party telemarketers",
  },
];

const CUSTOMER_REVIEWS = [
  {
    name: "Chaminda Perera",
    district: "Colombo",
    service: "Emergency Electrical DB Board Repair",
    rating: 5,
    date: "November 2026",
    comment: "Our main breaker tripped at 8 PM on a rainy Sunday. Found a certified electrician nearby through LocalServices.lk who arrived in 30 minutes and fixed a burnt neutral wire safely. Direct WhatsApp made sharing photos of our fuse box seamless!",
  },
  {
    name: "Niranjan Samarasinghe",
    district: "Galle",
    service: "Villa Inverter AC Chemical Cleaning",
    rating: 5,
    date: "October 2026",
    comment: "Southern AC serviced all 6 inverter air conditioners at our boutique villa in Unawatuna. Clean, courteous, and transparent fixed pricing without any surprises. Having their NIC and business registration verified beforehand gave us complete peace of mind.",
  },
  {
    name: "Dilani Kulatunga",
    district: "Kandy",
    service: "Custom Teak Kitchen Pantry",
    rating: 5,
    date: "October 2026",
    comment: "The carpentry team we hired from Kandy crafted exceptional solid teak cabinets for our new kitchen. Professional contract, on-time delivery, and master craftsmanship. Highly recommend this platform to anyone seeking verified tradespeople in Sri Lanka.",
  },
];

export default function Home() {
  const featuredProviders = DEMO_PROVIDERS.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-emerald-50/20 to-white py-16 sm:py-24 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800/80">
        {/* Decorative Grid Accent */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:opacity-10" />

        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-white/90 px-4 py-1.5 text-xs font-bold text-emerald-900 shadow-sm backdrop-blur dark:border-emerald-700/60 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span className="text-base">🇱🇰</span>
            <span>Sri Lanka&apos;s Verified Local Services Marketplace</span>
            <span className="hidden sm:inline text-emerald-300 dark:text-emerald-700">•</span>
            <span className="hidden sm:inline text-emerald-700 dark:text-emerald-400 font-semibold">All 25 Districts</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-white">
            Find & Hire Trusted Local Pros <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300">
              Across Sri Lanka.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
            Connect directly with verified tradespeople, technicians, and repair services in your district. No middlemen markups, human-checked IDs, and 100% genuine reviews.
          </p>

          {/* Interactive Hero Search Form */}
          <div className="mt-8 sm:mt-10">
            <HeroSearch />
          </div>

          {/* Trust Metric Stats Bar */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 sm:grid-cols-4 sm:p-6">
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xl">{stat.icon}</span>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white sm:text-3xl">
                    {stat.value}
                  </span>
                </div>
                <div className="mt-1 text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {stat.label}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Grid */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <span>⚡</span>
                <span>Everyday & Emergency Trades</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Popular Services in High Demand
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
                Browse everyday home maintenance, emergency repair, and skilled renovation services backed by verified pros.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 sm:mt-0"
            >
              <span>View all categories</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {POPULAR_SERVICES.map((serv) => (
              <Link
                key={serv.slug}
                href={`/services/${serv.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-600 dark:hover:shadow-black/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl dark:bg-emerald-950/60 transition group-hover:scale-110">
                      {serv.icon}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      {serv.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-zinc-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 transition">
                    {serv.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {serv.description}
                  </p>

                  {/* Highlights */}
                  <ul className="mt-3 space-y-1">
                    {serv.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    {serv.pricing}
                  </span>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                    Book Pro &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive All 25 Districts Explorer Section */}
      <section id="districts" className="border-t border-zinc-200/80 bg-zinc-50/70 py-16 sm:py-24 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3.5 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span>📍</span>
              <span>Islandwide Service Coverage</span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Browse Pros in All 25 Districts
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Select your district or enter your town to connect with certified professionals, plumbers, electricians, AC technicians and carpenters in your immediate area.
            </p>
          </div>

          {/* Interactive District Explorer */}
          <DistrictExplorer />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Simple & Transparent
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
              How LocalServices.lk Works
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Getting quality trade work done shouldn&apos;t be a hassle. We make finding and hiring local pros straightforward.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 text-3xl dark:bg-emerald-950/80">
                    {step.icon}
                  </span>
                  <span className="text-3xl font-black text-zinc-200 dark:text-zinc-800">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-white">
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

      {/* Featured Verified Pros Spotlight */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 sm:py-24 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Human-Verified Track Records
              </span>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Featured Verified Professionals
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Every listed pro has passed government identity or registration checks.
              </p>
            </div>
            <Link
              href="/search?verifiedOnly=true"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 sm:mt-0"
            >
              <span>Explore all verified pros</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {provider.district}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                      <span>★</span>
                      <span>{provider.rating_summary.average_rating}</span>
                      <span className="text-[10px] text-zinc-400">({provider.rating_summary.total_reviews})</span>
                    </div>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-white">
                    {provider.name}
                  </h3>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {provider.primary_category}
                  </p>

                  <p className="mt-2 text-xs line-clamp-2 text-zinc-500 dark:text-zinc-400">
                    {provider.description}
                  </p>

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {provider.badges.map((b) => (
                      <span
                        key={b.type}
                        className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                      >
                        ✓ {b.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Starting rate</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {provider.starting_price
                        ? `${provider.starting_price.currency} ${provider.starting_price.amount.toLocaleString()}`
                        : "Custom Quote"}
                    </span>
                  </div>
                  <Link
                    href={`/providers/${provider.slug}`}
                    className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  >
                    View & Contact
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose LocalServices.lk Comparison */}
      <section className="py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Trust & Quality Assurance
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
              Why Sri Lankans Prefer LocalServices.lk
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              How we compare to unverified classified ads, Facebook groups, and unregistered roadside brokers.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid grid-cols-1 md:grid-cols-3 bg-zinc-100/80 px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
              <div>Safety Standard</div>
              <div className="text-emerald-700 dark:text-emerald-400">LocalServices.lk</div>
              <div className="text-zinc-400">Unregulated Classifieds & Social Groups</div>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {COMPARISON_POINTS.map((item) => (
                <div key={item.feature} className="grid grid-cols-1 md:grid-cols-3 px-6 py-4 text-xs gap-2 md:gap-4 items-center">
                  <div className="font-bold text-zinc-900 dark:text-white">
                    {item.feature}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-300">
                    <span className="text-sm">✓</span>
                    <span>{item.platform}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                    <span className="text-sm text-red-500">✗</span>
                    <span>{item.others}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="border-t border-zinc-200 bg-zinc-50/60 py-16 sm:py-24 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Verified Feedback
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
              Real Experiences From Sri Lankan Homeowners
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Genuine testimonials submitted after jobs were completed through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {CUSTOMER_REVIEWS.map((review) => (
              <div
                key={review.name}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 text-sm">
                      {"★".repeat(review.rating)}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                      ✓ Verified Job
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 italic">
                    &quot;{review.comment}&quot;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">
                    {review.name}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {review.district} District • {review.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider CTA Banner */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-900 p-8 sm:p-14 text-white shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block rounded-full bg-emerald-700/80 px-3.5 py-1 text-xs font-bold text-emerald-100 uppercase tracking-wider">
                For Tradespeople & Service Businesses
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Are you a skilled pro or service company in Sri Lanka?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-emerald-100 leading-relaxed">
                Receive genuine customer enquiries in your district every day. Zero commission on job value, build a verified public reputation with government identity badges, and get paid 100% directly by clients.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/provider/onboarding"
                  className="rounded-xl bg-white px-7 py-3.5 text-center text-sm font-bold text-emerald-900 shadow-md transition hover:bg-emerald-50 active:scale-95"
                >
                  Create Free Provider Profile
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-xl border border-emerald-500/80 bg-emerald-800/40 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-emerald-800/80"
                >
                  Learn How Enquiries Work
                </Link>
              </div>
            </div>

            {/* Background Graphic Accent */}
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-emerald-600/20 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
