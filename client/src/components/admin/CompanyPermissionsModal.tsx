"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  KeyRound,
  Check,
  Sparkles,
  Building2,
  CreditCard,
  Briefcase,
  Users,
  FolderDown,
  LayoutDashboard,
  Settings,
  AlertCircle,
  Zap,
  Info,
} from "lucide-react";
import { CompanyRecord } from "./CompaniesManager";
import {
  CompanyPermissions,
  DEFAULT_COMPANY_PERMISSIONS,
  PLAN_AUTO_PERMISSIONS,
  updateCompanyPermissions,
} from "@/lib/api";

interface CompanyPermissionsModalProps {
  isOpen: boolean;
  company: CompanyRecord | null;
  onClose: () => void;
  onSuccess?: (updatedCompany: CompanyRecord) => void;
  onPermissionsUpdated?: (permissions: CompanyPermissions) => void;
}

export default function CompanyPermissionsModal({
  isOpen,
  company,
  onClose,
  onSuccess,
  onPermissionsUpdated,
}: CompanyPermissionsModalProps) {
  const [permissions, setPermissions] = useState<CompanyPermissions>(DEFAULT_COMPANY_PERMISSIONS);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Initialize permissions when modal opens or company changes
  useEffect(() => {
    if (company) {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem(`company_permissions_${company.id}`)
          : null;

      let initialPerms: CompanyPermissions = {
        ...DEFAULT_COMPANY_PERMISSIONS,
        ...(company.permissions || {}),
      };

      if (stored) {
        try {
          initialPerms = { ...initialPerms, ...JSON.parse(stored) };
        } catch {
          // ignore parsing error
        }
      }

      // If auto-approve from plan is active and company has plan
      if (initialPerms.autoApproveFromSubscription && company.plan) {
        const planPerms = PLAN_AUTO_PERMISSIONS[company.plan];
        if (planPerms) {
          initialPerms = { ...initialPerms, ...planPerms };
        }
      }

      setPermissions(initialPerms);
    }
  }, [company]);

  if (!isOpen || !company) return null;

  const handleToggle = (key: keyof Omit<CompanyPermissions, "autoApproveFromSubscription">) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleApplyPreset = (preset: "default" | "standard" | "full") => {
    if (preset === "default") {
      setPermissions({
        dashboard: false,
        jobs: false,
        applicants: false,
        resumes: false,
        settings: false,
        autoApproveFromSubscription: false,
      });
    } else if (preset === "standard") {
      setPermissions({
        dashboard: false,
        jobs: true,
        applicants: true,
        resumes: false,
        settings: false,
        autoApproveFromSubscription: true,
      });
    } else if (preset === "full") {
      setPermissions({
        dashboard: true,
        jobs: true,
        applicants: true,
        resumes: true,
        settings: true,
        autoApproveFromSubscription: true,
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await updateCompanyPermissions(company.id, permissions, {
        name: company.name,
        email: company.email,
      });

      if (!res.success) {
        setFeedback({
          text: res.message || "Failed to update permissions in database.",
          type: "error",
        });
        return;
      }

      // Also persist to localStorage for instant local/dev sync across tabs
      if (typeof window !== "undefined") {
        localStorage.setItem(`company_permissions_${company.id}`, JSON.stringify(permissions));
        localStorage.setItem(
          `company_permissions_${company.email.toLowerCase()}`,
          JSON.stringify(permissions)
        );
        if (res.company?.id) {
          localStorage.setItem(`company_permissions_${res.company.id}`, JSON.stringify(permissions));
        }
        window.dispatchEvent(new Event("company_permissions_updated"));
      }

      const updatedCompany: CompanyRecord = {
        ...company,
        id: res.company?.id || company.id,
        permissions,
      };

      if (onPermissionsUpdated) {
        onPermissionsUpdated(permissions);
      }
      if (onSuccess) {
        onSuccess(updatedCompany);
      }

      setFeedback({ text: "Permissions saved successfully in database!", type: "success" });
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error("Failed to save permissions:", err);
      setFeedback({
        text: err?.message || "Failed to update permissions in database.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const permissionItems = [
    {
      id: "jobs" as const,
      name: "Job Postings",
      description: "Allow company to create, publish, edit, and manage hiring vacancies.",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      enabled: permissions.jobs,
    },
    {
      id: "applicants" as const,
      name: "Candidate Applications",
      description: "Allow company to review incoming applicant profiles and interview stages.",
      icon: Users,
      color: "text-violet-600 bg-violet-50 border-violet-200",
      enabled: permissions.applicants,
    },
    {
      id: "resumes" as const,
      name: "Resume Database & Downloads",
      description: "Allow company to search verified candidates and access resume downloads.",
      icon: FolderDown,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      enabled: permissions.resumes,
    },
    {
      id: "dashboard" as const,
      name: "Recruitment Dashboard & Analytics",
      description: "Allow company to view recruitment KPI charts, applicant metrics, and reports.",
      icon: LayoutDashboard,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      enabled: permissions.dashboard,
    },
    {
      id: "settings" as const,
      name: "Account Settings & Preferences",
      description: "Allow company to customize internal recruitment preferences and settings.",
      icon: Settings,
      color: "text-slate-600 bg-slate-100 border-slate-200",
      enabled: permissions.settings,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pb-5 border-b border-slate-100 pr-10">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shrink-0 shadow-md ${company.logoBg}`}
          >
            {company.logoLetter}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {company.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 text-[#7C3AED] border border-violet-200">
                {company.plan}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  company.status === "Approved"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {company.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Super Admin Manual Feature Permissions (With or without subscription)</span>
            </p>
          </div>
        </div>

        {/* Info Banner & Auto-Approval Option */}
        <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-200/80 mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Zap className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900">
                Subscription Plan Auto-Approval
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                If enabled, features defined in <strong>{company.plan}</strong> tier will be automatically granted to this company. You can still toggle individual modules on or off below.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setPermissions((prev) => ({
                ...prev,
                autoApproveFromSubscription: !prev.autoApproveFromSubscription,
              }))
            }
            className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
              permissions.autoApproveFromSubscription ? "bg-[#7C3AED]" : "bg-slate-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                permissions.autoApproveFromSubscription ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700">Quick Access Presets:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset("default")}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              Default Only
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("standard")}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
            >
              Standard Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("full")}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
            >
              Full Access
            </button>
          </div>
        </div>

        {/* Default Modules (Always Visible) */}
        <div className="mb-3 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Default Modules (Always Visible in Sidebar)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-700 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Company Details / Profile</div>
                  <div className="text-[10px] text-slate-500">Public profile & company metadata</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Default
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-700 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Subscription & Billing</div>
                  <div className="text-[10px] text-slate-500">Plan tiers & invoice renewals</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Default
              </span>
            </div>
          </div>
        </div>

        {/* Feature Permissions List */}
        <div className="space-y-2.5 pt-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Permission-Protected Sidebar Modules
          </div>

          <div className="space-y-2">
            {permissionItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    item.enabled
                      ? "bg-white border-[#7C3AED]/40 shadow-xs"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{item.name}</span>
                        {item.enabled ? (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Granted
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                            Hidden / Restricted
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(item.id);
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                      item.enabled ? "bg-[#7C3AED]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        item.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in border ${
              feedback.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            {feedback.type === "error" ? (
              <X className="w-4 h-4 stroke-[3] text-rose-600" />
            ) : (
              <Check className="w-4 h-4 stroke-[3] text-emerald-600" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Changes take effect immediately on company&apos;s next page load or session.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-violet-500/20 transition cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save Permissions</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
