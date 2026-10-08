"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  ChevronDown,
  Briefcase,
  Building2,
  Users,
  Check,
} from "lucide-react";

export default function HeroBanner() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All Job Types");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const jobTypes = [
    "All Job Types",
    "Full-time",
    "Part-time",
    "Remote",
    "Contract",
    "Internship",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { jobTitle, location, jobType });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFBFD] via-[#F3F7FD] to-white pt-6 pb-12 lg:pt-10 lg:pb-20">
      {/* Background Soft Glows */}
      <div className="absolute top-12 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* ================= LEFT COLUMN: HEADLINE & SEARCH ================= */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-7 z-10">
            {/* Pill Tag */}
            <div className="inline-flex items-center">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] shadow-xs">
                Your Next Chapter Starts Here
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-0.5">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Find Your Dream Job
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight leading-[1.12]">
                <span className="text-slate-900">and </span>
                <span className="text-[#3B82F6] bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Build a Brighter
                </span>
              </h2>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-[#3B82F6] tracking-tight leading-[1.12]">
                Future
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Connect with top companies, explore exciting opportunities, and
              take the next step in your career journey.
            </p>

            {/* Job Search Horizontal Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-[0_10px_35px_-4px_rgba(37,99,235,0.1)] border border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1 max-w-2xl transition-all hover:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/20"
            >
              {/* Field 1: Job title, skills or company */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job title, skills or company"
                  className="w-full text-sm text-slate-800 placeholder:text-slate-400 font-medium bg-transparent focus:outline-none"
                />
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-8 bg-slate-200 shrink-0" />

              {/* Field 2: Location */}
              <div className="flex-1 sm:max-w-[160px] flex items-center gap-2.5 px-3 py-2">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full text-sm text-slate-800 placeholder:text-slate-400 font-medium bg-transparent focus:outline-none"
                />
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-8 bg-slate-200 shrink-0" />

              {/* Field 3: Job Type Dropdown */}
              <div className="relative sm:max-w-[160px]">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-slate-700 font-medium bg-transparent hover:text-slate-900 focus:outline-none cursor-pointer"
                >
                  <span className="truncate">{jobType}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                    {jobTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setJobType(type);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          jobType === type
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl sm:rounded-full shadow-md shadow-blue-600/30 transition-all duration-200 cursor-pointer whitespace-nowrap text-center shrink-0"
              >
                Search Jobs
              </button>
            </form>

            {/* Stats Counter Row */}
            <div className="pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-xl">
              {/* Stat 1 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
                  <Briefcase className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    10,000+
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Active Jobs
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/70 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                  <Building2 className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    5,000+
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Hiring Companies
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100/70 flex items-center justify-center text-sky-600 shrink-0 shadow-xs">
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    50,000+
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Registered Job Seekers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: HERO PERSON & FLOATING ELEMENTS ================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] lg:min-h-[520px]">
            
            {/* Multi-lobed Organic Pastel Cloud Backdrop */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <svg
                viewBox="0 0 500 500"
                className="w-[430px] sm:w-[500px] h-[430px] sm:h-[500px] opacity-85"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M160 380 C110 380 70 340 70 290 C70 250 95 218 130 205 C125 190 122 173 122 155 C122 105 162 65 212 65 C242 65 269 80 285 102 C302 85 326 75 352 75 C402 75 442 115 442 165 C442 178 439 190 434 201 C462 218 480 249 480 285 C480 338 437 380 384 380 Z"
                  fill="url(#cloudGrad)"
                />
                <defs>
                  <linearGradient
                    id="cloudGrad"
                    x1="120"
                    y1="80"
                    x2="440"
                    y2="380"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EEF4FF" />
                    <stop offset="0.5" stopColor="#E6EEFC" />
                    <stop offset="1" stopColor="#DCE8FA" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Decorative Dot Matrix: Left of head / above shoulder (3 cols x 4 rows) */}
            <div className="absolute top-12 left-4 sm:left-10 z-0 grid grid-cols-3 gap-2.5 opacity-60 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              ))}
            </div>

            {/* Decorative Dot Matrix: Bottom right of woman (2 cols x 4 rows) */}
            <div className="absolute bottom-6 right-2 sm:right-6 z-0 grid grid-cols-2 gap-2.5 opacity-55 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              ))}
            </div>

            {/* Top Right "Better Jobs Brighter Future" Handwritten Callout & Arrow */}
            <div className="absolute top-2 right-1 sm:right-4 z-20 pointer-events-none select-none flex flex-col items-center">
              <div className="text-right leading-tight">
                <span
                  style={{ fontFamily: "var(--font-caveat), cursive" }}
                  className="block text-2xl sm:text-3xl font-bold text-[#4338CA] tracking-wide"
                >
                  Better Jobs
                </span>
                <span
                  style={{ fontFamily: "var(--font-caveat), cursive" }}
                  className="block text-2xl sm:text-3xl font-bold text-[#4338CA] tracking-wide"
                >
                  Brighter Future
                </span>
              </div>

              {/* Hand-drawn curving arrow pointing downward to the Apply card */}
              <div className="w-12 h-12 relative -mt-0.5 ml-8">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-blue-500"
                >
                  {/* Curving swooping arc */}
                  <path
                    d="M12 6 C28 4, 38 12, 34 32"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Arrowhead */}
                  <path
                    d="M26 27 L 34 34 L 38 25"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Main Visual: Seamless Cutout of Professional Woman */}
            <div className="relative w-full max-w-[360px] sm:max-w-[410px] flex items-end justify-center z-10">
              <div className="relative w-full aspect-[3/4] max-h-[500px]">
                <Image
                  src="/hero-person.png"
                  alt="Young smiling businesswoman with laptop"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-contain object-bottom drop-shadow-xl"
                />
              </div>

              {/* Floating "Apply" Card on the right */}
              <div className="absolute right-[-12px] sm:right-[-24px] bottom-16 sm:bottom-20 z-30 bg-white/98 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_12px_32px_rgba(37,99,235,0.12)] border border-slate-100 min-w-[130px] sm:min-w-[150px] transition-transform hover:-translate-y-1 duration-300">
                {/* Top Row: "Apply" with green checkmark pill */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[#10B981] font-bold text-base sm:text-lg tracking-tight">
                    Apply
                  </span>
                  <div className="w-5 h-5 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600 ring-1 ring-emerald-200/50">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Sub items: Track and Get Hired */}
                <div className="space-y-1 text-xs sm:text-sm text-slate-600 font-medium">
                  <p>Track</p>
                  <p>Get Hired</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
