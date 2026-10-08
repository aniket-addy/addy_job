"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  MapPin,
  Users,
  Star,
  ExternalLink,
  Layers,
  Sparkles,
  Sprout,
  Globe,
  Boxes,
  Triangle,
  Building2,
} from "lucide-react";

interface CompanyItem {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  rating: number;
  openRoles: number;
  about: string;
  icon: React.ElementType;
  iconBg: string;
  color: string;
}

const companiesData: CompanyItem[] = [
  {
    id: "1",
    name: "NovaTech Solutions",
    industry: "Enterprise Software & Cloud",
    location: "Bengaluru, Karnataka",
    size: "1,200+ employees",
    rating: 4.8,
    openRoles: 24,
    about: "Building high-performance next generation cloud infrastructure and enterprise modern tools.",
    icon: Layers,
    iconBg: "bg-blue-50 border-blue-100",
    color: "text-blue-600",
  },
  {
    id: "2",
    name: "BrightPath Digital",
    industry: "Design & UX Innovations",
    location: "Mohali, Punjab",
    size: "450+ employees",
    rating: 4.9,
    openRoles: 12,
    about: "Award-winning product studio creating intuitive digital experiences for global high-growth brands.",
    icon: Sparkles,
    iconBg: "bg-rose-50 border-rose-100",
    color: "text-rose-500",
  },
  {
    id: "3",
    name: "GreenField Foods",
    industry: "AgriTech & Sustainable Supply",
    location: "Noida, Uttar Pradesh",
    size: "800+ employees",
    rating: 4.7,
    openRoles: 18,
    about: "Revolutionizing modern agricultural logistics and clean food supply chains across India.",
    icon: Sprout,
    iconBg: "bg-emerald-50 border-emerald-100",
    color: "text-emerald-600",
  },
  {
    id: "4",
    name: "Skyline Technologies",
    industry: "Fintech & Global Banking",
    location: "Hyderabad, Telangana",
    size: "2,500+ employees",
    rating: 4.8,
    openRoles: 42,
    about: "Powering real-time global financial transactions, decentralized ledgers, and secure payment APIs.",
    icon: Globe,
    iconBg: "bg-sky-50 border-sky-100",
    color: "text-sky-500",
  },
  {
    id: "5",
    name: "PixelForge Interactive",
    industry: "Gaming & Interactive Media",
    location: "Gurugram, Haryana",
    size: "320+ employees",
    rating: 4.6,
    openRoles: 9,
    about: "Creating immersive 3D simulations, mobile multiplayer titles, and interactive virtual tools.",
    icon: Boxes,
    iconBg: "bg-purple-50 border-purple-100",
    color: "text-purple-600",
  },
  {
    id: "6",
    name: "Apex Labs",
    industry: "Artificial Intelligence & Robotics",
    location: "Pune, Maharashtra",
    size: "600+ employees",
    rating: 4.9,
    openRoles: 15,
    about: "Developing autonomous system intelligence and LLM-powered enterprise automation systems.",
    icon: Triangle,
    iconBg: "bg-cyan-50 border-cyan-100",
    color: "text-cyan-600",
  },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState("");

  const filtered = companiesData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar activeTab="Companies" />

      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-[#F8FAFC] py-12 sm:py-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>5,000+ Verified Hiring Employers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Top Companies
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl">
            Discover great work cultures, competitive compensation benefits, and exciting career growth.
          </p>

          {/* Search bar */}
          <div className="mt-8 bg-white p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-200/80 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search company by name, industry, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm font-medium focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-500/20">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => {
            const Icon = comp.icon;
            return (
              <div
                key={comp.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl ${comp.iconBg} border flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-6 h-6 ${comp.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {comp.name}
                        </h3>
                        <p className="text-xs text-slate-500">{comp.industry}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{comp.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-5">
                    {comp.about}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 pb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{comp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{comp.size}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {comp.openRoles} Open Positions
                  </span>

                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                  >
                    <span>View Jobs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
