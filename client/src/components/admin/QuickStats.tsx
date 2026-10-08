"use client";

import React from "react";
import { Building2, Briefcase, Users, CreditCard } from "lucide-react";

interface QuickStatsProps {
  pendingCompanies: number;
}

export default function QuickStats({ pendingCompanies }: QuickStatsProps) {
  const stats = [
    {
      title: "Pending Companies",
      value: pendingCompanies.toString(),
      icon: Building2,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Active Jobs",
      value: "842",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Today's Applications",
      value: "2,482",
      icon: Users,
      color: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      title: "Today's Revenue",
      value: "₹ 3,45,000",
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center gap-3"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${s.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-base font-bold text-slate-900 block leading-tight truncate">
                  {s.value}
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate block">
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
