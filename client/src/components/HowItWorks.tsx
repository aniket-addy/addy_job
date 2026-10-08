"use client";

import React from "react";
import { UserCheck, Search, FileText, Award, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Showcase your skills, experience and goals.",
    icon: UserCheck,
  },
  {
    step: "02",
    title: "Explore Jobs",
    description: "Find the right opportunities for your career.",
    icon: Search,
  },
  {
    step: "03",
    title: "Apply with One-Click",
    description: "Submit your application in seconds.",
    icon: FileText,
  },
  {
    step: "04",
    title: "Get Hired",
    description: "Start your new chapter with your dream job.",
    icon: Award,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]">
              How It Works
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              Simple 4 Steps
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Get Hired in 4 Easy Steps
          </h2>
        </div>

        {/* Steps Grid with Connecting Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative flex items-center">
                <div className="w-full bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.06)] transition duration-200 flex flex-col items-start">
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-sm font-bold text-slate-400 font-mono">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Connecting arrow for desktop between items */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-100 border border-slate-200 items-center justify-center text-slate-400 shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
