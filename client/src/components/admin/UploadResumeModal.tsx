"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { ApplicationItem } from "./RecentApplications";
import { createAdminApplication } from "@/lib/api";

const DOMAIN_OPTIONS = [
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Mobile App Development",
  "Data Science & AI/ML",
  "Cloud & DevOps Engineering",
  "UI/UX & Product Design",
  "Quality Assurance & QA",
  "Product Management",
  "Cybersecurity",
  "Digital Marketing & Growth",
  "Human Resources (HR)",
  "Sales & Business Development",
  "Finance & Accounts",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  "Fresher (0 - 1 Year)",
  "1 - 2 Years (Junior)",
  "3 - 5 Years (Mid-Level)",
  "5 - 8 Years (Senior)",
  "8+ Years (Lead / Principal)",
  "Other",
];

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies?: Array<{ id: string; name: string }>;
  onSuccess: (newApplication: ApplicationItem) => void;
}

export default function UploadResumeModal({
  isOpen,
  onClose,
  companies = [],
  onSuccess,
}: UploadResumeModalProps) {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [domain, setDomain] = useState("Full Stack Development");
  const [customDomain, setCustomDomain] = useState("");
  const [experience, setExperience] = useState("1 - 2 Years (Junior)");
  const [customExperience, setCustomExperience] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("General Candidate Pool / Open");
  const [skills, setSkills] = useState("");
  const [status, setStatus] = useState<ApplicationItem["status"]>("New");

  // PDF State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<string>("");
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pdfFileSize, setPdfFileSize] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setErrorMsg("");
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document (.pdf)");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File size exceeds 15MB limit. Please upload a smaller PDF.");
      return;
    }

    setPdfFile(file);
    setPdfFileName(file.name);
    setPdfFileSize(
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`
    );

    // Read file as Base64 Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPdfData(result);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read the PDF file. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfData("");
    setPdfFileName("");
    setPdfFileSize("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const effectiveDomain = domain === "Other" ? customDomain.trim() : domain;
    const effectiveExperience = experience === "Other" ? customExperience.trim() : experience;

    if (!candidateName.trim()) {
      setErrorMsg("Please enter candidate name.");
      return;
    }
    if (!effectiveDomain) {
      setErrorMsg("Please select or enter a domain.");
      return;
    }
    if (!effectiveExperience) {
      setErrorMsg("Please select or enter candidate experience.");
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await createAdminApplication({
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        candidatePhone: candidatePhone.trim(),
        domain: effectiveDomain,
        experience: effectiveExperience,
        position: position.trim() || effectiveDomain,
        company: company.trim() || "General Candidate Pool / Open",
        skills: skillsArray,
        pdfData: pdfData,
        fileName: pdfFileName,
        status: status,
      });

      if (res && res.success && res.application) {
        onSuccess(res.application);
        onClose();
      } else {
        // Fallback optimistic creation if offline
        const fallbackApp: ApplicationItem = {
          id: `app-${Date.now()}`,
          candidateName: candidateName.trim(),
          candidateEmail: candidateEmail.trim(),
          candidatePhone: candidatePhone.trim(),
          avatarLetter: candidateName.trim().slice(0, 2).toUpperCase() || "CD",
          avatarBg: "bg-blue-600",
          position: position.trim() || effectiveDomain,
          company: company.trim() || "General Candidate Pool / Open",
          appliedOn: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: status,
          domain: effectiveDomain,
          experience: effectiveExperience,
          skills: skillsArray,
          pdfData: pdfData,
          fileName: pdfFileName,
        };
        onSuccess(fallbackApp);
        onClose();
      }
    } catch (err: any) {
      console.error("Upload resume error:", err);
      setErrorMsg(err.message || "Failed to upload resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Upload className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Upload Candidate Resume
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Super Admin
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Register candidate profile, domain, experience level, and PDF resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Candidate Basic Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Candidate Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Candidate Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="e.g. rahul.sharma@example.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Company / Client Pool
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="General Candidate Pool / Open">
                      General Candidate Pool (Open for All)
                    </option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Domain & Experience (User's Core Requirement) */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Specialization & Experience
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Domain Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Domain / Field <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 cursor-pointer"
                  >
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                {domain === "Other" && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom domain name"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="mt-2 w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                )}
              </div>

              {/* Experience Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Experience Level <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 cursor-pointer"
                  >
                    {EXPERIENCE_OPTIONS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>
                {experience === "Other" && (
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4.5 Years or Ex-Amazon"
                    value={customExperience}
                    onChange={(e) => setCustomExperience(e.target.value)}
                    className="mt-2 w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                )}
              </div>

              {/* Applied Role / Position */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Applied Role / Target Job Title
                </label>
                <input
                  type="text"
                  placeholder={`e.g. Senior ${domain !== "Other" ? domain : "Engineer"}`}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                />
              </div>

              {/* Initial Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationItem["status"])}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Key Skills / Tech Stack (comma separated)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. React, Next.js, Node.js, TypeScript, Tailwind CSS, MongoDB"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Upload PDF (User's Core Requirement) */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                Upload PDF Resume
              </span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">
                pdf format (max 15MB)
              </span>
            </h3>

            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {!pdfData ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/70 scale-[0.99]"
                    : "border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 shadow-xs">
                  <Upload className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 text-center">
                  Click to browse or drag and drop candidate PDF
                </p>
                <p className="text-[11px] text-slate-400 text-center mt-1">
                  Supported format: <strong className="text-slate-600">PDF (.pdf)</strong>
                </p>
                <button
                  type="button"
                  className="mt-3 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100"
                >
                  Choose PDF Document
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs">
                        {pdfFileName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        PDF Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {pdfFileSize} • Converted for instant in-browser preview
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newWin = window.open();
                      if (newWin) {
                        newWin.document.write(
                          `<iframe src="${pdfData}" style="width:100%; height:100%; border:none;"></iframe>`
                        );
                      }
                    }}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                    title="Preview in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={removePdf}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition"
                    title="Remove PDF"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Resume...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Save Resume</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
