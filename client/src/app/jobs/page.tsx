"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { jobsList } from "@/data/jobsData";
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  Bookmark,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});

  const categories = ["All", "Engineering", "Design", "Marketing", "Product", "Finance", "HR"];

  const filteredJobs = jobsList.filter((job) => {
    const matchesCategory =
      selectedCategory === "All" || job.category === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar activeTab="Jobs" />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-[#F8FAFC] py-12 sm:py-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover 10,000+ Opportunities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl">
            Click on any job card to view complete company insights, requirements, and apply directly.
          </p>

          {/* Search Box */}
          <div className="mt-8 bg-white p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-200/80 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by job title, company, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-medium focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/20">
              Find Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Main Jobs Listing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredJobs.length}</span> positions available
          </p>
        </div>

        {/* Jobs List Grid: Entire card is clickable to view company & job details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const isSaved = !!savedJobs[job.id];
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group block bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-300 hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition flex items-center gap-1.5">
                        <span>{job.title}</span>
                      </h3>
                      <p className="text-sm font-semibold text-blue-600 mt-0.5">
                        {job.company}
                      </p>
                    </div>

                    <button
                      onClick={(e) => toggleSave(e, job.id)}
                      aria-label="Save Job"
                      title={isSaved ? "Saved" : "Save Job"}
                      className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
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

                  {/* Location & Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 my-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {job.type} • {job.workplace}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.posted}
                    </span>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
