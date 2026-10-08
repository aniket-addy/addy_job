"use client";

import React, { useState } from "react";
import { X, PlusCircle, CheckCircle2 } from "lucide-react";

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlan: (plan: {
    name: string;
    price: string;
    billing: string;
    jobLimit: string;
    features: string[];
  }) => void;
}

export default function CreatePlanModal({
  isOpen,
  onClose,
  onAddPlan,
}: CreatePlanModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billing, setBilling] = useState("monthly");
  const [jobLimit, setJobLimit] = useState("20");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "Up to 20 active job postings",
    "Candidate resume downloads",
    "Standard platform support",
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    onAddPlan({
      name,
      price: `₹ ${price}`,
      billing: `/${billing === "monthly" ? "month" : "year"}`,
      jobLimit,
      features,
    });
    onClose();
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Create Subscription Plan
            </h3>
            <p className="text-xs text-slate-500">
              Set pricing and quotas for hiring companies.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plan Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Tier"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price (₹ INR)
              </label>
              <input
                type="number"
                required
                placeholder="24999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Billing Cycle
              </label>
              <select
                value={billing}
                onChange={(e) => setBilling(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Features Included
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add feature item..."
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Add
              </button>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {f}
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
            >
              Save & Launch Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
