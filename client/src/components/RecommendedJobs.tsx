"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Bookmark,
  ArrowRight,
  Briefcase,
  Layers,
  Sparkles,
  Globe,
  Sprout,
  Boxes,
  Triangle,
} from "lucide-react";
import {
  fetchPublicJobs,
  getStoredUser,
  getLocalSavedJobs,
  toggleLocalSavedJob,
} from "@/lib/api";
import { jobsList } from "@/data/jobsData";

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadJobs = () => {
    fetchPublicJobs()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
        } else {
          setJobs(jobsList.slice(0, 8));
        }
      })
      .catch((err) => {
        console.error("Error fetching recommended jobs:", err);
        setJobs(jobsList.slice(0, 8));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const syncSavedJobs = () => {
    const storedUser = getStoredUser();
    const uid = storedUser?.id || storedUser?.userId || storedUser?.email || "candidate";
    const saved = getLocalSavedJobs(uid);
    const map: Record<string, boolean> = {};
    saved.forEach((s: any) => {
      const id = s.id || s._id || s.jobId;
      if (id) map[id] = true;
    });
    setSavedJobs(map);
  };

  useEffect(() => {
    loadJobs();
    syncSavedJobs();

    const handleSync = () => {
      loadJobs();
      syncSavedJobs();
    };

    window.addEventListener("applied_jobs_change", handleSync);
    window.addEventListener("saved_jobs_change", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("applied_jobs_change", handleSync);
      window.removeEventListener("saved_jobs_change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const toggleSave = (job: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const storedUser = getStoredUser();
    const uid = storedUser?.id || storedUser?.userId || storedUser?.email || "candidate";
    const jId = job.id || job._id;
    const res = toggleLocalSavedJob(uid, job);
    setSavedJobs((prev) => ({ ...prev, [jId]: res.saved }));
  };

  return (
    <section id="recommended-jobs" className="py-8 sm:py-16 lg:py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended for You
            </h2>
            <p className="hidden sm:block text-slate-500 text-xs sm:text-sm mt-1">
              Based on your profile, skills and interests.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition group cursor-pointer whitespace-nowrap"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[270px] sm:w-[310px] shrink-0 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200" />
                  <div className="h-4 bg-slate-200 rounded w-24" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-40" />
                <div className="h-3 bg-slate-100 rounded w-32" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 text-slate-500 text-sm">
            No jobs currently available. Check back soon!
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {jobs.map((job) => {
              const jId = job.id || job._id;
              const isSaved = !!savedJobs[jId];
              const title = job.title || job.role || "Job Opportunity";
              const comp = job.company || "Company";
              const loc = job.location || "Remote";
              const badges = [job.type || "Full-time", job.workplace || "Remote"];

              return (
                <Link
                  key={jId}
                  href={`/jobs/${jId}`}
                  className="w-[270px] sm:w-[310px] shrink-0 snap-start bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] hover:border-blue-300 transition-all duration-200 flex flex-col group cursor-pointer"
                >
                  {/* Company Row: Logo + Company Name + Heart Save Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 overflow-hidden">
                        {job.logo || job.companyLogo ? (
                          <img
                            src={job.logo || job.companyLogo}
                            alt={comp}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          comp.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {comp}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleSave(job, e)}
                      aria-label={isSaved ? "Unsave job" : "Save job"}
                      title={isSaved ? "Saved" : "Save Job"}
                      className={`p-1.5 rounded-xl transition cursor-pointer shrink-0 ${
                        isSaved
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          isSaved ? "fill-blue-600 text-blue-600" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Job Title */}
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>

                  {/* Location & Tags Meta Row */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {loc} • {badges.filter(Boolean).join(" • ")}
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
