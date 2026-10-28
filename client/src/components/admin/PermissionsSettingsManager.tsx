"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  Zap,
  Lock,
  RotateCcw,
  Save,
  Pencil,
  LayoutGrid,
  Briefcase,
  Users,
  FileText,
  Settings,
  Info,
  CheckCircle2,
  ArrowRight,
  X,
  RefreshCw,
  Sparkles,
  Gift,
  Clock,
  Coins,
  Plus,
  Trash2,
  ListChecks,
  Check,
} from "lucide-react";
import {
  fetchAdminPermissionsSettings,
  updateAdminPermissionsSettings,
  safeSetLocalStorage,
  CompanyPermissions,
  PLAN_AUTO_PERMISSIONS,
} from "@/lib/api";

export const DEFAULT_TRIAL_POINTS: string[] = [
  "Instant access to Candidate Search & Talent Pool",
  "Direct Candidate CV Downloads with Complimentary Credits",
  "Post & Manage Job Openings on the platform",
  "Real-time Applicant Pipeline & Status Tracking",
  "Direct Messaging & Company Dashboard Access",
];

export interface PlanRuleItem {
  id: string;
  planName: string;
  badgeLabel: string;
  badgeStyle: string; // Tailwind classes for badge
  description: string;
  permissions: {
    dashboard: boolean;
    jobs: boolean;
    applicants: boolean;
    resumes: boolean;
    settings: boolean;
  };
}

const DEFAULT_PLAN_RULES: PlanRuleItem[] = [
  {
    id: "basic",
    planName: "Basic Plan",
    badgeLabel: "Basic Plan",
    badgeStyle: "bg-[#DBEAFE] text-[#1D4ED8] border-blue-200/60",
    description: "Essentials for small companies",
    permissions: {
      dashboard: true,
      jobs: false,
      applicants: false,
      resumes: false,
      settings: false,
    },
  },
  {
    id: "pro",
    planName: "Pro Plan",
    badgeLabel: "Pro Plan",
    badgeStyle: "bg-[#EDE9FE] text-[#6D28D9] border-purple-200/60",
    description: "Advanced features for growing teams",
    permissions: {
      dashboard: true,
      jobs: true,
      applicants: true,
      resumes: true,
      settings: false,
    },
  },
  {
    id: "enterprise",
    planName: "Enterprise",
    badgeLabel: "Enterprise",
    badgeStyle: "bg-[#D1FAE5] text-[#047857] border-emerald-200/60",
    description: "Full access with advanced controls",
    permissions: {
      dashboard: true,
      jobs: true,
      applicants: true,
      resumes: true,
      settings: true,
    },
  },
];

const DEFAULT_UNSUBSCRIBED_PERMS = {
  dashboard: true,
  jobs: false,
  applicants: false,
  resumes: false,
  settings: false,
};

interface PermissionsSettingsManagerProps {
  onGoToCompanies?: () => void;
}

