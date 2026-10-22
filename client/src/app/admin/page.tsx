"use client";

import React, { useState, useEffect } from "react";
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
import PlansPricingManager, { PlanItem } from "@/components/admin/PlansPricingManager";
import PermissionsSettingsManager from "@/components/admin/PermissionsSettingsManager";
import JobSeekersManager from "@/components/admin/JobSeekersManager";
import {
  getStoredUser,
  fetchAdminOverview,
  fetchAdminCompanies,
  updateCompanyStatus,
  fetchAdminJobs,
  updateAdminJobStatus,
  deleteAdminJob,
  fetchAdminApplications,
  updateAdminApplicationStatus,
  fetchAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  deleteAdminPlan,
  fetchAdminJobSeekers,
  deleteAdminJobSeeker,
  JobSeekerRecord,
  AdminOverviewStats,
} from "@/lib/api";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overviewStats, setOverviewStats] = useState<AdminOverviewStats | null>(null);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateStr, setCurrentDateStr] = useState<string>("");

  useEffect(() => {
    setCurrentDateStr(
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
    const user = getStoredUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (user.role && user.role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  const loadDatabaseData = async () => {
    try {
      setIsLoading(true);
      const [overview, companies, jobsData, appsData, plansData, jobSeekersData] = await Promise.all([
        fetchAdminOverview(),
        fetchAdminCompanies(),
        fetchAdminJobs(),
        fetchAdminApplications(),
        fetchAdminPlans(),
        fetchAdminJobSeekers(),
      ]);

      if (overview) {
        setOverviewStats(overview);
      }

      if (Array.isArray(companies)) {
        setAllCompanies(companies);
        setPendingCompanies(companies.filter((c: any) => c.status === "Pending"));
      }

      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
      }

      if (Array.isArray(appsData)) {
        setApplications(appsData);
      }

      if (Array.isArray(plansData)) {
        setPlans(plansData);
      }

      if (Array.isArray(jobSeekersData)) {
        setJobSeekers(jobSeekersData);
      }
    } catch (err) {
      console.error("Failed to load admin data from DB:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();

    const handleSync = () => {
      loadDatabaseData();
    };
    window.addEventListener("job_created", handleSync);
    window.addEventListener("job_updated", handleSync);
    window.addEventListener("company_profile_updated", handleSync);
    window.addEventListener("company_permissions_updated", handleSync);
    window.addEventListener("companies_updated", handleSync);
    window.addEventListener("auth_change", handleSync);
    window.addEventListener("applied_jobs_change", handleSync);
    window.addEventListener("storage", handleSync);

    const interval = setInterval(loadDatabaseData, 6000);

    return () => {
      window.removeEventListener("job_created", handleSync);
      window.removeEventListener("job_updated", handleSync);
      window.removeEventListener("company_profile_updated", handleSync);
      window.removeEventListener("company_permissions_updated", handleSync);
      window.removeEventListener("companies_updated", handleSync);
      window.removeEventListener("auth_change", handleSync);
      window.removeEventListener("applied_jobs_change", handleSync);
      window.removeEventListener("storage", handleSync);
      clearInterval(interval);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);

  // Real Database Data States (default empty arrays, no mock/dummy records)
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([]);
  const [allCompanies, setAllCompanies] = useState<CompanyRecord[]>([]);
  const [jobSeekers, setJobSeekers] = useState<JobSeekerRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleApproveCompany = async (id: string, name: string) => {
    setPendingCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Approved" } : c))
    );
    setAllCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Approved" } : c))
    );
    showToast(`Approved company "${name}" for platform access!`, "success");

    try {
      await updateCompanyStatus(id, "Approved");
      const overview = await fetchAdminOverview();
      if (overview) setOverviewStats(overview);
    } catch (err) {
      console.error("DB status update error:", err);
    }
  };

  const handleRejectCompany = async (id: string, name: string, reason?: string) => {
    setPendingCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Rejected", rejectionReason: reason } : c))
    );
    setAllCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Rejected", rejectionReason: reason } : c))
    );
    showToast(`Verification for "${name}" rejected. Email sent to company admin.`, "error");

    try {
      await updateCompanyStatus(id, "Rejected", reason);
      const overview = await fetchAdminOverview();
      if (overview) setOverviewStats(overview);
    } catch (err) {
      console.error("DB status update error:", err);
    }
  };

  const handleUpdateApplicationStatus = async (
    id: string,
    status: ApplicationItem["status"]
  ) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(`Application status updated to "${status}".`, "info");

    try {
      await updateAdminApplicationStatus(id, status);
    } catch (err) {
      console.error("DB app status update error:", err);
    }
  };

  const handleToggleJobStatus = async (id: string, newStatus: JobPosting["status"]) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
    showToast(`Job status changed to "${newStatus}".`, "info");

    try {
      await updateAdminJobStatus(id, newStatus);
      const overview = await fetchAdminOverview();
      if (overview) setOverviewStats(overview);
    } catch (err) {
      console.error("DB job status update error:", err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    showToast("Job posting removed from directory.", "error");

    try {
      await deleteAdminJob(id);
      const overview = await fetchAdminOverview();
      if (overview) setOverviewStats(overview);
    } catch (err) {
      console.error("DB delete job error:", err);
    }
  };

  const handleCreatePlan = async (newPlan: Omit<PlanItem, "_id" | "id">) => {
    try {
      const res = await createAdminPlan(newPlan);
      if (res.success) {
        showToast(`Created new plan "${newPlan.name}"!`, "success");
        const updated = await fetchAdminPlans();
        setPlans(updated);
        const overview = await fetchAdminOverview();
        if (overview) setOverviewStats(overview);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("plans_updated"));
          localStorage.setItem("plans_last_updated", String(Date.now()));
        }
      } else {
        showToast(res.message || "Failed to create plan", "error");
      }
    } catch (err) {
      console.error("DB create plan error:", err);
      showToast("Failed to create plan in database", "error");
    }
  };

  const handleEditPlan = async (id: string, updatedPlan: Partial<PlanItem>) => {
    try {
      const res = await updateAdminPlan(id, updatedPlan);
      if (res.success) {
        showToast(`Plan updated successfully!`, "success");
        const updated = await fetchAdminPlans();
        setPlans(updated);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("plans_updated"));
          localStorage.setItem("plans_last_updated", String(Date.now()));
        }
      } else {
        showToast(res.message || "Failed to update plan", "error");
      }
    } catch (err) {
      console.error("DB edit plan error:", err);
      showToast("Failed to update plan in database", "error");
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    try {
      const res = await deleteAdminPlan(id);
      if (res.success) {
        showToast(`Plan "${name}" removed from database.`, "error");
        const updated = await fetchAdminPlans();
        setPlans(updated);
        const overview = await fetchAdminOverview();
        if (overview) setOverviewStats(overview);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("plans_updated"));
          localStorage.setItem("plans_last_updated", String(Date.now()));
        }
      } else {
        showToast(res.message || "Failed to delete plan", "error");
      }
    } catch (err) {
      console.error("DB delete plan error:", err);
      showToast("Failed to delete plan from database", "error");
    }
  };

  const handleDeleteJobSeeker = async (id: string, name: string) => {
    try {
      const res = await deleteAdminJobSeeker(id);
      if (res.success) {
        showToast(`Candidate "${name}" removed successfully.`, "error");
        setJobSeekers((prev) => prev.filter((j) => j.id !== id));
        const overview = await fetchAdminOverview();
        if (overview) setOverviewStats(overview);
      } else {
        showToast(res.message || "Failed to remove candidate", "error");
      }
    } catch (err) {
      console.error("Delete candidate error:", err);
      showToast("Failed to remove candidate", "error");
    }
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
          jobSeekersCount={jobSeekers.length}
        />

        {/* 2. Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
          {/* Top Admin Header Bar */}
          <AdminHeader
            onToggleSidebar={() => setSidebarOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectTab={setActiveTab}
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
                      <span>{currentDateStr || "Today"}</span>
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
                  stats={overviewStats}
                />

                {/* 2. Platform Growth Overview & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2">
                    <GrowthChart
                      totalCompanies={overviewStats?.totalCompanies ?? 0}
                      totalJobs={overviewStats?.totalJobs ?? 0}
                      totalApplications={overviewStats?.totalApplications ?? 0}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <RecentActivity
                      onSelectTab={setActiveTab}
                      companies={allCompanies}
                      applications={applications}
                      jobs={jobs}
                    />
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

                    {/* Recent Applications / Resumes Table */}
                    <RecentApplications
                      applications={applications}
                      onViewAll={() => setActiveTab("resumes")}
                    />
                  </div>

                  {/* Right One-Third: Active Subscriptions & Quick Stats */}
                  <div className="lg:col-span-1 space-y-6">
                    <ActiveSubscriptions
                      onSelectTab={setActiveTab}
                      plans={plans}
                      allCompanies={allCompanies}
                    />
                    <QuickStats
                      pendingCompanies={pendingCount}
                      activeJobs={
                        overviewStats?.activeJobs ??
                        jobs.filter((j) => j.status === "Active").length
                      }
                      totalApplications={
                        overviewStats?.totalApplications ?? applications.length
                      }
                      revenue={overviewStats?.totalRevenue ?? "₹ 0"}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Dedicated Companies Management Tab */}
            {activeTab === "companies" && (
              <CompaniesManager
                companies={allCompanies}
                jobs={jobs}
                applications={applications}
                onApprove={handleApproveCompany}
                onReject={handleRejectCompany}
                onUpdateCompany={(updated) => {
                  setAllCompanies((prev) =>
                    prev.map((c) => (c.id === updated.id ? updated : c))
                  );
                }}
              />
            )}

            {/* Dedicated Job Seekers Directory Tab */}
            {activeTab === "jobseekers" && (
              <JobSeekersManager
                jobSeekers={jobSeekers}
                companies={allCompanies}
                onDeleteJobSeeker={handleDeleteJobSeeker}
                onRefresh={loadDatabaseData}
              />
            )}

            {/* Dedicated Candidate Resumes Tab */}
            {(activeTab === "resumes" || activeTab === "applications") && (
              <ApplicationsManager
                applications={applications}
                companies={allCompanies.map((c) => ({ id: c.id, name: c.name }))}
                onUpdateStatus={handleUpdateApplicationStatus}
                activeView="resumes"
                onAddApplication={(newApp) => {
                  setApplications((prev) => [newApp, ...prev]);
                }}
              />
            )}

            {/* Dedicated Job Postings Tab */}
            {activeTab === "jobs" && (
              <JobsModerator
                jobs={jobs}
                applications={applications}
                onToggleStatus={handleToggleJobStatus}
                onDeleteJob={handleDeleteJob}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                onNavigateToApplications={() => setActiveTab("resumes")}
              />
            )}

            {/* Plans & Pricing Tab */}
            {(activeTab === "plans" || activeTab === "subscriptions") && (
              <PlansPricingManager
                plans={plans}
                onAddPlan={handleCreatePlan}
                onEditPlan={handleEditPlan}
                onDeletePlan={handleDeletePlan}
              />
            )}

            {/* Super Admin Settings: Permissions & Auto-Approval */}
            {activeTab === "settings" && (
              <PermissionsSettingsManager
                onGoToCompanies={() => setActiveTab("companies")}
              />
            )}

            {/* Payments & Reports View */}
            {(activeTab === "payments" || activeTab === "reports") && (
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
        onAddPlan={(newPlan) => {
          handleCreatePlan({
            name: newPlan.name,
            price: newPlan.price,
            billingCycle: newPlan.billing.includes("year") ? "annually" : "monthly",
            credits: Number(newPlan.jobLimit) || 50,
            features: newPlan.features,
            status: "Active",
          });
        }}
      />
    </div>
  );
}
