"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROVINCES, DISTRICTS } from "@/lib/data/seed-data";

interface HeroSearchProps {
  initialDistrict?: string;
}

const POPULAR_TAGS = [
  { label: "AC Repair", icon: "❄️", query: "ac-repair" },
  { label: "Electrician", icon: "⚡", query: "electrical" },
  { label: "Plumber", icon: "🔧", query: "plumbing" },
  { label: "Deep Cleaning", icon: "🧹", query: "cleaning" },
  { label: "House Painter", icon: "🎨", query: "painting" },
  { label: "Carpentry", icon: "🪚", query: "carpentry" },
  { label: "CCTV & Security", icon: "📹", query: "cctv" },
  { label: "Masonry & Tiling", icon: "🧱", query: "masonry" },
];

export function HeroSearch({ initialDistrict = "" }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState(initialDistrict);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (district.trim()) params.set("district", district.trim());
    router.push(`/search?${params.toString()}`);
  };

  const handleTagClick = (tagQuery: string) => {
    const params = new URLSearchParams();
    params.set("category", tagQuery);
    if (district.trim()) params.set("district", district.trim());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input Box */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border-2 border-emerald-500/20 bg-white p-2.5 sm:p-3 shadow-2xl shadow-emerald-950/10 dark:border-emerald-500/30 dark:bg-zinc-900/90 dark:shadow-black/40 backdrop-blur"
      >
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Service Query Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What service do you need? (e.g. Plumber, AC Repair, Electrician)"
              className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/70 py-3.5 pl-11 pr-4 text-sm font-medium text-zinc-900 placeholder-zinc-400 transition focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700/80 dark:bg-zinc-800/60 dark:text-white dark:placeholder-zinc-500 dark:focus:bg-zinc-800"
            />
          </div>

          {/* District Select Dropdown (All 25 Districts) */}
          <div className="relative sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <select
              name="district"
              aria-label="Select District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full appearance-none rounded-xl border border-zinc-200/90 bg-zinc-50/70 py-3.5 pl-10 pr-9 text-sm font-medium text-zinc-900 transition focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700/80 dark:bg-zinc-800/60 dark:text-white dark:focus:bg-zinc-800"
            >
              <option value="">All 25 Districts</option>
              {PROVINCES.map((prov) => {
                const provDistricts = DISTRICTS.filter((d) => d.province_id === prov.id);
                return (
                  <optgroup key={prov.id} label={prov.name_en}>
                    {provDistricts.map((d) => (
                      <option key={d.id} value={d.slug}>
                        {d.name_en} ({d.name_si})
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/40 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:shadow-emerald-500/20"
          >
            <span>Find Pros</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>

      {/* Popular Fast-Search Chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Popular:
        </span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => handleTagClick(tag.query)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/80 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300"
          >
            <span>{tag.icon}</span>
            <span>{tag.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
