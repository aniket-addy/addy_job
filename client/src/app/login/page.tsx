"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { loginUser, setAuthSession } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"job_seeker" | "company" | "admin">("job_seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await loginUser({
        email: email.trim(),
        password,
        role,
      });

      if (!res.success || !res.token || !res.user) {
        setErrorMsg(res.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg(res.message || "Login successful! Opening dashboard...");
      setAuthSession(res.token, res.user);

      setTimeout(() => {
        if (res.user?.role === "admin" || role === "admin") {
          router.push("/admin");
        } else if (res.user?.role === "company") {
          router.push("/company/dashboard");
        } else {
          router.push("/candidate/dashboard");
        }
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-y-auto">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-5 sm:p-7 my-auto">
          <div className="text-center mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage your career opportunities or vacancies.
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setRole("job_seeker");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === "job_seeker"
                  ? "bg-white text-blue-600 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("company");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === "company"
                  ? "bg-white text-indigo-600 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Company
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === "admin"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Super Admin
            </button>
          </div>

          {/* Feedback Banners */}
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

          {/* Super Admin Quick Credentials Helper */}
          {role === "admin" && (
            <div className="mb-3 px-3 py-2 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-[11px] flex items-center justify-between animate-in fade-in duration-150">
              <span>
                Admin: <b>sadmin@gmail.com</b> | Pass: <b>Sadmin123</b>
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail("sadmin@gmail.com");
                  setPassword("Sadmin123");
                }}
                className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer bg-amber-100/70 px-2 py-0.5 rounded-lg"
              >
                Auto-fill
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={
                    role === "admin"
                      ? "sadmin@gmail.com"
                      : role === "company"
                      ? "recruiter@company.com"
                      : "candidate@email.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-1.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>
                      Sign In as{" "}
                      {role === "admin"
                        ? "Super Admin"
                        : role === "company"
                        ? "Company"
                        : "Job Seeker"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
