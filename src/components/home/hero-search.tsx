"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROVINCES, DISTRICTS } from "@/lib/data/seed-data";

const POPULAR_SHORTCUTS = [
  { name: "Electrical", query: "electrical" },
  { name: "Plumbing", query: "plumbing" },
  { name: "AC Services", query: "ac-repair" },
  { name: "Home Cleaning", query: "cleaning" },
  { name: "Carpentry & Repairs", query: "carpentry" },
  { name: "Painting", query: "painting" },
  { name: "CCTV & Security", query: "cctv" },
  { name: "Masonry", query: "masonry" },
];

export function HeroSearch() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service.trim()) params.set("q", service.trim());
    if (location.trim()) {
      // Check if matches a district slug or town
      const matchedDistrict = DISTRICTS.find(
        (d) => d.slug === location.toLowerCase() || d.name_en.toLowerCase() === location.toLowerCase()
      );
      if (matchedDistrict) {
        params.set("district", matchedDistrict.slug);
      } else {
        params.set("town", location.trim());
      }
    }
    router.push(`/professionals?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input Container */}
      <form
        onSubmit={handleSearch}
        className="rounded-2xl border border-zinc-200/90 bg-white p-2.5 sm:p-3 shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-[#0d1726] dark:shadow-none"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Service Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="What service do you need? (e.g. Electrician, Plumbing, AC)"
              className="w-full rounded-xl border border-transparent bg-zinc-50/80 py-3.5 pl-11 pr-4 text-sm font-medium text-zinc-900 placeholder-zinc-400 transition focus:border-zinc-300 focus:bg-white focus:outline-none dark:bg-zinc-800/60 dark:text-white dark:placeholder-zinc-500"
            />
          </div>

          {/* Location / Town Input */}
          <div className="relative sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <select
              aria-label="Location or District"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full appearance-none rounded-xl border border-transparent bg-zinc-50/80 py-3.5 pl-10 pr-9 text-sm font-medium text-zinc-900 transition focus:border-zinc-300 focus:bg-white focus:outline-none dark:bg-zinc-800/60 dark:text-white"
            >
              <option value="">Where do you need it? (All Locations)</option>
              {PROVINCES.map((prov) => {
                const provDistricts = DISTRICTS.filter((d) => d.province_id === prov.id);
                return (
                  <optgroup key={prov.id} label={prov.name_en}>
                    {provDistricts.map((d) => (
                      <option key={d.id} value={d.slug}>
                        {d.name_en} District
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

          {/* Primary CTA: Find Professionals */}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-[#0a2540] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0c3246] active:scale-[0.98] dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400"
          >
            Find Professionals
          </button>
        </div>
      </form>

      {/* Popular Service Shortcuts & Secondary CTA */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Popular:</span>
          {POPULAR_SHORTCUTS.map((sc) => (
            <button
              key={sc.name}
              type="button"
              onClick={() => {
                setService(sc.query);
                router.push(`/professionals?q=${encodeURIComponent(sc.query)}`);
              }}
              className="rounded-lg bg-zinc-100/90 px-2.5 py-1 font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {sc.name}
            </button>
          ))}
        </div>

        {/* Secondary Action Link */}
        <Link
          href="/post-request"
          className="inline-flex items-center gap-1 font-bold text-[#0f766e] hover:text-[#0a2540] dark:text-sky-400 dark:hover:text-sky-300 transition"
        >
          <span>Need custom quotes? Post a Request</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
