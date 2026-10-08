"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Bell, Menu, X } from "lucide-react";

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({ activeTab = "Home" }: NavbarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Companies", href: "#" },
    { name: "Resources", href: "#" },
    { name: "About", href: "#" },
  ];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Left */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              {/* CareerConnect Custom Connected Node Logo */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-9 h-9 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                >
                  {/* Connected Node Graphic */}
                  <circle cx="10" cy="18" r="7" fill="#2563EB" />
                  <circle cx="25" cy="11" r="6" fill="#3B82F6" />
                  <circle cx="26" cy="25" r="5" fill="#60A5FA" />
                  {/* Subtle connecting bridge */}
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
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = currentTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setCurrentTab(link.name)}
                  className="relative py-2 text-sm lg:text-[15px] font-medium transition-colors cursor-pointer group"
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
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Profile */}
          <div className="hidden md:flex items-center gap-5">
            {/* Search Button */}
            <button
              aria-label="Search"
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Notification Bell with Badge */}
            <button
              aria-label="Notifications"
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                1
              </span>
            </button>

            {/* Profile Avatar */}
            <div className="relative pl-1">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-200/80 shadow-sm hover:ring-blue-500 transition-all cursor-pointer">
                <Image
                  src="/avatar.jpg"
                  alt="User Profile"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
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
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
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
              const isActive = currentTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    setCurrentTab(link.name);
                    setMobileMenuOpen(false);
                  }}
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
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-slate-200">
                <Image
                  src="/avatar.jpg"
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
                <p className="text-xs text-slate-500">View profile</p>
              </div>
            </div>
            <button
              aria-label="Search"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
