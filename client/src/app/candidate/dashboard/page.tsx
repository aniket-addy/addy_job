"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
  Bookmark,
  Bell,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Send,
  Calendar,
  Eye,
  CheckCircle2,
  ChevronRight,
  Download,
  Upload,
  Crown,
  Headphones,
  Search,
  Edit3,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
  Camera,
  Home,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { getStoredUser, clearAuthSession } from "@/lib/api";

interface ApplicationItem {
  id: string;
  role: string;
  company: string;
  location: string;
  status: "Applied" | "Viewed" | "Interview" | "Shortlisted";
  date: string;
  avatarBg: string;
  avatarText: string;
}

export default function CandidateDashboardPage() {
  const router = useRouter();

  // Profile State
  const [name, setName] = useState("Rahul Sharma");
  const [headline, setHeadline] = useState("Frontend Developer");
  const [experience, setExperience] = useState("2+ Years Experience");
  const [location, setLocation] = useState("Noida, Uttar Pradesh");
  const [email, setEmail] = useState("rahul.sharma@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [education, setEducation] = useState("B.Tech in Computer Science (2020 - 2024)");
  const [languages, setLanguages] = useState("English, Hindi");
  const [bio, setBio] = useState(
    "Passionate Frontend Developer with experience in building responsive and user-friendly web applications using React.js, Next.js and modern web technologies. Always eager to learn and work on challenging projects."
  );

  const [skills, setSkills] = useState([
    "React.js",
    "Next.js",
    "JavaScript",
    "Tailwind CSS",
    "TypeScript",
    "HTML",
    "CSS",
    "Node.js",
    "Git",
    "MongoDB",
  ]);

  const [resumeName, setResumeName] = useState("Rahul_Sharma_Resume.pdf");
  const [resumeDate, setResumeDate] = useState("Updated 2 days ago • 1.2 MB");

  // Navigation / Tab States
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    "dashboard" | "profile" | "resume" | "applied" | "saved" | "alerts" | "messages" | "settings"
  >("profile");

  const [appliedSubTab, setAppliedSubTab] = useState<"applied" | "saved" | "interviews">("applied");
  const [tabletTab, setTabletTab] = useState<"about" | "skills" | "resume" | "experience" | "education">("about");

  // UI Interactive States
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uploadResumeModalOpen, setUploadResumeModalOpen] = useState(false);
  const [completeProfileModalOpen, setCompleteProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Applications list matching the mockup
  const [applications] = useState<ApplicationItem[]>([
    {
      id: "1",
      role: "Frontend Developer",
      company: "TechCorp",
      location: "Noida",
      status: "Applied",
      date: "2 days ago",
      avatarBg: "bg-blue-600",
      avatarText: "TC",
    },
    {
      id: "2",
      role: "UI/UX Designer",
      company: "BrightPath",
      location: "Gurugram",
      status: "Viewed",
      date: "3 days ago",
      avatarBg: "bg-purple-600",
      avatarText: "BP",
    },
    {
      id: "3",
      role: "React Developer",
      company: "InnovateTech",
      location: "Bangalore",
      status: "Interview",
      date: "5 days ago",
      avatarBg: "bg-indigo-600",
      avatarText: "IT",
    },
  ]);

  // Load user data from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = getStoredUser();
      if (user) {
        if (user.name) setName(user.name);
        if (user.email) setEmail(user.email);
      }
      const savedProfile = localStorage.getItem("candidate_profile_custom");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.headline) setHeadline(parsed.headline);
          if (parsed.experience) setExperience(parsed.experience);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.education) setEducation(parsed.education);
          if (parsed.languages) setLanguages(parsed.languages);
          if (parsed.bio) setBio(parsed.bio);
          if (parsed.skills) setSkills(parsed.skills);
          if (parsed.resumeName) setResumeName(parsed.resumeName);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = (formData.get("name") as string) || name;
    const newHeadline = (formData.get("headline") as string) || headline;
    const newExp = (formData.get("experience") as string) || experience;
    const newLoc = (formData.get("location") as string) || location;
    const newMail = (formData.get("email") as string) || email;
    const newPhone = (formData.get("phone") as string) || phone;
    const newBio = (formData.get("bio") as string) || bio;
    const newEdu = (formData.get("education") as string) || education;
    const newLang = (formData.get("languages") as string) || languages;
    const rawSkills = (formData.get("skills") as string) || skills.join(", ");

    setName(newName);
    setHeadline(newHeadline);
    setExperience(newExp);
    setLocation(newLoc);
    setEmail(newMail);
    setPhone(newPhone);
    setBio(newBio);
    setEducation(newEdu);
    setLanguages(newLang);
    const splitSkills = rawSkills.split(",").map((s) => s.trim()).filter(Boolean);
    if (splitSkills.length) setSkills(splitSkills);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "candidate_profile_custom",
        JSON.stringify({
          headline: newHeadline,
          experience: newExp,
          location: newLoc,
          phone: newPhone,
          bio: newBio,
          education: newEdu,
          languages: newLang,
          skills: splitSkills,
        })
      );
    }

    setEditModalOpen(false);
    showToast("Profile updated successfully!");
  };

  const handleUploadResume = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById("resume-file-input") as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const fileName = input.files[0].name;
      setResumeName(fileName);
      setResumeDate("Updated just now • " + (input.files[0].size / (1024 * 1024)).toFixed(1) + " MB");
    } else {
      setResumeName(`${name.replace(/\s+/g, "_")}_Resume_Updated.pdf`);
      setResumeDate("Updated just now • 1.4 MB");
    }
    setUploadResumeModalOpen(false);
    showToast("Resume uploaded successfully!");
  };

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[999] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4 border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Career<span className="text-blue-600">Connect</span>
            </span>
          </Link>
        </div>

        {/* Global Search Pill (Desktop & Tablet) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden"
            />
          </div>
        </div>

        {/* Right Actions: Notifications & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                  <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                    1 New
                  </span>
                </div>
                <div className="py-2 space-y-1">
                  <div className="p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-50 transition flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      TC
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        TechCorp reviewed your application
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill / Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-200/90 shadow-xs relative bg-blue-100">
                <Image
                  src="/reviewer-1.jpg"
                  alt={name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-slate-800 max-w-[120px] truncate">
                {name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-50 text-emerald-600 uppercase">
                    Job Seeker
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setEditModalOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <Edit3 className="w-4 h-4 text-blue-500" />
                    <span>Edit Profile</span>
                  </button>
                  <Link
                    href="/jobs"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    <span>Browse All Jobs</span>
                  </Link>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: SIDEBAR + CONTENT */}
      <div className="flex-1 flex max-w-[1536px] w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 gap-6">
        {/* LEFT SIDEBAR (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6">
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-1">
            <button
              onClick={() => setActiveSidebarTab("dashboard")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSidebarTab === "dashboard"
                  ? "bg-blue-50 text-blue-600 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab("profile")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSidebarTab === "profile"
                  ? "bg-blue-100/70 text-blue-700 font-extrabold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab("resume")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSidebarTab === "resume"
                  ? "bg-blue-50 text-blue-600 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>My Resume</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab("applied")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSidebarTab === "applied"
                  ? "bg-blue-50 text-blue-600 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Send className="w-4 h-4 text-slate-500" />
                <span>Applied Jobs</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                12
              </span>
            </button>

            <button
              onClick={() => setActiveSidebarTab("saved")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSidebarTab === "saved"
                  ? "bg-blue-50 text-blue-600 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>Saved Jobs</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab("alerts")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSidebarTab === "alerts"
                  ? "bg-blue-50 text-blue-600 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span>Job Alerts</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab("messages")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSidebarTab === "messages"
                  ? "bg-blue-50 text-blue-600 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Messages</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                5
              </span>
            </button>

            <button
              onClick={() => setActiveSidebarTab("settings")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSidebarTab === "settings"
                  ? "bg-blue-50 text-blue-600 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </button>
          </div>

          {/* Upgrade to Premium Card */}
          <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#1E1B4B] via-[#1E293B] to-[#0F172A] text-white shadow-xl shadow-slate-900/10 border border-slate-700/50">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-slate-900 mb-3 shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold tracking-tight">Upgrade to Premium</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Get more job opportunities, unlimited applications & more.
            </p>
            <button
              onClick={() => showToast("Premium plans opening soon!")}
              className="mt-4 w-full py-2.5 px-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <span>Upgrade Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Need Help Link */}
          <div className="px-4 py-2 flex items-center gap-3 text-slate-500 hover:text-blue-600 transition cursor-pointer text-xs font-medium">
            <Headphones className="w-4 h-4 text-slate-400" />
            <div>
              <p className="font-semibold text-slate-700">Need Help?</p>
              <p className="text-[10px] text-slate-400">Contact support</p>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {/* 1. HERO PROFILE CARD */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F0F5FF] via-[#EEF2FF] to-[#FAF5FF] rounded-3xl border border-blue-100/80 p-5 sm:p-7 shadow-xs">
            {/* Watermark Script Text on Right (Mockup Match) */}
            <div className="absolute right-6 top-8 select-none pointer-events-none hidden xl:block text-right">
              <span className="font-serif italic text-2xl lg:text-3xl font-normal text-indigo-400/40 tracking-wide">
                Better Opportunities Ahead →
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              {/* Left Profile Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                {/* Avatar with Camera icon */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-blue-100">
                    <Image
                      src="/reviewer-1.jpg"
                      alt={name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md ring-2 ring-white transition cursor-pointer"
                    title="Change profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Name, Headline, Contact, Bio */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {name}
                    </h1>
                    <span className="inline-flex items-center text-blue-600" title="Verified Candidate">
                      <CheckCircle className="w-5 h-5 fill-blue-600 text-white" />
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span>{headline}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-600 font-normal">{experience}</span>
                  </p>

                  {/* Contact Badges */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-[11px] sm:text-xs text-slate-600 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {phone}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-[13px] text-slate-600 max-w-2xl leading-relaxed pt-1">
                    {bio}
                  </p>

                  {/* Primary Skills Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.slice(0, 5).map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-slate-700 border border-slate-200/80 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Circular Gauge & Edit Profile Button */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-blue-200/40">
                {/* 85% Completion Gauge */}
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-blue-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600"
                        strokeDasharray="85, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-black text-slate-900">85%</span>
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-800">Profile</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">85% Complete</p>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. STATS ROW (4 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Applied Jobs */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4 hover:border-purple-200 transition">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">12</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Applied Jobs</p>
              </div>
            </div>

            {/* Card 2: Saved Jobs */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4 hover:border-emerald-200 transition">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">5</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Saved Jobs</p>
              </div>
            </div>

            {/* Card 3: Interviews */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4 hover:border-amber-200 transition">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">3</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Interviews</p>
              </div>
            </div>

            {/* Card 4: Profile Views */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4 hover:border-cyan-200 transition">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">2</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Profile Views</p>
              </div>
            </div>
          </div>

          {/* TABLET / MOBILE SUB-NAVIGATION BAR (Shows on tablet/mobile) */}
          <div className="block lg:hidden bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: "about", label: "About Me" },
                { id: "skills", label: "Skills" },
                { id: "resume", label: "Resume" },
                { id: "experience", label: "Experience" },
                { id: "education", label: "Education" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTabletTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    tabletTab === tab.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLET QUICK ACTIONS (As seen in tablet mockup) */}
          <div className="hidden md:grid lg:hidden grid-cols-4 gap-3 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setEditModalOpen(true)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition flex flex-col items-center text-center gap-1 cursor-pointer"
            >
              <User className="w-5 h-5 text-blue-500" />
              <span className="text-[11px] font-bold">Update Profile</span>
            </button>
            <button
              onClick={() => setUploadResumeModalOpen(true)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition flex flex-col items-center text-center gap-1 cursor-pointer"
            >
              <Upload className="w-5 h-5 text-indigo-500" />
              <span className="text-[11px] font-bold">Upload Resume</span>
            </button>
            <button
              onClick={() => showToast("Job alerts updated for your profile!")}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition flex flex-col items-center text-center gap-1 cursor-pointer"
            >
              <Bell className="w-5 h-5 text-amber-500" />
              <span className="text-[11px] font-bold">Set Job Alerts</span>
            </button>
            <Link
              href="/jobs"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition flex flex-col items-center text-center gap-1 cursor-pointer"
            >
              <Search className="w-5 h-5 text-emerald-500" />
              <span className="text-[11px] font-bold">Browse Jobs</span>
            </Link>
          </div>

          {/* 3. TWO COLUMN GRID (Desktop & Tablet) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: About Me + Recent Applications */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* About Me Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">About Me</h2>
                  </div>
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">{bio}</p>

                {/* 2x2 Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Experience
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{experience}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Education
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{education}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{location}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Languages
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{languages}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Recent Applications
                    </h2>
                  </div>
                  <Link
                    href="/jobs"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {/* Sub-tabs for applications in Mobile view */}
                <div className="flex sm:hidden items-center gap-2 border-b border-slate-100 pb-2">
                  {(["applied", "saved", "interviews"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAppliedSubTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                        appliedSubTab === tab
                          ? "bg-blue-600 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Application list items */}
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 transition flex items-center justify-between gap-3 group cursor-pointer"
                      onClick={() => showToast(`Application status for ${app.role}: ${app.status}`)}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-2xl ${app.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}
                        >
                          {app.avatarText}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {app.role}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {app.company} • {app.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            app.status === "Applied"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : app.status === "Viewed"
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          }`}
                        >
                          {app.status}
                        </span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                          {app.date}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Skills + Resume + Profile Strength */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Skills Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">Skills</h2>
                  </div>
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">Resume</h2>
                  </div>
                  <button
                    onClick={() => showToast("Viewing all resume versions...")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {/* PDF File Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-100">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{resumeName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{resumeDate}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Downloading ${resumeName}...`)}
                    className="w-9 h-9 rounded-xl hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 flex items-center justify-center transition shrink-0 cursor-pointer"
                    title="Download Resume"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* Upload Button */}
                <button
                  onClick={() => setUploadResumeModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition hover:bg-blue-50/50 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Upload New Resume</span>
                </button>
              </div>

              {/* Profile Strength Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-blue-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Profile Strength
                    </h2>
                  </div>
                  <button
                    onClick={() => setCompleteProfileModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Gauge */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600"
                        strokeDasharray="85, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-slate-900">85%</span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Good Profile</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Complete your profile to get more job recommendations.
                    </p>
                  </div>
                </div>

                {/* Strength Checklist */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 fill-emerald-50" />
                    <span>Basic Information</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 fill-emerald-50" />
                    <span>Skills & Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 fill-emerald-50" />
                    <span>Education</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 fill-emerald-50" />
                    <span>Resume Uploaded</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                    <span>Resume Photo</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                    <span>Portfolio</span>
                  </div>
                </div>

                {/* Complete Profile Button */}
                <button
                  onClick={() => setCompleteProfileModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer mt-1"
                >
                  <span>Complete Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. OPPORTUNITY CTA BANNER (Mockup Match) */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Let&apos;s Find Your Next Opportunity
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                  Update your profile, explore jobs, and take the next step in your career.
                </p>
              </div>
            </div>

            <Link
              href="/jobs"
              className="px-6 py-3 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs sm:text-sm shrink-0 transition flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105"
            >
              <span>Browse Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 5. FOOTER */}
          <footer className="mt-8 pt-8 border-t border-slate-200/80 text-xs text-slate-500 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-slate-900">CareerConnect</span>
                </div>
                <p className="text-[11px] text-slate-400">Your Career, Our Mission.</p>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">For Job Seekers</p>
                <ul className="space-y-1.5 text-[11px]">
                  <li>
                    <Link href="/jobs" className="hover:text-blue-600">
                      Browse Jobs
                    </Link>
                  </li>
                  <li>
                    <a href="#advice" className="hover:text-blue-600">
                      Career Advice
                    </a>
                  </li>
                  <li>
                    <a href="#builder" className="hover:text-blue-600">
                      Resume Builder
                    </a>
                  </li>
                  <li>
                    <a href="#help" className="hover:text-blue-600">
                      Help Center
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">For Companies</p>
                <ul className="space-y-1.5 text-[11px]">
                  <li>
                    <Link href="/company/dashboard" className="hover:text-blue-600">
                      Post a Job
                    </Link>
                  </li>
                  <li>
                    <a href="#pricing" className="hover:text-blue-600">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#faqs" className="hover:text-blue-600">
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-blue-600">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">Quick Links</p>
                <ul className="space-y-1.5 text-[11px]">
                  <li>
                    <Link href="/" className="hover:text-blue-600">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-blue-600">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a href="#privacy" className="hover:text-blue-600">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#terms" className="hover:text-blue-600">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
              <p>© 2025 CareerConnect. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-blue-600">
                  Twitter
                </a>
                <a href="#" className="hover:text-blue-600">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-blue-600">
                  Facebook
                </a>
                <a href="#" className="hover:text-blue-600">
                  Instagram
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR (Mockup Match) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-6 flex md:hidden items-center justify-between shadow-2xl">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>
        <Link
          href="/jobs"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800"
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Jobs</span>
        </Link>
        <button
          onClick={() => {
            setActiveSidebarTab("saved");
            showToast("Saved jobs opened");
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800 cursor-pointer"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Saved</span>
        </button>
        <button
          onClick={() => {
            setNotificationsOpen(true);
            showToast("Alerts opened");
          }}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800 cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Alerts</span>
        </button>
        <button
          onClick={() => {
            setActiveSidebarTab("profile");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-0.5 text-blue-600 cursor-pointer font-bold"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* MODAL 1: EDIT PROFILE */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">Edit Profile</h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={name}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Role / Title</label>
                  <input
                    type="text"
                    name="headline"
                    defaultValue={headline}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    defaultValue={experience}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={location}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={email}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={phone}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Education</label>
                <input
                  type="text"
                  name="education"
                  defaultValue={education}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Languages</label>
                <input
                  type="text"
                  name="languages"
                  defaultValue={languages}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">About Me (Bio)</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={bio}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  defaultValue={skills.join(", ")}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD RESUME */}
      {uploadResumeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Upload New Resume</h3>
              </div>
              <button
                onClick={() => setUploadResumeModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadResume} className="space-y-4 pt-4">
              <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center hover:bg-blue-50/50 transition">
                <FileText className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  Choose a PDF or DOCX file to upload
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Maximum file size: 5 MB</p>
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="mt-3 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadResumeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: COMPLETE PROFILE */}
      {completeProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">Profile Completion</h3>
              </div>
              <button
                onClick={() => setCompleteProfileModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-4 space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  85%
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Almost There!</p>
                  <p className="text-[11px] text-slate-600">
                    Add a portfolio link or certificate to reach 100% profile strength.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Add Portfolio URL</span>
                  <button
                    onClick={() => {
                      setCompleteProfileModalOpen(false);
                      showToast("Portfolio added! Profile strength updated to 95%.");
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px]"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Add Certifications</span>
                  <button
                    onClick={() => {
                      setCompleteProfileModalOpen(false);
                      showToast("Certification added! Profile strength 100%.");
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px]"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setCompleteProfileModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
