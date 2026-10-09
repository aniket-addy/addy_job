"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { companiesList, Company } from "@/data/companiesData";
import { jobsList } from "@/data/jobsData";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  Star,
  ShieldCheck,
  Search,
  Briefcase,
  ExternalLink,
  Layers,
  Sparkles,
  Sprout,
  Boxes,
  Triangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Gift,
  HeartHandshake,
  Share2,
  UserPlus,
  Check,
  Award,
  ThumbsUp,
} from "lucide-react";

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params?.id as string;

  // Find company by ID or name fallback
  const company: Company =
    companiesList.find(
      (c) =>
        c.id === companyId ||
        c.name.toLowerCase().replace(/\s+/g, "-") === companyId?.toLowerCase()
    ) || companiesList[0];

  // Find all jobs for this company
  const allCompanyJobs = jobsList.filter(
    (j) =>
      j.company.toLowerCase().includes(company.name.toLowerCase()) ||
      company.name.toLowerCase().includes(j.company.toLowerCase())
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [workplaceFilter, setWorkplaceFilter] = useState("All");
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"jobs" | "about" | "culture">("jobs");

  const filteredJobs = allCompanyJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWorkplace =
      workplaceFilter === "All" ||
      job.workplace.toLowerCase() === workplaceFilter.toLowerCase();

    return matchesSearch && matchesWorkplace;
  });

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      alert("Company profile link copied to clipboard!");
    }
  };

  const scrollToSection = (id: string, tab: "jobs" | "about" | "culture") => {
    setActiveTab(tab);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar activeTab="Companies" />

      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Companies</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Companies</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">{company.name}</span>
          </div>
        </div>
      </div>

      {/* ================= REAL CORPORATE HEADER (LinkedIn / Glassdoor Style) ================= */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        {/* Sleek Brand Cover Banner */}
        <div className={`relative w-full h-40 sm:h-52 bg-gradient-to-r ${company.bannerGradient} overflow-hidden`}>
          {/* Subtle geometric dot pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:20px_20px]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Right Verified Pill */}
          <div className="absolute top-4 right-4 sm:right-8 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Employer</span>
            </span>
          </div>
        </div>

        {/* Profile Details Container (Details positioned below the banner) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          {/* Top Row: Avatar overlapping the banner edge + Action Buttons on the right */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-3 relative z-10">
            {/* High-fidelity Company Avatar Badge */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-xl p-2 flex items-center justify-center shrink-0">
              <div
                className={`w-full h-full rounded-xl ${company.iconBg} border border-slate-200/80 flex flex-col items-center justify-center shadow-xs select-none`}
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                  {company.initials}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-0.5">
                  {company.name.split(" ")[1] || "CORP"}
                </span>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2.5 self-start sm:self-end shrink-0 pt-1 sm:pt-0">
              {/* Follow Button */}
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isFollowing
                    ? "bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow • {company.followers}</span>
                  </>
                )}
              </button>

              {/* Visit Website */}
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                title="Share Company Profile"
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition shadow-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Company Details (100% Below the Banner on White Background) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {company.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                <span>Verified</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                {company.industry}
              </span>
            </div>

            {/* Company Tagline */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-3xl leading-relaxed">
              {company.tagline}
            </p>

            {/* Meta details strip with dot separators */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{company.location}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{company.size}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span>{company.companyType}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Founded {company.founded}</span>
              </span>
            </div>
          </div>

          {/* ================= AUTHENTIC CORPORATE SCORECARD (Glassdoor / AmbitionBox Style) ================= */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Overall Rating */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-slate-900 leading-none">{company.rating}</span>
                  <span className="text-xs text-amber-600 font-bold">★★★★★</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {company.reviewsCount} Verified Employee Reviews
                </p>
              </div>
            </div>

            {/* 2. Recommend to Friend */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 leading-none">{company.recommendRate}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Recommend to a Friend
                </p>
              </div>
            </div>

            {/* 3. CEO Approval */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 leading-none">{company.ceoApproval}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Leadership &amp; CEO Approval
                </p>
              </div>
            </div>

            {/* 4. Active Open Positions */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-blue-600 leading-none">{allCompanyJobs.length}</span>
                  <span className="text-xs font-semibold text-slate-700">Open Roles</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  ● Actively Hiring Now
                </p>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => scrollToSection("jobs-section", "jobs")}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                activeTab === "jobs"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              All Open Jobs ({allCompanyJobs.length})
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about-section", "about")}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                activeTab === "about"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              About {company.name}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("culture-section", "culture")}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                activeTab === "culture"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              Culture &amp; Benefits
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8">
        {/* Company Jobs Section (Primary Focal Area) */}
        <section id="jobs-section" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{allCompanyJobs.length} Active Openings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Current Openings at {company.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Explore available roles. Click on any job post to review responsibilities, package, and apply directly.
              </p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={`Search jobs at ${company.name} by title or skill...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Workplace Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {["All", "Remote", "Hybrid", "On-site"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setWorkplaceFilter(tab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                    workplaceFilter === tab
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs List Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-400 hover:shadow-[0_12px_32px_rgba(37,99,235,0.08)] transition-all duration-200 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Top Row: Category & Workplace badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {job.category}
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-[11px] font-bold ${
                          job.workplace === "Remote"
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : job.workplace === "Hybrid"
                            ? "bg-sky-50 text-sky-700 border border-sky-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {job.workplace}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {job.title}
                    </h3>

                    {/* Salary & Meta Row */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                      <span className="text-slate-900 font-extrabold text-sm sm:text-base text-blue-600">
                        {job.salary}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {job.experience || "2 - 5 yrs"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {job.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Posted {job.posted}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all">
                      <span>View Details & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Open Positions Match Your Search</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching with different keywords or clear your workplace filter to view all available roles at {company.name}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setWorkplaceFilter("All");
                }}
                className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* About Company Card */}
        <section id="about-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4 scroll-mt-24">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>About {company.name}</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {company.about}
          </p>
        </section>

        {/* Culture & Perks */}
        <section id="culture-section" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
          {/* Culture & Values */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-600" />
              <span>Work Culture & Values</span>
            </h3>
            <ul className="space-y-2.5">
              {company.culture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Perks & Benefits */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-600" />
              <span>Employee Perks & Benefits</span>
            </h3>
            <ul className="space-y-2.5">
              {company.perks.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
