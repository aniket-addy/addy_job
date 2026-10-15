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
  Upload,
  Send,
  Layers,
  Sparkles,
  Download,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { ApplicationItem } from "./RecentApplications";
import UploadResumeModal from "./UploadResumeModal";
import ResumeDetailModal from "./ResumeDetailModal";

interface ApplicationsManagerProps {
  applications: ApplicationItem[];
  onUpdateStatus: (id: string, status: ApplicationItem["status"]) => void;
  companies?: Array<{ id: string; name: string }>;
  onAddApplication?: (newApp: ApplicationItem) => void;
  activeView?: string;
}

export default function ApplicationsManager({
  applications,
  onUpdateStatus,
  companies = [],
  onAddApplication,
  activeView = "resumes",
}: ApplicationsManagerProps) {
  const [filter, setFilter] = useState<string>("All");
  const [domainFilter, setDomainFilter] = useState<string>("All");
  const [experienceFilter, setExperienceFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  
  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<ApplicationItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Extract unique domains from applications
  const uniqueDomains = Array.from(
    new Set(
      applications
        .map((a) => a.domain)
        .filter(Boolean) as string[]
    )
  );

  const filteredApps = applications.filter((app) => {
    // 1. Status Filter
    const matchesFilter =
      filter === "All" ||
      filter.toUpperCase() === "ALL" ||
      app.status.toLowerCase() === filter.toLowerCase() ||
      (filter.toLowerCase() === "applied" && app.status.toLowerCase() === "new") ||
      (filter.toLowerCase() === "reviewing" && app.status.toLowerCase() === "reviewed");

    // 2. Domain Filter
    const matchesDomain =
      domainFilter === "All" ||
      (app.domain && app.domain.toLowerCase().includes(domainFilter.toLowerCase())) ||
      (app.position && app.position.toLowerCase().includes(domainFilter.toLowerCase()));

    // 3. Experience Filter
    const matchesExperience =
      experienceFilter === "All" ||
      (app.experience && app.experience.toLowerCase().includes(experienceFilter.toLowerCase()));

    // 4. Search Filter
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.candidateName.toLowerCase().includes(q) ||
      app.position.toLowerCase().includes(q) ||
      app.company.toLowerCase().includes(q) ||
      (app.domain && app.domain.toLowerCase().includes(q)) ||
      (app.experience && app.experience.toLowerCase().includes(q)) ||
      (app.candidateEmail && app.candidateEmail.toLowerCase().includes(q));

    return matchesFilter && matchesDomain && matchesExperience && matchesSearch;
  });

  const handleOpenDetail = (app: ApplicationItem) => {
    setSelectedCandidate(app);
    setIsDetailModalOpen(true);
  };

  const isResumeView = activeView === "resumes";

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isResumeView ? "Candidate Resumes & Database" : "Candidate Applications"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {filteredApps.length} Candidates
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isResumeView
                ? "Upload, filter by domain & experience, view candidate PDF resumes, and track recruitment pipeline."
                : "Review submissions, schedule interviews, and mark candidates as Hired or Rejected."}
            </p>
          </div>

          <div className="flex items-center gap-2 max-w-full">
            {/* Status Filter Tabs (Pill wrapper) */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
              {["ALL", "Applied", "Reviewing", "Shortlisted", "Interview", "Hired", "Rejected"].map(
                (f) => {
                  const isActive =
                    (f === "ALL" && (filter === "All" || filter.toUpperCase() === "ALL")) ||
                    filter.toUpperCase() === f.toUpperCase() ||
                    (f === "Applied" && filter === "New") ||
                    (f === "Reviewing" && filter === "Reviewed");

                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {f}
                    </button>
                  );
                }
              )}
            </div>

            {/* Circular Send / Upload Resume Button on right side of filter */}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              title="Upload Candidate Resume"
              aria-label="Upload Candidate Resume"
              className="w-9 h-9 min-w-9 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, domain, position, company or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
            />
          </div>

          {/* Domain Filter Dropdown */}
          <div className="md:col-span-3 relative">
            <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full pl-8.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-slate-700 cursor-pointer appearance-none truncate"
            >
              <option value="All">All Domains</option>
              <option value="Full Stack">Full Stack Development</option>
              <option value="Frontend">Frontend Development</option>
              <option value="Backend">Backend Development</option>
              <option value="Mobile">Mobile App Development</option>
              <option value="Data Science">Data Science & AI/ML</option>
              <option value="DevOps">Cloud & DevOps</option>
              <option value="UI/UX">UI/UX Design</option>
              <option value="QA">Quality Assurance</option>
              {uniqueDomains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Experience Filter Dropdown */}
          <div className="md:col-span-3 relative">
            <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full pl-8.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-slate-700 cursor-pointer appearance-none truncate"
            >
              <option value="All">All Experience Levels</option>
              <option value="Fresher">Fresher (0 - 1 Year)</option>
              <option value="1 - 2">1 - 2 Years</option>
              <option value="3 - 5">3 - 5 Years</option>
              <option value="5 - 8">5 - 8 Years</option>
              <option value="8+">8+ Years</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Applications & Resumes Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Domain & Experience</th>
                <th className="py-3.5 px-4">Applied Role</th>
                <th className="py-3.5 px-4">Target Company</th>
                <th className="py-3.5 px-4">Resume PDF</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-700 text-sm">
                        No candidate resumes match this filter.
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        Try adjusting your search query, domain or experience filters, or upload a new candidate resume.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload First Resume</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApps.map((item) => {
                  const hasPdf = Boolean(item.pdfData || item.resumeUrl);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(item)}
                    >
                      {/* Candidate Name & Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[11px] shrink-0 shadow-xs ${
                              item.avatarBg || "bg-blue-600"
                            }`}
                          >
                            {item.avatarLetter || "CD"}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 leading-tight block hover:text-blue-600 transition">
                              {item.candidateName}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {item.candidateEmail || `${item.candidateName.toLowerCase().replace(/\s+/g, "")}@example.com`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Domain & Experience */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 max-w-fit">
                            <Layers className="w-3 h-3 text-indigo-500 shrink-0" />
                            {item.domain || "Full Stack Dev"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            {item.experience || "1 - 2 Years"}
                          </span>
                        </div>
                      </td>

                      {/* Applied Role */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {item.position}
                      </td>

                      {/* Target Company */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {item.company}
                        </span>
                      </td>

                      {/* Resume PDF Badge */}
                      <td
                        className="py-3.5 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasPdf ? (
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition shadow-2xs group-hover:scale-105"
                          >
                            <FileText className="w-3.5 h-3.5 text-rose-600" />
                            <span>PDF Attached</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-normal">
                            <FileCheck2 className="w-3.5 h-3.5 text-blue-500" />
                            <span>Profile Verified</span>
                          </span>
                        )}
                      </td>

                      {/* Current Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${
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

                      {/* Moderation Controls */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="View Full Resume"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              onUpdateStatus(
                                item.id,
                                e.target.value as ApplicationItem["status"]
                              )
                            }
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                          >
                            <option value="New">New</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Resume Modal */}
      <UploadResumeModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        companies={companies}
        onSuccess={(newApp) => {
          if (onAddApplication) {
            onAddApplication(newApp);
          }
          setSelectedCandidate(newApp);
          setIsDetailModalOpen(true);
        }}
      />

      {/* Resume Detail & PDF Preview Modal */}
      <ResumeDetailModal
        application={selectedCandidate}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCandidate(null);
        }}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
}
