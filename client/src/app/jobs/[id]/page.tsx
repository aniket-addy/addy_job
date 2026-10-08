"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { jobsList, JobDetail } from "@/data/jobsData";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Globe,
  Users,
  Calendar,
  CheckCircle2,
  Bookmark,
  Share2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  X,
  Upload,
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const job: JobDetail | undefined =
    jobsList.find((j) => j.id === jobId) || jobsList[0];

  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSendJobsLikeThis = () => {
    setAlertMessage("Job alert created! We'll send similar jobs to your inbox.");
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Suggested jobs based on shared tags or same category (excluding current job)
  const suggestedJobs = jobsList
    .filter((j) => j.id !== job.id)
    .sort((a, b) => {
      const aMatches = a.tags.filter((t) => job.tags.includes(t)).length;
      const bMatches = b.tags.filter((t) => job.tags.includes(t)).length;
      return bMatches - aMatches;
    })
    .slice(0, 4);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setApplicationSubmitted(false);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar activeTab="Jobs" />

      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Jobs</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isSaved
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`}
              title={isSaved ? "Saved" : "Save Job"}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isSaved ? "fill-blue-600 text-blue-600" : ""
                }`}
              />
              <span>{isSaved ? "Saved" : "Save Job"}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Job link copied to clipboard!");
              }}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
              title="Share Job"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: JOB & COMPANY FULL DETAILS (lg:col-span-8) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Job Header Card - Exactly like Reference Image */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              {/* Top Row: Job Title, Company, Posted by on Left & MNC / Company Logo on Right */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {job.title}
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 font-normal">
                    {job.company}
                  </p>
                  <p className="text-sm text-slate-500 font-normal">
                    Posted by {job.postedBy || "PERSOL"}
                  </p>
                </div>

                {/* Company Logo Box */}
                <div className="w-24 h-20 sm:w-28 sm:h-22 rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 flex items-center justify-center bg-white shadow-xs shrink-0 select-none">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex flex-col text-left">
                      <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 leading-none">
                        {job.company.split(" ")[0].toUpperCase() || "MNC"}
                      </span>
                      <span className="text-[6.5px] sm:text-[7.5px] font-bold tracking-widest text-slate-400 uppercase leading-none mt-0.5">
                        CORPORATION
                      </span>
                    </div>
                    {/* Multi-facet diamond logo badge */}
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-xs">
                        <polygon points="20,4 36,20 20,20" fill="#FBBF24" />
                        <polygon points="36,20 20,36 20,20" fill="#EF4444" />
                        <polygon points="20,36 4,20 20,20" fill="#1E3A8A" />
                        <polygon points="4,20 20,4 20,20" fill="#10B981" />
                        <circle cx="20" cy="20" r="5" fill="#FFFFFF" fillOpacity="0.9" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row: Experience, Salary, Location on Left & "Send me jobs like this" on Right */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-slate-700 font-medium flex-wrap">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{job.experience || "0 - 1 years"}</span>
                    <span className="text-slate-300 font-light mx-1">|</span>
                    <span className="text-slate-800 font-medium">
                      {job.salary.includes("₹") ? job.salary : `₹ ${job.salary}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-normal">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleSendJobsLikeThis}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline cursor-pointer transition flex items-center gap-1"
                  >
                    <span>Send me jobs like this</span>
                  </button>
                </div>
              </div>

              {/* Alert Notification Toast */}
              {alertMessage && (
                <div className="mt-4 py-2 px-3.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl font-medium flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{alertMessage}</span>
                </div>
              )}

              {/* Thin Divider Line */}
              <div className="border-t border-slate-100 my-5 sm:my-6" />

              {/* Bottom Row: Posted, Openings, Applicants on Left & Save, Apply Pill Buttons on Right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500">
                  <span>
                    Posted:{" "}
                    <strong className="font-semibold text-slate-800">
                      {job.posted}
                    </strong>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span>
                    Openings:{" "}
                    <strong className="font-semibold text-slate-800">
                      {job.openings || 1}
                    </strong>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span>
                    Applicants:{" "}
                    <strong className="font-semibold text-slate-800">
                      {job.applicants || "100+"}
                    </strong>
                  </span>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSaved(!isSaved)}
                    className={`px-7 py-2 rounded-full border text-sm font-semibold transition cursor-pointer ${
                      isSaved
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="px-8 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-sm transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Required Skills Badges */}
            {job.tags && job.tags.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Required Skills & Technologies
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {job.tags.length} key skills
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About the Company Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_6px_24px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>About {job.company}</span>
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {job.aboutCompany}
              </p>

              {/* Company Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Company Size</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{job.companySize}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Founded</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{job.founded}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Industry</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">{job.industry}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Website</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600 truncate block">{job.website}</span>
                </div>
              </div>
            </div>

            {/* Role Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_6px_24px_rgba(0,0,0,0.02)] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Role Overview</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements &amp; Experience</h3>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Perks &amp; Benefits</h3>
                <ul className="space-y-2.5">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Floating Apply CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-blue-600/20">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Ready to apply for {job.title}?</h3>
                <p className="text-xs sm:text-sm text-blue-100 mt-1">Submit your profile now to get directly connected with the hiring team.</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-8 py-3.5 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-md transition active:scale-98 shrink-0 cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SKILL-MATCHED JOBS (lg:col-span-4) ================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Suggested Jobs Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_6px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Suggested For Your Skills</h3>
                    <p className="text-[11px] text-slate-400">Matched to your profile</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {suggestedJobs.length} Matches
                </span>
              </div>

              {/* List of matched job cards */}
              <div className="space-y-4">
                {suggestedJobs.map((sJob, idx) => {
                  const matchScores = ["96% Match", "92% Match", "88% Match", "85% Match"];
                  return (
                    <Link
                      key={sJob.id}
                      href={`/jobs/${sJob.id}`}
                      className="block p-4 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-[0_8px_20px_rgba(37,99,235,0.07)] transition-all group bg-slate-50/50 hover:bg-white"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          {matchScores[idx] || "85% Match"}
                        </span>
                        <span className="text-[11px] font-bold text-slate-800">
                          {sJob.salary}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition line-clamp-1">
                        {sJob.title}
                      </h4>

                      <p className="text-xs text-blue-600 font-semibold mt-0.5">
                        {sJob.company}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                        <span>{sJob.location}</span>
                        <span>•</span>
                        <span>{sJob.workplace}</span>
                      </div>

                      {/* Matching skills preview */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {sJob.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-white border border-slate-200/60 text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  <span>Explore All Openings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Hiring Assurance Card */}
            <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-3xl p-5 border border-indigo-100/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>CareerConnect Verified Job</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All compensation bands and hiring teams are verified by CareerConnect. No recruiter spam or fake listings.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ================= INTERACTIVE APPLICATION MODAL ================= */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {applicationSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Your profile and resume have been forwarded directly to the hiring team at{" "}
                  <span className="font-bold text-slate-900">{job.company}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    Applying for
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {job.company} • {job.location}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex.morgan@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  {/* Resume Upload Pill */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Upload Resume (PDF, DOCX)
                    </label>
                    <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer flex flex-col items-center justify-center">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-blue-600">
                        Attach Resume or Drag &amp; Drop
                      </span>
                      <span className="text-[10px] text-slate-400">PDF or Word file (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition cursor-pointer"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
