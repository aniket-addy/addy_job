"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Star, Layers, Sparkles, Globe, Sprout } from "lucide-react";

interface TopCompanyCard {
  id: string;
  name: string;
  rating: number;
  reviewsCount: string;
  tag: "Startup" | "Corporate" | "Foreign MNC" | "Unicorn";
  logoContent: React.ReactNode;
}

const companies: TopCompanyCard[] = [
  {
    id: "1",
    name: "Finastra",
    rating: 3.6,
    reviewsCount: "669 reviews",
    tag: "Startup",
    logoContent: (
      <span className="text-[12px] font-black tracking-tight text-[#7C3AED] leading-none">
        FINASTRA
      </span>
    ),
  },
  {
    id: "2",
    name: "Era Infra Engineering",
    rating: 3.7,
    reviewsCount: "301 reviews",
    tag: "Corporate",
    logoContent: (
      <div className="text-center">
        <span className="text-sm font-black tracking-wide text-[#0284C7] block leading-none">
          ERA
        </span>
        <span className="text-[7px] font-semibold text-slate-500 block leading-tight">
          GROUP
        </span>
      </div>
    ),
  },
  {
    id: "3",
    name: "NovaTech Solutions",
    rating: 4.8,
    reviewsCount: "420 reviews",
    tag: "Foreign MNC",
    logoContent: (
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
        <Layers className="w-4 h-4" />
      </div>
    ),
  },
  {
    id: "4",
    name: "BrightPath Digital",
    rating: 4.9,
    reviewsCount: "284 reviews",
    tag: "Startup",
    logoContent: (
      <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white">
        <Sparkles className="w-4 h-4" />
      </div>
    ),
  },
  {
    id: "5",
    name: "Skyline Tech",
    rating: 4.7,
    reviewsCount: "390 reviews",
    tag: "Corporate",
    logoContent: (
      <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
        <Globe className="w-4 h-4" />
      </div>
    ),
  },
  {
    id: "6",
    name: "GreenField Foods",
    rating: 4.6,
    reviewsCount: "215 reviews",
    tag: "Unicorn",
    logoContent: (
      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
        <Sprout className="w-4 h-4" />
      </div>
    ),
  },
];

export default function TopCompaniesCards() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-8 sm:py-12 bg-[#0B0F19] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Top companies & View all */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Top companies
          </h2>

          <Link
            href="/companies"
            className="text-xs sm:text-sm font-semibold text-blue-500 hover:text-blue-400 transition"
          >
            View all
          </Link>
        </div>

        {/* Horizontal Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {companies.map((company) => (
            <Link
              key={company.id}
              href="/companies"
              className="w-[185px] sm:w-[210px] shrink-0 snap-start bg-[#141C2A] rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-md flex flex-col items-center justify-between text-center group hover:border-slate-700 hover:bg-[#182233] transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center w-full">
                {/* White Logo Container */}
                <div className="w-14 h-14 bg-white rounded-xl shadow-xs flex items-center justify-center p-2 mb-3 shrink-0">
                  {company.logoContent}
                </div>

                {/* Company Name */}
                <h3 className="text-white font-bold text-sm sm:text-base leading-snug truncate w-full group-hover:text-blue-400 transition-colors">
                  {company.name}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-200">
                    {company.rating}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {company.reviewsCount}
                  </span>
                </div>

                {/* Badge Tag */}
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold bg-[#2C2114] text-[#F59E0B] border border-[#78350F]/40">
                    {company.tag}
                  </span>
                </div>
              </div>

              {/* View Jobs Action Link */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 w-full text-center">
                <span className="text-xs font-semibold text-blue-500 group-hover:text-blue-400 transition-colors">
                  View jobs
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
