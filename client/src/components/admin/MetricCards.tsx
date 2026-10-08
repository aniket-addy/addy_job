"use client";

import React from "react";
import {
  Building2,
  Briefcase,
  FileCheck2,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface MetricCardsProps {
  onSelectTab: (tab: AdminTab) => void;
  pendingCount: number;
}

export default function MetricCards({ onSelectTab, pendingCount }: MetricCardsProps) {
  const cards = [
    {
      id: "companies" as AdminTab,
      title: "Total Companies",
      value: "245",
      change: "↑ 12%",
      subtext: `198 approved • ${pendingCount} pending`,
      actionLabel: "Manage",
      icon: Building2,
      iconBg: "bg-purple-100 text-purple-600",
      accentBorder: "hover:border-purple-200",
    },
    {
      id: "jobs" as AdminTab,
      title: "Total Job Postings",
      value: "1,248",
      change: "↑ 18%",
      subtext: "Active: 842 • Expired: 406",
      actionLabel: "View All",
      icon: Briefcase,
      iconBg: "bg-rose-100 text-rose-500",
      accentBorder: "hover:border-rose-200",
    },
    {
      id: "applications" as AdminTab,
      title: "Total Applications",
      value: "28,476",
      change: "↑ 22%",
      subtext: "Today: 2,482",
      actionLabel: "View All",
      icon: FileCheck2,
      iconBg: "bg-blue-100 text-blue-600",
      accentBorder: "hover:border-blue-200",
    },
    {
      id: "payments" as AdminTab,
      title: "Total Revenue",
      value: "₹ 12,45,230",
      change: "↑ 16%",
      subtext: "This month",
      actionLabel: "View Analytics",
      icon: CreditCard,
      iconBg: "bg-emerald-100 text-emerald-600",
      accentBorder: "hover:border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all group flex flex-col justify-between ${card.accentBorder}`}
          >
            <div>
              {/* Top Row: Icon + Title */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {card.title}
                </span>
              </div>

              {/* Value + Growth Badge */}
              <div className="mt-4 flex items-baseline gap-2.5">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                  {card.value}
                </h3>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {card.change}
                </span>
              </div>

              {/* Subtext */}
              <p className="mt-1 text-xs text-slate-400 font-medium">
                {card.subtext}
              </p>
            </div>

            {/* Bottom Link Action */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onSelectTab(card.id)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer flex items-center gap-1 group-hover:gap-1.5 duration-200"
              >
                <span>{card.actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
