"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Check,
  Sparkles,
  Zap,
  Building2,
  Briefcase,
  Users,
  FolderDown,
  Settings,
  LayoutDashboard,
  CreditCard,
  Info,
  Save,
  CheckCircle2,
  Sliders,
  RefreshCw,
} from "lucide-react";
import {
  fetchAdminPermissionsSettings,
  updateAdminPermissionsSettings,
  CompanyPermissions,
  PLAN_AUTO_PERMISSIONS,
} from "@/lib/api";

interface PlanRule {
  planName: string;
  badgeColor: string;
  permissions: {
    dashboard: boolean;
    jobs: boolean;
    applicants: boolean;
    resumes: boolean;
    settings: boolean;
  };
}

const DEFAULT_PLAN_RULES: PlanRule[] = [
  {
    planName: "Basic Plan",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    permissions: {
      dashboard: false,
      jobs: true,
      applicants: true,
      resumes: false,
      settings: false,
    },
  },
  {
    planName: "Pro Plan",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    permissions: {
      dashboard: true,
      jobs: true,
      applicants: true,
      resumes: true,
      settings: false,
    },
  },
  {
    planName: "Enterprise",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    permissions: {
      dashboard: true,
      jobs: true,
      applicants: true,
      resumes: true,
      settings: true,
    },
  },
];

const normalizePlanRules = (rawRules: any): PlanRule[] => {
  if (Array.isArray(rawRules) && rawRules.length > 0) {
    return rawRules;
  }
  if (rawRules && typeof rawRules === "object") {
    return Object.entries(rawRules).map(([planName, perms]: [string, any]) => ({
      planName,
      badgeColor:
        planName.toLowerCase().includes("enterprise")
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : planName.toLowerCase().includes("pro")
          ? "bg-violet-50 text-violet-700 border-violet-200"
          : "bg-blue-50 text-blue-700 border-blue-200",
      permissions: {
        dashboard: Boolean(perms?.dashboard),
        jobs: Boolean(perms?.jobs),
        applicants: Boolean(perms?.applicants),
        resumes: Boolean(perms?.resumes),
        settings: Boolean(perms?.settings),
      },
    }));
  }
  return DEFAULT_PLAN_RULES;
};

interface PermissionsSettingsManagerProps {
  onGoToCompanies?: () => void;
}

