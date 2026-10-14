"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Bookmark,
  Share2,
  Mic,
  BookOpen,
  XCircle,
  MoreVertical,
  Building2,
  MapPin,
  Briefcase,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Check,
  X,
  Volume2,
} from "lucide-react";

export interface AppliedJobItem {
  id: string;
  jobId: string;
  title: string;
  company: string;
  companyId?: string;
  location?: string;
  salary?: string;
  type?: string;
  workplace?: string;
  appliedDate?: string;
  appliedOn?: string;
  status: string;
  statusStep?: number; // 1: Sent, 2: Viewed, 3: Resume Viewed, 4: Action/Interview
  recruiterStatus?: string;
  totalApplicants?: number;
  viewedCount?: number;
  rating?: number;
  reviewsCount?: string;
  viewedDays?: string;
  candidateName?: string;
  candidateEmail?: string;
}

interface AppliedJobsViewProps {
  appliedJobs: AppliedJobItem[];
  onSelectCompanyForMessage?: (companyName: string, companyId?: string) => void;
  onToggleSave?: (job: any) => void;
  isJobSaved?: (jobId: string) => boolean;
}

export default function AppliedJobsView({
  appliedJobs = [],
  onSelectCompanyForMessage,
  onToggleSave,
  isJobSaved,
}: AppliedJobsViewProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(
    appliedJobs[0]?.id || appliedJobs[0]?.jobId || ""
  );
  const [mockModalOpen, setMockModalOpen] = useState(false);
  const [qaModalOpen, setQaModalOpen] = useState(false);
  const [prepRole, setPrepRole] = useState<string>("");

  const activeJob =
    appliedJobs.find((j) => (j.id || j.jobId) === selectedJobId) || appliedJobs[0];

  const filteredList = appliedJobs;

  const openMockPrep = (e: React.MouseEvent, role: string) => {
    e.stopPropagation();
    setPrepRole(role);
    setMockModalOpen(true);
  };

  const openQAPrep = (e: React.MouseEvent, role: string) => {
    e.stopPropagation();
    setPrepRole(role);
    setQaModalOpen(true);
  };

  if (appliedJobs.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-2xl mx-auto my-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Applied Jobs Yet</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          When you apply to jobs on AddyJob, they will automatically appear here with live recruiter tracking, application stages, and interview preparation.
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <span>Explore Available Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* ================= LEFT COLUMN: LIST OF APPLIED JOBS (lg:col-span-5) ================= */}
          <div className="lg:col-span-5 border-r border-slate-200/80 p-4 sm:p-5 flex flex-col gap-3.5 bg-slate-50/40">

            {/* Application Cards List */}
            <div className="space-y-3 overflow-y-auto max-h-[700px] pr-1">
              {filteredList.map((job) => {
                const jId = job.id || job.jobId;
                const isSelected = (activeJob?.id || activeJob?.jobId) === jId;

                return (
                  <div
                    key={jId}
                    onClick={() => setSelectedJobId(jId)}
                    className={`rounded-2xl p-4 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-100"
                        : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    {/* Top Row: Title & Company + Bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {job.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {job.company} <span className="text-amber-500 font-bold">★ {job.rating || 4.8}</span> | {job.reviewsCount || "120 Reviews"}
                        </p>
                      </div>

                      <div className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <Bookmark className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Middle Status Pill + Recruiter Activity */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Resume viewed {job.viewedDays || "2 days ago"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {job.recruiterStatus || "Recruiter last active 1d ago"}
                      </span>
                    </div>

                    {/* Bottom Interview Prep Row matching Reference Image 2: [ Prep for this interview   🎙️ Mock | 📖 Q&A ] */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px] font-medium">
                        Prep for this interview
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => openMockPrep(e, job.title)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          <Mic className="w-3 h-3 text-blue-500" />
                          <span>Mock</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={(e) => openQAPrep(e, job.title)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3 text-blue-500" />
                          <span>Q&A</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: APPLICATION DETAILS & STATUS TRACKER (lg:col-span-7) ================= */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-6">
            {activeJob ? (
              <div className="space-y-6">
                {/* Header: Title, Company, Similar Jobs Link, Bookmark */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      {activeJob.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-700">
                      {activeJob.company}{" "}
                      <span className="text-amber-500 font-bold">★ {activeJob.rating || 4.8}</span> | {activeJob.reviewsCount || "120 Reviews"}
                    </p>
                    <Link
                      href={`/jobs?q=${encodeURIComponent(activeJob.title)}`}
                      className="inline-block text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition pt-1"
                    >
                      View similar jobs
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleSave && onToggleSave(activeJob)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
                      title="Bookmark Job"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isJobSaved && isJobSaved(activeJob.jobId || activeJob.id)
                            ? "fill-blue-600 text-blue-600"
                            : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          navigator.clipboard?.writeText(window.location.origin + `/jobs/${activeJob.jobId || activeJob.id}`);
                          alert("Job link copied to clipboard!");
                        }
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
                      title="Share Application"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* ================= 1. APPLICATION STATUS STEPPER (Exact Reference Image 2) ================= */}
                <div className="space-y-3.5">
                  <h4 className="text-sm font-bold text-slate-900">Application status</h4>

                  {/* Horizontal Stepper Progress Bar */}
                  <div className="relative pt-2 pb-4">
                    {/* Connecting lines */}
                    <div className="absolute top-5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                    <div
                      className="absolute top-5 left-4 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
                      style={{
                        width: `${Math.min(100, Math.max(15, ((activeJob.statusStep || 3) - 1) * 33.3))}%`,
                      }}
                    />

                    {/* Step Nodes */}
                    <div className="relative z-10 grid grid-cols-4 text-center">
                      {/* Step 1: Application Sent */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 mt-2">Application Sent</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{activeJob.appliedDate || "08 Oct '26"}</span>
                      </div>

                      {/* Step 2: Application Viewed */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 mt-2">Application Viewed</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{activeJob.appliedDate || "08 Oct '26"}</span>
                      </div>

                      {/* Step 3: Resume Viewed */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xs ${
                            (activeJob.statusStep || 3) >= 3
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 mt-2">Resume Viewed</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{activeJob.appliedDate || "08 Oct '26"}</span>
                      </div>

                      {/* Step 4: Awaiting Recruiter Action */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            (activeJob.statusStep || 3) >= 4
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-white border-slate-300 text-slate-400"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 mt-2 max-w-[100px] leading-tight">
                          Awaiting Recruiter Action
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= 2. ACTIVITY ON THIS JOB ================= */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Activity on this job
                  </h4>
                  <div className="bg-slate-50/60 rounded-2xl border border-slate-200/90 p-4 sm:p-5 grid grid-cols-2 gap-4 max-w-md">
                    <div>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {activeJob.totalApplicants || 3772}
                      </p>
                      <p className="text-xs text-slate-500 leading-snug mt-1">Total applications</p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {activeJob.viewedCount || 1681}
                      </p>
                      <p className="text-xs text-slate-500 leading-snug mt-1">Applications viewed by recruiter</p>
                    </div>
                  </div>
                </div>

                {/* ================= 3. WHAT MAY WORK FOR YOU? ================= */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-900">What may work for you?</h4>
                  <p className="text-xs text-slate-500">
                    Following criteria suggests how well you match with the job.
                  </p>

                  <div className="space-y-1.5 pt-1 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Early Applicant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Keyskills</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                      <span className="font-semibold text-slate-900">Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Work Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                      <span className="font-semibold text-slate-900">Industry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Department</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert("Detail Match View: Your profile matches Location and Industry requirements. Add more relevant skills to boost interview shortlisting chances!")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline pt-1 inline-block cursor-pointer"
                  >
                    Detail View
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* MODAL: MOCK INTERVIEW PREP */}
      {mockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Mock Interview Prep</h3>
                  <p className="text-xs text-slate-500">{prepRole}</p>
                </div>
              </div>
              <button
                onClick={() => setMockModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs text-slate-600">
              <p className="leading-relaxed">
                Practice 1-on-1 interview questions tailored specifically for the <strong className="text-slate-900">{prepRole}</strong> role using AI voice synthesis and instant feedback.
              </p>

              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-bold text-blue-900 text-xs block">Sample Mock Topics:</span>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>System design & architecture fundamentals</li>
                  <li>Real-world troubleshooting scenarios</li>
                  <li>Behavioral leadership & situational handling</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setMockModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`AI Mock Interview initiated for ${prepRole}! Mic test passed.`);
                  setMockModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Start AI Voice Mock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INTERVIEW Q&A PREP */}
      {qaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Curated Interview Q&A</h3>
                  <p className="text-xs text-slate-500">{prepRole}</p>
                </div>
              </div>
              <button
                onClick={() => setQaModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <h5 className="font-bold text-slate-900">Q1: How do you handle high-pressure delivery timelines?</h5>
                <p className="text-slate-600 leading-relaxed">
                  Break down requirements into minimal viable iterations, maintain continuous communication with stakeholders, and prioritize mission-critical blockers first.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <h5 className="font-bold text-slate-900">Q2: Explain your approach to code quality and maintainability.</h5>
                <p className="text-slate-600 leading-relaxed">
                  Enforce strict typing, write comprehensive unit tests, document key architectural decisions, and conduct thorough peer code reviews.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <h5 className="font-bold text-slate-900">Q3: Why are you interested in joining our engineering team?</h5>
                <p className="text-slate-600 leading-relaxed">
                  Your team is building high-impact products at scale with a focus on innovation and developer culture, which perfectly aligns with my long-term career aspirations.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setQaModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
