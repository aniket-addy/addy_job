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

import { CompanyRecord } from "./CompaniesManager";
import { ApplicationItem } from "./RecentApplications";
import { JobPosting } from "./JobsModerator";

interface RecentActivityProps {
  onSelectTab: (tab: AdminTab) => void;
  companies?: CompanyRecord[];
  applications?: ApplicationItem[];
  jobs?: JobPosting[];
}

export default function RecentActivity({
  onSelectTab,
  companies = [],
  applications = [],
  jobs = [],
}: RecentActivityProps) {
  // Generate real activities from database records
  const activities = [
    ...companies.slice(0, 3).map((c) => ({
      id: `comp-${c.id}`,
      title:
        c.status === "Approved"
          ? "Company approved"
          : c.status === "Rejected"
          ? "Company rejected"
          : "New company registered",
      details: `${c.name} — ${c.plan || "Platform User"}`,
      time: c.submittedOn || "Recently",
      icon: c.status === "Rejected" ? XCircle : CheckCircle2,
      iconColor:
        c.status === "Rejected"
          ? "text-rose-500 bg-rose-50 ring-rose-100"
          : "text-emerald-500 bg-emerald-50 ring-emerald-100",
      tab: "companies" as AdminTab,
    })),
    ...applications.slice(0, 3).map((a) => ({
      id: `app-${a.id}`,
      title: "New application received",
      details: `${a.candidateName} applied for ${a.position}`,
      time: a.appliedOn || "Recently",
      icon: User,
      iconColor: "text-blue-500 bg-blue-50 ring-blue-100",
      tab: "resumes" as AdminTab,
    })),
  ].slice(0, 5);

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
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No platform activity recorded yet.
          </p>
        ) : (
          activities.map((item, idx) => {
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
          })
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400 font-medium">
          Auto-synced with platform events
        </span>
      </div>
    </div>
  );
}
