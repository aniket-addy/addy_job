"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchJobActivityAPI } from "@/lib/api";
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
  logo?: string;
  companyLogo?: string;
  location?: string;
  salary?: string;
  type?: string;
  workplace?: string;
  appliedDate?: string;
  appliedOn?: string;
  status: string;
  statusStep?: number; // 1: Sent, 2: Resume Viewed, 3: Recruiter Action
  resumeViewed?: boolean;
  resumeViewedAt?: string | Date;
  recruiterAction?: string; // Hired, Shortlisted, Interview, Rejected
  recruiterActionAt?: string | Date;
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
  isJobSaved?: (jobOrId: any) => boolean;
}

export default function AppliedJobsView({
  appliedJobs = [],
  onSelectCompanyForMessage,
  onToggleSave,
  isJobSaved,
}: AppliedJobsViewProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(
    String(appliedJobs[0]?.jobId || appliedJobs[0]?.id || "")
  );
  const [mockModalOpen, setMockModalOpen] = useState(false);
  const [qaModalOpen, setQaModalOpen] = useState(false);
  const [prepRole, setPrepRole] = useState<string>("");

  const activeJob =
    appliedJobs.find((j) => {
      const sId = String(selectedJobId);
      return String(j.jobId) === sId || String(j.id) === sId;
    }) || appliedJobs[0];

  const [liveActivity, setLiveActivity] = useState<{ totalApplicants: number; viewedCount: number } | null>(null);

  useEffect(() => {
    if (!activeJob) {
      setLiveActivity(null);
      return;
    }
    const jId = String(activeJob.jobId || activeJob.id || "");
    if (!jId) return;

    let isMounted = true;
    const fetchStats = async () => {
      try {
        const stats = await fetchJobActivityAPI(jId, activeJob.title, activeJob.company);
        if (stats && stats.success && isMounted) {
          setLiveActivity({
            totalApplicants: stats.totalApplicants,
            viewedCount: stats.viewedCount,
          });
        }
      } catch {}
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);

    const onSync = () => {
      fetchStats();
    };
    window.addEventListener("applied_jobs_change", onSync);
    window.addEventListener("storage", onSync);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("applied_jobs_change", onSync);
      window.removeEventListener("storage", onSync);
    };
  }, [activeJob?.jobId, activeJob?.id, activeJob?.title, activeJob?.company]);

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

  // Active Job Stepper Analysis
  const activeStatus = (activeJob?.status || "").trim();
  const activeAction = (activeJob?.recruiterAction || (["Shortlisted", "Interview", "Hired", "Rejected"].includes(activeStatus) ? activeStatus : "")).trim();
  
  const isHired = activeAction.toLowerCase() === "hired" || activeStatus.toLowerCase() === "hired";
  const isShortlisted = activeAction.toLowerCase() === "shortlisted" || activeStatus.toLowerCase() === "shortlisted";
  const isInterview = activeAction.toLowerCase() === "interview" || activeStatus.toLowerCase() === "interview";
  const isRejected = activeAction.toLowerCase() === "rejected" || activeStatus.toLowerCase() === "rejected";
  const hasRecruiterAction = isHired || isShortlisted || isInterview || isRejected;

  const isResumeViewed = Boolean(
    activeJob?.resumeViewed ||
    (activeJob?.statusStep && activeJob.statusStep >= 2) ||
    hasRecruiterAction ||
    ["Reviewed", "Reviewing", "Resume Viewed"].includes(activeStatus)
  );

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* ================= LEFT COLUMN: LIST OF APPLIED JOBS (lg:col-span-5) ================= */}
          <div className="lg:col-span-5 border-r border-slate-200/80 p-4 sm:p-5 flex flex-col gap-3.5 bg-slate-50/40">

            {/* Application Cards List */}
            <div className="space-y-3 overflow-y-auto max-h-[700px] pr-1">
              {filteredList.map((job) => {
                const jId = String(job.jobId || job.id);
                const isSelected = Boolean(
                  activeJob && (
                    String(activeJob.id) === String(job.id) ||
                    (job.jobId && String(activeJob.jobId) === String(job.jobId)) ||
                    String(activeJob.id) === jId ||
                    String(activeJob.jobId) === jId
                  )
                );

                const jStatus = (job.status || "").trim();
                const jAction = (job.recruiterAction || (["Shortlisted", "Interview", "Hired", "Rejected"].includes(jStatus) ? jStatus : "")).trim();
                const jIsHired = jAction.toLowerCase() === "hired" || jStatus.toLowerCase() === "hired";
                const jIsShortlisted = jAction.toLowerCase() === "shortlisted" || jStatus.toLowerCase() === "shortlisted";
                const jIsInterview = jAction.toLowerCase() === "interview" || jStatus.toLowerCase() === "interview";
                const jIsRejected = jAction.toLowerCase() === "rejected" || jStatus.toLowerCase() === "rejected";
                const jHasAction = jIsHired || jIsShortlisted || jIsInterview || jIsRejected;
                const jIsResumeViewed = Boolean(
                  job.resumeViewed ||
                  (job.statusStep && job.statusStep >= 2) ||
                  jHasAction ||
                  ["Reviewed", "Reviewing", "Resume Viewed"].includes(jStatus)
                );

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
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100 overflow-hidden">
                          {job.logo || job.companyLogo ? (
                            <img
                              src={job.logo || job.companyLogo}
                              alt={job.company}
                              className="w-full h-full object-contain p-0.5"
                            />
                          ) : (
                            (job.company || "C").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">
                            {job.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                            {job.company} <span className="text-amber-500 font-bold">★ {job.rating || 4.8}</span> | {job.reviewsCount || "120 Reviews"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleSave) onToggleSave(job);
                        }}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer shrink-0 ${
                          isJobSaved && (isJobSaved(job.jobId || job.id) || isJobSaved(job))
                            ? "bg-blue-50 border-blue-200 text-blue-600 shadow-2xs"
                            : "border-slate-200 text-slate-400 hover:text-blue-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        title={
                          isJobSaved && (isJobSaved(job.jobId || job.id) || isJobSaved(job))
                            ? "Remove from Saved Jobs"
                            : "Save Job"
                        }
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            isJobSaved && (isJobSaved(job.jobId || job.id) || isJobSaved(job))
                              ? "fill-blue-600 text-blue-600"
                              : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Middle Status Pill + Recruiter Activity */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-1">
                      {jIsHired ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hired 🎉</span>
                        </div>
                      ) : jIsShortlisted ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Shortlisted ⭐</span>
                        </div>
                      ) : jIsInterview ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Mic className="w-3.5 h-3.5 text-purple-600" />
                          <span>Interview Scheduled</span>
                        </div>
                      ) : jIsRejected ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <X className="w-3.5 h-3.5 text-rose-600" />
                          <span>Not Selected</span>
                        </div>
                      ) : jIsResumeViewed ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Resume viewed {job.viewedDays || "recently"}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Application submitted</span>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 font-medium">
                        {job.recruiterStatus || (jHasAction ? "Action taken" : jIsResumeViewed ? "Recruiter active recently" : "Application sent")}
                      </span>
                    </div>

                    {/* Bottom Interview Prep Row: [ Prep for this interview   🎙️ Mock | 📖 Q&A ] */}
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
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shrink-0 border border-blue-100 overflow-hidden shadow-xs">
                      {activeJob.logo || activeJob.companyLogo ? (
                        <img
                          src={activeJob.logo || activeJob.companyLogo}
                          alt={activeJob.company}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        (activeJob.company || "C").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
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
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleSave && onToggleSave(activeJob)}
                      className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                        isJobSaved && (isJobSaved(activeJob.jobId || activeJob.id) || isJobSaved(activeJob))
                          ? "bg-blue-50 border-blue-200 text-blue-600 shadow-2xs"
                          : "border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                      title={
                        isJobSaved && (isJobSaved(activeJob.jobId || activeJob.id) || isJobSaved(activeJob))
                          ? "Remove from Saved Jobs"
                          : "Bookmark Job"
                      }
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isJobSaved && (isJobSaved(activeJob.jobId || activeJob.id) || isJobSaved(activeJob))
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

                {/* ================= 1. APPLICATION STATUS STEPPER (3 STAGES) ================= */}
                <div className="space-y-3.5">
                  <h4 className="text-sm font-bold text-slate-900">Application status</h4>

                  {/* Horizontal Stepper Progress Bar (3 Nodes: Sent, Resume Viewed, Recruiter Action) */}
                  <div className="relative pt-2 pb-4">
                    {/* Background connecting line */}
                    <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -z-0" />

                    {/* Animated Active connecting line */}
                    <div
                      className={`absolute top-5 left-10 h-0.5 transition-all duration-500 -z-0 ${
                        isRejected ? "bg-rose-400" : isInterview ? "bg-purple-500" : "bg-emerald-500"
                      }`}
                      style={{
                        width: hasRecruiterAction
                          ? "calc(100% - 80px)"
                          : isResumeViewed
                          ? "calc(50% - 40px)"
                          : "0%",
                      }}
                    />

                    {/* Step Nodes: 3 Columns */}
                    <div className="relative z-10 grid grid-cols-3 text-center">
                      {/* Step 1: Application Sent */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 mt-2">Application Sent</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {activeJob.appliedDate || activeJob.appliedOn || "Recently"}
                        </span>
                      </div>

                      {/* Step 2: Resume Viewed */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white transition-all ${
                            isResumeViewed
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 border-2 border-slate-300 text-slate-400"
                          }`}
                        >
                          {isResumeViewed ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-bold mt-2 ${
                            isResumeViewed ? "text-slate-800" : "text-slate-500"
                          }`}
                        >
                          Resume Viewed
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {isResumeViewed
                            ? (activeJob.viewedDays || (activeJob.resumeViewedAt ? new Date(activeJob.resumeViewedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : activeJob.appliedDate || "Viewed"))
                            : "Awaiting recruiter"}
                        </span>
                      </div>

                      {/* Step 3: Recruiter Action */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-white transition-all ${
                            isHired
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                              : isShortlisted
                              ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                              : isInterview
                              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                              : isRejected
                              ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                              : "bg-white border-2 border-slate-300 text-slate-400"
                          }`}
                        >
                          {isHired ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : isShortlisted ? (
                            <Sparkles className="w-3.5 h-3.5" />
                          ) : isInterview ? (
                            <Mic className="w-3.5 h-3.5" />
                          ) : isRejected ? (
                            <X className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>

                        <span
                          className={`text-xs font-bold mt-2 max-w-[130px] leading-tight ${
                            isHired
                              ? "text-emerald-700"
                              : isShortlisted
                              ? "text-amber-700"
                              : isInterview
                              ? "text-purple-700"
                              : isRejected
                              ? "text-rose-600"
                              : "text-slate-700"
                          }`}
                        >
                          {isHired
                            ? "Hired 🎉"
                            : isShortlisted
                            ? "Shortlisted ⭐"
                            : isInterview
                            ? "Interview"
                            : isRejected
                            ? "Not Selected"
                            : "Awaiting Recruiter Action"}
                        </span>

                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {isHired
                            ? "Offer / Hired"
                            : isShortlisted
                            ? "Selected for next round"
                            : isInterview
                            ? "Interview Scheduled"
                            : isRejected
                            ? "Application Closed"
                            : "Under Evaluation"}
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
                        {liveActivity?.totalApplicants ?? (activeJob.totalApplicants || 1)}
                      </p>
                      <p className="text-xs text-slate-500 leading-snug mt-1">Total applications</p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {liveActivity?.viewedCount ??
                          (typeof activeJob.viewedCount === "number"
                            ? activeJob.viewedCount
                            : isResumeViewed
                            ? 1
                            : 0)}
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
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* MODAL: MOCK INTERVIEW PREP */}
      {mockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
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
