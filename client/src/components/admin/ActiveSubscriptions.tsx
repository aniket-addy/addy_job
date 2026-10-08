"use client";

import React from "react";
import { ShieldCheck, Award, Zap, ArrowRight } from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface ActiveSubscriptionsProps {
  onSelectTab: (tab: AdminTab) => void;
}

export default function ActiveSubscriptions({
  onSelectTab,
}: ActiveSubscriptionsProps) {
  const plans = [
    {
      id: "pro",
      name: "Pro Plan",
      companiesCount: "128 companies",
      price: "₹ 9,999",
      period: "/ month",
      status: "Active",
      icon: Zap,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      borderAccent: "hover:border-blue-200",
    },
    {
      id: "premium",
      name: "Premium Plan",
      companiesCount: "72 companies",
      price: "₹ 19,999",
      period: "/ month",
      status: "Active",
      icon: Award,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      borderAccent: "hover:border-emerald-200",
    },
    {
      id: "basic",
      name: "Basic Plan",
      companiesCount: "45 companies",
      price: "₹ 4,999",
      period: "/ month",
      status: "Active",
      icon: ShieldCheck,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      borderAccent: "hover:border-amber-200",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Active Subscriptions</h3>
        <button
          onClick={() => onSelectTab("subscriptions")}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Plans List */}
      <div className="mt-4 space-y-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              onClick={() => onSelectTab("plans")}
              className={`p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between group ${plan.borderAccent}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${plan.iconBg}`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {plan.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {plan.companiesCount}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">
                  {plan.price}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    {plan.period}
                  </span>
                </div>
                <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                  {plan.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
