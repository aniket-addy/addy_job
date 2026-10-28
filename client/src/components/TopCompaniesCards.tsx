"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Star, Building2, Briefcase } from "lucide-react";
import { fetchPublicCompanies } from "@/lib/api";
import { companiesList } from "@/data/companiesData";

export default function TopCompaniesCards({ initialCompanies }: { initialCompanies?: any[] }) {
  const [companies, setCompanies] = useState<any[]>(
    Array.isArray(initialCompanies) && initialCompanies.length > 0 ? initialCompanies : []
  );
  const [isLoading, setIsLoading] = useState(
    !Array.isArray(initialCompanies) || initialCompanies.length === 0
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const load = () => {
      fetchPublicCompanies()
        .then((data) => {
          if (isMounted) {
            if (Array.isArray(data) && data.length > 0) {
              setCompanies(data);
            } else {
              setCompanies(companiesList);
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching top companies:", err);
          if (isMounted) setCompanies(companiesList);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    };

    load();
    window.addEventListener("companies_updated", load);
    return () => {
      isMounted = false;
      window.removeEventListener("companies_updated", load);
    };
  }, []);

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
        {isLoading ? (
          <div className="flex items-stretch gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-[185px] sm:w-[210px] shrink-0 bg-[#141C2A] rounded-2xl p-5 border border-slate-800 animate-pulse space-y-3"
              >
                <div className="w-14 h-14 bg-slate-800 rounded-xl mx-auto" />
                <div className="h-4 bg-slate-800 rounded w-24 mx-auto" />
                <div className="h-3 bg-slate-800 rounded w-16 mx-auto" />
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No registered companies found.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {companies.map((company) => {
              const compId = company.id || company._id;
              const openCount = typeof company.openRoles === "number" ? company.openRoles : (parseInt(company.openRoles, 10) || 0);

              return (
                <Link
                  key={compId}
                  href={`/companies/${compId}`}
                  className="w-[185px] sm:w-[210px] shrink-0 snap-start bg-[#141C2A] rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-md flex flex-col items-center justify-between text-center group hover:border-slate-700 hover:bg-[#182233] transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* White Logo Container */}
                    <div className="w-14 h-14 bg-white rounded-xl shadow-xs flex items-center justify-center p-1.5 mb-3 shrink-0 overflow-hidden border border-slate-100">
                      {company.logo || company.profileImage ? (
                        <img
                          src={company.logo || company.profileImage}
                          alt={company.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <span className="text-sm font-black text-slate-900">
                          {(company.name || "C").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Company Name */}
                    <h3 className="text-white font-bold text-sm sm:text-base leading-snug truncate w-full group-hover:text-blue-400 transition-colors">
                      {company.name}
                    </h3>

                    {/* Rating & Location */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-200">
                        {company.rating || "4.8"}
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[80px]">
                        {company.location || "India"}
                      </span>
                    </div>

                    {/* Badge Tag */}
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold bg-[#2C2114] text-[#F59E0B] border border-[#78350F]/40 truncate max-w-[150px]">
                        {company.industry || "Technology"}
                      </span>
                    </div>
                  </div>

                  {/* View Jobs Action Link */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 w-full text-center">
                    <span className="text-xs font-semibold text-blue-500 group-hover:text-blue-400 transition-colors">
                      {openCount > 0 ? `${openCount} Jobs` : "View Company"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
