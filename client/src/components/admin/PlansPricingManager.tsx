"use client";

import React, { useState } from "react";
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  X,
  PlusCircle,
  Check,
  Send,
  Star,
  Crown,
  Calendar,
} from "lucide-react";

export interface PlanItem {
  _id?: string;
  id?: string;
  name: string;
  price: string;
  yearlyPrice?: string;
  billingCycle?: string;
  features: string[];
  credits?: number;
  status?: "Active" | "Inactive";
  subtitle?: string;
  isPopular?: boolean;
}

interface PlansPricingManagerProps {
  plans: PlanItem[];
  onAddPlan: (plan: Omit<PlanItem, "_id" | "id">) => Promise<void> | void;
  onEditPlan: (id: string, plan: Partial<PlanItem>) => Promise<void> | void;
  onDeletePlan: (id: string, name: string) => Promise<void> | void;
}

export default function PlansPricingManager({
  plans,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
}: PlansPricingManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  // Billing Cycle View State: "monthly" | "yearly"
  const [billingCycleView, setBillingCycleView] = useState<"monthly" | "yearly">("monthly");

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [credits, setCredits] = useState<number>(50);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "Standard Listing",
    "Basic Candidate Search",
    "1 Job posting",
  ]);

  const openCreateModal = () => {
    setEditingPlan(null);
    setName("");
    setPrice("");
    setYearlyPrice("");
    setBillingCycle(billingCycleView);
    setCredits(billingCycleView === "yearly" ? 360 : 50);
    setStatus("Active");
    setFeatures([
      "Standard Listing",
      "Basic Candidate Search",
      "1 Job posting",
    ]);
    setFeatureInput("");
    setModalOpen(true);
  };

  const openEditModal = (plan: PlanItem) => {
    setEditingPlan(plan);
    setName(plan.name || "");
    setPrice(plan.price || "");
    setYearlyPrice(plan.yearlyPrice || "");
    setBillingCycle(
      (plan.billingCycle || "").toLowerCase() === "yearly" ? "yearly" : "monthly"
    );
    setCredits(plan.credits || 50);
    setStatus(plan.status || "Active");
    setFeatures(plan.features && plan.features.length > 0 ? [...plan.features] : []);
    setFeatureInput("");
    setModalOpen(true);
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;

    // Normalize price display
    let formattedPrice = price.trim();
    if (!formattedPrice.startsWith("₹") && !formattedPrice.startsWith("$")) {
      formattedPrice = `₹ ${formattedPrice}`;
    }

    let formattedYearly = yearlyPrice.trim();
    if (formattedYearly && !formattedYearly.startsWith("₹") && !formattedYearly.startsWith("$")) {
      formattedYearly = `₹ ${formattedYearly}`;
    }

    const payload = {
      name: name.trim(),
      price: formattedPrice,
      yearlyPrice: formattedYearly,
      billingCycle,
      credits: Number(credits) || 0,
      status,
      features,
    };

    if (editingPlan) {
      const planId = (editingPlan._id || editingPlan.id) as string;
      await onEditPlan(planId, payload);
    } else {
      await onAddPlan(payload);
    }
    setModalOpen(false);
  };

  // Helper matching EmployerSignupView pricing calculation with dynamic /month or /year
  const getCardPriceInfo = (plan: PlanItem, cycle: "monthly" | "yearly") => {
    const rawPrice = typeof plan === "string" ? plan : (plan?.price || "");
    const digits = (rawPrice || "").replace(/[^\d]/g, "");
    const num = parseInt(digits, 10);
    const planCycle = (
      plan?.billingCycle || (cycle === "yearly" ? "yearly" : "monthly")
    ).toLowerCase();

    const isYearly = planCycle === "yearly" || cycle === "yearly";
    const billingUnit = isYearly ? "/ year" : "/ month";
    const displayPrice = num > 0 ? `₹${num.toLocaleString("en-IN")}` : (rawPrice || "₹0");

    return {
      displayPrice,
      billingUnit,
      annualBilledText: isYearly ? "Billed annually (Save 20%)" : null,
    };
  };

  // Separate data: Month ka data month me, aur Year ka data year me
  const displayedPlans = plans.filter((p) => {
    const cycle = (p.billingCycle || "monthly").toLowerCase();
    return cycle === billingCycleView;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Action */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-[#7C3AED] text-xs font-bold mb-2 border border-violet-200/60">
            <Tags className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Database Synced Packages</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Plans & Pricing Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure recruiter packages, subscription rates, resume view credits, and corporate access tiers. All updates save directly to MongoDB.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-98 text-white text-xs font-bold shadow-md shadow-violet-500/20 flex items-center gap-2 cursor-pointer transition whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {billingCycleView === "yearly" ? "Yearly" : "Monthly"} Plan</span>
        </button>
      </div>

      {/* Monthly / Yearly Switcher matching Employer Signup UI */}
      <div className="flex flex-col items-center justify-center pt-1 pb-2">
        <div className="inline-flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-full shadow-xs">
          <button
            type="button"
            onClick={() => setBillingCycleView("monthly")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              billingCycleView === "monthly"
                ? "bg-[#7C3AED] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly
          </button>
          <div className="relative">
            <span className="absolute -top-3.5 right-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[9px] border border-emerald-200">
              Save 20%
            </span>
            <button
              type="button"
              onClick={() => setBillingCycleView("yearly")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycleView === "yearly"
                  ? "bg-[#7C3AED] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">
          Showing <span className="font-bold text-[#7C3AED] capitalize">{billingCycleView}</span> plans ({displayedPlans.length} active in MongoDB)
        </p>
      </div>

      {/* Plans Grid (1:1 Matching Employer Signup Card Themes from Image 2) */}
      {displayedPlans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-[#7C3AED] mx-auto flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No {billingCycleView === "yearly" ? "Yearly" : "Monthly"} Plans Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Abhi koi {billingCycleView === "yearly" ? "Yearly" : "Monthly"} plan add nahi hai. Naya card add karne ke liye niche click karein.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#6D28D9] cursor-pointer"
          >
            Add {billingCycleView === "yearly" ? "Yearly" : "Monthly"} Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-2">
          {displayedPlans.map((p, idx) => {
            const planId = (p._id || p.id || `plan-${idx}`) as string;
            const isInactive = p.status === "Inactive";
            const themeIndex = idx % 3;

            const isPopular =
              p.isPopular ||
              (displayedPlans.length >= 2 && idx === 1) ||
              (typeof p.name === "string" &&
                (p.name.toLowerCase().includes("pro") ||
                  p.name.toLowerCase().includes("popular")));

            const isEnterprise =
              themeIndex === 2 ||
              (typeof p.name === "string" &&
                p.name.toLowerCase().includes("enterprise"));

            const subtitle =
              p.subtitle ||
              (themeIndex === 0
                ? "Best for small businesses & startups"
                : themeIndex === 1
                ? "Best for growing businesses"
                : "Best for large teams & enterprises");

            const priceInfo = getCardPriceInfo(p, billingCycleView);

            // Top action controls (Status, Edit, Delete)
            const renderCardActions = () => (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isInactive
                      ? "bg-slate-200 text-slate-600"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {p.status || "Active"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(p);
                  }}
                  title="Edit Plan"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#7C3AED] hover:bg-[#EDE9FE] transition cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(`Are you sure you want to permanently delete "${p.name}"?`)
                    ) {
                      onDeletePlan(planId, p.name);
                    }
                  }}
                  title="Delete Plan"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );

            // ---------------- CARD 2 THEME: PROFESSIONAL / MOST POPULAR ----------------
            if (isPopular) {
              return (
                <div
                  key={planId}
                  className={`group relative bg-white rounded-3xl border-2 border-[#7C3AED] p-7 flex flex-col justify-between shadow-xl shadow-violet-500/10 hover:shadow-2xl hover:shadow-violet-600/30 -translate-y-1 lg:-translate-y-2 hover:-translate-y-4 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer overflow-visible ring-0 hover:ring-4 hover:ring-[#EDE9FE] ${
                    isInactive ? "opacity-75" : ""
                  }`}
                >
                  {/* Top Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#7C3AED] text-white font-extrabold text-[11px] shadow-sm tracking-wide z-20 group-hover:bg-[#6D28D9] group-hover:scale-105 transition-all duration-200">
                    Most Popular
                  </div>

                  {renderCardActions()}

                  {/* Subtle Ambient Hover Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#EDE9FE]/60 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-amber-400 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-500 group-hover:fill-white group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#7C3AED] transition-colors duration-200 pr-16">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {subtitle}
                    </p>

                    {/* Price */}
                    <div className="mt-5 pb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#7C3AED] transition-colors duration-200">
                          {priceInfo.displayPrice}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">{priceInfo.billingUnit}</span>
                      </div>
                      {priceInfo.annualBilledText && (
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                          {priceInfo.annualBilledText}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="mt-5 space-y-3 text-xs text-slate-600">
                      {(p.features || []).map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-center gap-2.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        >
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5] group-hover:scale-110 transition-transform duration-200" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2 relative z-10">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] group-hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-violet-500/20 group-hover:shadow-xl group-hover:shadow-violet-600/35 group-hover:scale-[1.01] transition-all duration-300 cursor-pointer text-center active:scale-98"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              );
            }

            // ---------------- CARD 3 THEME: ENTERPRISE (AMBER CROWN) ----------------
            if (isEnterprise) {
              return (
                <div
                  key={planId}
                  className={`group relative bg-white rounded-3xl border border-slate-200 hover:border-amber-500/80 p-7 flex flex-col justify-between shadow-xs hover:shadow-2xl hover:shadow-amber-500/15 hover:-translate-y-2 hover:scale-[1.01] transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                    isInactive ? "opacity-75" : ""
                  }`}
                >
                  {renderCardActions()}

                  {/* Subtle Ambient Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Crown className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors duration-200 pr-16">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {subtitle}
                    </p>

                    {/* Price */}
                    <div className="mt-5 pb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors duration-200">
                          {priceInfo.displayPrice}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">{priceInfo.billingUnit}</span>
                      </div>
                      {priceInfo.annualBilledText && (
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                          {priceInfo.annualBilledText}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="mt-5 space-y-3 text-xs text-slate-600">
                      {(p.features || []).map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-center gap-2.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        >
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5] group-hover:scale-110 transition-transform duration-200" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2 relative z-10">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 group-hover:border-amber-600 bg-slate-50/50 group-hover:bg-amber-500 text-slate-700 group-hover:text-white text-xs font-bold transition-all duration-300 cursor-pointer text-center shadow-xs group-hover:shadow-md group-hover:shadow-amber-500/25 active:scale-98"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              );
            }

            // ---------------- CARD 1 THEME: STARTER / VIOLET ----------------
            return (
              <div
                key={planId}
                className={`group relative bg-white rounded-3xl border border-slate-200 hover:border-[#7C3AED]/80 p-7 flex flex-col justify-between shadow-xs hover:shadow-2xl hover:shadow-violet-500/15 hover:-translate-y-2 hover:scale-[1.01] transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                  isInactive ? "opacity-75" : ""
                }`}
              >
                {renderCardActions()}

                {/* Subtle Ambient Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#EDE9FE]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Send className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#7C3AED] transition-colors duration-200 pr-16">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {subtitle}
                  </p>

                  {/* Price */}
                  <div className="mt-5 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#7C3AED] transition-colors duration-200">
                        {priceInfo.displayPrice}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">{priceInfo.billingUnit}</span>
                    </div>
                    {priceInfo.annualBilledText && (
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                        {priceInfo.annualBilledText}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mt-5 space-y-3 text-xs text-slate-600">
                    {(p.features || []).map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-center gap-2.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5] group-hover:scale-110 transition-transform duration-200" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-2 relative z-10">
                  <button
                    type="button"
                    onClick={() => openEditModal(p)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] group-hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-violet-500/20 group-hover:shadow-xl group-hover:shadow-violet-600/35 group-hover:scale-[1.01] transition-all duration-300 cursor-pointer text-center active:scale-98"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE & EDIT PLAN MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#7C3AED] flex items-center justify-center font-bold">
                {editingPlan ? (
                  <Pencil className="w-5 h-5" />
                ) : (
                  <PlusCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {editingPlan ? `Edit Plan: ${editingPlan.name}` : `Create New ${billingCycle === "yearly" ? "Yearly (/year)" : "Monthly (/month)"} Plan`}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingPlan
                    ? "Update pricing, billing cycle duration, and package entitlements in MongoDB."
                    : `Add a new ${billingCycle} plan to the database available for all companies.`}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Billing Cycle Selector Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plan Duration / Billing Cycle <span className="text-rose-500">*</span>
                </label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value as "monthly" | "yearly")}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white font-semibold transition cursor-pointer"
                >
                  <option value="monthly">Monthly Plan (/month)</option>
                  <option value="yearly">Yearly Plan (/year)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {billingCycle === "yearly"
                    ? "Yearly plan select karne par card par amount ke aage '/year' dikhega aur yeh Yearly tab me aayega."
                    : "Monthly plan select karne par card par amount ke aage '/month' dikhega aur yeh Monthly tab me aayega."}
                </span>
              </div>

              {/* Plan Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starter, Pro Plan, Enterprise"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                />
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {billingCycle === "yearly" ? "Price (₹ / year)" : "Price (₹ / month)"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={billingCycle === "yearly" ? "e.g. ₹ 28,788" : "e.g. ₹ 2,999"}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-3.5 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                    {billingCycle === "yearly" ? "/ year" : "/ month"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Card par {price || (billingCycle === "yearly" ? "₹ 28,788" : "₹ 2,999")}{" "}
                  <strong className="text-slate-600 font-bold">{billingCycle === "yearly" ? "/ year" : "/ month"}</strong> display hoga.
                </span>
              </div>

              {/* Credits & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Resume / Action Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Plan Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Features List Builder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Features Included ({features.length})
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add feature e.g. 'Standard Listing'"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 group"
                    >
                      <span className="truncate pr-2">{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPlan ? "Save Changes" : `Create ${billingCycle === "yearly" ? "Yearly (/year)" : "Monthly (/month)"} Plan`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
