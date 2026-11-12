import Link from "next/link";
import { CATEGORIES } from "@/lib/data/seed-data";

export const metadata = {
  title: "Service Categories — LocalServices.lk",
  description: "Browse verified local services in Sri Lanka by category: Plumbing, Electrical, AC Repair, Cleaning, Carpentry, Automotive, and more.",
};

export default function ServicesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-300 font-medium">Categories</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Explore All Service Categories
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          Find verified tradespeople and professional services across Sri Lanka. Select a service category to see available specialists in your area.
        </p>
      </div>

      <div className="space-y-12">
        {CATEGORIES.map((category) => (
          <section key={category.id} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
                  {category.name_en}
                </h2>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  {category.name_si} • {category.name_ta}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              {category.description_en}
            </p>

            {/* Subcategories Grid */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/services/${sub.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-emerald-300 hover:bg-white hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-emerald-700 dark:hover:bg-zinc-900"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{sub.icon}</span>
                        <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                          {sub.name_en}
                        </h3>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {sub.description_en}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-zinc-200/50 text-xs font-semibold text-emerald-700 dark:border-zinc-800 dark:text-emerald-400">
                      <span>Find Providers</span>
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
