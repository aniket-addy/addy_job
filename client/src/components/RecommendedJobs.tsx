"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Heart,
  ArrowRight,
  Globe,
  Sprout,
  Layers,
  Sparkles,
  Boxes,
  Triangle,
} from "lucide-react";

interface Job {
  id: string;
  company: string;
  companyIcon: React.ElementType;
  iconBg: string;
  iconColor: string;
  role: string;
  companySub: string;
  location: string;
  badges: string[];
  salary: string;
}

const jobs: Job[] = [
  {
    id: "1",
    company: "NovaTech",
    companyIcon: Layers,
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    iconColor: "text-white",
    role: "Frontend Developer",
    companySub: "NovaTech Solutions",
    location: "Bengaluru, Karnataka",
    badges: ["Full-time", "Remote"],
    salary: "₹6L - ₹10L/year",
  },
  {
    id: "2",
    company: "BrightPath",
    companyIcon: Sparkles,
    iconBg: "bg-gradient-to-br from-rose-500 to-amber-500",
    iconColor: "text-white",
    role: "UI/UX Designer",
    companySub: "BrightPath Digital",
    location: "Mohali, Punjab",
    badges: ["Full-time", "Hybrid"],
    salary: "₹5L - ₹8L/year",
  },
  {
    id: "3",
    company: "GreenField",
    companyIcon: Sprout,
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    iconColor: "text-white",
    role: "Marketing Associate",
    companySub: "GreenField Foods",
    location: "Noida, Uttar Pradesh",
    badges: ["Full-time", "On-site"],
    salary: "₹4L - ₹7L/year",
  },
  {
    id: "4",
    company: "Skyline",
    companyIcon: Globe,
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    iconColor: "text-white",
    role: "Backend Developer",
    companySub: "Skyline Technologies",
    location: "Hyderabad, Telangana",
    badges: ["Full-time", "Remote"],
    salary: "₹8L - ₹12L/year",
  },
  {
    id: "5",
    company: "Apex Labs",
    companyIcon: Triangle,
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    iconColor: "text-white",
    role: "DevOps Engineer",
    companySub: "Apex Labs Cloud",
    location: "Pune, Maharashtra",
    badges: ["Full-time", "Remote"],
    salary: "₹12L - ₹18L/year",
  },
  {
    id: "6",
    company: "PixelForge",
    companyIcon: Boxes,
    iconBg: "bg-gradient-to-br from-purple-500 to-indigo-600",
    iconColor: "text-white",
    role: "Product Designer",
    companySub: "PixelForge Studio",
    location: "Gurugram, Haryana",
    badges: ["Full-time", "Hybrid"],
    salary: "₹9L - ₹14L/year",
  },
];

export default function RecommendedJobs() {
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-8 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended for You
            </h2>
            <p className="hidden sm:block text-slate-500 text-xs sm:text-sm mt-1">
              Based on your profile, skills and interests.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition group cursor-pointer whitespace-nowrap"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Horizontal Manual Scrollable Job Cards Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {jobs.map((job) => {
            const Icon = job.companyIcon;
            const isSaved = !!savedJobs[job.id];
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="w-[270px] sm:w-[310px] shrink-0 snap-start bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Company Row: Logo + Company Name + Heart Save Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${job.iconBg} flex items-center justify-center shadow-xs shrink-0`}
                      >
                        <Icon className={`w-5 h-5 ${job.iconColor}`} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {job.company}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleSave(job.id, e)}
                      aria-label={isSaved ? "Unsave job" : "Save job"}
                      title={isSaved ? "Saved" : "Save Job"}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isSaved ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Job Title */}
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {job.role}
                  </h3>

                  {/* Location & Tags Meta Row */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {job.location} • {job.badges.join(" • ")}
                    </span>
                  </div>
                </div>

                {/* Salary Row (at the bottom of card) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Offered Salary</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {job.salary}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    View
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
