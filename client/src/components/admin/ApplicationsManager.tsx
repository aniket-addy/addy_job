"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Search,
  Filter,
  User,
  Building2,
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { ApplicationItem } from "./RecentApplications";

interface ApplicationsManagerProps {
  applications: ApplicationItem[];
  onUpdateStatus: (id: string, status: ApplicationItem["status"]) => void;
}

export default function ApplicationsManager({
  applications,
  onUpdateStatus,
}: ApplicationsManagerProps) {
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<ApplicationItem | null>(null);

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filter === "All" || app.status === filter;
    const matchesSearch =
      app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-6 h-6 text-blue-600" />
              <span>Job Seekers & Applications</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Track candidate submissions, verify resumes, and monitor application flows.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "New", "Shortlisted", "Reviewed", "Hired", "Rejected"].map((f) => (
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
            placeholder="Search candidate, position or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Applied Role</th>
                <th className="py-3 px-4">Target Company</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No candidate applications match this filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm ${item.avatarBg}`}
                        >
                          {item.avatarLetter}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {item.candidateName}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <FileText className="w-3 h-3 text-blue-500" />
                            Resume Verified
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.position}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {item.company}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {item.appliedOn}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          item.status === "Shortlisted"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "New"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : item.status === "Reviewed"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : item.status === "Hired"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          onUpdateStatus(item.id, e.target.value as ApplicationItem["status"])
                        }
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
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
