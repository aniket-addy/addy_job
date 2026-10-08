"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  Eye,
  Trash2,
  ShieldAlert,
} from "lucide-react";

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  status: "Active" | "Pending" | "Expired" | "Closed";
  postedOn: string;
  applicantsCount: number;
}

interface JobsModeratorProps {
  jobs: JobPosting[];
  onToggleStatus: (id: string, newStatus: JobPosting["status"]) => void;
  onDeleteJob: (id: string) => void;
}

export default function JobsModerator({
  jobs,
  onToggleStatus,
  onDeleteJob,
}: JobsModeratorProps) {
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((j) => {
    const matchesFilter = filter === "All" || j.status === filter;
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <span>Job Postings Moderation</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Supervise active job requisitions across all subscribed companies.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Active", "Pending", "Expired", "Closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  filter === f
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search job title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Jobs Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Job Title & Company</th>
                <th className="py-3 px-4">Job Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Compensation</th>
                <th className="py-3 px-4">Applicants</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No job postings found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">
                          {j.title}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {j.company}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {j.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {j.location}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {j.salary}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                        {j.applicantsCount} applied
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          j.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : j.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : j.status === "Expired"
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {j.status === "Pending" && (
                          <button
                            onClick={() => onToggleStatus(j.id, "Active")}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {j.status === "Active" ? (
                          <button
                            onClick={() => onToggleStatus(j.id, "Closed")}
                            className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all cursor-pointer"
                          >
                            Close
                          </button>
                        ) : (
                          <button
                            onClick={() => onToggleStatus(j.id, "Active")}
                            className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all cursor-pointer"
                          >
                            Reactivate
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteJob(j.id)}
                          aria-label="Delete job posting"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
