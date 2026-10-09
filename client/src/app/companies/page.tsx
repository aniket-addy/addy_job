"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { companiesList, Company } from "@/data/companiesData";
import { jobsList } from "@/data/jobsData";
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
  ArrowRight,
  Briefcase,
  ChevronDown,
  Check,
} from "lucide-react";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [desktopLocationDropdownOpen, setDesktopLocationDropdownOpen] = useState(false);
  const [desktopIndustryDropdownOpen, setDesktopIndustryDropdownOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const industryRef = useRef<HTMLDivElement>(null);
  const desktopLocationRef = useRef<HTMLDivElement>(null);
  const desktopIndustryRef = useRef<HTMLDivElement>(null);

  const locationsList = [
    "All Locations",
    "Bengaluru",
    "Mumbai",
    "Delhi NCR",
    "Hyderabad",
    "Pune",
    "Remote",
  ];

  const industriesList = [
    "All Industries",
    "Enterprise Software & Cloud",
    "FinTech & Digital Payments",
    "EdTech & Learning Platforms",
    "HealthTech & Diagnostics",
    "E-commerce & Logistics",
    "AI & Developer Tools",
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
      if (industryRef.current && !industryRef.current.contains(event.target as Node)) {
        setIndustryDropdownOpen(false);
      }
      if (desktopLocationRef.current && !desktopLocationRef.current.contains(event.target as Node)) {
        setDesktopLocationDropdownOpen(false);
      }
      if (desktopIndustryRef.current && !desktopIndustryRef.current.contains(event.target as Node)) {
        setDesktopIndustryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = companiesList.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesLocation =
      selectedLocation === "All Locations" ||
      c.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesIndustry =
      selectedIndustry === "All Industries" ||
      c.industry.toLowerCase().includes(selectedIndustry.toLowerCase());
    return matchesSearch && matchesLocation && matchesIndustry;
  });

  const getCompanyIcon = (iconName: string, color: string) => {
    const props = { className: `w-6 h-6 ${color}` };
    switch (iconName) {
      case "Layers":
        return <Layers {...props} />;
      case "Sparkles":
        return <Sparkles {...props} />;
      case "Sprout":
        return <Sprout {...props} />;
      case "Globe":
        return <Globe {...props} />;
      case "Boxes":
        return <Boxes {...props} />;
      case "Triangle":
        return <Triangle {...props} />;
      default:
        return <Building2 {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar activeTab="Companies" />

      {/* Header Section (Matching Reference Image 1) */}
      <section className="relative z-30 bg-gradient-to-b from-[#F5F8FF] via-[#EDF3FE] to-[#F8FAFC] pt-4 pb-8 sm:pt-8 sm:pb-12 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ================= 1. MOBILE HEADER DESIGN (Matches Image 1) ================= */}
          <div className="block lg:hidden">
            {/* Top Row: Left Text + Right 3D Skyscraper with Floating Logos */}
            <div className="flex items-start justify-between gap-2 pt-1 pb-3">
              {/* Left Column: Badge, Title & Subtitle */}
              <div className="flex-1 pr-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EBF3FE] text-[#1D68FE] border border-blue-200/70 mb-2.5 shadow-2xs">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>5,000+ Verified Companies</span>
                </div>

                {/* Headline */}
                <h1 className="text-[1.95rem] xs:text-3xl sm:text-4xl font-black text-[#0B1528] tracking-tight leading-[1.12]">
                  Explore Top <br />
                  <span className="text-[#1D68FE]">Companies</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed mt-2.5 max-w-[195px] xs:max-w-[220px]">
                  Discover great work cultures, competitive compensation benefits, and view all active job openings by company.
                </p>
              </div>

              {/* Right Column: 3D Skyscraper Graphic with Floating Company Tiles */}
              <div className="relative w-[140px] xs:w-[155px] sm:w-[175px] h-[178px] xs:h-[195px] sm:h-[215px] shrink-0">
                {/* 3D Skyscraper Container */}
                <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-md border border-white/80">
                  <Image
                    src="/companies-tower-3d.jpg"
                    alt="Corporate headquarters skyscraper"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Tile 1: Google (Top Left) */}
                <div className="absolute left-[-16px] top-4 z-20 w-10 h-10 rounded-2xl bg-white shadow-lg border border-slate-100/90 flex items-center justify-center p-2 -rotate-6">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>

                {/* Floating Tile 2: Amazon (Bottom Left) */}
                <div className="absolute left-[-10px] bottom-7 z-20 w-11 h-11 rounded-2xl bg-white shadow-lg border border-slate-100/90 flex items-center justify-center p-1.5 rotate-3">
                  <span className="text-xl font-black text-slate-900 leading-none">a</span>
                </div>

                {/* Floating Tile 3: Microsoft (Bottom Right) */}
                <div className="absolute right-2 bottom-6 z-20 w-10 h-10 rounded-2xl bg-white shadow-lg border border-slate-100/90 flex items-center justify-center p-2 -rotate-3">
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <span className="bg-[#F25022] w-1.5 h-1.5 rounded-2xs" />
                    <span className="bg-[#7FBA00] w-1.5 h-1.5 rounded-2xs" />
                    <span className="bg-[#00A4EF] w-1.5 h-1.5 rounded-2xs" />
                    <span className="bg-[#FFB900] w-1.5 h-1.5 rounded-2xs" />
                  </div>
                </div>

                {/* Floating Tile 4: Spotify (Top Right) */}
                <div className="absolute right-[-10px] top-10 z-20 w-10 h-10 rounded-2xl bg-white shadow-lg border border-slate-100/90 flex items-center justify-center p-1.5 rotate-6">
                  <div className="w-6 h-6 rounded-full bg-[#1DB954] text-white flex items-center justify-center p-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Search Card Container (Matches Image 1 Exactly) */}
            <div className="mt-2.5 bg-white rounded-3xl p-3 border border-slate-200/90 shadow-[0_8px_30px_rgba(15,23,42,0.06)] relative z-40">
              {/* Row 1: Search Input */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-slate-200/90 bg-white">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search company by name, industry, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
              </div>

              {/* Row 2: Location + Industry + Search Button */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2.5">
                {/* 1. Location Pill */}
                <div ref={locationRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    className="w-full h-11 px-3 rounded-2xl border border-slate-200/90 bg-white flex items-center justify-between gap-1 text-left cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {selectedLocation === "All Locations" ? "Location" : selectedLocation}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        locationDropdownOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {locationDropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 w-52 max-h-72 overflow-y-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-100 p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1.5">
                        Select Location
                      </div>
                      {locationsList.map((loc) => {
                        const isSelected = selectedLocation === loc;
                        return (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              setSelectedLocation(loc);
                              setLocationDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 text-blue-600 font-bold"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{loc}</span>
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Industry Pill */}
                <div ref={industryRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
                    className="w-full h-11 px-3 rounded-2xl border border-slate-200/90 bg-white flex items-center justify-between gap-1 text-left cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {selectedIndustry === "All Industries" ? "Industry" : selectedIndustry}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        industryDropdownOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {industryDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 max-h-72 overflow-y-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-100 p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1.5">
                        Select Industry
                      </div>
                      {industriesList.map((ind) => {
                        const isSelected = selectedIndustry === ind;
                        return (
                          <button
                            key={ind}
                            type="button"
                            onClick={() => {
                              setSelectedIndustry(ind);
                              setIndustryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 text-blue-600 font-bold"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <span className="truncate">{ind}</span>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Search Button (Text matching Image 1) */}
                <button
                  type="button"
                  className="h-11 px-6 rounded-2xl bg-[#1D68FE] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center transition shadow-sm cursor-pointer shrink-0"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* ================= 2. DESKTOP HEADER DESIGN (Matches Image 1) ================= */}
          <div className="hidden lg:block pt-2 pb-2">
            <div className="grid grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="col-span-5 xl:col-span-5 text-left pr-2">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EBF3FE] text-[#1D68FE] border border-blue-200/70 shadow-2xs mb-4">
                  <Building2 className="w-4 h-4" />
                  <span>5,000+ Verified Companies</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl xl:text-5xl font-black text-[#0B1528] tracking-tight leading-[1.12]">
                  Explore Top <br />
                  <span className="text-[#1D68FE]">Companies</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-500 text-sm xl:text-base font-normal leading-relaxed mt-4 max-w-sm">
                  Discover great work cultures, competitive compensation benefits, and view all active job openings by company.
                </p>

                {/* Decorative Sparkle & Doodle Arc matching Image 1 */}
                <div className="relative mt-3 h-10 w-44 pointer-events-none">
                  {/* Blue 4-point Sparkle */}
                  <div className="absolute right-4 top-0.5 text-[#1D68FE]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                  </div>
                  {/* Subtle Curved Arc */}
                  <svg className="w-32 h-8 text-[#1D68FE]/60" viewBox="0 0 120 28" fill="none">
                    <path d="M4 24 C 28 6, 68 4, 102 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Right Column: Wide Glass Headquarters Campus with Overlapping Badges & Logos */}
              <div className="col-span-7 xl:col-span-7 relative h-[290px] xl:h-[320px]">
                {/* Campus Image Frame */}
                <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-[0_16px_40px_rgba(15,23,42,0.08)] border border-white/80">
                  <Image
                    src="/companies-desktop-campus.jpg"
                    alt="Corporate Headquarters Campus"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                  {/* Gradient Overlays */}
                  <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F5F8FF]/90 via-[#F5F8FF]/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge 1: 5,000+ Verified Companies (Top Left) */}
                <div className="absolute left-[-16px] top-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)] border border-slate-100 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1D68FE] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 leading-tight">5,000+</div>
                    <div className="text-[11px] font-medium text-slate-500 leading-tight">Verified Companies</div>
                  </div>
                </div>

                {/* Floating Badge 2: 200K+ Active Job Openings (Top Right) */}
                <div className="absolute right-4 top-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)] border border-slate-100 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-9 h-9 rounded-xl bg-[#1D68FE] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 leading-tight">200K+</div>
                    <div className="text-[11px] font-medium text-slate-500 leading-tight">Active Job Openings</div>
                  </div>
                </div>

                {/* Floating Company Logos Overlapping in Front of Building */}
                <div className="absolute left-6 bottom-3 z-20 flex items-center gap-3">
                  {/* Google */}
                  <div className="w-13 h-13 xl:w-14 xl:h-14 rounded-2xl bg-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] border border-slate-100/90 flex items-center justify-center p-2.5 -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                  </div>

                  {/* Microsoft */}
                  <div className="w-13 h-13 xl:w-14 xl:h-14 rounded-2xl bg-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] border border-slate-100/90 flex items-center justify-center p-3 rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-pointer">
                    <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                      <span className="bg-[#F25022] w-2 h-2 rounded-2xs" />
                      <span className="bg-[#7FBA00] w-2 h-2 rounded-2xs" />
                      <span className="bg-[#00A4EF] w-2 h-2 rounded-2xs" />
                      <span className="bg-[#FFB900] w-2 h-2 rounded-2xs" />
                    </div>
                  </div>

                  {/* Amazon */}
                  <div className="w-13 h-13 xl:w-14 xl:h-14 rounded-2xl bg-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] border border-slate-100/90 flex items-center justify-center p-2.5 -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-900 leading-none">a</span>
                      <svg viewBox="0 0 32 8" className="w-5 h-1.5 text-amber-500 fill-current -mt-0.5">
                        <path d="M2 2 Q 16 9 30 2 Q 16 5 2 2 Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Spotify */}
                  <div className="w-13 h-13 xl:w-14 xl:h-14 rounded-2xl bg-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] border border-slate-100/90 flex items-center justify-center p-2.5 rotate-4 hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#1DB954] text-white flex items-center justify-center p-1.5 shadow-xs">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Horizontal Search Bar (Matching Image 1) */}
            <div className="mt-8 bg-white rounded-3xl p-2.5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-slate-200/90 flex items-center gap-2 max-w-6xl mx-auto relative z-40">
              {/* Field 1: Search */}
              <div className="flex items-center gap-3 px-4 py-2 flex-1">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Search company by name, industry, or city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full text-sm text-slate-800 placeholder:text-slate-400 font-medium bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="w-px h-8 bg-slate-200 shrink-0" />

              {/* Field 2: Location */}
              <div ref={desktopLocationRef} className="relative flex items-center gap-3 px-4 py-2 w-64">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="w-full">
                  <button
                    type="button"
                    onClick={() => setDesktopLocationDropdownOpen(!desktopLocationDropdownOpen)}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-700 bg-transparent cursor-pointer"
                  >
                    <span className="truncate">
                      {selectedLocation === "All Locations" ? "Location" : selectedLocation}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        desktopLocationDropdownOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                </div>

                {desktopLocationDropdownOpen && (
                  <div className="absolute left-2 top-full mt-2 w-60 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-100/90 p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1.5">
                      Select Location
                    </div>
                    {locationsList.map((loc) => {
                      const isSelected = selectedLocation === loc;
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setSelectedLocation(loc);
                            setDesktopLocationDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 text-blue-600 font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{loc}</span>
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-slate-200 shrink-0" />

              {/* Field 3: Industry */}
              <div ref={desktopIndustryRef} className="relative flex items-center gap-3 px-4 py-2 w-64">
                <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="w-full">
                  <button
                    type="button"
                    onClick={() => setDesktopIndustryDropdownOpen(!desktopIndustryDropdownOpen)}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-700 bg-transparent cursor-pointer"
                  >
                    <span className="truncate">
                      {selectedIndustry === "All Industries" ? "Industry" : selectedIndustry}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        desktopIndustryDropdownOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                </div>

                {desktopIndustryDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-100/90 p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1.5">
                      Select Industry
                    </div>
                    {industriesList.map((ind) => {
                      const isSelected = selectedIndustry === ind;
                      return (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => {
                            setSelectedIndustry(ind);
                            setDesktopIndustryDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 text-blue-600 font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span className="truncate">{ind}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Search Button (Matching Image 1: [ 🔍 Search Companies ]) */}
              <button
                type="button"
                className="px-7 py-3.5 rounded-2xl bg-[#1D68FE] hover:bg-blue-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4 text-white shrink-0" />
                <span>Search Companies</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Companies Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full relative z-10">
        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{filtered.length}</span> top hiring companies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => {
            // Count actual open jobs for this specific company
            const actualOpenJobs = jobsList.filter(
              (j) =>
                j.company.toLowerCase().includes(comp.name.toLowerCase()) ||
                comp.name.toLowerCase().includes(j.company.toLowerCase())
            );
            const openCount = actualOpenJobs.length > 0 ? actualOpenJobs.length : comp.openRoles;

            return (
              <Link
                key={comp.id}
                href={`/companies/${comp.id}`}
                className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-blue-400 hover:shadow-[0_12px_32px_rgba(37,99,235,0.09)] transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl ${comp.iconBg} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        {getCompanyIcon(comp.iconName, comp.color)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                          {comp.name}
                        </h3>
                        <p className="text-xs text-slate-500">{comp.industry}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-xl text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
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
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-emerald-600" />
                    <span>{openCount} Open Positions</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all">
                    <span>View Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
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
