"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
  Building2,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";

import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import MetricCards from "@/components/admin/MetricCards";
import GrowthChart from "@/components/admin/GrowthChart";
import RecentActivity from "@/components/admin/RecentActivity";
import QuickActions from "@/components/admin/QuickActions";
import PendingApprovals, { PendingCompany } from "@/components/admin/PendingApprovals";
import RecentApplications, { ApplicationItem } from "@/components/admin/RecentApplications";
import ActiveSubscriptions from "@/components/admin/ActiveSubscriptions";
import QuickStats from "@/components/admin/QuickStats";
import CompaniesManager, { CompanyRecord } from "@/components/admin/CompaniesManager";
import ApplicationsManager from "@/components/admin/ApplicationsManager";
import JobsModerator, { JobPosting } from "@/components/admin/JobsModerator";
import CreatePlanModal from "@/components/admin/CreatePlanModal";
import MobileBottomNav from "@/components/admin/MobileBottomNav";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);

  // Initial Companies state
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([
    {
      id: "c1",
      name: "BrightPath Technologies",
      plan: "Pro Plan",
      submittedOn: "Apr 24, 2025 10:24 AM",
      status: "Pending",
      logoBg: "bg-blue-600",
      logoLetter: "BP",
    },
    {
      id: "c2",
      name: "Skyline Solutions",
      plan: "Premium Plan",
      submittedOn: "Apr 24, 2025 09:12 AM",
      status: "Pending",
      logoBg: "bg-indigo-600",
      logoLetter: "SS",
    },
    {
      id: "c3",
      name: "GreenField Innovations",
      plan: "Basic Plan",
      submittedOn: "Apr 23, 2025 08:45 PM",
      status: "Pending",
      logoBg: "bg-emerald-600",
      logoLetter: "GF",
    },
    {
      id: "c4",
      name: "NovaTech Pvt Ltd",
      plan: "Pro Plan",
      submittedOn: "Apr 23, 2025 03:20 PM",
      status: "Pending",
      logoBg: "bg-violet-600",
      logoLetter: "NT",
    },
  ]);

  // Full companies directory
  const [allCompanies, setAllCompanies] = useState<CompanyRecord[]>([
    {
      id: "c1",
      name: "BrightPath Technologies",
      email: "hr@brightpath.io",
      location: "Bengaluru, India",
      activeJobs: 14,
      plan: "Pro Plan",
      status: "Pending",
      submittedOn: "Apr 24, 2025",
      logoBg: "bg-blue-600",
      logoLetter: "BP",
    },
    {
      id: "c2",
      name: "Skyline Solutions",
      email: "contact@skyline.co",
      location: "Hyderabad, India",
      activeJobs: 28,
      plan: "Premium Plan",
      status: "Pending",
      submittedOn: "Apr 24, 2025",
      logoBg: "bg-indigo-600",
      logoLetter: "SS",
    },
    {
      id: "c3",
      name: "GreenField Innovations",
      email: "careers@greenfield.in",
      location: "Pune, India",
      activeJobs: 6,
      plan: "Basic Plan",
      status: "Pending",
      submittedOn: "Apr 23, 2025",
      logoBg: "bg-emerald-600",
      logoLetter: "GF",
    },
    {
      id: "c4",
      name: "NovaTech Pvt Ltd",
      email: "jobs@novatech.com",
      location: "Noida, India",
      activeJobs: 19,
      plan: "Pro Plan",
      status: "Pending",
      submittedOn: "Apr 23, 2025",
      logoBg: "bg-violet-600",
      logoLetter: "NT",
    },
    {
      id: "c5",
      name: "Google Inc.",
      email: "recruitment@google.com",
      location: "Mountain View, USA & Remote",
      activeJobs: 142,
      plan: "Enterprise",
      status: "Approved",
      submittedOn: "Jan 12, 2025",
      logoBg: "bg-amber-500",
      logoLetter: "G",
    },
    {
      id: "c6",
      name: "Microsoft",
      email: "talent@microsoft.com",
      location: "Redmond, USA & India",
      activeJobs: 98,
      plan: "Enterprise",
      status: "Approved",
      submittedOn: "Feb 04, 2025",
      logoBg: "bg-blue-500",
      logoLetter: "M",
    },
    {
      id: "c7",
      name: "BuildBit Inc.",
      email: "admin@buildbit.net",
      location: "Mumbai, India",
      activeJobs: 0,
      plan: "Basic Plan",
      status: "Rejected",
      submittedOn: "Apr 22, 2025",
      logoBg: "bg-rose-600",
      logoLetter: "BB",
    },
  ]);

  // Candidates & Applications
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: "a1",
      candidateName: "Rahul Sharma",
      avatarLetter: "RS",
      avatarBg: "bg-blue-600",
      position: "Frontend Developer",
      company: "NovaTech",
      appliedOn: "Apr 24, 2025",
      status: "New",
    },
    {
      id: "a2",
      candidateName: "Priya Singh",
      avatarLetter: "PS",
      avatarBg: "bg-pink-600",
      position: "UI/UX Designer",
      company: "BrightPath",
      appliedOn: "Apr 24, 2025",
      status: "Shortlisted",
    },
    {
      id: "a3",
      candidateName: "Amit Verma",
      avatarLetter: "AV",
      avatarBg: "bg-amber-600",
      position: "Backend Developer",
      company: "GreenField",
      appliedOn: "Apr 23, 2025",
      status: "Reviewed",
    },
    {
      id: "a4",
      candidateName: "Sneha Patel",
      avatarLetter: "SP",
      avatarBg: "bg-teal-600",
      position: "Full Stack Developer",
      company: "Skyline",
      appliedOn: "Apr 23, 2025",
      status: "New",
    },
    {
      id: "a5",
      candidateName: "Vikram Malhotra",
      avatarLetter: "VM",
      avatarBg: "bg-indigo-600",
      position: "DevOps Engineer",
      company: "BrightPath",
      appliedOn: "Apr 22, 2025",
      status: "Hired",
    },
  ]);

  // Job Postings
  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: "j1",
      title: "Senior Full Stack Engineer",
      company: "BrightPath Technologies",
      type: "Full-Time • Remote",
      location: "Bengaluru, KA",
      salary: "₹ 18 - 25 LPA",
      status: "Active",
      postedOn: "Apr 24, 2025",
      applicantsCount: 64,
    },
    {
      id: "j2",
      title: "Lead UI/UX Designer",
      company: "Skyline Solutions",
      type: "Full-Time",
      location: "Hyderabad, TS",
      salary: "₹ 14 - 20 LPA",
      status: "Active",
      postedOn: "Apr 23, 2025",
      applicantsCount: 42,
    },
    {
      id: "j3",
      title: "Backend Go / Node Developer",
      company: "NovaTech Pvt Ltd",
      type: "Full-Time",
      location: "Noida, UP",
      salary: "₹ 15 - 22 LPA",
      status: "Pending",
      postedOn: "Apr 23, 2025",
      applicantsCount: 19,
    },
    {
      id: "j4",
      title: "Product Marketing Manager",
      company: "GreenField Innovations",
      type: "Contract",
      location: "Pune, MH",
      salary: "₹ 10 - 15 LPA",
      status: "Active",
      postedOn: "Apr 20, 2025",
      applicantsCount: 31,
    },
    {
      id: "j5",
      title: "Junior React Native Developer",
      company: "BrightPath Technologies",
      type: "Internship",
      location: "Bengaluru, KA",
      salary: "₹ 35,000 / mo",
      status: "Expired",
      postedOn: "Mar 10, 2025",
      applicantsCount: 118,
    },
  ]);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleApproveCompany = (id: string, name: string) => {
    setPendingCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Approved" } : c))
    );
    setAllCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Approved" } : c))
    );
    showToast(`Approved company "${name}" for platform access!`, "success");
  };

  const handleRejectCompany = (id: string, name: string) => {
    setPendingCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c))
    );
    setAllCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c))
    );
    showToast(`Application for "${name}" has been rejected.`, "error");
  };

  const handleUpdateApplicationStatus = (
    id: string,
    status: ApplicationItem["status"]
  ) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(`Application status updated to "${status}".`, "info");
  };

  const handleToggleJobStatus = (id: string, newStatus: JobPosting["status"]) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
    showToast(`Job status changed to "${newStatus}".`, "info");
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    showToast("Job posting removed from directory.", "error");
  };

  const handleAddPlan = (newPlan: { name: string; price: string }) => {
    showToast(`Created new plan "${newPlan.name}" (${newPlan.price})!`, "success");
  };

  const pendingCount = pendingCompanies.filter((c) => c.status === "Pending").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Alert System */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : toastMessage.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-blue-400" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* 1. Left Dark Navy Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pendingCompaniesCount={pendingCount}
        />

        {/* 2. Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
          {/* Top Admin Header Bar */}
          <AdminHeader
            onToggleSidebar={() => setSidebarOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Main Dashboard Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
            {/* View Switcher: Dashboard or Dedicated Management Views */}
            {activeTab === "dashboard" && (
              <>
                {/* Top Banner: Greeting, Date & View Reports Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Good Morning, Super Admin</span>
                      <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Here&apos;s what&apos;s happening on your platform today.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    {/* Date Pill */}
                    <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-sm">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Wed, 24 Apr 2025</span>
                    </div>

                    {/* View Reports Button */}
                    <button
                      onClick={() => setActiveTab("reports")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Reports</span>
                    </button>
                  </div>
                </div>

                {/* 1. 4 Metric Cards */}
                <MetricCards
                  onSelectTab={setActiveTab}
                  pendingCount={pendingCount}
                />

                {/* 2. Platform Growth Overview & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2">
                    <GrowthChart />
                  </div>
                  <div className="lg:col-span-1">
                    <RecentActivity onSelectTab={setActiveTab} />
                  </div>
                </div>

                {/* 3. Quick Actions */}
                <QuickActions
                  onSelectAction={setActiveTab}
                  onOpenCreatePlan={() => setCreatePlanModalOpen(true)}
                />

                {/* 4. Lower Two-Column Section: Tables & Subscriptions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Left Two-Thirds: Tables */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Pending Approvals Table */}
                    <PendingApprovals
                      companies={pendingCompanies}
                      onApprove={handleApproveCompany}
                      onReject={handleRejectCompany}
                      onViewAll={() => setActiveTab("companies")}
                    />

                    {/* Recent Applications Table */}
                    <RecentApplications
                      applications={applications}
                      onViewAll={() => setActiveTab("applications")}
                    />
                  </div>

                  {/* Right One-Third: Active Subscriptions & Quick Stats */}
                  <div className="lg:col-span-1 space-y-6">
                    <ActiveSubscriptions onSelectTab={setActiveTab} />
                    <QuickStats pendingCompanies={pendingCount} />
                  </div>
                </div>
              </>
            )}

            {/* Dedicated Companies Management Tab */}
            {activeTab === "companies" && (
              <CompaniesManager
                companies={allCompanies}
                onApprove={handleApproveCompany}
                onReject={handleRejectCompany}
              />
            )}

            {/* Dedicated Job Seekers & Applications Tab */}
            {(activeTab === "applications" || activeTab === "resumes") && (
              <ApplicationsManager
                applications={applications}
                onUpdateStatus={handleUpdateApplicationStatus}
              />
            )}

            {/* Dedicated Job Postings Tab */}
            {activeTab === "jobs" && (
              <JobsModerator
                jobs={jobs}
                onToggleStatus={handleToggleJobStatus}
                onDeleteJob={handleDeleteJob}
              />
            )}

            {/* Subscriptions & Plans Tab */}
            {(activeTab === "subscriptions" || activeTab === "plans") && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-6 h-6 text-blue-600" />
                      <span>Subscription Tiers & Platform Pricing</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure corporate recruiter packages, pricing models, and billing cycles.
                    </p>
                  </div>
                  <button
                    onClick={() => setCreatePlanModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
                  >
                    + Create New Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        Popular
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">Pro Plan</h3>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        ₹ 9,999 <span className="text-xs text-slate-400 font-normal">/ month</span>
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li>✓ 128 Subscribed Companies</li>
                        <li>✓ Up to 25 Active Jobs</li>
                        <li>✓ Unlimited Candidate Applications</li>
                        <li>✓ Standard Verification Badge</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-md flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                        Enterprise Grade
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">Premium Plan</h3>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        ₹ 19,999 <span className="text-xs text-slate-400 font-normal">/ month</span>
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li>✓ 72 Subscribed Companies</li>
                        <li>✓ Unlimited Active Job Requisitions</li>
                        <li>✓ Priority Candidate Matching</li>
                        <li>✓ Dedicated Account Representative</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                        Starter
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">Basic Plan</h3>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        ₹ 4,999 <span className="text-xs text-slate-400 font-normal">/ month</span>
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li>✓ 45 Subscribed Companies</li>
                        <li>✓ Up to 5 Active Jobs</li>
                        <li>✓ Standard Candidate Inbox</li>
                        <li>✓ Community Support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payments & Reports View */}
            {(activeTab === "payments" || activeTab === "reports" || activeTab === "settings") && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 capitalize">
                  {activeTab} Management
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Detailed analytics, transaction history, and system audit logs are automatically synced and aggregated from platform telemetry.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                  >
                    Return to Super Admin Dashboard
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. Mobile Bottom Navigation (Visible on Mobile Screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSidebar={() => setSidebarOpen(true)}
        pendingCount={pendingCount}
      />

      {/* 4. Create Plan Modal */}
      <CreatePlanModal
        isOpen={createPlanModalOpen}
        onClose={() => setCreatePlanModalOpen(false)}
        onAddPlan={handleAddPlan}
      />
    </div>
  );
}
