"use client";

import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { fetchPublicCompanies } from "@/lib/api";

export default function TopCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchPublicCompanies()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCompanies(data);
        }
      })
      .catch((err) => console.error("Error fetching companies:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  if (companies.length === 0) {
    return null;
  }

  // Duplicate list for smooth marquee
  const marqueeList = [
    ...companies,
    ...companies,
    ...companies,
    ...companies,
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-50/50 overflow-hidden">
      {/* Inline styles for guaranteed infinite marquee animation */}
      <style>{`
        @keyframes scrollRightToLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .infinite-marquee-slider {
          display: flex;
          width: max-content;
          animation: scrollRightToLeft 28s linear infinite;
          will-change: transform;
        }
        .infinite-marquee-slider:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Top Companies
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Hiring actively on AddyJob
          </p>
        </div>

        {/* Infinite Scrolling Logos Container */}
        <div className="relative py-2 sm:py-3 overflow-hidden">
          <div className="infinite-marquee-slider flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16">
            {marqueeList.map((comp, idx) => {
              const compName = comp.name || "Company";
              return (
                <div
                  key={`${compName}-${idx}`}
                  className="flex items-center gap-3 shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {compName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-800 text-base sm:text-lg tracking-tight select-none">
                    {compName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
