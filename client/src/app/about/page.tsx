"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Target,
  Zap,
  Users2,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Radical Transparency",
      desc: "Clear compensation figures, genuine company culture metrics, and zero hidden recruitment surprises.",
      icon: ShieldCheck,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Direct Access",
      desc: "Skip bureaucratic gatekeepers. Connect straight to engineering managers and hiring decision makers.",
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Candidate First",
      desc: "Empowering job seekers with unbiased interview prep, real salary benchmarks, and tailored role recommendations.",
      icon: Users2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Long-Term Growth",
      desc: "We don't just connect you with a job. We help you design and build a thriving, future-proof career path.",
      icon: HeartHandshake,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar activeTab="About" />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-[#F8FAFC] py-14 sm:py-20 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-4">
            <Target className="w-3.5 h-3.5" />
            <span>Empowering Careers Across India</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Building the Next Generation <br />
            <span className="text-blue-600">Career Network</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            CareerConnect is designed to make hiring fair, transparent, and ultra-fast. We connect ambitious tech talent with top companies that value their skills.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 w-full z-10">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.03)] grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              50,000+
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Registered Job Seekers
            </p>
          </div>
          <div className="pt-6 sm:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              10,000+
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Verified Open Jobs
            </p>
          </div>
          <div className="pt-6 sm:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              5,000+
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Top Hiring Companies
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-16">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Every feature we build is guided by what brings real value to job seekers and teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-200 transition duration-200"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${val.color} border flex items-center justify-center mb-5`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Join CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center flex flex-col items-center justify-center shadow-xl shadow-blue-600/20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Take the Next Step?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
            Whether you are looking for your first tech break or your next leadership opportunity, your dream role is waiting.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/jobs"
              className="px-8 py-3.5 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-md transition active:scale-98"
            >
              Explore All Jobs
            </Link>
            <Link
              href="/companies"
              className="px-8 py-3.5 rounded-full bg-blue-500/30 hover:bg-blue-500/40 text-white font-semibold text-sm border border-white/20 transition"
            >
              Browse Companies
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
