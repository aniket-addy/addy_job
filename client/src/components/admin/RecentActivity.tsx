"use client";

import React from "react";
import {
  CheckCircle2,
  User,
  CreditCard,
  XCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface RecentActivityProps {
  onSelectTab: (tab: AdminTab) => void;
}

export default function RecentActivity({ onSelectTab }: RecentActivityProps) {
  const activities = [
    {
      id: 1,
      title: "New company registered",
      details: "TechVision Solutions",
      time: "2 hours ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-500 bg-emerald-50 ring-emerald-100",
      tab: "companies" as AdminTab,
    },
    {
      id: 2,
      title: "New application received",
      details: "Frontend Developer — PixelForge",
      time: "3 hours ago",
      icon: User,
      iconColor: "text-blue-500 bg-blue-50 ring-blue-100",
      tab: "applications" as AdminTab,
    },
    {
      id: 3,
      title: "Payment received",
      details: "Acme Corp — Pro Plan",
      time: "5 hours ago",
      icon: CreditCard,
      iconColor: "text-amber-500 bg-amber-50 ring-amber-100",
      tab: "payments" as AdminTab,
    },
    {
      id: 4,
      title: "Company rejected",
      details: "BuildBit Inc.",
      time: "6 hours ago",
      icon: XCircle,
      iconColor: "text-rose-500 bg-rose-50 ring-rose-100",
      tab: "companies" as AdminTab,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
        <button
          onClick={() => onSelectTab("reports")}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Activities list */}
      <div className="mt-4 space-y-4">
        {activities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectTab(item.tab)}
              className="flex items-start gap-3.5 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              {/* Icon with subtle ring */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-4 ${item.iconColor} transition-transform group-hover:scale-105`}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  {item.details}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <Clock className="w-2.5 h-2.5" />
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400 font-medium">
          Auto-synced with platform events
        </span>
      </div>
    </div>
  );
}
