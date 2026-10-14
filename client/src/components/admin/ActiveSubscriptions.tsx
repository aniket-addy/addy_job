"use client";

import React from "react";
import { ShieldCheck, Award, Zap, ArrowRight } from "lucide-react";
import { AdminTab } from "./AdminSidebar";

import { PlanItem } from "./PlansPricingManager";
import { CompanyRecord } from "./CompaniesManager";

interface ActiveSubscriptionsProps {
  onSelectTab: (tab: AdminTab) => void;
  plans?: PlanItem[];
  allCompanies?: CompanyRecord[];
}

export default function ActiveSubscriptions({
  onSelectTab,
  plans = [],
  allCompanies = [],
}: ActiveSubscriptionsProps) {

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Plans & Pricing</h3>
        <button
          onClick={() => onSelectTab("plans")}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          Manage Plans
        </button>
      </div>

      {/* Plans List */}
      <div className="mt-4 space-y-3">
        {plans.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No active subscription plans configured yet.
          </p>
        ) : (
          plans.map((plan, idx) => {
            const subscribedCount = allCompanies.filter(
              (c) => c.plan && c.plan.toLowerCase() === plan.name.toLowerCase()
            ).length;
            const Icon = idx === 0 ? Zap : idx === 1 ? Award : ShieldCheck;
            const iconBg =
              idx === 0
                ? "bg-blue-50 text-blue-600 border-blue-100"
                : idx === 1
                ? "bg-purple-50 text-purple-600 border-purple-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100";

            return (
              <div
                key={plan._id || plan.id || plan.name}
                onClick={() => onSelectTab("plans")}
                className="p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between group hover:border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${iconBg}`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {plan.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {subscribedCount} companies subscribed
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    {plan.price}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">
                      /{plan.billingCycle?.toLowerCase() || "mo"}
                    </span>
                  </div>
                  <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
