"use client";

import React, { useState } from "react";
import {
  Building2,
  Check,
  X,
  Search,
  Eye,
  Mail,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  Users,
  FileText,
  Shield,
  ExternalLink,
} from "lucide-react";

export interface CompanyRecord {
  id: string;
  name: string;
  email: string;
  location: string;
  plan: string;
  status: "Approved" | "Pending" | "Rejected";
  submittedOn: string;
  logoBg: string;
  logoLetter: string;
  phone?: string;
  gstNumber?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  userId?: string;
  activeJobs?: number;
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
  const [filter, setFilter] = useState<"ALL" | "Pending" | "Approved" | "Rejected">("ALL");
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyRecord | null>(null);

  const filteredCompanies = companies.filter((c) => {
    const matchesFilter = filter === "ALL" || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = companies.filter((c) => c.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header and Controls (Styled exactly like Image 1) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Company Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Review company verification requests, plans, and job posting permissions.
            </p>
          </div>

          {/* Status Filter Tabs (Pill wrapper matching Image 1) */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            {(["ALL", "Pending", "Approved", "Rejected"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  filter === tab
                    ? "bg-white text-[#7C3AED] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tab}</span>
                {tab === "Pending" && pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company name, email or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
      </div>

      {/* Companies List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Active Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Company Info</th>
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
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5 whitespace-nowrap">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${c.logoBg}`}
                        >
                          {c.logoLetter}
                        </div>
                        <span className="font-bold text-slate-900 leading-tight">
                          {c.name}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-normal">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          {c.email}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {c.location}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                        {c.plan}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${
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

                    {/* View Details Action Button */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] hover:bg-[#DDD6FE] active:scale-95 rounded-xl transition cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
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

      {/* VIEW COMPANY DETAILS MODAL */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Brand */}
            <div className="flex items-start gap-4 mb-6 pb-5 border-b border-slate-100 pr-10">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shrink-0 shadow-md ${selectedCompany.logoBg}`}
              >
                {selectedCompany.logoLetter}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {selectedCompany.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      selectedCompany.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : selectedCompany.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {selectedCompany.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 text-[#7C3AED] border border-violet-200">
                    {selectedCompany.plan}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Account ID: {selectedCompany.userId || selectedCompany.id}</span>
                  <span>•</span>
                  <span>Registered: {selectedCompany.submittedOn}</span>
                </p>
              </div>
            </div>

            {/* Company Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {/* Work Email */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  Work Email
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 break-all">
                  {selectedCompany.email}
                </p>
              </div>

              {/* Phone / Contact */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Contact Number
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  {selectedCompany.phone || "+91 98765 43210"}
                </p>
              </div>

              {/* Location */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Headquarters / Location
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  {selectedCompany.location}
                </p>
              </div>

              {/* Website */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  Company Website
                </span>
                <p className="text-xs sm:text-sm font-semibold text-blue-600 truncate">
                  {selectedCompany.website ? (
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{selectedCompany.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    `https://${selectedCompany.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`
                  )}
                </p>
              </div>

              {/* Industry */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  Industry Sector
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  {selectedCompany.industry || "Software & Technology Solutions"}
                </p>
              </div>

              {/* Company Size */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Company Size / Employees
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  {selectedCompany.companySize || "51-200 employees"}
                </p>
              </div>

              {/* GST Number */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  GSTIN / Corporate Tax ID
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 font-mono">
                  {selectedCompany.gstNumber || "29ABCDE1234F1Z5"}
                </p>
              </div>

              {/* Subscription Tier */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  Recruiter Plan
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#7C3AED]">
                  {selectedCompany.plan}
                </p>
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Manage verification and platform access rights for this recruiter account.
              </div>
              <div className="flex items-center gap-2">
                {selectedCompany.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => {
                        onReject(selectedCompany.id, selectedCompany.name);
                        setSelectedCompany(null);
                      }}
                      className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition cursor-pointer"
                    >
                      Reject Registration
                    </button>
                    <button
                      onClick={() => {
                        onApprove(selectedCompany.id, selectedCompany.name);
                        setSelectedCompany(null);
                      }}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Approve Company</span>
                    </button>
                  </>
                ) : selectedCompany.status === "Approved" ? (
                  <button
                    onClick={() => {
                      onReject(selectedCompany.id, selectedCompany.name);
                      setSelectedCompany(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition cursor-pointer"
                  >
                    Revoke Access
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onApprove(selectedCompany.id, selectedCompany.name);
                      setSelectedCompany(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 border border-emerald-200 rounded-xl transition cursor-pointer"
                  >
                    Re-approve Access
                  </button>
                )}
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
