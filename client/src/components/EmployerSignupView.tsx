"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Users,
  AlertCircle,
  Globe,
  Briefcase,
  Zap,
  TrendingUp,
  UserCheck,
  Send,
  Star,
  Crown,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Search,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { registerUser, setAuthSession } from "@/lib/api";

interface EmployerSignupViewProps {
  onSwitchToJobSeeker?: () => void;
}

export default function EmployerSignupView({ onSwitchToJobSeeker }: EmployerSignupViewProps) {
  const router = useRouter();

  // Form State
  const [form, setForm] = useState({
    companyName: "",
    workEmail: "",
    website: "",
    companySize: "",
    industry: "",
    password: "",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // FAQ open/close accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First one open by default

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!form.companyName.trim()) {
      setErrorMsg("Please enter your company name.");
      setIsLoading(false);
      return;
    }
    if (!form.workEmail.trim()) {
      setErrorMsg("Please enter your official work email.");
      setIsLoading(false);
      return;
    }
    if (!form.password || form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    if (!form.agreeTerms) {
      setErrorMsg("Please agree to the Terms of Service and Privacy Policy.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await registerUser({
        role: "company",
        email: form.workEmail.trim().toLowerCase(),
        workEmail: form.workEmail.trim().toLowerCase(),
        password: form.password,
        companyName: form.companyName.trim(),
        industry: form.industry || "Information Technology",
        companySize: form.companySize || "11-50 employees",
        location: "Bengaluru, India",
      });

      if (!res.success || !res.token || !res.user) {
        setErrorMsg(res.message || "Registration failed. Please check your details.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Company registered successfully! Redirecting to dashboard...");
      setAuthSession(res.token, res.user);

      setTimeout(() => {
        router.push("/company/dashboard");
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("employer-registration-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const faqs = [
    {
      q: "How can a recruiter sign up for an AddyJob account?",
      a: "Getting started takes less than two minutes. Fill out the registration form with your company details, official corporate email, and size. Once submitted, your company workspace is instantly created and ready for job postings.",
    },
    {
      q: "How does pricing work for AddyJob recruiter plans and job postings?",
      a: "We offer transparent monthly and annual subscription tiers. Starter is great for fast single hires, while Professional and Enterprise unlock advanced candidate search and volume discounts. Annual billing saves you an extra 20%.",
    },
    {
      q: "What support, insight, and team collaboration features does AddyJob offer?",
      a: "You get full applicant tracking dashboards, stage-by-stage pipeline management, applicant resume downloads, candidate status tagging, and dedicated customer support via email and live assistance.",
    },
    {
      q: "How secure is my recruiter account?",
      a: "All data is safeguarded with enterprise-grade 256-bit SSL encryption, isolated database tenancies, secure bcrypt password hashing, and token authentication. Your candidate notes and hiring pipelines remain 100% confidential.",
    },
    {
      q: "How can I find the right candidates using AddyJob?",
      a: "Our smart talent discovery engine lets you filter candidates across tech domains, experience levels, notice periods, and locations. Verified candidate badges guarantee verified resumes and authentic contact details.",
    },
    {
      q: "What features does AddyJob provide for bulk hiring?",
      a: "Our Enterprise plan is specifically designed for high-volume recruitment drives, offering unlimited job postings, bulk candidate resume export, automated pre-screening questions, and a dedicated account manager.",
    },
    {
      q: "How can recruiters promote employer branding on AddyJob?",
      a: "Professional and Enterprise accounts feature custom branded company profiles showcasing your work culture, office pictures, team testimonials, and employee perks, boosting applicant response rates by up to 3x.",
    },
    {
      q: "Are there any tips for writing effective job postings on AddyJob?",
      a: "Provide clear responsibilities, distinct required vs. preferred tech skills, transparent compensation ranges, and flexible work modes. Clear descriptions see significant boosts in high-intent candidate conversions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#7C3AED] selection:text-white">
      {/* 1. Header Navbar */}
      <Navbar
        actionButtonText="Post a Job"
        actionButtonHref="#employer-registration-card"
      />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-slate-200/60 bg-gradient-to-b from-purple-50/50 via-white to-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

            {/* Left Column: Brand Message, Feature Highlights & Visual */}
            <div className="lg:col-span-7 space-y-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] text-xs font-bold tracking-wide uppercase">
                <span>FOR COMPANIES</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Find the best{" "}
                <span className="text-[#7C3AED] bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  talent
                </span>{" "}
                for your team
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Post jobs, access a vast pool of verified candidates, and hire faster with AddyJob.
              </p>

              {/* 3 Value Propositions */}
              <div className="space-y-4 pt-1">
                {/* Bullet 1 */}
                <div className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Reach qualified candidates</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Access millions of job seekers across industries.
                    </p>
                  </div>
                </div>

                {/* Bullet 2 */}
                <div className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <Zap className="w-5 h-5 fill-emerald-600/20" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Hire faster</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Powerful tools to find, shortlisting and connect.
                    </p>
                  </div>
                </div>

                {/* Bullet 3 */}
                <div className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Build your employer brand</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showcase your company and attract top talent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero Visual Showcase with Floating Cards */}
              <div className="relative pt-4 max-w-lg">
                {/* Team photo frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-white">
                  <Image
                    src="/employer-team.jpg"
                    alt="AddyJob Employer Hiring Team"
                    width={640}
                    height={480}
                    className="w-full h-[270px] sm:h-[310px] object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Card 1: 500+ Applications (Top-Right) */}
                <div className="absolute -top-3 -right-3 sm:-right-5 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex items-center gap-3 animate-pulse">
                  <div>
                    <span className="block text-sm sm:text-base font-black text-slate-900 leading-none">
                      500+
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Applications
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-6 w-8 pb-0.5">
                    <div className="w-1.5 h-3 bg-purple-300 rounded-sm" />
                    <div className="w-1.5 h-4 bg-purple-400 rounded-sm" />
                    <div className="w-1.5 h-6 bg-[#7C3AED] rounded-sm" />
                    <div className="w-1.5 h-5 bg-[#6D28D9] rounded-sm" />
                  </div>
                </div>

                {/* Floating Card 2: Great Candidates (Bottom-Left) */}
                <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-900 mb-1">
                    Great Candidates
                  </span>
                  <div className="flex items-center -space-x-2">
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                      <Image
                        src="/reviewer-1.jpg"
                        alt="Candidate"
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                      <Image
                        src="/reviewer-2.jpg"
                        alt="Candidate"
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                      <Image
                        src="/reviewer-4.jpg"
                        alt="Candidate"
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-[#7C3AED] text-white text-[9px] font-bold flex items-center justify-center">
                      +99
                    </div>
                  </div>
                </div>

                {/* Floating Card 3: Post Job in Minutes (Bottom-Right) */}
                <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-xs font-black text-slate-900">Post Job</span>
                    <span className="text-[10px] text-slate-500">in Minutes</span>
                  </div>
                </div>
              </div>

              {/* Hero Bottom Key Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/80 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">10M+</div>
                  <div className="text-[11px] text-slate-500 font-medium">Active Job Seekers</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">50K+</div>
                  <div className="text-[11px] text-slate-500 font-medium">Companies Hiring</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">95%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Faster Hiring Process</div>
                </div>
              </div>
            </div>

            {/* Right Column: "Create Company Account" Registration Card */}
            <div className="lg:col-span-5" id="employer-registration-card">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-slate-200/80 p-5 sm:p-8 relative">

                {/* Form Header */}
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Create Company Account
                    </h2>
                    {onSwitchToJobSeeker && (
                      <button
                        type="button"
                        onClick={onSwitchToJobSeeker}
                        className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] hover:underline cursor-pointer"
                      >
                        Job Seeker?
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Start hiring the right talent with AddyJob.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleFormSubmit} className="space-y-3.5">

                  {/* Field 1: Company Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. AddyJob Technologies Pvt. Ltd."
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8B5CF6] focus:bg-white focus:ring-2 focus:ring-[#EDE9FE] transition-all"
                      />
                    </div>
                  </div>

                  {/* Field 2: Work Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="hr@company.com"
                        value={form.workEmail}
                        onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8B5CF6] focus:bg-white focus:ring-2 focus:ring-[#EDE9FE] transition-all"
                      />
                    </div>
                  </div>

                  {/* Field 3: Company Website (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company Website (Optional)
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        placeholder="https://www.company.com"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8B5CF6] focus:bg-white focus:ring-2 focus:ring-[#EDE9FE] transition-all"
                      />
                    </div>
                  </div>

                  {/* Field 4: Company Size */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company Size
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={form.companySize}
                        onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                        className="w-full pl-10 pr-8 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8B5CF6] focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10 employees">1-10 employees (Startup)</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="500+ employees">500+ employees (Enterprise)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Field 5: Industry */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Industry
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={form.industry}
                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                        className="w-full pl-10 pr-8 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8B5CF6] focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select industry</option>
                        <option value="Information Technology">Information Technology & Software</option>
                        <option value="Fintech & Banking">Fintech & Banking</option>
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="Healthcare & EdTech">Healthcare & Pharmaceuticals</option>
                        <option value="Manufacturing & Auto">Manufacturing & Automotive</option>
                        <option value="Media & Marketing">Media, Advertising & Marketing</option>
                        <option value="Consulting & HR Services">Consulting & HR Services</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Field 6: Create Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8B5CF6] focus:bg-white focus:ring-2 focus:ring-[#EDE9FE] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      id="company-terms"
                      type="checkbox"
                      required
                      checked={form.agreeTerms}
                      onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-[#7C3AED] focus:ring-[#8B5CF6] cursor-pointer"
                    />
                    <label htmlFor="company-terms" className="text-[11px] text-slate-500 leading-snug cursor-pointer">
                      I agree to the{" "}
                      <a href="#" className="text-[#7C3AED] hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#7C3AED] hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.99] shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span>Creating Company Account...</span>
                      ) : (
                        <>
                          <span>Create Company Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom Sign In Link */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-bold text-[#7C3AED] hover:text-[#6D28D9] hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>

                  {/* Switch to Job Seeker prompt */}
                  {onSwitchToJobSeeker && (
                    <div className="pt-2 border-t border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={onSwitchToJobSeeker}
                        className="text-[11px] text-slate-400 hover:text-[#7C3AED] font-medium transition cursor-pointer"
                      >
                        Looking for job opportunities? Register as Job Seeker &rarr;
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trusted By Leading Companies Section */}
      <section className="py-12 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-8">
            TRUSTED BY LEADING COMPANIES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Google */}
            <div className="flex items-center gap-1 font-sans font-bold text-lg sm:text-xl text-slate-700">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>

            {/* Microsoft */}
            <div className="flex items-center gap-2 font-sans font-semibold text-base sm:text-lg text-slate-700">
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <span className="bg-[#F25022] rounded-[1px]" />
                <span className="bg-[#7FBA00] rounded-[1px]" />
                <span className="bg-[#00A4EF] rounded-[1px]" />
                <span className="bg-[#FFB900] rounded-[1px]" />
              </div>
              <span>Microsoft</span>
            </div>

            {/* Amazon */}
            <div className="flex flex-col items-center">
              <span className="font-sans font-black text-lg sm:text-xl text-slate-800 tracking-tight leading-none">
                amazon
              </span>
              <svg className="w-12 h-2 text-[#FF9900]" viewBox="0 0 50 10" fill="none">
                <path
                  d="M2 3C15 8 35 8 48 3"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Infosys */}
            <div className="font-sans font-bold text-lg sm:text-xl text-[#007CC3] tracking-wide">
              Infosys
            </div>

            {/* TCS */}
            <div className="flex items-baseline gap-1">
              <span className="font-sans font-black text-lg sm:text-xl text-[#E31837] tracking-tighter">
                tcs
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                TATA CONSULTANCY SERVICES
              </span>
            </div>

            {/* Flipkart */}
            <div className="flex items-center gap-1.5 font-sans font-black italic text-lg sm:text-xl text-[#2874F0]">
              <div className="w-5 h-5 rounded-md bg-[#2874F0] text-[#FFE500] font-bold text-xs flex items-center justify-center not-italic">
                f
              </div>
              <span>Flipkart</span>
            </div>

            {/* Accenture */}
            <div className="flex items-center font-sans font-bold text-base sm:text-lg text-slate-800 tracking-tight">
              <span>accenture</span>
              <span className="text-[#A100FF] font-black ml-0.5">&gt;</span>
            </div>
          </div>
        </div>
      </section>


      {/* 5. Frequently Asked Questions Section */}
      <section className="py-16 lg:py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Find answers to common questions about hiring on AddyJob.
            </p>
          </div>

          {/* Accordion list */}
          <div className="divide-y divide-slate-100 border-y border-slate-100">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-[#7C3AED] transition-colors">
                      {faq.q}
                    </span>
                    <span className="text-xl sm:text-2xl font-light text-slate-400 group-hover:text-[#7C3AED] shrink-0 transition-transform duration-200">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pr-8 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Footer matching Image 2 */}
      <footer className="bg-[#0B132B] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-slate-800/80">

            {/* Column 1: Brand & Socials */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center p-0.5">
                  <Image
                    src="/addyjob-logo.png"
                    alt="AddyJob"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-lg font-black tracking-tight text-white">
                  Addy<span className="text-[#7C3AED]">Job</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Hire the right talent, faster. AddyJob connects companies with top job seekers across industries.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#7C3AED] transition"
                >
                  <span className="text-[11px] font-bold">in</span>
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#7C3AED] transition"
                >
                  <span className="text-[11px] font-bold">𝕏</span>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 transition"
                >
                  <span className="text-[11px] font-bold">ig</span>
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition"
                >
                  <span className="text-[11px] font-bold">yt</span>
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="font-bold text-white text-xs mb-3.5 tracking-wider uppercase">
                Product
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#employer-registration-card" onClick={scrollToForm} className="hover:text-white transition">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#employer-registration-card" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Employer Branding
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Recruiter Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="font-bold text-white text-xs mb-3.5 tracking-wider uppercase">
                Company
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div>
              <h4 className="font-bold text-white text-xs mb-3.5 tracking-wider uppercase">
                Resources
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/resources" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Hiring Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Love Note */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>&copy; 2024 AddyJob. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <span className="text-red-500">❤️</span> for better hiring
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
