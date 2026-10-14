"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Plus,
  Trash2,
  MapPin,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface JobAlertItem {
  id: string;
  role: string;
  location: string;
  frequency: "Daily" | "Weekly";
  active: boolean;
  createdAt: string;
}

interface JobAlertsViewProps {
  alerts: JobAlertItem[];
  onCreateAlert: (role: string, location: string) => void;
  onDeleteAlert: (alertId: string) => void;
  onToggleAlert: (alertId: string) => void;
}

export default function JobAlertsView({
  alerts = [],
  onCreateAlert,
  onDeleteAlert,
  onToggleAlert,
}: JobAlertsViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim()) return;
    onCreateAlert(roleInput.trim(), locationInput.trim() || "Any Location");
    setRoleInput("");
    setLocationInput("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Job Alerts & Notifications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Receive automated real-time alerts when new jobs matching your preferences are posted
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Alert</span>
        </button>
      </div>

      {/* Alerts Grid */}
      {alerts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900">No Job Alerts Created</h4>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Create custom alerts for your desired job title and preferred location to never miss new hiring openings.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((al) => (
            <div
              key={al.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {al.role}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{al.location}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteAlert(al.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 my-3">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                    {al.frequency} Alert
                  </span>
                  <span className="text-slate-400">Created: {al.createdAt}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/jobs?q=${encodeURIComponent(al.role)}&location=${encodeURIComponent(al.location === "Any Location" ? "" : al.location)}`}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs inline-flex items-center gap-1 transition"
                >
                  <Search className="w-3 h-3" />
                  <span>View Matching Jobs</span>
                </Link>

                <button
                  onClick={() => onToggleAlert(al.id)}
                  className={`text-xs font-bold transition cursor-pointer ${
                    al.active ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {al.active ? "Active" : "Paused"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE ALERT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Create Job Alert
            </h3>

            <form onSubmit={handleCreate} className="space-y-3.5 pt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Job Role / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer, Cloud Architect..."
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Remote, Delhi NCR..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
