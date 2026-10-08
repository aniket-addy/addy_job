"use client";

import React from "react";
import {
  ArrowRight,
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

export default function TopCompanies() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Top Companies
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Join 5,000+ hiring companies
            </p>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition group self-start sm:self-auto"
          >
            <span>View All Companies</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Logos Container */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center">
          {companies.map((comp) => {
            const Icon = comp.icon;
            return (
              <div
                key={comp.name}
                className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity group cursor-pointer"
              >
                <Icon
                  className={`w-6 h-6 ${comp.color} transition-transform group-hover:scale-110`}
                />
                <span className="font-bold text-slate-800 text-sm sm:text-base tracking-tight">
                  {comp.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
