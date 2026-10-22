"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Sparkles } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconBg?: string;
  iconColor?: string;
}

interface CustomJobDropdownProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  quickPills?: string[];
  allowCustomInput?: boolean;
  customInputPlaceholder?: string;
  className?: string;
}

export const CustomJobDropdown: React.FC<CustomJobDropdownProps> = ({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  quickPills,
  allowCustomInput = false,
  customInputPlaceholder = "Type custom value...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Selected Option object (if matching predefined option)
  const selectedOption = options.find(
    (opt) =>
      opt.value.toLowerCase().trim() === (value || "").toLowerCase().trim() ||
      opt.label.toLowerCase().trim() === (value || "").toLowerCase().trim()
  );

  const SelectedIcon = selectedOption?.icon;

  return (
    <div className={`relative ${isOpen ? "z-30" : "z-10"} ${className}`} ref={containerRef}>
      {/* Label */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {selectedOption?.badge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              selectedOption.badgeColor || "bg-purple-50 text-purple-700 border-purple-200"
            }`}
          >
            {selectedOption.badge}
          </span>
        )}
      </div>

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full group px-3.5 py-2.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer select-none ${
          isOpen
            ? "bg-white border-[#7C3AED] ring-4 ring-purple-100 shadow-sm"
            : "bg-slate-50/90 hover:bg-white border-slate-200/90 hover:border-purple-300 shadow-2xs"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {SelectedIcon ? (
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                selectedOption.iconBg || "bg-purple-100"
              } ${selectedOption.iconColor || "text-purple-700"}`}
            >
              <SelectedIcon className="w-4 h-4" />
            </div>
          ) : value ? (
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold">•</span>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
              {selectedOption ? selectedOption.label : value || placeholder}
            </div>
            {selectedOption?.description && (
              <div className="text-[10px] text-slate-400 font-medium truncate -mt-0.5">
                {selectedOption.description}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
              isOpen
                ? "bg-purple-100 text-purple-700 rotate-180"
                : "text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100"
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-purple-950/15 p-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Custom Input Field (e.g. for custom experience typing) */}
          {allowCustomInput && (
            <div className="p-2 border-b border-slate-100 mb-1">
              <div className="relative">
                <input
                  ref={customInputRef}
                  type="text"
                  placeholder={customInputPlaceholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-hidden font-medium"
                />
                {value && (
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 pl-1">
                Select from popular presets below or type freely
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 overscroll-contain">
            {options.map((option) => {
              const isSelected =
                option.value.toLowerCase().trim() === (value || "").toLowerCase().trim() ||
                option.label.toLowerCase().trim() === (value || "").toLowerCase().trim();
              const OptionIcon = option.icon;

              return (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-purple-50 text-purple-900 font-bold border border-purple-200/70 shadow-2xs"
                      : "hover:bg-slate-50/90 text-slate-700 hover:text-slate-900 font-medium"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {OptionIcon && (
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          option.iconBg || "bg-slate-100"
                        } ${option.iconColor || "text-slate-600"}`}
                      >
                        <OptionIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs truncate flex items-center gap-1.5">
                        <span className={isSelected ? "text-purple-900 font-bold" : "text-slate-800"}>
                          {option.label}
                        </span>
                        {option.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${
                              option.badgeColor || "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Select Pills (optional, e.g. for experience presets) */}
      {quickPills && quickPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quick:</span>
          {quickPills.map((pill) => {
            const isMatch = (value || "").toLowerCase().includes(pill.toLowerCase().replace("yrs", "").trim());
            return (
              <button
                key={pill}
                type="button"
                onClick={() => onChange(pill)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  isMatch
                    ? "bg-purple-100 text-purple-700 border-purple-300 shadow-2xs font-bold"
                    : "bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border-slate-200 hover:border-purple-200"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
