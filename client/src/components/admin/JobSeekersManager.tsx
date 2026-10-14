"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  ExternalLink,
  Calendar,
  Sparkles,
  Award,
  Globe,
  DollarSign,
} from "lucide-react";
import { JobSeekerRecord } from "@/lib/api";

interface JobSeekersManagerProps {
  jobSeekers: JobSeekerRecord[];
  onDeleteJobSeeker: (id: string, name: string) => void;
  onRefresh?: () => void;
  onViewResume?: (candidate: JobSeekerRecord) => void;
}

export default function JobSeekersManager({
  jobSeekers,
  onDeleteJobSeeker,
  onRefresh,
  onViewResume,
}: JobSeekersManagerProps) {
  const [filter, setFilter] = useState<"ALL" | "WITH_RESUME" | "NO_RESUME" | "FRESHER" | "EXPERIENCED">("ALL");
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<JobSeekerRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCandidates = jobSeekers.filter((c) => {
    // Filter logic
    if (filter === "WITH_RESUME" && !c.resumeName) return false;
    if (filter === "NO_RESUME" && c.resumeName) return false;
    if (filter === "FRESHER") {
      const exp = (c.experience || "").toLowerCase();
      if (!exp.includes("fresher") && !exp.includes("0 year") && exp !== "0") return false;
    }
    if (filter === "EXPERIENCED") {
      const exp = (c.experience || "").toLowerCase();
      if (exp.includes("fresher") || exp.includes("0 year") || exp === "0" || !exp) return false;
    }

    // Search query
    const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.headline && c.headline.toLowerCase().includes(q)) ||
      (c.targetRole && c.targetRole.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.university && c.university.toLowerCase().includes(q)) ||
      (c.course && c.course.toLowerCase().includes(q)) ||
      (c.skills && c.skills.some((s) => s.toLowerCase().includes(q))) ||
      (c.userId && c.userId.toLowerCase().includes(q))
    );
  });

  const totalCount = jobSeekers.length;
  const withResumeCount = jobSeekers.filter((c) => Boolean(c.resumeName)).length;
  const fresherCount = jobSeekers.filter((c) => {
    const exp = (c.experience || "").toLowerCase();
    return exp.includes("fresher") || exp.includes("0 year") || exp === "0" || !exp;
  }).length;
  const experiencedCount = totalCount - fresherCount;

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Job Seekers & Candidates
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {filteredCandidates.length} Registered
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review registered candidates, resumes uploaded from profile, contact info, and education credentials.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            {[
              { id: "ALL", label: "All Candidates" },
              { id: "WITH_RESUME", label: `With Resume (${withResumeCount})` },
              { id: "NO_RESUME", label: "No Resume" },
              { id: "FRESHER", label: `Freshers (${fresherCount})` },
              { id: "EXPERIENCED", label: `Experienced (${experiencedCount})` },
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Candidates
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">{totalCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Resumes Uploaded
            </span>
            <span className="text-xl font-black text-emerald-700 mt-0.5 block">{withResumeCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Freshers
            </span>
            <span className="text-xl font-black text-blue-700 mt-0.5 block">{fresherCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
              Experienced
            </span>
            <span className="text-xl font-black text-indigo-700 mt-0.5 block">{experiencedCount}</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate by name, email, phone, role, university, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
          />
        </div>
      </div>

      {/* Candidates Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Target Role / Headline</th>
                <th className="py-3.5 px-4">Experience & Location</th>
                <th className="py-3.5 px-4">Skills</th>
                <th className="py-3.5 px-4">Resume Status</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-700 text-sm">
                        No job seekers found
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        {search
                          ? "Try adjusting your search keywords."
                          : "When candidates sign up on the platform, their details will appear here automatically."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => {
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      {/* Candidate Avatar & Info */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs ${
                              c.avatarBg || "bg-blue-600"
                            }`}
                          >
                            {c.avatarLetter || "CD"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                                {c.name}
                              </span>
                              {c.userId && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">
                                  {c.userId}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {c.email}
                              </span>
                              {c.phone && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {c.phone}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Headline / Target Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 block">
                          {c.headline || c.targetRole || "Job Seeker"}
                        </span>
                        {c.course && (
                          <span className="text-[11px] text-slate-400 block mt-0.5 flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-indigo-500 shrink-0" />
                            {c.course} {c.specialization ? `(${c.specialization})` : ""}
                          </span>
                        )}
                      </td>

                      {/* Experience & Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                          <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                          {c.experience || "Fresher"}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {c.location || "India"}
                        </span>
                      </td>

                      {/* Skills */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {c.skills && c.skills.length > 0 ? (
                            c.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 truncate"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No skills added</span>
                          )}
                          {c.skills && c.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
                              +{c.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Resume Status */}
                      <td
                        className="py-3.5 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {c.resumeName ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="max-w-[120px] truncate" title={c.resumeName}>
                                {c.resumeName}
                              </span>
                            </span>
                            {c.resumeUrl && (
                              <a
                                href={c.resumeUrl}
                                download={c.resumeName}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                                title="Download Resume"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            No Resume
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {c.registeredOn || "Recent"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCandidate(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove candidate "${c.name}"?`)) {
                                onDeleteJobSeeker(c.id, c.name);
                              }
                            }}
                            className="w-8 h-8 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer"
                            title="Delete candidate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md ${
                    selectedCandidate.avatarBg || "bg-blue-600"
                  }`}
                >
                  {selectedCandidate.avatarLetter || "CD"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white tracking-tight">
                      {selectedCandidate.name}
                    </h3>
                    {selectedCandidate.userId && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono border border-white/20">
                        {selectedCandidate.userId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedCandidate.headline || selectedCandidate.targetRole || "Job Seeker"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Contact & Location Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                    <p className="text-xs font-bold text-slate-800 truncate">{selectedCandidate.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {selectedCandidate.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {selectedCandidate.location || "India"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Card */}
              <div className="p-4.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Education & Qualification
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Highest Qualification</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedCandidate.highestQualification || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Course / Degree</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedCandidate.course || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Specialization</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedCandidate.specialization || "General"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">University / College</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedCandidate.university || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Passing Year</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedCandidate.passingYear || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Grade / Score</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedCandidate.gradeScore ? `${selectedCandidate.gradeScore} (${selectedCandidate.gradingSystem || ""})` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills & Preferences */}
              <div className="p-4.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Skills & Preferences
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                      Technical Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                        selectedCandidate.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                      <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.experience || "Fresher"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Salary</span>
                      <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.expectedSalary || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Languages</span>
                      <p className="font-bold text-slate-800 mt-0.5">{selectedCandidate.languages || "English, Hindi"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Card */}
              <div className="p-4.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Uploaded Resume
                    </h4>
                  </div>
                  {selectedCandidate.resumeUrl && (
                    <a
                      href={selectedCandidate.resumeUrl}
                      download={selectedCandidate.resumeName || "Resume.pdf"}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume</span>
                    </a>
                  )}
                </div>

                {selectedCandidate.resumeName ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-100">
                          PDF
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{selectedCandidate.resumeName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {selectedCandidate.resumeDate || "Uploaded recently"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PDF Preview if data exists */}
                    {selectedCandidate.resumeUrl && (
                      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                        <iframe
                          src={selectedCandidate.resumeUrl}
                          className="w-full h-[320px] rounded-2xl bg-white"
                          title="Candidate Resume Preview"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                    <p className="font-bold text-slate-600 text-xs">No resume uploaded yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Candidate has not uploaded their CV from their profile dashboard.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
