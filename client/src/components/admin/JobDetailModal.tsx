"use client";

import React from "react";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  UserCheck,
  Tag,
  CheckCircle2,
  Trash2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { JobPosting } from "./JobsModerator";

interface JobDetailModalProps {
  job: JobPosting | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (id: string, newStatus: JobPosting["status"]) => void;
  onDeleteJob: (id: string) => void;
}

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
  onToggleStatus,
  onDeleteJob,
}: JobDetailModalProps) {
  if (!isOpen || !job) return null;

  const handleStatusClick = (newStatus: JobPosting["status"]) => {
    onToggleStatus(job.id, newStatus);
    onClose();
  };

  const handleDeleteClick = () => {
    if (confirm(`Are you sure you want to delete job posting "${job.title}"?`)) {
      onDeleteJob(job.id);
      onClose();
    }
  };

  const tagsList = (job.tags && job.tags.length > 0)
    ? job.tags
    : (job.skills && job.skills.length > 0)
    ? job.skills
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center font-black text-blue-300 text-lg shadow-inner shrink-0">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {job.title}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide shrink-0 ${
                    job.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : job.status === "Pending"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : job.status === "Paused"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : job.status === "Expired"
                      ? "bg-slate-500/20 text-slate-300 border-slate-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5 truncate">
                <span className="flex items-center gap-1 font-semibold text-slate-200">
                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  {job.company}
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {job.location}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-mono text-[11px]">ID: {job.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 divide-y divide-slate-100">
          {/* Key Metrics / Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-500" />
                Compensation
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">{job.salary || "Competitive"}</p>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                Job Type & Mode
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {job.type} • {job.workplace || "Hybrid"}
              </p>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-500" />
                Vacancies / Openings
              </span>
              <p className="text-sm font-bold text-purple-700 mt-1">
                {job.openings || 1} Openings
              </p>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-indigo-500" />
                Applicants
              </span>
              <p className="text-sm font-bold text-indigo-600 mt-1">
                {job.applicantsCount || 0} Candidates
              </p>
            </div>
          </div>

          {/* Secondary Details row */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Department:</span>
              <span className="font-semibold text-slate-800">{job.department || "Engineering"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Experience:</span>
              <span className="font-semibold text-slate-800">{job.experience || "Not specified"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Posted By:</span>
              <span className="font-semibold text-slate-800">{job.postedBy || job.company}</span>
            </div>
          </div>

          {/* Tags & Skills */}
          {tagsList.length > 0 && (
            <div className="pt-4 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Required Skills & Tags</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {tagsList.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Description */}
          <div className="pt-4 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Job Description
            </h4>
            <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {job.description && job.description.trim() ? (
                job.description
              ) : (
                <span className="italic text-slate-400">
                  No detailed description provided for this job requisition.
                </span>
              )}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="pt-4 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Key Responsibilities
              </h4>
              <ul className="space-y-1.5 p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="pt-4 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Requirements & Qualifications
              </h4>
              <ul className="space-y-1.5 p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="pt-4 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Perks & Benefits</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-50 text-amber-800 font-semibold rounded-xl text-xs border border-amber-200/80 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteClick}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Job</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {job.status === "Pending" && (
              <button
                onClick={() => handleStatusClick("Active")}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Publish</span>
              </button>
            )}

            {job.status === "Active" ? (
              <>
                <button
                  onClick={() => handleStatusClick("Paused")}
                  className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PauseCircle className="w-4 h-4 text-amber-700" />
                  <span>Pause Job</span>
                </button>
                <button
                  onClick={() => handleStatusClick("Closed")}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-all cursor-pointer"
                >
                  <span>Close Job</span>
                </button>
              </>
            ) : job.status === "Paused" ? (
              <button
                onClick={() => handleStatusClick("Active")}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Resume / Activate</span>
              </button>
            ) : (
              <button
                onClick={() => handleStatusClick("Active")}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Reactivate Job</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
