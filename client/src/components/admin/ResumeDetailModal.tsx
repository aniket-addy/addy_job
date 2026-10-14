"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Layers,
  Clock,
  Download,
  ExternalLink,
  Tag,
  CheckCircle2,
  Shield,
  Eye,
} from "lucide-react";
import { ApplicationItem } from "./RecentApplications";

interface ResumeDetailModalProps {
  application: ApplicationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: ApplicationItem["status"]) => void;
}

export default function ResumeDetailModal({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
}: ResumeDetailModalProps) {
  if (!isOpen || !application) return null;

  const hasPdf = Boolean(application.pdfData || application.resumeUrl);
  const pdfSource = application.pdfData || application.resumeUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md ${
                application.avatarBg || "bg-blue-600"
              }`}
            >
              {application.avatarLetter || "CD"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {application.candidateName}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    application.status === "Shortlisted"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : application.status === "New"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : application.status === "Reviewed"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : application.status === "Hired"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}
                >
                  {application.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>{application.position}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Building2 className="w-3 h-3" />
                  {application.company}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasPdf && (
              <a
                href={pdfSource}
                download={application.fileName || `${application.candidateName.replace(/\s+/g, "_")}_Resume.pdf`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            )}
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Domain */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Domain
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                {application.domain || application.position || "General"}
              </p>
            </div>

            {/* Experience */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Experience
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                {application.experience || "Verified Profile"}
              </p>
            </div>

            {/* Email */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                {application.candidateEmail || "Not specified"}
              </p>
            </div>

            {/* Phone */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Phone
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                {application.candidatePhone || "+91 (Not provided)"}
              </p>
            </div>
          </div>

          {/* Skills if available */}
          {application.skills && application.skills.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                <Tag className="w-3 h-3 text-blue-500" />
                Skills & Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {application.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PDF Viewer Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Attached Resume PDF Document
                </h3>
              </div>
              {hasPdf && (
                <button
                  type="button"
                  onClick={() => {
                    const win = window.open();
                    if (win) {
                      win.document.write(
                        `<iframe src="${pdfSource}" style="width:100%; height:100%; border:none;"></iframe>`
                      );
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Fullscreen</span>
                </button>
              )}
            </div>

            {hasPdf ? (
              <div className="w-full rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-inner">
                <iframe
                  src={pdfSource}
                  className="w-full h-[480px] rounded-2xl bg-white"
                  title="Candidate Resume Preview"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                <FileText className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">
                  No direct PDF attached for this legacy entry.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Candidate profile data is fully verified in database.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Status Moderation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Update Status:</span>
            <select
              value={application.status}
              onChange={(e) =>
                onUpdateStatus &&
                onUpdateStatus(application.id, e.target.value as ApplicationItem["status"])
              }
              className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
            >
              <option value="New">New</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
