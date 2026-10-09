"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthSession } from "@/lib/api";
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
  const router = useRouter();

  const handleAdminLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 h-screen bg-white text-slate-700 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-200/80 shadow-2xl lg:shadow-none lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: Logo & Close Button (mobile) - Fixed */}
        <div className="h-20 px-6 shrink-0 flex items-center justify-between border-b border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
          >
            {/* CareerConnect Connected Nodes Logo */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-blue-600/10 rounded-lg p-1">
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 drop-shadow-sm"
              >
                <circle cx="10" cy="18" r="7" fill="#3B82F6" />
                <circle cx="25" cy="11" r="6" fill="#60A5FA" />
                <circle cx="26" cy="25" r="5" fill="#93C5FD" />
                <path
                  d="M14 16 L22 13"
                  stroke="#60A5FA"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M14 20 L23 23"
                  stroke="#60A5FA"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="18" r="3" fill="#FFFFFF" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Career<span className="text-blue-600">Connect</span>
            </span>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Scrollable Nav Menu */}
        <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors ${
                      isActive
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-blue-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600 border border-blue-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Platform Growth & Super Admin Profile - Fixed */}
        <div className="shrink-0 p-4 space-y-3 border-t border-slate-100 bg-slate-50/60">
          {/* Platform Growth Widget */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100 p-3.5 shadow-2xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Platform Growth
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    More companies. More jobs.
                  </p>
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
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
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-sm shadow-amber-500/20">
                <Crown className="w-4 h-4 text-amber-950" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-none flex items-center gap-1">
                  Super Admin
                </p>
                <p className="text-[11px] text-slate-400 truncate max-w-[125px]">
                  admin@careerconnect.com
                </p>
              </div>
            </div>

            <button
              onClick={handleAdminLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
