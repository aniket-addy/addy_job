"use client";

import React from "react";
import {
  Code2,
  Palette,
  Megaphone,
  TrendingUp,
  CircleDollarSign,
  Users2,
  ArrowRight,
} from "lucide-react";

interface Category {
  title: string;
  jobs: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const categories: Category[] = [
  {
    title: "IT & Software",
    jobs: "2,500+ jobs",
    icon: Code2,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 border-indigo-100",
  },
  {
    title: "Design & Creative",
    jobs: "1,200+ jobs",
    icon: Palette,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-100",
  },
  {
    title: "Marketing",
    jobs: "1,400+ jobs",
    icon: Megaphone,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 border-purple-100",
  },
  {
    title: "Sales",
    jobs: "1,100+ jobs",
    icon: TrendingUp,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-100",
  },
  {
    title: "Finance",
    jobs: "900+ jobs",
    icon: CircleDollarSign,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50 border-teal-100",
  },
  {
    title: "HR",
    jobs: "700+ jobs",
    icon: Users2,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 border-blue-100",
  },
];

export default function JobCategories() {
  return (
    <section className="py-14 sm:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] mb-3">
              Popular Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Jobs by Category
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Find opportunities in your area of expertise and grow your career.
            </p>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition group self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-200 group cursor-pointer flex flex-col items-start"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${cat.iconBg} border flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}
                >
                  <Icon className={`w-6 h-6 ${cat.iconColor} stroke-[2]`} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <span className="text-xs text-slate-500 mt-1">{cat.jobs}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