export default function PermissionsSettingsManager({
  onGoToCompanies,
}: PermissionsSettingsManagerProps) {
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(true);
  const [defaultNewCompanyPerms, setDefaultNewCompanyPerms] = useState<{
    dashboard: boolean;
    jobs: boolean;
    applicants: boolean;
    resumes: boolean;
    settings: boolean;
  }>({
    dashboard: false,
    jobs: false,
    applicants: false,
    resumes: false,
    settings: false,
  });

  const [planRules, setPlanRules] = useState<PlanRule[]>(DEFAULT_PLAN_RULES);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load from backend or localStorage
    const loadSettings = async () => {
      try {
        const remote = await fetchAdminPermissionsSettings();
        if (remote) {
          if (typeof remote.autoApprovalEnabled === "boolean") {
            setAutoApprovalEnabled(remote.autoApprovalEnabled);
          }
          if (remote.planRules) {
            setPlanRules(normalizePlanRules(remote.planRules));
          }
          if (remote.defaultNewCompanyPerms) {
            setDefaultNewCompanyPerms(remote.defaultNewCompanyPerms);
          }
          return;
        }

        // LocalStorage fallback
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("addyjob_permissions_settings");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (typeof parsed.autoApprovalEnabled === "boolean") {
              setAutoApprovalEnabled(parsed.autoApprovalEnabled);
            }
            if (parsed.planRules) {
              setPlanRules(normalizePlanRules(parsed.planRules));
            }
            if (parsed.defaultNewCompanyPerms) {
              setDefaultNewCompanyPerms(parsed.defaultNewCompanyPerms);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load permissions settings:", e);
      }
    };

    loadSettings();
  }, []);

  const handleTogglePlanPerm = (planIndex: number, key: keyof PlanRule["permissions"]) => {
    setPlanRules((prev) => {
      const current = normalizePlanRules(prev);
      const copy = [...current];
      if (copy[planIndex]) {
        copy[planIndex] = {
          ...copy[planIndex],
          permissions: {
            ...copy[planIndex].permissions,
            [key]: !copy[planIndex].permissions[key],
          },
        };
      }
      return copy;
    });
  };

  const handleToggleDefaultPerm = (key: keyof typeof defaultNewCompanyPerms) => {
    setDefaultNewCompanyPerms((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentRules = normalizePlanRules(planRules);
      const planRulesMap: Record<string, any> = {};
      currentRules.forEach((pr) => {
        planRulesMap[pr.planName] = pr.permissions;
      });

      const payload = {
        autoApprovalEnabled,
        planRules: planRulesMap,
        defaultNewCompanyPerms,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("addyjob_permissions_settings", JSON.stringify(payload));
        // Sync plan auto perms
        currentRules.forEach((pr) => {
          PLAN_AUTO_PERMISSIONS[pr.planName] = pr.permissions;
        });
        window.dispatchEvent(new Event("company_permissions_updated"));
        window.dispatchEvent(new Event("storage"));
      }

      const res = await updateAdminPermissionsSettings(payload);

      setSaveSuccess(true);
      const count = (res as any)?.updatedCompaniesCount;
      if (typeof count === "number" && count > 0) {
        setSaveMessage(`Applied to ${count} active company subscription${count > 1 ? "s" : ""}!`);
      } else {
        setSaveMessage("Applied to all company subscriptions!");
      }
      setTimeout(() => {
        setSaveSuccess(false);
        setSaveMessage(null);
      }, 4000);
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const moduleItems: { key: keyof PlanRule["permissions"]; label: string; icon: any }[] = [
    { key: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { key: "jobs", label: "Job Postings", icon: Briefcase },
    { key: "applicants", label: "Applications & Candidates", icon: Users },
    { key: "resumes", label: "Candidate Resumes Purchased", icon: FolderDown },
    { key: "settings", label: "Company Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Recruiter Permissions & Auto-Approval Settings
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Control which sidebar modules are visible to companies. Baseline access is limited to Company Profile and Subscription Details, while full features can be auto-unlocked by subscription plans or granted manually.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold shadow-md shadow-violet-200 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveSuccess ? (saveMessage || "Saved Successfully!") : isSaving ? "Saving..." : "Save Configuration"}</span>
          </button>
        </div>
      </div>

      {/* 2. Global Auto-Approval Engine Banner */}
      <div className="bg-linear-to-r from-violet-50 via-purple-50/50 to-white rounded-2xl p-6 border border-violet-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-black text-slate-900">
                  Subscription Plan Auto-Approval Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-[#7C3AED] border border-violet-200">
                  Automated
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                When enabled, companies who purchase or hold an active subscription tier will automatically receive the permissions designated below without requiring manual Super Admin intervention.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={autoApprovalEnabled}
              onChange={(e) => setAutoApprovalEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
          </label>
        </div>
      </div>

      {/* 3. Plan-Wise Auto-Approval Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#7C3AED]" />
            <span>Plan-Wise Auto-Approval Rules</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose which sidebar modules are automatically unlocked when a company holds each subscription tier.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Subscription Plan</th>
                {moduleItems.map((mod) => (
                  <th key={mod.key} className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <mod.icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{mod.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {normalizePlanRules(planRules).map((plan, planIdx) => (
                <tr key={plan.planName} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${plan.badgeColor}`}>
                      {plan.planName}
                    </span>
                  </td>
                  {moduleItems.map((mod) => {
                    const isChecked = plan.permissions[mod.key];
                    return (
                      <td key={mod.key} className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePlanPerm(planIdx, mod.key)}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition cursor-pointer border ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-600 text-white shadow-xs"
                              : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
                          }`}
                          title={`Toggle ${mod.label} for ${plan.planName}`}
                        >
                          {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-[10px]">—</span>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Default Permissions for New / Unsubscribed Companies */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Default Permissions for Unsubscribed Companies</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Extra features to grant companies before they purchase a plan (in addition to Profile & Subscription).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {moduleItems.map((mod) => {
            const isChecked = defaultNewCompanyPerms[mod.key];
            return (
              <div
                key={mod.key}
                onClick={() => handleToggleDefaultPerm(mod.key)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                  isChecked
                    ? "bg-violet-50/50 border-[#7C3AED] shadow-2xs"
                    : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <mod.icon className={`w-4 h-4 ${isChecked ? "text-[#7C3AED]" : "text-slate-400"}`} />
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold border ${
                      isChecked
                        ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                        : "bg-white text-transparent border-slate-300"
                    }`}
                  >
                    ✓
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">{mod.label}</p>
                  <p className="text-[10px] text-slate-400">{isChecked ? "Enabled by default" : "Disabled by default"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Manual Override Quick Action Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Individual Company Manual Override</span>
          </h4>
          <p className="text-xs text-slate-500 max-w-xl">
            Need to grant specific permissions to a partner company without a subscription? Use the dedicated{" "}
            <span className="font-bold text-amber-700">"Permissions"</span> button next to any company in the Company Management table or Sub-Admin portal.
          </p>
        </div>

        {onGoToCompanies && (
          <button
            type="button"
            onClick={onGoToCompanies}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] hover:bg-[#DDD6FE] rounded-xl transition cursor-pointer shrink-0"
          >
            <span>Open Company Management</span>
            <span className="text-sm">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
