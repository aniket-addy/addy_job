"use client";

import React from "react";
import {
  Layers,
  Sparkles,
  Sprout,
  Globe,
  Boxes,
  Triangle,
} from "lucide-react";

const companies = [
  {
    name: "NovaTech",
    icon: Layers,
    color: "text-blue-600",
  },
  {
    name: "BrightPath",
    icon: Sparkles,
    color: "text-rose-500",
  },
  {
    name: "GreenField",
    icon: Sprout,
    color: "text-emerald-600",
  },
  {
    name: "Skyline",
    icon: Globe,
    color: "text-sky-500",
  },
  {
    name: "PixelForge",
    icon: Boxes,
    color: "text-purple-600",
  },
  {
    name: "Apex Labs",
    icon: Triangle,
    color: "text-cyan-600",
  },
];

// Duplicate items for continuous seamless loop
const marqueeList = [...companies, ...companies];

export default function TopCompanies() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (without View All Companies link) */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Top Companies
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Join 5,000+ hiring companies
          </p>
        </div>

        {/* Infinite Scrolling Logos Container (Right to Left) */}
        <div className="relative bg-white rounded-2xl py-6 sm:py-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Left Gradient Fade Mask */}
          <div className="absolute left-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Fade Mask */}
          <div className="absolute right-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Continuous Marquee Track */}
          <div className="animate-marquee flex items-center gap-12 sm:gap-16">
            {marqueeList.map((comp, idx) => {
              const Icon = comp.icon;
              return (
                <div
                  key={`${comp.name}-${idx}`}
                  className="flex items-center gap-3 shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                  <Icon
                    className={`w-6 h-6 ${comp.color} transition-transform group-hover:scale-110`}
                  />
                  <span className="font-bold text-slate-800 text-base sm:text-lg tracking-tight select-none">
                    {comp.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
