"use client";

import React, { useState } from "react";
import { Check, X, Building2, CheckCircle2 } from "lucide-react";

export interface PendingCompany {
  id: string;
  name: string;
  plan: string;
  submittedOn: string;
  status: "Pending" | "Approved" | "Rejected";
  logoBg: string;
  logoLetter: string;
}

interface PendingApprovalsProps {
  companies: PendingCompany[];
  onApprove: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
  onViewAll?: () => void;
}

export default function PendingApprovals({
  companies,
  onApprove,
  onReject,
  onViewAll,
}: PendingApprovalsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === companies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(companies.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Premium Plan":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Pro Plan":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-slate-900">Pending Approvals</h3>
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            {companies.filter((c) => c.status === "Pending").length}
          </span>
        </div>
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
              <th className="py-2.5 px-3 w-8">
                <input
                  type="checkbox"
                  checked={
                    companies.length > 0 && selectedIds.length === companies.length
                  }
                  onChange={toggleSelectAll}
                  aria-label="Select all companies"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3">Company</th>
              <th className="py-2.5 px-3">Plan</th>
              <th className="py-2.5 px-3">Submitted On</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  All company applications have been reviewed!
                </td>
              </tr>
            ) : (
              companies.map((company) => {
                const isSelected = selectedIds.includes(company.id);
                return (
                  <tr
                    key={company.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(company.id)}
                        aria-label={`Select ${company.name}`}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    {/* Company */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] text-white shrink-0 ${company.logoBg}`}
                        >
                          {company.logoLetter}
                        </div>
                        <span className="font-bold text-slate-800 truncate max-w-[150px] sm:max-w-none">
                          {company.name}
                        </span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getPlanBadge(
                          company.plan
                        )}`}
                      >
                        {company.plan}
                      </span>
                    </td>

                    {/* Submitted On */}
                    <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {company.submittedOn}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          company.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : company.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      {company.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApprove(company.id, company.name)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => onReject(company.id, company.name)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3 h-3 stroke-[3]" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
