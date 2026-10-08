"use client";

import React, { useState } from "react";
import {
  Building2,
  Check,
  X,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
  Shield,
  Briefcase,
  Mail,
  MapPin,
} from "lucide-react";
import { PendingCompany } from "./PendingApprovals";

export interface CompanyRecord {
  id: string;
  name: string;
  email: string;
  location: string;
  activeJobs: number;
  plan: string;
  status: "Approved" | "Pending" | "Rejected";
  submittedOn: string;
  logoBg: string;
  logoLetter: string;
}

interface CompaniesManagerProps {
  companies: CompanyRecord[];
  onApprove: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
}

export default function CompaniesManager({
  companies,
  onApprove,
  onReject,
}: CompaniesManagerProps) {
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [search, setSearch] = useState("");

  const filteredCompanies = companies.filter((c) => {
    const matchesFilter = filter === "All" || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span>Company Management</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Review company verification requests, plans, and job posting permissions.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {tab}
                {tab === "Pending" && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
                    {companies.filter((c) => c.status === "Pending").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company name, email or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Companies List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Active Plan</th>
                <th className="py-3 px-4">Active Jobs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No companies found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${c.logoBg}`}
                        >
                          {c.logoLetter}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {c.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {c.location}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {c.plan}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {c.activeJobs} jobs
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          c.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : c.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {c.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onApprove(c.id, c.name)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => onReject(c.id, c.name)}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {c.status === "Approved" ? (
                            <button
                              onClick={() => onReject(c.id, c.name)}
                              className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
                            >
                              Revoke Access
                            </button>
                          ) : (
                            <button
                              onClick={() => onApprove(c.id, c.name)}
                              className="text-xs text-emerald-600 hover:underline font-medium cursor-pointer"
                            >
                              Re-approve
                            </button>
                          )}
                        </div>
                      )}
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
