"use client";

import { useState } from "react";
import Link from "next/link";
import { PROVINCES, DISTRICTS } from "@/lib/data/seed-data";

// Sample major towns/hubs per district for rich local discovery
const DISTRICT_HUBS: Record<string, string[]> = {
  colombo: ["Kollupitiya", "Dehiwala", "Moratuwa", "Nugegoda", "Maharagama", "Kaduwela"],
  gampaha: ["Negombo", "Kelaniya", "Wattala", "Kadawatha", "Ja-Ela", "Gampaha Town"],
  kalutara: ["Panadura", "Kalutara South", "Horana", "Beruwala", "Aluthgama"],
  kandy: ["Kandy City", "Peradeniya", "Katugastota", "Gampola", "Kundasale"],
  matale: ["Matale Town", "Dambulla", "Sigiriya", "Ukuwela"],
  "nuwara-eliya": ["Nuwara Eliya Town", "Hatton", "Talawakele", "Ginigathena"],
  galle: ["Galle Fort", "Unawatuna", "Hikkaduwa", "Ambalangoda", "Karapitiya"],
  matara: ["Matara Town", "Weligama", "Mirissa", "Dickwella", "Hakmana"],
  hambantota: ["Tangalle", "Hambantota Town", "Ambalantota", "Beliatta", "Tissamaharama"],
  jaffna: ["Jaffna Town", "Nallur", "Chavakachcheri", "Point Pedro", "Manipay"],
  kilinochchi: ["Kilinochchi Town", "Paranthan", "Pallai"],
  mannar: ["Mannar Town", "Pesalai", "Thalaimannar"],
  vavuniya: ["Vavuniya Town", "Nedunkeni", "Cheddikulam"],
  mullaitivu: ["Mullaitivu Town", "Puthukkudiyiruppu", "Oddusuddan"],
  batticaloa: ["Batticaloa Town", "Kattankudy", "Eravur", "Valaichchenai"],
  ampara: ["Ampara Town", "Kalmunai", "Sammanthurai", "Akkaraipattu"],
  trincomalee: ["Trincomalee Town", "Kinniya", "Mutur", "Nilaveli"],
  kurunegala: ["Kurunegala Town", "Kuliyapitiya", "Pannala", "Narammala", "Wariyapola"],
  puttalam: ["Chilaw", "Puttalam Town", "Wennappuwa", "Marawila", "Anamaduwa"],
  anuradhapura: ["Anuradhapura City", "Kekirawa", "Medawachchiya", "Eppawala"],
  polonnaruwa: ["Polonnaruwa Town", "Kaduruwela", "Hingurakgoda", "Medirigiriya"],
  badulla: ["Badulla Town", "Bandarawela", "Ella", "Haputale", "Mahiyanganaya"],
  monaragala: ["Monaragala Town", "Wellawaya", "Bibile", "Buttala"],
  ratnapura: ["Ratnapura City", "Balangoda", "Pelmadulla", "Embilipitiya"],
  kegalle: ["Kegalle Town", "Mawanella", "Warakapola", "Rambukkana"],
};

export function DistrictExplorer() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDistricts = DISTRICTS.filter((district) => {
    const matchesProvince = selectedProvinceId === null || district.province_id === selectedProvinceId;
    const matchesSearch =
      searchQuery.trim() === "" ||
      district.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      district.name_si.includes(searchQuery) ||
      district.name_ta.includes(searchQuery) ||
      (DISTRICT_HUBS[district.slug] &&
        DISTRICT_HUBS[district.slug].some((town) =>
          town.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesProvince && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Province Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Province Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedProvinceId(null)}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              selectedProvinceId === null
                ? "bg-emerald-700 text-white shadow-sm dark:bg-emerald-600"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            All 25 Districts
          </button>
          {PROVINCES.map((prov) => {
            const count = DISTRICTS.filter((d) => d.province_id === prov.id).length;
            const isSelected = selectedProvinceId === prov.id;
            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => setSelectedProvinceId(prov.id)}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-sm dark:bg-emerald-600"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {prov.name_en.replace(" Province", "")} ({count})
              </button>
            );
          })}
        </div>

        {/* Quick Filter Search */}
        <div className="relative w-full md:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district or town..."
            className="w-full rounded-full border border-zinc-200 bg-white py-1.5 pl-9 pr-3 text-xs text-zinc-900 placeholder-zinc-400 transition focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          />
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredDistricts.map((d) => {
          const prov = PROVINCES.find((p) => p.id === d.province_id);
          const hubs = DISTRICT_HUBS[d.slug] || [];

          return (
            <Link
              key={d.id}
              href={`/search?district=${d.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/80 dark:hover:shadow-black/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {prov?.name_en.replace(" Province", "")}
                  </span>
                  <span className="text-xs text-zinc-400 group-hover:text-emerald-600 transition">
                    Explore &rarr;
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 transition">
                    {d.name_en}
                  </h3>
                  <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{d.name_si}</span>
                    <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">•</span>
                    <span>{d.name_ta}</span>
                  </div>
                </div>

                {/* Popular towns chips */}
                {hubs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {hubs.slice(0, 4).map((town) => (
                      <span
                        key={town}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {town}
                      </span>
                    ))}
                    {hubs.length > 4 && (
                      <span className="text-[10px] text-zinc-400 self-center">
                        +{hubs.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span>View Local Pros</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">No districts or towns found matching &quot;{searchQuery}&quot;.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedProvinceId(null);
            }}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Clear filters and view all 25 districts
          </button>
        </div>
      )}
    </div>
  );
}
