"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  MapPin,
  Briefcase,
  Trash2,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";

interface SavedJobsViewProps {
  savedJobs: any[];
  onRemoveSaved: (jobId: string) => void;
}

export default function SavedJobsView({
  savedJobs = [],
  onRemoveSaved,
}: SavedJobsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = savedJobs.filter((job) => {
    const titleMatch = (job.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const compMatch = (job.company || "").toLowerCase().includes(searchQuery.toLowerCase());
    const locMatch = (job.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || compMatch || locMatch;
  });

  if (savedJobs.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-2xl mx-auto my-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Saved Jobs Yet</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          You haven&apos;t bookmarked any jobs yet. Browse exciting job opportunities and click the save icon to bookmark them for later review.
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <span>Browse All Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Saved Jobs ({savedJobs.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Positions you bookmarked for later review and fast application
          </p>
        </div>

        {/* Search inside saved */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search saved jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
          />
        </div>
      </div>

      {/* Grid of Saved Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((job) => {
          const jId = job.id || job._id || job.jobId;
          const compName = job.company || "Company";
          const tags = Array.isArray(job.tags) && job.tags.length > 0 ? job.tags : Array.isArray(job.skills) ? job.skills : [];

          return (
            <div
              key={jId}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100">
                      {compName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{compName}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveSaved(jId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 my-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.type || "Full-time"}
                  </span>
                  {job.salary && (
                    <span className="font-bold text-slate-800">
                      {String(job.salary).includes("₹") ? job.salary : `₹ ${job.salary}`}
                    </span>
                  )}
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.slice(0, 3).map((t: string) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/jobs/${jId}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <button
                  onClick={() => onRemoveSaved(jId)}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