// Reusable iOS-style Switch Toggle matching screenshot
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer select-none focus:outline-none ${
        size === "sm"
          ? "w-9 h-5"
          : size === "lg"
          ? "w-13 h-7"
          : "w-11 h-6"
      } ${
        checked ? "bg-[#6D28D9]" : "bg-slate-200 hover:bg-slate-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
          size === "sm"
            ? `w-3.5 h-3.5 ${checked ? "translate-x-4.5" : "translate-x-1"}`
            : size === "lg"
            ? `w-5.5 h-5.5 ${checked ? "translate-x-6.5" : "translate-x-1"}`
            : `w-4.5 h-4.5 ${checked ? "translate-x-5.5" : "translate-x-1"}`
        }`}
      />
    </button>
  );
}

export default function PermissionsSettingsManager({
  onGoToCompanies,
}: PermissionsSettingsManagerProps) {
  // 1. Subscription Plan Auto-Approval Engine
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(true);

  // 2. Plan-Wise Rules
  const [planRules, setPlanRules] = useState<PlanRuleItem[]>(DEFAULT_PLAN_RULES);

  // 3. Company Free Trial & Unsubscribed Permissions
  const [enableDefaultPerms, setEnableDefaultPerms] = useState(true);
  const [freeTrialEnabled, setFreeTrialEnabled] = useState(true);
  const [trialDays, setTrialDays] = useState(14);
  const [trialCredits, setTrialCredits] = useState(15);
  const [trialPoints, setTrialPoints] = useState<string[]>(DEFAULT_TRIAL_POINTS);
  const [unsubscribedPerms, setUnsubscribedPerms] = useState({
    dashboard: true,
    jobs: true,
    applicants: true,
    resumes: false,
    settings: false,
  });

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "info"; text: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRules, setEditingRules] = useState<PlanRuleItem[]>([]);

  // Show toast notification helper
  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load from database / local storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const remote = await fetchAdminPermissionsSettings();
        if (remote) {
          if (typeof remote.autoApprovalEnabled === "boolean") {
            setAutoApprovalEnabled(remote.autoApprovalEnabled);
          }
          if (typeof remote.freeTrialEnabled === "boolean") {
            setFreeTrialEnabled(remote.freeTrialEnabled);
          }
          if (typeof remote.trialDays === "number") {
            setTrialDays(remote.trialDays);
          }
          if (typeof remote.trialCredits === "number") {
            setTrialCredits(remote.trialCredits);
          }
          if (Array.isArray(remote.trialPoints) && remote.trialPoints.length > 0) {
            setTrialPoints(remote.trialPoints);
          }
          if (typeof remote.enableDefaultPermissions === "boolean") {
            setEnableDefaultPerms(remote.enableDefaultPermissions);
          }
          if (remote.defaultNewCompanyPerms) {
            setUnsubscribedPerms({
              ...DEFAULT_UNSUBSCRIBED_PERMS,
              ...remote.defaultNewCompanyPerms,
            });
          }
          if (remote.planRulesDetails && Array.isArray(remote.planRulesDetails)) {
            setPlanRules(remote.planRulesDetails);
            return;
          } else if (remote.planRules && typeof remote.planRules === "object") {
            // Map object rules
            setPlanRules((prev) =>
              prev.map((pr) => {
                const found = remote.planRules[pr.planName];
                if (found) {
                  return {
                    ...pr,
                    permissions: {
                      dashboard: Boolean(found.dashboard),
                      jobs: Boolean(found.jobs),
                      applicants: Boolean(found.applicants),
                      resumes: Boolean(found.resumes),
                      settings: Boolean(found.settings),
                    },
                  };
                }
                return pr;
              })
            );
            return;
          }
        }

        // Local storage cache fallback
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("addyjob_permissions_settings");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (typeof parsed.autoApprovalEnabled === "boolean") {
              setAutoApprovalEnabled(parsed.autoApprovalEnabled);
            }
            if (typeof parsed.freeTrialEnabled === "boolean") {
              setFreeTrialEnabled(parsed.freeTrialEnabled);
            }
            if (typeof parsed.trialDays === "number") {
              setTrialDays(parsed.trialDays);
            }
            if (typeof parsed.trialCredits === "number") {
              setTrialCredits(parsed.trialCredits);
            }
            if (Array.isArray(parsed.trialPoints) && parsed.trialPoints.length > 0) {
              setTrialPoints(parsed.trialPoints);
            }
            if (typeof parsed.enableDefaultPermissions === "boolean") {
              setEnableDefaultPerms(parsed.enableDefaultPermissions);
            }
            if (parsed.defaultNewCompanyPerms) {
              setUnsubscribedPerms({
                ...DEFAULT_UNSUBSCRIBED_PERMS,
                ...parsed.defaultNewCompanyPerms,
              });
            }
            if (parsed.planRulesDetails && Array.isArray(parsed.planRulesDetails)) {
              setPlanRules(parsed.planRulesDetails);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load permissions settings:", err);
      }
    };

    loadSettings();
  }, []);

  // Toggle module permission for a specific plan tier
  const handleTogglePlanPermission = (
    planIndex: number,
    moduleKey: keyof PlanRuleItem["permissions"]
  ) => {
    setPlanRules((prev) => {
      const next = [...prev];
      if (next[planIndex]) {
        next[planIndex] = {
          ...next[planIndex],
          permissions: {
            ...next[planIndex].permissions,
            [moduleKey]: !next[planIndex].permissions[moduleKey],
          },
        };
      }
      return next;
    });
  };

  // Toggle unsubscribed company module permission
  const handleToggleUnsubscribed = (key: keyof typeof unsubscribedPerms) => {
    setUnsubscribedPerms((prev) => {
      const next = {
        ...prev,
        [key]: !prev[key],
      };
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("addyjob_permissions_settings");
          const parsed = cached ? JSON.parse(cached) : {};
          parsed.defaultNewCompanyPerms = next;
          if (!parsed.planRules) parsed.planRules = {};
          parsed.planRules["Free Trial"] = next;
          localStorage.setItem("addyjob_permissions_settings", JSON.stringify(parsed));
          PLAN_AUTO_PERMISSIONS["Free Trial"] = next;
          window.dispatchEvent(new Event("company_permissions_updated"));
          window.dispatchEvent(new Event("storage"));
        } catch (e) {}
      }
      return next;
    });
  };

  // Reset to initial default state
  const handleResetToDefault = () => {
    setAutoApprovalEnabled(true);
    setPlanRules(DEFAULT_PLAN_RULES);
    setEnableDefaultPerms(true);
    setFreeTrialEnabled(true);
    setTrialDays(14);
    setTrialCredits(15);
    setTrialPoints([...DEFAULT_TRIAL_POINTS]);
    setUnsubscribedPerms({
      dashboard: true,
      jobs: true,
      applicants: true,
      resumes: false,
      settings: false,
    });
    showToast("Settings reset to default configuration", "info");
  };

  // Immediate toggle handler for Free Trial
  const handleToggleFreeTrial = (enabled: boolean) => {
    setFreeTrialEnabled(enabled);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("addyjob_permissions_settings");
        const parsed = cached ? JSON.parse(cached) : {};
        parsed.freeTrialEnabled = enabled;
        localStorage.setItem("addyjob_permissions_settings", JSON.stringify(parsed));
        window.dispatchEvent(new Event("company_permissions_updated"));
        window.dispatchEvent(new Event("storage"));
      } catch (e) {}
    }
    updateAdminPermissionsSettings({ freeTrialEnabled: enabled }).catch((err) =>
      console.warn("Background freeTrialEnabled sync error:", err)
    );
  };

  // Save full configuration
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const planRulesMap: Record<string, any> = {};
      planRules.forEach((pr) => {
        planRulesMap[pr.planName] = pr.permissions;
      });

      // Synchronize Free Trial rule with unsubscribedPerms
      planRulesMap["Free Trial"] = unsubscribedPerms;

      const cleanedPoints = trialPoints
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const payload = {
        autoApprovalEnabled,
        freeTrialEnabled,
        trialDays: Math.max(1, Number(trialDays) || 1),
        trialCredits: Math.max(0, Number(trialCredits) || 0),
        trialPoints: cleanedPoints.length > 0 ? cleanedPoints : DEFAULT_TRIAL_POINTS,
        enableDefaultPermissions: enableDefaultPerms,
        planRules: planRulesMap,
        planRulesDetails: planRules,
        defaultNewCompanyPerms: unsubscribedPerms,
      };

      // 1. Store in localStorage for instant front-end synchronicity
      if (typeof window !== "undefined") {
        safeSetLocalStorage("addyjob_permissions_settings", JSON.stringify(payload));
        // Update in-memory PLAN_AUTO_PERMISSIONS
        planRules.forEach((pr) => {
          PLAN_AUTO_PERMISSIONS[pr.planName] = pr.permissions;
        });
        PLAN_AUTO_PERMISSIONS["Free Trial"] = unsubscribedPerms;
        window.dispatchEvent(new Event("company_permissions_updated"));
        window.dispatchEvent(new Event("storage"));
      }

      // 2. Persist to MongoDB backend
      const res = await updateAdminPermissionsSettings(payload);

      const count = (res as any)?.updatedCompaniesCount;
      if (typeof count === "number" && count > 0) {
        showToast(`Configuration saved & applied to ${count} active company accounts!`);
      } else {
        showToast("Configuration saved successfully!");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Settings saved locally.", "info");
    } finally {
      setIsSaving(false);
    }
  };

  // Open Edit Plan Names Modal
  const handleOpenEditModal = () => {
    setEditingRules(JSON.parse(JSON.stringify(planRules)));
    setIsEditModalOpen(true);
  };

  // Save changes from Edit Plan Names Modal
  const handleSaveEditModal = () => {
    setPlanRules(editingRules);
    setIsEditModalOpen(false);
    showToast("Plan details updated. Remember to click Save Configuration.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold backdrop-blur-md ${
              toastMessage.type === "success"
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-blue-600 text-white border-blue-500"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* TOP: Breadcrumb & Title Header */}
      <div className="flex flex-col gap-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="hover:text-slate-600 transition">Settings</span>
          <span className="text-slate-400 font-semibold">›</span>
          <span className="text-slate-800 font-bold">Recruiter Permissions</span>
        </div>

        {/* Title row with action buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-0.5">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight">
              Recruiter Permissions & Auto-Approval Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Control which modules recruiters can access based on their subscription plan.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Save Configuration Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-purple-500/20 active:scale-95 transition cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
            </button>

            {/* Reset to Default Button */}
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 transition cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Subscription Plan Auto-Approval Engine Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50/60 via-purple-50/30 to-white border border-purple-100/90 p-5 sm:p-6 shadow-[0_2px_12px_rgba(109,40,217,0.03)]">
        {/* Subtle decorative glow in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-100/40 to-transparent pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            {/* Lightning Zap Icon in purple squircle */}
            <div className="w-12 h-12 rounded-2xl bg-[#6D28D9] text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25">
              <Zap className="w-6 h-6 fill-white" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Subscription Plan Auto-Approval Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F3E8FF] text-[#6D28D9] border border-purple-200/50">
                  Automated
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                Automatically grant permissions to companies when they purchase or hold an active subscription plan, without requiring manual approval.
              </p>
            </div>
          </div>

          <div className="shrink-0 pl-16 sm:pl-0">
            <ToggleSwitch
              size="lg"
              checked={autoApprovalEnabled}
              onChange={setAutoApprovalEnabled}
              ariaLabel="Toggle Subscription Plan Auto-Approval Engine"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Plan-Wise Auto-Approval Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg text-[#6D28D9] flex items-center justify-center shrink-0 mt-0.5">
              <Key className="w-5 h-5 text-[#6D28D9]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Plan-Wise Auto-Approval Rules
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose which sidebar modules are automatically unlocked when a company holds each subscription tier.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenEditModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-50/70 hover:bg-purple-100/70 text-[#6D28D9] border border-purple-200/70 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            <Pencil className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span>Edit Plan Names</span>
          </button>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6 text-left w-[280px]">
                  SUBSCRIPTION PLAN
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <LayoutGrid className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-700 text-xs normal-case tracking-normal">
                      Dashboard
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">
                      Overview
                    </span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-700 text-xs normal-case tracking-normal">
                      Job Postings
                    </span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-700 text-xs normal-case tracking-normal">
                      Applications &
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">
                      Candidates
                    </span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-700 text-xs normal-case tracking-normal">
                      Candidate Resumes
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">
                      Purchased
                    </span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-700 text-xs normal-case tracking-normal">
                      Company Settings
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {planRules.map((plan, planIdx) => (
                <tr
                  key={plan.id}
                  className="hover:bg-slate-50/40 transition-colors"
                >
                  {/* Plan Badge & Description */}
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${plan.badgeStyle}`}
                      >
                        {plan.badgeLabel}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {plan.description}
                      </span>
                    </div>
                  </td>

                  {/* Dashboard Overview Toggle */}
                  <td className="py-5 px-4 text-center">
                    <ToggleSwitch
                      checked={plan.permissions.dashboard}
                      onChange={() => handleTogglePlanPermission(planIdx, "dashboard")}
                      ariaLabel={`Toggle Dashboard Overview for ${plan.planName}`}
                    />
                  </td>

                  {/* Job Postings Toggle */}
                  <td className="py-5 px-4 text-center">
                    <ToggleSwitch
                      checked={plan.permissions.jobs}
                      onChange={() => handleTogglePlanPermission(planIdx, "jobs")}
                      ariaLabel={`Toggle Job Postings for ${plan.planName}`}
                    />
                  </td>

                  {/* Applications & Candidates Toggle */}
                  <td className="py-5 px-4 text-center">
                    <ToggleSwitch
                      checked={plan.permissions.applicants}
                      onChange={() => handleTogglePlanPermission(planIdx, "applicants")}
                      ariaLabel={`Toggle Applications & Candidates for ${plan.planName}`}
                    />
                  </td>

                  {/* Candidate Resumes Purchased Toggle */}
                  <td className="py-5 px-4 text-center">
                    <ToggleSwitch
                      checked={plan.permissions.resumes}
                      onChange={() => handleTogglePlanPermission(planIdx, "resumes")}
                      ariaLabel={`Toggle Candidate Resumes Purchased for ${plan.planName}`}
                    />
                  </td>

                  {/* Company Settings Toggle */}
                  <td className="py-5 px-4 text-center">
                    <ToggleSwitch
                      checked={plan.permissions.settings}
                      onChange={() => handleTogglePlanPermission(planIdx, "settings")}
                      ariaLabel={`Toggle Company Settings for ${plan.planName}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Company Free Trial & Unsubscribed Permissions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
        {/* Card Header with Master Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5 border border-purple-100/60 shadow-xs">
              <Gift className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Company Free Trial & Unsubscribed Permissions
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    freeTrialEnabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {freeTrialEnabled ? "● Trial Active" : "○ Trial Disabled"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Control whether companies can activate a Free Trial from their subscription page, configure trial duration & complimentary resume credits, and select exact feature permissions granted.
              </p>
            </div>
          </div>

          {/* Master Trial Switch */}
          <div className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/60 self-start lg:self-auto shrink-0">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-800 block">
                Enable Free Trial
              </span>
              <span className="text-[10px] text-slate-500 block">
                {freeTrialEnabled ? "Companies can activate trial" : "Trial option hidden / locked"}
              </span>
            </div>
            <ToggleSwitch
              size="md"
              checked={freeTrialEnabled}
              onChange={handleToggleFreeTrial}
              ariaLabel="Enable Free Trial for companies"
            />
          </div>
        </div>

        {/* Trial Duration, Complimentary Credits & Unsubscribed Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* Trial Duration Selector (Custom Days Input + Quick Presets) */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                Trial Duration
              </span>
              <span className="text-xs font-extrabold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                {trialDays} Days
              </span>
            </div>

            {/* Custom Days Input */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
              <input
                type="number"
                min="1"
                max="365"
                value={trialDays}
                onChange={(e) => setTrialDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-black text-slate-900 bg-transparent focus:outline-none"
                placeholder="Enter days..."
              />
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Days</span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1">
              {[7, 14, 21, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setTrialDays(d)}
                  className={`py-1 px-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                    trialDays === d
                      ? "bg-[#7C3AED] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Complimentary Credits Selector (Custom Credits Input + Quick Presets) */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                Resume Credits
              </span>
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                {trialCredits} Credits
              </span>
            </div>

            {/* Custom Credits Input */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
              <input
                type="number"
                min="0"
                max="10000"
                value={trialCredits}
                onChange={(e) => setTrialCredits(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-xs font-black text-slate-900 bg-transparent focus:outline-none"
                placeholder="Enter credits..."
              />
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Credits</span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-5 gap-1">
              {[5, 10, 25, 50, 100].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTrialCredits(c)}
                  className={`py-1 px-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                    trialCredits === c
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Baseline Unsubscribed Auto-Grant Switch */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Baseline Unsubscribed
              </span>
              <ToggleSwitch
                size="sm"
                checked={enableDefaultPerms}
                onChange={setEnableDefaultPerms}
                ariaLabel="Enable baseline permissions for unsubscribed companies"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Auto-grant the same feature permissions to newly registered companies before they purchase a plan.
            </p>
          </div>
        </div>

        {/* Free Trial Provided Points Highlights (Customizable points list) */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-purple-600" />
                  Trial Provided Benefits (Points Format)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700">
                  {trialPoints.length} Points
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Whatever points you configure here are directly presented on the company Free Trial subscription card.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setTrialPoints([...DEFAULT_TRIAL_POINTS])}
                className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                Reset Defaults
              </button>
              <button
                type="button"
                onClick={() => setTrialPoints([...trialPoints, ""])}
                className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Point
              </button>
            </div>
          </div>

          {/* Editable Points List */}
          <div className="space-y-2">
            {trialPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <span className="w-6 h-6 rounded-lg bg-purple-50 text-[#7C3AED] border border-purple-100 text-[10px] font-black flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => {
                    const newPoints = [...trialPoints];
                    newPoints[index] = e.target.value;
                    setTrialPoints(newPoints);
                  }}
                  placeholder={`e.g. Trial benefit point #${index + 1}...`}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  disabled={trialPoints.length <= 1}
                  onClick={() => {
                    if (trialPoints.length > 1) {
                      setTrialPoints(trialPoints.filter((_, i) => i !== index));
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  title="Remove point"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Permissions Matrix Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Trial & Baseline Feature Toggles
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Turn each individual feature ON or OFF to control what companies can access during the trial.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline-block">
            {Object.values(unsubscribedPerms).filter(Boolean).length} of 5 Features Granted
          </span>
        </div>

        {/* 5 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          {/* Card 1: Dashboard Overview */}
          <div
            onClick={() => handleToggleUnsubscribed("dashboard")}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer select-none ${
              unsubscribedPerms.dashboard
                ? "border-blue-200/90 bg-blue-50/20 shadow-xs"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <ToggleSwitch
                size="sm"
                checked={unsubscribedPerms.dashboard}
                onChange={() => handleToggleUnsubscribed("dashboard")}
                ariaLabel="Toggle Dashboard Overview"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Dashboard
                </h4>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                    unsubscribedPerms.dashboard
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {unsubscribedPerms.dashboard ? "Granted" : "Locked"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Analytics, overview stats & company summary metrics.
              </p>
            </div>
          </div>

          {/* Card 2: Job Postings */}
          <div
            onClick={() => handleToggleUnsubscribed("jobs")}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer select-none ${
              unsubscribedPerms.jobs
                ? "border-purple-200/90 bg-purple-50/20 shadow-xs"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <ToggleSwitch
                size="sm"
                checked={unsubscribedPerms.jobs}
                onChange={() => handleToggleUnsubscribed("jobs")}
                ariaLabel="Toggle Job Postings"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Job Postings
                </h4>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                    unsubscribedPerms.jobs
                      ? "bg-purple-100 text-purple-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {unsubscribedPerms.jobs ? "Granted" : "Locked"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Post new openings & manage active job listings.
              </p>
            </div>
          </div>

          {/* Card 3: Applications & Candidates */}
          <div
            onClick={() => handleToggleUnsubscribed("applicants")}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer select-none ${
              unsubscribedPerms.applicants
                ? "border-emerald-200/90 bg-emerald-50/20 shadow-xs"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <ToggleSwitch
                size="sm"
                checked={unsubscribedPerms.applicants}
                onChange={() => handleToggleUnsubscribed("applicants")}
                ariaLabel="Toggle Applications & Candidates"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Applicants
                </h4>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                    unsubscribedPerms.applicants
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {unsubscribedPerms.applicants ? "Granted" : "Locked"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Review applicant profiles, status & manage pipeline.
              </p>
            </div>
          </div>

          {/* Card 4: Candidate Resumes Purchased */}
          <div
            onClick={() => handleToggleUnsubscribed("resumes")}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer select-none ${
              unsubscribedPerms.resumes
                ? "border-rose-200/90 bg-rose-50/20 shadow-xs"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <ToggleSwitch
                size="sm"
                checked={unsubscribedPerms.resumes}
                onChange={() => handleToggleUnsubscribed("resumes")}
                ariaLabel="Toggle Candidate Resumes Purchased"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Resumes
                </h4>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                    unsubscribedPerms.resumes
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {unsubscribedPerms.resumes ? "Granted" : "Locked"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Access candidate CV downloads & resume repository.
              </p>
            </div>
          </div>

          {/* Card 5: Company Settings */}
          <div
            onClick={() => handleToggleUnsubscribed("settings")}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer select-none ${
              unsubscribedPerms.settings
                ? "border-amber-200/90 bg-amber-50/20 shadow-xs"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Settings className="w-4 h-4" />
              </div>
              <ToggleSwitch
                size="sm"
                checked={unsubscribedPerms.settings}
                onChange={() => handleToggleUnsubscribed("settings")}
                ariaLabel="Toggle Company Settings"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Settings
                </h4>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                    unsubscribedPerms.settings
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {unsubscribedPerms.settings ? "Granted" : "Locked"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Configure company profile, preferences & team access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Individual Company Manual Override Banner */}
      <div className="bg-gradient-to-r from-[#FFF8F0] to-[#FFF3E6] rounded-2xl p-5 sm:p-6 border border-amber-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/50">
            <Key className="w-5 h-5 text-amber-600 rotate-90" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Individual Company Manual Override
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Need to grant specific permissions to a partner company without a subscription? Use the dedicated{" "}
              <span className="font-bold text-amber-800">"Permissions"</span> button next to any company in the Company Management table or Sub-Admin portal.
            </p>
          </div>
        </div>

        {onGoToCompanies && (
          <button
            type="button"
            onClick={onGoToCompanies}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-orange-500/20 active:scale-95 transition cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>Open Company Management</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        )}
      </div>

      {/* MODAL: Edit Plan Names */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Edit Subscription Plan Details
                  </h3>
                  <p className="text-xs text-slate-400">
                    Customize display labels and descriptions for each tier
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form list */}
            <div className="space-y-4 py-4">
              {editingRules.map((plan, idx) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tier {idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${plan.badgeStyle}`}
                    >
                      {plan.badgeLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Plan Display Name
                      </label>
                      <input
                        type="text"
                        value={plan.badgeLabel}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingRules((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], badgeLabel: val, planName: val };
                            return next;
                          });
                        }}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Description / Subtext
                      </label>
                      <input
                        type="text"
                        value={plan.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingRules((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], description: val };
                            return next;
                          });
                        }}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditModal}
                className="px-5 py-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
