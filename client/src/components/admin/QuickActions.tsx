"use client";

import React from "react";
import {
  Building2,
  PlusCircle,
  Briefcase,
  FileCheck2,
  Receipt,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface QuickActionsProps {
  onSelectAction: (tab: AdminTab) => void;
  onOpenCreatePlan?: () => void;
}

export default function QuickActions({
  onSelectAction,
  onOpenCreatePlan,
}: QuickActionsProps) {
  const actions = [
    {
      title: "Manage Companies",
      subtitle: "Approve / Reject / View",
      icon: Building2,
      tab: "companies" as AdminTab,
      bg: "bg-purple-50 hover:bg-purple-100/80 border-purple-100 hover:border-purple-200",
      iconColor: "text-purple-600 bg-white shadow-sm",
    },
    {
      title: "Create Subscription Plan",
      subtitle: "Add / Edit / Manage",
      icon: PlusCircle,
      tab: "plans" as AdminTab,
      bg: "bg-pink-50 hover:bg-pink-100/80 border-pink-100 hover:border-pink-200",
      iconColor: "text-pink-600 bg-white shadow-sm",
      isCustomAction: true,
    },
    {
      title: "Monitor Jobs",
      subtitle: "View & Moderate",
      icon: Briefcase,
      tab: "jobs" as AdminTab,
      bg: "bg-cyan-50 hover:bg-cyan-100/80 border-cyan-100 hover:border-cyan-200",
      iconColor: "text-cyan-600 bg-white shadow-sm",
    },
    {
      title: "View Applications",
      subtitle: "Track & Review",
      icon: FileCheck2,
      tab: "applications" as AdminTab,
      bg: "bg-violet-50 hover:bg-violet-100/80 border-violet-100 hover:border-violet-200",
      iconColor: "text-violet-600 bg-white shadow-sm",
    },
    {
      title: "View Payments",
      subtitle: "Transactions & Invoices",
      icon: Receipt,
      tab: "payments" as AdminTab,
      bg: "bg-blue-50 hover:bg-blue-100/80 border-blue-100 hover:border-blue-200",
      iconColor: "text-blue-600 bg-white shadow-sm",
    },
    {
      title: "Reports & Analytics",
      subtitle: "Insights & Reports",
      icon: BarChart3,
      tab: "reports" as AdminTab,
      bg: "bg-indigo-50 hover:bg-indigo-100/80 border-indigo-100 hover:border-indigo-200",
      iconColor: "text-indigo-600 bg-white shadow-sm",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Quick Actions</span>
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            Super Admin Controls
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={() => {
                if (act.isCustomAction && onOpenCreatePlan) {
                  onOpenCreatePlan();
                } else {
                  onSelectAction(act.tab);
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex flex-col justify-between group ${act.bg}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${act.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {act.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
