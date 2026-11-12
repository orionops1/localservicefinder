"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FavouriteRecord } from "@/types/database";

export default function CustomerFavouritesPage() {
  const [favourites, setFavourites] = useState<FavouriteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchFavourites() {
      try {
        const res = await fetch("/api/v1/favourites?customerId=cust-sample-01");
        const data = await res.json();
        if (isMounted && data.favourites) {
          setFavourites(data.favourites);
        }
      } catch (err) {
        console.error("Failed to load favourites", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchFavourites();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemove = async (businessId: string) => {
    try {
      await fetch("/api/v1/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: "cust-sample-01",
          businessId,
        }),
      });
      setFavourites((prev) => prev.filter((f) => f.business_id !== businessId));
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Saved Providers</h1>
            <p className="text-xs text-slate-600 mt-1">
              Quick access to your preferred Sri Lankan trade professionals and service workshops.
            </p>
          </div>
          <Link
            href="/customer/enquiries"
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            ← My Enquiries
          </Link>
        </div>

        {/* Favourites Grid */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading your saved providers...
          </div>
        ) : favourites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <span className="text-3xl">🤍</span>
            <p className="text-sm font-bold text-slate-800">No Saved Providers Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save trusted professionals by clicking the heart icon on any provider profile.
            </p>
            <Link
              href="/search"
              className="inline-block mt-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold"
            >
              Browse Verified Providers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favourites.map((fav) => {
              const biz = fav.business;
              if (!biz) return null;
              return (
                <div
                  key={fav.business_id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/providers/${biz.slug}`}
                          className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition"
                        >
                          {biz.name}
                        </Link>
                        <p className="text-xs font-medium text-emerald-800">
                          {biz.primary_category} • {biz.district}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(fav.business_id)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold p-1"
                        title="Remove from saved"
                      >
                        ❤️ Saved
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{biz.description}</p>

                    <div className="flex items-center space-x-2 text-xs pt-1">
                      <span className="text-amber-500">★</span>
                      <span className="font-bold text-slate-800">
                        {biz.rating_summary.average_rating.toFixed(1)}
                      </span>
                      <span className="text-slate-400">
                        ({biz.rating_summary.total_reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/providers/${biz.slug}`}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      View Details & Pricing →
                    </Link>

                    {biz.public_phone && (
                      <a
                        href={`tel:${biz.public_phone}`}
                        className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-bold"
                      >
                        📞 Call
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
