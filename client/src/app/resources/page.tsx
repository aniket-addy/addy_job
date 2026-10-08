"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FileText,
  BookOpen,
  Calculator,
  Compass,
  ArrowRight,
  Download,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

const articles = [
  {
    title: "How to Ace Your System Design Interview in 2026",
    category: "Interview Prep",
    readTime: "7 min read",
    desc: "A comprehensive breakdown of distributed caching, database sharding, and real-time event streaming architectures.",
  },
  {
    title: "ATS-Friendly Resume Templates That Actually Land Calls",
    category: "Resume Building",
    readTime: "5 min read",
    desc: "Why modern Applicant Tracking Systems reject 70% of candidate resumes and how to format yours for maximum visibility.",
  },
  {
    title: "Negotiating Tech Compensation: Base, Equity & Bonuses",
    category: "Salary Strategy",
    readTime: "6 min read",
    desc: "Proven conversation scripts and benchmark data to counter-offer with confidence without risking the job offer.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar activeTab="Resources" />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-[#F8FAFC] py-12 sm:py-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Career Advancement Hub</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Career Resources &amp; Guides
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl">
            Everything you need to craft high-impact resumes, master technical interviews, and negotiate top-tier compensation.
          </p>
        </div>
      </section>

      {/* Main Tools & Guides */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        {/* Core Career Tools Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tool 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] transition duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Resume Builder &amp; Audit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Build an ATS-optimized, high-impact resume in minutes with pre-approved industry templates.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time keyword ATS score check</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Export to PDF &amp; DOCX</span>
                </li>
              </ul>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition cursor-pointer">
              Launch Resume Builder
            </button>
          </div>

          {/* Tool 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] transition duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <BookOpen className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Interview Prep Kit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                500+ curated interview questions and behavioral models asked by top Indian and global tech firms.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Frontend, Backend &amp; Full-Stack questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>STAR method behavioral framework</span>
                </li>
              </ul>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition cursor-pointer">
              Explore Interview Questions
            </button>
          </div>

          {/* Tool 3 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] transition duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <Calculator className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Tech Salary Benchmark
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Check realistic market salaries by experience level, location, and specialization across India.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Updated 2026 hiring package metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>In-hand vs CTC breakdown</span>
                </li>
              </ul>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition cursor-pointer">
              Calculate Market Salary
            </button>
          </div>
        </div>

        {/* Featured Guides & Articles */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Guides &amp; Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <div
                key={art.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-300 transition duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition mb-2">
                    {art.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {art.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
