"use client";

import React from "react";

interface GrowthChartProps {
  totalCompanies?: number;
  totalJobs?: number;
  totalApplications?: number;
}

export default function GrowthChart({
  totalCompanies = 0,
  totalJobs = 0,
  totalApplications = 0,
}: GrowthChartProps) {
  const hasData = totalCompanies > 0 || totalJobs > 0 || totalApplications > 0;

  const stats = [
    {
      label: "Total Companies",
      value: totalCompanies,
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      dot: "bg-indigo-600",
    },
    {
      label: "Total Job Postings",
      value: totalJobs,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      dot: "bg-blue-600",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      color: "bg-teal-100 text-teal-700 border-teal-200",
      dot: "bg-teal-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[280px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Platform Overview
          </h3>
          <div className="mt-1 flex items-center gap-4 text-xs">
            {stats.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className={`w-2.5 h-2.5 rounded-full inline-block ${s.dot}`} />
                {s.label.split(" ")[1]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex-1 flex flex-col justify-center py-6">
        {hasData ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`p-5 rounded-2xl border flex flex-col items-center justify-center gap-1 ${s.color}`}
              >
                <span className="text-4xl font-black tracking-tight">
                  {s.value.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-semibold text-center opacity-80">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm font-bold text-slate-800">No platform data yet</p>
            <p className="text-xs text-slate-400 max-w-xs">
              As companies register, post jobs and submit applications, your real platform stats will appear here.
            </p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400 font-medium">
          All counts are live from MongoDB — no mock data
        </span>
      </div>
    </div>
  );
}
