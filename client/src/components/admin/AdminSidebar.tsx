"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Briefcase,
  FileCheck2,
  FileText,
  Receipt,
  Tags,
  BarChart3,
  Settings,
  LogOut,
  Crown,
  X,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "companies"
  | "subscriptions"
  | "jobs"
  | "applications"
  | "resumes"
  | "payments"
  | "plans"
  | "reports"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  pendingCompaniesCount?: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  pendingCompaniesCount = 12,
}: AdminSidebarProps) {
  const menuItems = [
    {
      id: "dashboard" as AdminTab,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "companies" as AdminTab,
      label: "Companies",
      icon: Building2,
      badge: pendingCompaniesCount > 0 ? pendingCompaniesCount : undefined,
    },
    {
      id: "subscriptions" as AdminTab,
      label: "Subscriptions",
      icon: CreditCard,
    },
    {
      id: "jobs" as AdminTab,
      label: "Job Postings",
      icon: Briefcase,
    },
    {
      id: "applications" as AdminTab,
      label: "Applications",
      icon: FileCheck2,
    },
    {
      id: "resumes" as AdminTab,
      label: "Resumes",
      icon: FileText,
    },
    {
      id: "payments" as AdminTab,
      label: "Payments",
      icon: Receipt,
    },
    {
      id: "plans" as AdminTab,
      label: "Plans & Pricing",
      icon: Tags,
    },
    {
      id: "reports" as AdminTab,
      label: "Reports & Analytics",
      icon: BarChart3,
    },
    {
      id: "settings" as AdminTab,
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile / Tablet Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0A1326] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#162238] shadow-2xl lg:shadow-none lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: Logo & Close Button (mobile) */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-[#162238]/80">
            <Link
              href="/"
              className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
            >
              {/* AddyJob Logo */}
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center p-0.5 shrink-0">
                <Image
                  src="/addyjob-logo.png"
                  alt="AddyJob Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                Addy<span className="text-blue-500">Job</span>
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Menu */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] scrollbar-thin scrollbar-thumb-slate-800">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-[#121E36]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-[18px] h-[18px] transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-blue-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? "bg-white text-blue-600"
                          : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Platform Growth & Super Admin Profile */}
        <div className="p-4 space-y-3 border-t border-[#162238]/80 bg-[#080F1E]">
          {/* Platform Growth Widget */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121E36] to-[#0E172B] border border-blue-900/40 p-3.5 shadow-inner">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Platform Growth
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    More companies. More jobs.
                  </p>
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            </div>

            {/* Glowing Wavy Line Chart Accent */}
            <div className="mt-2.5 pt-1 relative h-6 w-full">
              <svg
                viewBox="0 0 100 24"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient
                    id="growthWave"
                    x1="0"
                    y1="0"
                    x2="100"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#818CF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 18 Q 20 8, 40 14 T 75 6 T 100 4"
                  fill="none"
                  stroke="url(#growthWave)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Super Admin User Footer */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Crown className="w-4 h-4 text-amber-950" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none flex items-center gap-1">
                  Super Admin
                </p>
                <p className="text-[11px] text-slate-400 truncate max-w-[125px]">
                  admin@addyjob.com
                </p>
              </div>
            </div>

            <Link
              href="/"
              title="Return to Public Website"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
