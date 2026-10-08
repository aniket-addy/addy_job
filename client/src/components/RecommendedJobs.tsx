"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Bookmark,
  ArrowRight,
  Globe,
  Compass,
  Sprout,
  Layers,
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
    iconBg: "bg-blue-600",
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
    companyIcon: Compass,
    iconBg: "bg-indigo-600",
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
    iconBg: "bg-emerald-600",
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
    iconBg: "bg-sky-600",
    iconColor: "text-white",
    role: "Backend Developer",
    companySub: "Skyline Technologies",
    location: "Hyderabad, Telangana",
    badges: ["Full-time", "Remote"],
    salary: "₹8L - ₹12L/year",
  },
];

export default function RecommendedJobs() {
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] mb-3">
              Handpicked for You
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended Jobs
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Based on your profile, skills and interests.
            </p>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition group self-start sm:self-auto"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job) => {
            const Icon = job.companyIcon;
            const isSaved = !!savedJobs[job.id];
            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Company Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl ${job.iconBg} flex items-center justify-center shadow-xs`}
                      >
                        <Icon className={`w-5 h-5 ${job.iconColor}`} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {job.company}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSave(job.id)}
                      aria-label="Save job"
                      title={isSaved ? "Saved" : "Save Job"}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isSaved
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isSaved ? "fill-blue-600 text-blue-600" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Company */}
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {job.role}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {job.companySub}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Salary */}
                  <div className="text-sm font-bold text-slate-900 mb-5">
                    {job.salary}
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  href={`/jobs/${job.id}`}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl transition duration-150 shadow-sm cursor-pointer text-center block"
                >
                  View Details &amp; Apply
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
