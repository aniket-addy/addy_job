"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  MapPin,
  Sparkles,
  ShieldCheck,
  Check,
  Users,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { registerUser, setAuthSession } from "@/lib/api";

export type UserRole = "job_seeker" | "company";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step 1: Role Selection | Step 2: Fill Form
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("job_seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check if query parameter has role preselected (e.g. /signup?role=company)
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "company" || roleParam === "job_seeker") {
      setSelectedRole(roleParam);
      setStep(2);
    }
  }, [searchParams]);

  // Job seeker form state
  const [candidateForm, setCandidateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    targetRole: "Frontend Developer",
    experience: "1-3 Years",
  });

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    workEmail: "",
    password: "",
    industry: "Information Technology",
    companySize: "11-50 employees",
    location: "Bengaluru, India",
  });

  const handleSelectRoleAndContinue = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    setSuccessMsg(null);
    setStep(2);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (selectedRole === "job_seeker") {
        const res = await registerUser({
          role: "job_seeker",
          email: candidateForm.email,
          password: candidateForm.password,
          fullName: candidateForm.fullName,
          targetRole: candidateForm.targetRole,
          experience: candidateForm.experience,
        });

        if (!res.success || !res.token || !res.user) {
          setErrorMsg(res.message || "Registration failed. Please try again.");
          setIsLoading(false);
          return;
        }

        setSuccessMsg(res.message || "Account created successfully!");
        setAuthSession(res.token, res.user);

        setTimeout(() => {
          router.push("/candidate/dashboard");
        }, 800);
      } else {
        const res = await registerUser({
          role: "company",
          email: companyForm.workEmail,
          workEmail: companyForm.workEmail,
          password: companyForm.password,
          companyName: companyForm.companyName,
          industry: companyForm.industry,
          companySize: companyForm.companySize,
          location: companyForm.location,
        });

        if (!res.success || !res.token || !res.user) {
          setErrorMsg(res.message || "Registration failed. Please try again.");
          setIsLoading(false);
          return;
        }

        setSuccessMsg(res.message || "Company registered successfully!");
        setAuthSession(res.token, res.user);

        setTimeout(() => {
          router.push("/company/dashboard");
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-y-auto">
        {/* ================= STEP 1: ROLE SELECTION ONLY ================= */}
        {step === 1 ? (
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-5 sm:p-8 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="text-center mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2 border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join CareerConnect</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                How would you like to join?
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Choose your account type below to get started with a customized experience.
              </p>
            </div>

            {/* 2 Big Action Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Option 1: Job Seeker Card */}
              <div
                onClick={() => setSelectedRole("job_seeker")}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5 hover:shadow-md ${
                  selectedRole === "job_seeker"
                    ? "border-blue-600 bg-blue-50/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
                      <User className="w-5 h-5" />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedRole === "job_seeker"
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedRole === "job_seeker" && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    I am a Job Seeker
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Looking for dream roles, tech opportunities, and internships.
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Explore 1,200+ verified tech jobs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>1-Click easy resume application</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Track application & interview status</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRoleAndContinue("job_seeker");
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedRole === "job_seeker"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>Sign up as Job Seeker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Option 2: Company / Employer Card */}
              <div
                onClick={() => setSelectedRole("company")}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5 hover:shadow-md ${
                  selectedRole === "company"
                    ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-105">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedRole === "company"
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedRole === "company" && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    I am an Employer
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Hiring top talent, posting vacancies, and screening candidates.
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Post openings to 50,000+ candidates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Screen & shortlist verified resumes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Manage entire hiring & interview pipeline</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRoleAndContinue("company");
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedRole === "company"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>Sign up as Employer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Sign In
                </Link>
              </p>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* ================= STEP 2: COMPACT VIEW-FIT REGISTRATION FORM ================= */
          <div className="max-w-xl w-full bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-5 sm:p-7 my-auto animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Account Type</span>
              </button>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Step 2 of 2
              </span>
            </div>

            {/* Role Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                    selectedRole === "job_seeker"
                      ? "bg-blue-600 shadow-sm"
                      : "bg-indigo-600 shadow-sm"
                  }`}
                >
                  {selectedRole === "job_seeker" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                    {selectedRole === "job_seeker"
                      ? "Job Seeker Registration"
                      : "Employer / Company Registration"}
                  </h2>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {selectedRole === "job_seeker"
                      ? "Create your profile to apply for jobs and get hired."
                      : "Register your company to post openings and hire talent."}
                  </p>
                </div>
              </div>
            </div>

            {/* Error / Success Feedback Banners */}
            {errorMsg && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 2-Column Compact Responsive Form */}
            <form onSubmit={handleSignup} className="space-y-3">
              {selectedRole === "job_seeker" ? (
                <>
                  {/* Row 1: Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={candidateForm.fullName}
                          onChange={(e) =>
                            setCandidateForm({ ...candidateForm, fullName: e.target.value })
                          }
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="rahul@example.com"
                          value={candidateForm.email}
                          onChange={(e) =>
                            setCandidateForm({ ...candidateForm, email: e.target.value })
                          }
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Target Role & Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Role / Domain
                      </label>
                      <select
                        value={candidateForm.targetRole}
                        onChange={(e) =>
                          setCandidateForm({ ...candidateForm, targetRole: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Product Manager">Product Manager</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Experience Level
                      </label>
                      <select
                        value={candidateForm.experience}
                        onChange={(e) =>
                          setCandidateForm({ ...candidateForm, experience: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="Fresher / Student">Fresher / Student</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years (Senior)</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Company Row 1: Company Name & Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Acme Tech Pvt Ltd"
                          value={companyForm.companyName}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, companyName: e.target.value })
                          }
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Work Email
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="hr@acme.com"
                          value={companyForm.workEmail}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, workEmail: e.target.value })
                          }
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Row 2: Industry & Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Industry
                      </label>
                      <select
                        value={companyForm.industry}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, industry: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="Information Technology">Information Technology</option>
                        <option value="Fintech & Banking">Fintech & Banking</option>
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="Healthcare & EdTech">Healthcare & EdTech</option>
                        <option value="Manufacturing & Auto">Manufacturing & Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Size
                      </label>
                      <select
                        value={companyForm.companySize}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, companySize: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="1-10 employees">1-10 employees (Startup)</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="200+ employees">200+ employees (Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  {/* Company Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Office Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Bengaluru, Karnataka, India"
                        value={companyForm.location}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, location: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={
                      selectedRole === "job_seeker"
                        ? candidateForm.password
                        : companyForm.password
                    }
                    onChange={(e) => {
                      if (selectedRole === "job_seeker") {
                        setCandidateForm({ ...candidateForm, password: e.target.value });
                      } else {
                        setCompanyForm({ ...companyForm, password: e.target.value });
                      }
                    }}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  defaultChecked
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-500">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] ${
                    selectedRole === "job_seeker"
                      ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                  }`}
                >
                  {isLoading ? (
                    <span>Opening your dashboard...</span>
                  ) : (
                    <>
                      <span>
                        {selectedRole === "job_seeker"
                          ? "Complete Registration & Open Dashboard"
                          : "Complete Employer Setup & Open Dashboard"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading registration...
        </div>
      }
    >
      <SignupContent />
    </React.Suspense>
  );
}
