"use client";

import React from "react";
import { User, Eye } from "lucide-react";

export interface ApplicationItem {
  id: string;
  candidateName: string;
  avatarLetter: string;
  avatarBg: string;
  position: string;
  company: string;
  appliedOn: string;
  status: "New" | "Shortlisted" | "Reviewed" | "Hired" | "Rejected";
}

interface RecentApplicationsProps {
  applications: ApplicationItem[];
  onViewAll?: () => void;
  onSelectApplication?: (app: ApplicationItem) => void;
}

export default function RecentApplications({
  applications,
  onViewAll,
  onSelectApplication,
}: RecentApplicationsProps) {
  const getStatusBadge = (status: ApplicationItem["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shortlisted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Reviewed":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hired":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Candidate</th>
              <th className="py-2.5 px-3">Position</th>
              <th className="py-2.5 px-3">Company</th>
              <th className="py-2.5 px-3">Applied On</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => onSelectApplication?.(app)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                {/* Candidate */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${app.avatarBg}`}
                    >
                      {app.avatarLetter}
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {app.candidateName}
                    </span>
                  </div>
                </td>

                {/* Position */}
                <td className="py-3 px-3 text-slate-700 font-medium">
                  {app.position}
                </td>

                {/* Company */}
                <td className="py-3 px-3 text-slate-500 font-medium">
                  {app.company}
                </td>

                {/* Applied On */}
                <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                  {app.appliedOn}
                </td>

                {/* Status */}
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
