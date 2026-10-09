"use client";

import React from "react";
import { UserCheck, Search, FileText, Award, ArrowRight } from "lucide-react";

interface StepItem {
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  actionText: string;
}

const steps: StepItem[] = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Showcase your skills, experience and goals.",
    icon: UserCheck,
    href: "#create-profile",
    actionText: "Create Profile",
  },
  {
    step: "02",
    title: "Explore Jobs",
    description: "Find the right opportunities for your career.",
    icon: Search,
    href: "#explore-jobs",
    actionText: "Explore Jobs",
  },
  {
    step: "03",
    title: "Apply with One-Click",
    description: "Submit your application in seconds.",
    icon: FileText,
    href: "#recommended-jobs",
    actionText: "View Jobs",
  },
  {
    step: "04",
    title: "Get Hired",
    description: "Start your new chapter with your dream job.",
    icon: Award,
    href: "#get-hired",
    actionText: "Success Stories",
  },
];

export default function HowItWorks() {
  const handleStepClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-white scroll-mt-24">
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
                <a
                  href={item.href}
                  onClick={(e) => handleStepClick(e, item.href)}
                  aria-label={`${item.title} - ${item.actionText}`}
                  className="w-full bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-500 hover:shadow-[0_12px_28px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 active:scale-[0.99] transition-all duration-200 flex flex-col items-start group cursor-pointer text-left h-full"
                >
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200 shadow-xs">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-sm font-bold text-slate-400 group-hover:text-blue-600 font-mono transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 text-base mb-2 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5">
                    {item.description}
                  </p>

                  {/* Action Link Footer */}
                  <div className="mt-auto pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                    <span>{item.actionText}</span>
                    <div className="w-6 h-6 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </a>

                {/* Connecting arrow for desktop between items */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-100 border border-slate-200 items-center justify-center text-slate-400 shadow-xs pointer-events-none">
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
