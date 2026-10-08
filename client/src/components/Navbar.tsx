"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Bell, Menu, X, CheckCircle, User, Briefcase, Bookmark, LogOut, ShieldCheck } from "lucide-react";

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({ activeTab }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    <nav className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Left */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* CareerConnect Custom Connected Node Logo */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-9 h-9 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                >
                  <circle cx="10" cy="18" r="7" fill="#2563EB" />
                  <circle cx="25" cy="11" r="6" fill="#3B82F6" />
                  <circle cx="26" cy="25" r="5" fill="#60A5FA" />
                  <path
                    d="M14 16 L22 13"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 20 L23 23"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="18" r="3" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
                Career<span className="text-blue-600">Connect</span>
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
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-200/80 shadow-sm hover:ring-blue-500 transition-all cursor-pointer flex items-center justify-center"
              >
                <Image
                  src="/avatar.png"
                  alt="User Profile"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">Alex Morgan</p>
                    <p className="text-xs text-slate-500">alex.morgan@career.com</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/jobs"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>My Applications</span>
                    </Link>
                    <Link
                      href="/jobs"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>Saved Jobs</span>
                    </Link>
                    <Link
                      href="/resources"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50/70 hover:bg-blue-100 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Super Admin Portal</span>
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Admin Portal link on large screens */}
            <Link
              href="/admin"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all duration-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              className="relative p-2 text-slate-600 hover:text-blue-600 rounded-full"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-1 ring-white">
                1
              </span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
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

          <div className="pt-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Open Super Admin Portal</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-2">
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
                <p className="text-sm font-semibold text-slate-800">
                  Alex Morgan
                </p>
                <p className="text-xs text-slate-500">alex.morgan@career.com</p>
              </div>
            </div>
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Search"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
