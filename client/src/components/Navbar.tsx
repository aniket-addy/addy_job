"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Bell,
  Menu,
  X,
  CheckCircle,
  User,
  Briefcase,
  Bookmark,
  LogOut,
  ShieldCheck,
  Home,
  Heart,
} from "lucide-react";
import { getStoredUser, clearAuthSession, UserSession } from "@/lib/api";

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({ activeTab }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentUser(getStoredUser());
    const handleAuth = () => setCurrentUser(getStoredUser());
    window.addEventListener("auth_change", handleAuth);
    window.addEventListener("storage", handleAuth);
    return () => {
      window.removeEventListener("auth_change", handleAuth);
      window.removeEventListener("storage", handleAuth);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Companies", href: "/companies" },
    { name: "Resources", href: "/resources" },
    { name: "About", href: "/about" },
  ];

  const getIsActive = (href: string, name: string) => {
    if (activeTab) return activeTab.toLowerCase() === name.toLowerCase();
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Left */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* AddyJob Logo */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-xs shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center bg-black">
                <Image
                  src="/addyjob-logo.png"
                  alt="AddyJob Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                Addy<span className="text-blue-600">Job</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.href, link.name);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative py-2 text-sm lg:text-[15px] font-medium transition-colors group"
                >
                  <span
                    className={
                      isActive
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }
                  >
                    {link.name}
                  </span>
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full mx-auto w-full transition-all" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Profile */}
          <div className="hidden md:flex items-center gap-4 lg:gap-5 relative">
            {/* Search Link */}
            <Link
              href="/jobs"
              aria-label="Search Jobs"
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </Link>

            {/* When Logged In: Show Bell, Profile Avatar with Dropdown, and Dashboard Button */}
            {mounted && currentUser ? (
              <>
                {/* Notification Bell with Badge */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileOpen(false);
                    }}
                    aria-label="Notifications"
                    className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                  >
                    <Bell className="w-5 h-5 stroke-[2]" />
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      1
                    </span>
                  </button>

                  {/* Notification Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="text-sm font-bold text-slate-900">Notifications</span>
                        <span className="text-xs text-blue-600 font-medium">Mark all read</span>
                      </div>
                      <div className="py-3 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">Application Viewed!</p>
                          <p className="text-xs text-slate-500 mt-0.5">NovaTech reviewed your Frontend Developer application.</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">10 minutes ago</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar & Dropdown */}
                <div className="relative pl-1">
                  <button
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setNotificationsOpen(false);
                    }}
                    title={currentUser.name || "My Profile"}
                    className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-200/90 shadow-xs hover:ring-blue-500 transition-all cursor-pointer flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm hover:scale-105"
                  >
                    <Image
                      src={
                        currentUser.role === "job_seeker"
                          ? "/reviewer-1.jpg"
                          : "/avatar.png"
                      }
                      alt={currentUser.name || "User Profile"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {currentUser.name || "My Account"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {currentUser.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                          {currentUser.role === "job_seeker"
                            ? "Candidate"
                            : currentUser.role === "company"
                            ? "Company"
                            : "Super Admin"}
                        </span>
                      </div>
                      <div className="py-1">
                        {currentUser.role === "company" ? (
                          <Link
                            href="/company/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                          >
                            <Briefcase className="w-4 h-4 text-indigo-500" />
                            <span>Employer Dashboard</span>
                          </Link>
                        ) : currentUser.role === "admin" ? (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50/70 hover:bg-blue-100 transition"
                          >
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>Super Admin Portal</span>
                          </Link>
                        ) : (
                          <Link
                            href="/candidate/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                          >
                            <User className="w-4 h-4 text-blue-500" />
                            <span>Candidate Profile / Dashboard</span>
                          </Link>
                        )}
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Button: ONLY shown for Company and Super Admin */}
                {currentUser.role === "company" ? (
                  <Link
                    href="/company/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Company Dashboard</span>
                  </Link>
                ) : currentUser.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : null}
              </>
            ) : (
              /* When Logged Out: Show ONLY Sign In & Create Account buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
                >
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right: Bell (when logged in) + Hamburger Menu */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && currentUser && (
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="relative p-2 text-slate-700 hover:text-blue-600 rounded-full transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5 stroke-[2]" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[2]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[2]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.href, link.name);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </Link>
              );
            })}
          </div>

          {mounted && currentUser ? (
            /* Mobile Signed In Details */
            <div className="pt-2 space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-slate-200">
                    <Image
                      src="/avatar.png"
                      alt="User Profile"
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {currentUser.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[170px]">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 uppercase">
                  {currentUser.role === "job_seeker" ? "Candidate" : currentUser.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={
                    currentUser.role === "admin"
                      ? "/admin"
                      : currentUser.role === "company"
                      ? "/company/dashboard"
                      : "/candidate/dashboard"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2 px-3 bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {currentUser.role === "job_seeker"
                    ? "My Profile"
                    : currentUser.role === "company"
                    ? "Company Dashboard"
                    : "Admin Portal"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center py-2 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            /* Mobile Signed Out Details */
            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-3 bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>

    {/* Mobile Bottom Navigation Bar (Fixed at bottom on all mobile screens) */}
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[54px] rounded-xl transition-all ${
            pathname === "/"
              ? "text-blue-600 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${pathname === "/" ? "fill-blue-600/20 stroke-[2.2]" : "stroke-[1.8]"}`} />
          <span className="text-[11px] mt-1 tracking-tight">Home</span>
        </Link>

        {/* 2. Jobs */}
        <Link
          href="/jobs"
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[54px] rounded-xl transition-all ${
            pathname.startsWith("/jobs") && !pathname.includes("saved")
              ? "text-blue-600 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Briefcase className={`w-5 h-5 transition-transform ${pathname.startsWith("/jobs") && !pathname.includes("saved") ? "stroke-[2.2]" : "stroke-[1.8]"}`} />
          <span className="text-[11px] mt-1 tracking-tight">Jobs</span>
        </Link>

        {/* 3. Saved */}
        <Link
          href="/jobs?filter=saved"
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[54px] rounded-xl transition-all ${
            pathname.includes("saved")
              ? "text-blue-600 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Heart className={`w-5 h-5 transition-transform ${pathname.includes("saved") ? "fill-blue-600/20 stroke-[2.2]" : "stroke-[1.8]"}`} />
          <span className="text-[11px] mt-1 tracking-tight">Saved</span>
        </Link>

        {/* 4. Alerts */}
        <button
          type="button"
          onClick={() => setNotificationsOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[54px] rounded-xl transition-all cursor-pointer ${
            notificationsOpen
              ? "text-blue-600 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Alerts</span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[54px] rounded-xl transition-all cursor-pointer ${
            mobileMenuOpen || pathname === "/about"
              ? "text-blue-600 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <User className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-1 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  </>
  );
}
