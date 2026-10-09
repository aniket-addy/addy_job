"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  PlusCircle,
  Search,
  MapPin,
  Calendar,
  FileText,
  ShieldCheck,
  Eye,
  Trash2,
  X,
  Sparkles,
  ArrowRight,
  UserCheck,
  UserX,
  CreditCard,
  Download,
  Crown,
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  Settings,
  LayoutDashboard,
  Check,
  FolderDown,
  Plus,
  Camera,
  Upload,
  ImageIcon,
  ExternalLink,
  Globe,
  Share2,
} from "lucide-react";
import { getStoredUser, clearAuthSession } from "@/lib/api";

// Types
interface PostedJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  applicantsCount: number;
  status: "Active" | "Paused" | "Closed";
  postedOn: string;
}

interface RecruiterApplicant {
  id: string;
  candidateName: string;
  appliedRole: string;
  jobId: string;
  experience: string;
  location: string;
  appliedDate: string;
  resumeFileName: string;
  skills: string[];
  status: "Applied" | "Reviewing" | "Shortlisted" | "Interview" | "Hired" | "Rejected";
  matchScore: number;
  email: string;
  phone: string;
  notes?: string;
}

interface PurchasedResume {
  id: string;
  candidateName: string;
  title: string;
  experience: string;
  location: string;
  purchasedDate: string;
  fileSize: string;
  downloadUrl: string;
  email: string;
  phone: string;
}

export default function CompanyDashboardPage() {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "jobs" | "applicants" | "resumes" | "subscription" | "settings"
  >("dashboard");

  // Company Profile Info
  const [companyName, setCompanyName] = useState("Acme Global Technologies");
  const [tagline, setTagline] = useState("Innovating enterprise software solutions");
  const [industry, setIndustry] = useState("Information Technology & Services");
  const [companySize, setCompanySize] = useState("250 - 500 Employees");
  const [headquarters, setHeadquarters] = useState("Bengaluru, Karnataka, India");
  const [website, setWebsite] = useState("https://acmetech.global");
  const [contactEmail, setContactEmail] = useState("recruiting@acmetech.global");
  const [contactPhone, setContactPhone] = useState("+91 80 4123 5678");
  const [gstNumber, setGstNumber] = useState("29AABCN1234F1Z6");
  const [aboutCompany, setAboutCompany] = useState(
    "Acme Global Technologies is a leading cloud infrastructure and enterprise product engineering company building high-scale distributed systems and digital platforms for Fortune 500 clients worldwide."
  );

  // Profile Image & Banner Cover Image states
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [imageModalState, setImageModalState] = useState<{
    isOpen: boolean;
    type: "profile" | "banner";
    mode: "menu" | "view";
  }>({ isOpen: false, type: "profile", mode: "menu" });

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Subscription & Resume Credits state
  const [currentPlan, setCurrentPlan] = useState("Professional Growth");
  const [planValidity, setPlanValidity] = useState("Valid until Dec 31, 2026");
  const [totalResumesPurchased, setTotalResumesPurchased] = useState(50);
  const [resumesUsed, setResumesUsed] = useState(15);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [applicantFilter, setApplicantFilter] = useState<
    "ALL" | "Applied" | "Reviewing" | "Shortlisted" | "Interview" | "Hired" | "Rejected"
  >("ALL");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<RecruiterApplicant | null>(null);

  // Form states for new job
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Engineering");
  const [newLocation, setNewLocation] = useState("Bengaluru (Hybrid)");
  const [newType, setNewType] = useState("Full-time");
  const [newSalary, setNewSalary] = useState("₹18L - ₹26L/yr");

  // Initial Jobs List (Kitne Post Hai)
  const [jobs, setJobs] = useState<PostedJob[]>([
    {
      id: "JOB-101",
      title: "Senior Full Stack Engineer (React / Node.js)",
      department: "Engineering",
      location: "Bengaluru (Hybrid)",
      type: "Full-time",
      salary: "₹20L - ₹28L/yr",
      applicantsCount: 42,
      status: "Active",
      postedOn: "3 days ago",
    },
    {
      id: "JOB-102",
      title: "Lead UI/UX Designer & Design Systems",
      department: "Product Design",
      location: "Remote (India)",
      type: "Full-time",
      salary: "₹18L - ₹24L/yr",
      applicantsCount: 28,
      status: "Active",
      postedOn: "1 week ago",
    },
    {
      id: "JOB-103",
      title: "DevOps & Cloud Infrastructure Architect",
      department: "Platform Eng",
      location: "Hyderabad, India",
      type: "Full-time",
      salary: "₹24L - ₹32L/yr",
      applicantsCount: 19,
      status: "Active",
      postedOn: "2 weeks ago",
    },
    {
      id: "JOB-104",
      title: "Product Marketing Manager (B2B SaaS)",
      department: "Marketing",
      location: "Mumbai, India",
      type: "Full-time",
      salary: "₹15L - ₹20L/yr",
      applicantsCount: 14,
      status: "Paused",
      postedOn: "3 weeks ago",
    },
    {
      id: "JOB-105",
      title: "Associate React Frontend Developer",
      department: "Engineering",
      location: "Noida, India",
      type: "Full-time",
      salary: "₹8L - ₹12L/yr",
      applicantsCount: 83,
      status: "Active",
      postedOn: "Just now",
    },
  ]);

  // Applicants List (Applications received, Hired, Rejected)
  const [applicants, setApplicants] = useState<RecruiterApplicant[]>([
    {
      id: "APP-001",
      candidateName: "Rahul Sharma",
      appliedRole: "Associate React Frontend Developer",
      jobId: "JOB-105",
      experience: "2+ Years",
      location: "Noida, UP",
      appliedDate: "Today, 11:30 AM",
      resumeFileName: "Rahul_Sharma_Resume.pdf",
      skills: ["React.js", "Next.js", "Tailwind CSS", "TypeScript"],
      status: "Applied",
      matchScore: 94,
      email: "rahul.sharma@gmail.com",
      phone: "+91 98765 43210",
      notes: "Strong frontend fundamentals, verified portfolio.",
    },
    {
      id: "APP-002",
      candidateName: "Priya Venkatesh",
      appliedRole: "Senior Full Stack Engineer (React / Node.js)",
      jobId: "JOB-101",
      experience: "5 Years",
      location: "Bengaluru, KA",
      appliedDate: "Yesterday",
      resumeFileName: "Priya_Venkatesh_FullStack.pdf",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      status: "Interview",
      matchScore: 98,
      email: "priya.v@techmail.com",
      phone: "+91 98112 34567",
      notes: "Completed Technical Round 1 with high rating.",
    },
    {
      id: "APP-003",
      candidateName: "Amit Patel",
      appliedRole: "Lead UI/UX Designer & Design Systems",
      jobId: "JOB-102",
      experience: "6 Years",
      location: "Ahmedabad / Remote",
      appliedDate: "3 days ago",
      resumeFileName: "Amit_Patel_ProductDesign.pdf",
      skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
      status: "Hired",
      matchScore: 96,
      email: "amit.design@gmail.com",
      phone: "+91 99001 22334",
      notes: "Offer accepted! Joining date set for 1st of next month.",
    },
    {
      id: "APP-004",
      candidateName: "Sneha Mukherjee",
      appliedRole: "DevOps & Cloud Infrastructure Architect",
      jobId: "JOB-103",
      experience: "4 Years",
      location: "Kolkata, WB",
      appliedDate: "4 days ago",
      resumeFileName: "Sneha_M_CloudArch.pdf",
      skills: ["Kubernetes", "Terraform", "Docker", "GCP"],
      status: "Shortlisted",
      matchScore: 89,
      email: "sneha.devops@outlook.com",
      phone: "+91 97480 11223",
      notes: "Shortlisted for Round 2 technical assessment.",
    },
    {
      id: "APP-005",
      candidateName: "Vikramaditya Rao",
      appliedRole: "Senior Full Stack Engineer (React / Node.js)",
      jobId: "JOB-101",
      experience: "1 Year",
      location: "Chennai, TN",
      appliedDate: "5 days ago",
      resumeFileName: "Vikram_CV_2025.pdf",
      skills: ["HTML", "Basic JS", "Express"],
      status: "Rejected",
      matchScore: 48,
      email: "vikram.rao@mail.com",
      phone: "+91 96200 44556",
      notes: "Experience does not meet senior requirement threshold.",
    },
    {
      id: "APP-006",
      candidateName: "Ananya Deshmukh",
      appliedRole: "Associate React Frontend Developer",
      jobId: "JOB-105",
      experience: "2.5 Years",
      location: "Pune, MH",
      appliedDate: "6 days ago",
      resumeFileName: "Ananya_Deshmukh_Frontend.pdf",
      skills: ["React.js", "Redux", "REST APIs", "Jest"],
      status: "Reviewing",
      matchScore: 91,
      email: "ananya.d@gmail.com",
      phone: "+91 98450 99887",
      notes: "Under recruiter review.",
    },
    {
      id: "APP-007",
      candidateName: "Karthik Sundaram",
      appliedRole: "Product Marketing Manager (B2B SaaS)",
      jobId: "JOB-104",
      experience: "3 Years",
      location: "Mumbai, MH",
      appliedDate: "1 week ago",
      resumeFileName: "Karthik_Marketing_Lead.pdf",
      skills: ["B2B SaaS", "Growth Marketing", "HubSpot", "SEO"],
      status: "Rejected",
      matchScore: 54,
      email: "karthik.s@domain.in",
      phone: "+91 98330 22110",
      notes: "Candidate requested higher remote CTC out of budget.",
    },
  ]);

  // Purchased Resumes Database (Kitne Resume Kharide Hai)
  const [purchasedResumes] = useState<PurchasedResume[]>([
    {
      id: "RES-801",
      candidateName: "Rahul Sharma",
      title: "Frontend Developer (React.js, Next.js)",
      experience: "2+ Years",
      location: "Noida, UP",
      purchasedDate: "Today",
      fileSize: "1.2 MB",
      downloadUrl: "/Rahul_Sharma_Resume.pdf",
      email: "rahul.sharma@gmail.com",
      phone: "+91 98765 43210",
    },
    {
      id: "RES-802",
      candidateName: "Tanvi Kapoor",
      title: "Senior Product Designer",
      experience: "4.5 Years",
      location: "Gurugram, HR",
      purchasedDate: "2 days ago",
      fileSize: "2.4 MB",
      downloadUrl: "#",
      email: "tanvi.design@gmail.com",
      phone: "+91 98101 55667",
    },
    {
      id: "RES-803",
      candidateName: "Arjun Nambiar",
      title: "Golang & Distributed Systems Engineer",
      experience: "5 Years",
      location: "Bengaluru, KA",
      purchasedDate: "5 days ago",
      fileSize: "1.1 MB",
      downloadUrl: "#",
      email: "arjun.n@techcloud.io",
      phone: "+91 99450 77889",
    },
    {
      id: "RES-804",
      candidateName: "Neha Chawla",
      title: "AI / Machine Learning Engineer",
      experience: "3 Years",
      location: "Hyderabad, TS",
      purchasedDate: "1 week ago",
      fileSize: "1.8 MB",
      downloadUrl: "#",
      email: "neha.ai@mlresearch.com",
      phone: "+91 98880 33445",
    },
  ]);

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = getStoredUser();
      if (user) {
        if (user.companyName) setCompanyName(user.companyName);
        else if (user.name) setCompanyName(user.name + " Corp");
        if (user.email) setContactEmail(user.email);
        if (user.industry) setIndustry(user.industry);
        if (user.location) setHeadquarters(user.location);
        if (user.phone) setContactPhone(user.phone);
        if (user.gstNumber) setGstNumber(user.gstNumber);
      }
      const savedCompanyProfile = localStorage.getItem("company_profile_data");
      if (savedCompanyProfile) {
        try {
          const parsed = JSON.parse(savedCompanyProfile);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.industry) setIndustry(parsed.industry);
          if (parsed.headquarters) setHeadquarters(parsed.headquarters);
          if (parsed.website) setWebsite(parsed.website);
          if (parsed.aboutCompany) setAboutCompany(parsed.aboutCompany);
          if (parsed.contactPhone) setContactPhone(parsed.contactPhone);
          if (parsed.gstNumber) setGstNumber(parsed.gstNumber);
          if (parsed.profileImage) setProfileImage(parsed.profileImage);
          if (parsed.bannerImage) setBannerImage(parsed.bannerImage);
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

  // Image Upload & Removal Handlers (See, Update, Remove)
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        try {
          const prev = JSON.parse(localStorage.getItem("company_profile_data") || "{}");
          localStorage.setItem("company_profile_data", JSON.stringify({ ...prev, profileImage: base64 }));
        } catch (err) {}
        showToast("Company profile image updated successfully!");
        setImageModalState((prev) => ({ ...prev, isOpen: false, mode: "menu" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast("File size too large. Please select a banner under 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBannerImage(base64);
        try {
          const prev = JSON.parse(localStorage.getItem("company_profile_data") || "{}");
          localStorage.setItem("company_profile_data", JSON.stringify({ ...prev, bannerImage: base64 }));
        } catch (err) {}
        showToast("Company cover banner updated successfully!");
        setImageModalState((prev) => ({ ...prev, isOpen: false, mode: "menu" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (type: "profile" | "banner") => {
    if (type === "profile") {
      setProfileImage(null);
      try {
        const prev = JSON.parse(localStorage.getItem("company_profile_data") || "{}");
        delete prev.profileImage;
        localStorage.setItem("company_profile_data", JSON.stringify(prev));
      } catch (err) {}
      showToast("Profile image removed. Reverted to default.");
    } else {
      setBannerImage(null);
      try {
        const prev = JSON.parse(localStorage.getItem("company_profile_data") || "{}");
        delete prev.bannerImage;
        localStorage.setItem("company_profile_data", JSON.stringify(prev));
      } catch (err) {}
      showToast("Cover banner removed. Reverted to default gradient.");
    }
    setImageModalState((prev) => ({ ...prev, isOpen: false, mode: "menu" }));
  };

  // Actions for Candidates: Hire, Reject, Shortlist, Interview
  const handleUpdateStatus = (
    applicantId: string,
    newStatus: "Reviewing" | "Shortlisted" | "Interview" | "Hired" | "Rejected"
  ) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === applicantId ? { ...app, status: newStatus } : app))
    );
    const applicant = applicants.find((a) => a.id === applicantId);
    showToast(
      `${applicant?.candidateName || "Candidate"} has been marked as ${newStatus}!`
    );
  };

  // Action: Post New Job
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Please enter a valid job title");
      return;
    }
    const newJob: PostedJob = {
      id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      department: newDept,
      location: newLocation,
      type: newType,
      salary: newSalary,
      applicantsCount: 0,
      status: "Active",
      postedOn: "Just now",
    };
    setJobs([newJob, ...jobs]);
    setIsPostJobModalOpen(false);
    setNewTitle("");
    showToast(`Job posting "${newJob.title}" is now LIVE!`);
  };

  // Action: Buy More Resume Credits
  const handleBuyCredits = (credits: number, price: string) => {
    setTotalResumesPurchased((prev) => prev + credits);
    setIsBuyCreditsModalOpen(false);
    showToast(`Successfully purchased ${credits} Resume Credits for ${price}!`);
  };

  // Save Company Profile
  const handleSaveCompanyProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cName = (formData.get("companyName") as string) || companyName;
    const cTagline = (formData.get("tagline") as string) || tagline;
    const cIndustry = (formData.get("industry") as string) || industry;
    const cSize = (formData.get("companySize") as string) || companySize;
    const cHq = (formData.get("headquarters") as string) || headquarters;
    const cWeb = (formData.get("website") as string) || website;
    const cEmail = (formData.get("contactEmail") as string) || contactEmail;
    const cPhone = (formData.get("contactPhone") as string) || contactPhone;
    const cGst = (formData.get("gstNumber") as string) || gstNumber;
    const cAbout = (formData.get("aboutCompany") as string) || aboutCompany;

    setCompanyName(cName);
    setTagline(cTagline);
    setIndustry(cIndustry);
    setCompanySize(cSize);
    setHeadquarters(cHq);
    setWebsite(cWeb);
    setContactEmail(cEmail);
    setContactPhone(cPhone);
    setGstNumber(cGst);
    setAboutCompany(cAbout);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "company_profile_data",
        JSON.stringify({
          companyName: cName,
          tagline: cTagline,
          industry: cIndustry,
          companySize: cSize,
          headquarters: cHq,
          website: cWeb,
          contactEmail: cEmail,
          contactPhone: cPhone,
          gstNumber: cGst,
          aboutCompany: cAbout,
          profileImage,
          bannerImage,
        })
      );
    }
    showToast("Company profile updated successfully!");
  };

  // Logout
  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  // Metrics calculation
  const totalJobsCount = jobs.length;
  const activeJobsCount = jobs.filter((j) => j.status === "Active").length;
  const totalApplicantsCount = applicants.length;
  const hiredCount = applicants.filter((a) => a.status === "Hired").length;
  const rejectedCount = applicants.filter((a) => a.status === "Rejected").length;
  const inPipelineCount = applicants.filter(
    (a) => a.status === "Interview" || a.status === "Shortlisted" || a.status === "Reviewing"
  ).length;
  const remainingCredits = totalResumesPurchased - resumesUsed;

  // Filtered applicants
  const filteredApplicants = applicants.filter((app) => {
    const matchesFilter = applicantFilter === "ALL" || app.status === applicantFilter;
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appliedRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[999] bg-slate-900 border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      {/* LEFT SIDEBAR (Clean Light Style - Matching Candidate / Super Admin) */}
      <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col shrink-0 sticky top-0 h-screen z-30 select-none shadow-xs">
        {/* Sidebar Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block">
                Career<span className="text-blue-600">Connect</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Company Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Navigation (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Navigation
          </div>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0 text-blue-600" />
            <span className="flex-1 text-left">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === "profile"
                ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0 text-slate-500" />
            <span className="flex-1 text-left">Company Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === "jobs"
                ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Briefcase className="w-4 h-4 shrink-0 text-slate-500" />
              <span>Job Postings</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
              {totalJobsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("applicants")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === "applicants"
                ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Users className="w-4 h-4 shrink-0 text-slate-500" />
              <span>Applications</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
              {totalApplicantsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("resumes")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === "resumes"
                ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <FolderDown className="w-4 h-4 shrink-0 text-slate-500" />
              <span>Resumes Purchased</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              {remainingCredits} Left
            </span>
          </button>

          <button
            onClick={() => setActiveTab("subscription")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === "subscription"
                ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <CreditCard className="w-4 h-4 shrink-0 text-slate-500" />
              <span>Our Subscription</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              PRO
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === "settings"
                ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0 text-slate-500" />
            <span className="flex-1 text-left">Settings</span>
          </button>

          {/* Resume Balance Mini Card in Sidebar */}
          <div className="pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Resume Credits</span>
                <span className="font-black text-emerald-600">
                  {remainingCredits} / {totalResumesPurchased}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(remainingCredits / totalResumesPurchased) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setIsBuyCreditsModalOpen(true)}
                className="mt-3 w-full py-1.5 px-3 rounded-xl bg-white hover:bg-blue-50 text-blue-600 text-[11px] font-bold border border-slate-200 hover:border-blue-300 transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buy More Credits</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Logged in company & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
              {companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{companyName}</p>
              <p className="text-[10px] text-slate-500 truncate">{contactEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* TOP BAR */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates, roles, or resume database..."
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-hidden transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Post Job Quick Action Button */}
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post a New Job</span>
              <span className="sm:hidden">Post Job</span>
            </button>

            {/* Resume Credit Indicator */}
            <button
              onClick={() => setIsBuyCreditsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>{remainingCredits} Credits</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY PER TAB */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Executive Welcome Banner (Light Modern Gradient) */}
              <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#F0F5FF] via-[#EEF2FF] to-[#FAF5FF] border border-blue-100/80 shadow-xs">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider inline-block mb-2">
                      Employer Hub • {companyName}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Recruitment Command Center
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                      Manage job posts, review incoming applications, download candidate resumes,
                      and hire top tier talent directly from one portal.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsPostJobModalOpen(true)}
                      className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer hover:scale-102"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post New Job</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("resumes")}
                      className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-2 transition cursor-pointer"
                    >
                      <FolderDown className="w-4 h-4 text-emerald-600" />
                      <span>View Resumes ({remainingCredits} Left)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6 KEY METRICS TILES */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* 1. Kitne Post Hai */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-500">Total Job Posts</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{totalJobsCount}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      {activeJobsCount} Active Listings
                    </p>
                  </div>
                </div>

                {/* 2. Kitne Applications Aye Hai */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-500">Applications</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{totalApplicantsCount}</p>
                    <p className="text-[10px] text-indigo-600 font-bold mt-0.5">
                      {inPipelineCount} In Review
                    </p>
                  </div>
                </div>

                {/* 3. Kis User Ko Hire Kiya Hai */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-500">Candidates Hired</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-600">{hiredCount}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Offers Accepted</p>
                  </div>
                </div>

                {/* 4. Kis User Ko Reject Kiya Hai */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-rose-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-500">Rejected</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <UserX className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-rose-600">{rejectedCount}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Not Shortlisted</p>
                  </div>
                </div>

                {/* 5. Kitne Resume Kharide Hai */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-amber-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-500">Resumes Bought</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <FolderDown className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-amber-600">{totalResumesPurchased}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {remainingCredits} Available
                    </p>
                  </div>
                </div>

                {/* 6. Our Subscription */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-500">Subscription</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Crown className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 truncate">PRO Growth</p>
                    <p className="text-[10px] text-purple-600 font-bold mt-0.5">Valid Dec 2026</p>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID: Live Applications & Active Job Listings */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: Live Applications Tracker */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Recent Candidate Applications</span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        Take immediate action to hire, interview, or reject applicants.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("applicants")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All ({totalApplicantsCount})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Applicants List */}
                  <div className="space-y-3">
                    {applicants.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {app.candidateName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                {app.candidateName}
                              </h4>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {app.matchScore}% Match
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{app.appliedRole}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                              <span>{app.experience}</span>
                              <span>•</span>
                              <span>{app.location}</span>
                              <span>•</span>
                              <span>{app.appliedDate}</span>
                            </p>
                          </div>
                        </div>

                        {/* Status badge & Quick Action buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              app.status === "Hired"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : app.status === "Rejected"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : app.status === "Interview"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : app.status === "Shortlisted"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {app.status}
                          </span>

                          {/* Quick Hire / Reject Buttons */}
                          {app.status !== "Hired" && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, "Hired")}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Hire this candidate"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Hire</span>
                            </button>
                          )}

                          {app.status !== "Rejected" && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, "Rejected")}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Reject application"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedApplicant(app)}
                            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                            title="View Full Profile & Resume"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Active Job Posts & Quick Stats */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Job Postings Card */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span>Active Job Openings</span>
                      </h3>
                      <button
                        onClick={() => setIsPostJobModalOpen(true)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        + Post
                      </button>
                    </div>

                    <div className="space-y-3">
                      {jobs.slice(0, 4).map((job) => (
                        <div
                          key={job.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{job.title}</h4>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                job.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {job.location} • {job.salary}
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
                            <span className="text-blue-600 font-bold">
                              {job.applicantsCount} Applicants
                            </span>
                            <span className="text-slate-400">{job.postedOn}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveTab("jobs")}
                      className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Manage All {totalJobsCount} Jobs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Resume Credits Quick Purchase Widget */}
                  <div className="bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-slate-50 rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FolderDown className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Resume Database Access</h4>
                        <p className="text-[11px] text-slate-500">
                          {remainingCredits} Credits Available
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Download verified resumes directly with full contact info and verified
                      experience history.
                    </p>
                    <button
                      onClick={() => setIsBuyCreditsModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Buy Resume Credit Packs</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Company Profile & Branding</h2>
                  <p className="text-xs text-slate-500">
                    This public information is displayed to candidates on job postings and company pages.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Employer
                </span>
              </div>

              <form onSubmit={handleSaveCompanyProfile} className="space-y-6">
                {/* Brand Header Banner & Profile Avatar (Matching 1st image) */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                  {/* Sleek Brand Cover Banner (Click to See, Update, Remove) */}
                  <div
                    onClick={() => setImageModalState({ isOpen: true, type: "banner", mode: "menu" })}
                    className="relative w-full h-44 sm:h-56 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 overflow-hidden cursor-pointer group"
                    style={
                      bannerImage
                        ? {
                            backgroundImage: `url(${bannerImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    {/* Subtle geometric dot pattern (from Image 1) */}
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:20px_20px] pointer-events-none" />
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Banner Hover Overlay */}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-md">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Click to View, Update or Remove Banner</span>
                      </span>
                    </div>

                    {/* Top Right Header Controls */}
                    <div className="absolute top-4 right-4 sm:right-6 flex items-center gap-2.5 z-10">
                      {/* Verified Employer Pill (from Image 1) */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Employer</span>
                      </span>

                      {/* Cover Options Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageModalState({ isOpen: true, type: "banner", mode: "menu" });
                        }}
                        className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Cover Options</span>
                      </button>
                    </div>
                  </div>

                  {/* Profile Details Container (Below Banner) */}
                  <div className="px-6 sm:px-8 pb-6">
                    {/* Avatar overlapping banner + Right side action buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4 relative z-10">
                      {/* Company Avatar Card (Click to See, Update, Remove) */}
                      <div
                        onClick={() => setImageModalState({ isOpen: true, type: "profile", mode: "menu" })}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-xl p-1.5 flex items-center justify-center shrink-0 relative group cursor-pointer"
                        title="Click to view, update or remove logo"
                      >
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={companyName}
                            className="w-full h-full object-contain rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center shadow-xs select-none">
                            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                              {companyName.slice(0, 2).toUpperCase()}
                            </span>
                            <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-0.5">
                              {companyName.split(" ")[1] || "CORP"}
                            </span>
                          </div>
                        )}

                        {/* Hover camera overlay */}
                        <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1">
                          <Camera className="w-4 h-4" />
                          <span>Edit Logo</span>
                        </div>

                        {/* Small camera badge bottom right */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                          <Camera className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Right: Actions (Follow, Website, Share from Image 1) */}
                      <div className="flex items-center gap-2 self-start sm:self-end shrink-0">
                        <Link
                          href="/companies/1"
                          target="_blank"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Public Page</span>
                        </Link>

                        <a
                          href={website.startsWith("http") ? website : `https://${website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>Website</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              navigator.clipboard?.writeText(window.location.origin + "/companies/1");
                              showToast("Company profile link copied to clipboard!");
                            }
                          }}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs cursor-pointer"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Company Details (Title, badges, tagline, meta strip from Image 1) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                          {companyName}
                        </h1>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                          <span>Verified</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                          {industry}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-3xl leading-relaxed">
                        {tagline}
                      </p>

                      {/* Meta details strip with dot separators */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{headquarters}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{companySize}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>Private • Enterprise</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Founded 2018</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-200/60">
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span>GST: {gstNumber}</span>
                        </span>
                        {contactPhone && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{contactPhone}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Edit Company Information</h3>
                    <span className="text-[11px] text-slate-400">All changes update live</span>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        defaultValue={companyName}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Company Tagline</label>
                      <input
                        type="text"
                        name="tagline"
                        defaultValue={tagline}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        defaultValue={industry}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Company Size</label>
                      <input
                        type="text"
                        name="companySize"
                        defaultValue={companySize}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Headquarters</label>
                      <input
                        type="text"
                        name="headquarters"
                        defaultValue={headquarters}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Website URL</label>
                      <input
                        type="url"
                        name="website"
                        defaultValue={website}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Recruiting Email</label>
                      <input
                        type="email"
                        name="contactEmail"
                        defaultValue={contactEmail}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        name="contactPhone"
                        defaultValue={contactPhone}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">GST Number (GSTIN)</label>
                      <input
                        type="text"
                        name="gstNumber"
                        defaultValue={gstNumber}
                        placeholder="29AAAAA0000A1Z5"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono uppercase tracking-wider focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">GSTIN Verification</label>
                      <div className="w-full px-3.5 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>GSTIN Active &amp; Verified</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-xs">
                      About Company / Description
                    </label>
                    <textarea
                      name="aboutCompany"
                      rows={4}
                      defaultValue={aboutCompany}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
                    >
                      Save Company Profile
                    </button>
                  </div>
                </div>

                {/* Hidden File Inputs for Profile Logo & Cover Banner Uploads */}
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerImageUpload}
                />
              </form>
            </div>
          )}

          {/* TAB 3: JOB POSTINGS (Kitne Post Hai) */}
          {activeTab === "jobs" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Job Postings Management</h2>
                  <p className="text-xs text-slate-500">
                    Total {totalJobsCount} job openings created ({activeJobsCount} currently active)
                  </p>
                </div>
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition hover:scale-102"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a New Job</span>
                </button>
              </div>

              {/* Jobs Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                      <tr>
                        <th className="py-3.5 px-6">Job Role & ID</th>
                        <th className="py-3.5 px-6">Department</th>
                        <th className="py-3.5 px-6">Location</th>
                        <th className="py-3.5 px-6">Salary Range</th>
                        <th className="py-3.5 px-6">Applications</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6 font-bold text-slate-900">
                            <div>{job.title}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{job.id}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{job.department}</td>
                          <td className="py-4 px-6 text-slate-600">{job.location}</td>
                          <td className="py-4 px-6 font-semibold text-emerald-600">{job.salary}</td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {job.applicantsCount} Candidates
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                job.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => {
                                setJobs((prev) =>
                                  prev.map((j) =>
                                    j.id === job.id
                                      ? {
                                          ...j,
                                          status: j.status === "Active" ? "Paused" : "Active",
                                        }
                                      : j
                                  )
                                );
                                showToast(`Job status updated for ${job.title}`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                            >
                              {job.status === "Active" ? "Pause" : "Activate"}
                            </button>
                            <button
                              onClick={() => {
                                setJobs((prev) => prev.filter((j) => j.id !== job.id));
                                showToast(`Job ${job.title} deleted`);
                              }}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                              title="Delete job"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPLICATIONS (Uspar Kitne Applications Aye Hai, Hire / Reject) */}
          {activeTab === "applicants" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Candidate Applications</h2>
                  <p className="text-xs text-slate-500">
                    Review submissions, schedule interviews, and mark candidates as Hired or Rejected.
                  </p>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  {(
                    [
                      "ALL",
                      "Applied",
                      "Reviewing",
                      "Shortlisted",
                      "Interview",
                      "Hired",
                      "Rejected",
                    ] as const
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => setApplicantFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        applicantFilter === st
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicant Cards List */}
              <div className="space-y-4">
                {filteredApplicants.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-900">No applications match this filter</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try selecting another status tab or clear the search query.
                    </p>
                  </div>
                ) : (
                  filteredApplicants.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-300 transition shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                    >
                      {/* Left Candidate Info */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                          {app.candidateName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm sm:text-base font-black text-slate-900">
                              {app.candidateName}
                            </h3>
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {app.matchScore}% Match Score
                            </span>
                            <span
                              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                                app.status === "Hired"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : app.status === "Rejected"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : app.status === "Interview"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : app.status === "Shortlisted"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 font-semibold mt-1">
                            Applied For: <span className="text-slate-900">{app.appliedRole}</span>
                          </p>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-400 mt-1">
                            <span className="flex items-center gap-1 text-slate-600">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              {app.experience}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {app.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              {app.email}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {app.phone}
                            </span>
                          </div>

                          {/* Skills Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {app.skills.map((s, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>View Resume</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(app.id, "Shortlisted")}
                          className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition cursor-pointer"
                        >
                          Shortlist
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(app.id, "Interview")}
                          className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition cursor-pointer"
                        >
                          Interview
                        </button>

                        {/* HIRE BUTTON */}
                        <button
                          onClick={() => handleUpdateStatus(app.id, "Hired")}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Hire Candidate</span>
                        </button>

                        {/* REJECT BUTTON */}
                        <button
                          onClick={() => handleUpdateStatus(app.id, "Rejected")}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserX className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: RESUMES PURCHASED (Kitne Resume Kharide Hai) */}
          {activeTab === "resumes" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Purchased Resumes & Database</h2>
                  <p className="text-xs text-slate-500">
                    Access candidate CVs purchased from the talent pool.
                  </p>
                </div>
                <button
                  onClick={() => setIsBuyCreditsModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition hover:scale-102"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buy More Resume Credits</span>
                </button>
              </div>

              {/* Credits Balance Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500">Total Credits Purchased</span>
                  <p className="text-3xl font-black text-slate-900 mt-1">{totalResumesPurchased}</p>
                  <p className="text-xs text-slate-500 mt-1">From active subscription & credit packs</p>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500">Resumes Downloaded</span>
                  <p className="text-3xl font-black text-indigo-600 mt-1">{resumesUsed}</p>
                  <p className="text-xs text-slate-500 mt-1">Unlocked candidate contacts</p>
                </div>

                <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200 shadow-xs">
                  <span className="text-[11px] font-bold text-emerald-700">Available Credit Balance</span>
                  <p className="text-3xl font-black text-emerald-600 mt-1">{remainingCredits}</p>
                  <p className="text-xs text-slate-600 mt-1">Ready to unlock new talent profiles</p>
                </div>
              </div>

              {/* Purchased Resumes List */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FolderDown className="w-4 h-4 text-emerald-600" />
                  <span>Unlocked Resumes Vault</span>
                </h3>

                <div className="space-y-3">
                  {purchasedResumes.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center shrink-0 border border-rose-200">
                          PDF
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {res.candidateName}
                          </h4>
                          <p className="text-xs text-slate-600">{res.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {res.experience} • {res.location} • Purchased: {res.purchasedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-[11px] text-slate-500 hidden md:block">
                          <p>{res.email}</p>
                          <p>{res.phone}</p>
                        </div>
                        <button
                          onClick={() =>
                            showToast(`Downloading verified resume for ${res.candidateName}...`)
                          }
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download CV</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OUR SUBSCRIPTION */}
          {activeTab === "subscription" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Company Subscription & Plans</h2>
                  <p className="text-xs text-slate-500">
                    Manage your active recruitment package, quota limits, and billing options.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Active: {currentPlan}</span>
                </span>
              </div>

              {/* Current Active Plan Overview Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-white border border-blue-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 block mb-1">
                    Current Active Tier
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">{currentPlan}</h3>
                  <p className="text-xs text-slate-500 mt-1">{planValidity}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Job Posts</span>
                      <p className="font-bold text-slate-900">Unlimited</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">
                        Resume Credits
                      </span>
                      <p className="font-bold text-emerald-600">{totalResumesPurchased} / Month</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Team Seats</span>
                      <p className="font-bold text-slate-900">5 Recruiters</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Support</span>
                      <p className="font-bold text-purple-600">24/7 Dedicated</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsUpgradePlanModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md transition hover:scale-105 cursor-pointer shrink-0"
                >
                  Upgrade to Enterprise
                </button>
              </div>

              {/* Subscription Tier Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tier 1: Starter */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-black text-slate-900">Starter Recruiter</h4>
                    <p className="text-xs text-slate-500 mt-1">For small startups hiring occasionally</p>
                    <p className="text-2xl font-black text-slate-900 mt-4">
                      ₹4,999 <span className="text-xs text-slate-500 font-normal">/ month</span>
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-600 mt-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Up to 5 Active Job Posts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>15 Resume Downloads / mo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Standard Candidate Matching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>1 Recruiter Seat</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => showToast("You are already on a higher plan (Pro Growth)!")}
                    className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
                  >
                    Downgrade
                  </button>
                </div>

                {/* Tier 2: Pro Growth (Current) */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-50/40 to-white border-2 border-blue-600 shadow-md relative flex flex-col justify-between">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white uppercase tracking-wider shadow-xs">
                    Current Plan
                  </span>

                  <div>
                    <h4 className="text-base font-black text-slate-900">Professional Growth</h4>
                    <p className="text-xs text-slate-500 mt-1">For growing teams and fast hiring</p>
                    <p className="text-2xl font-black text-slate-900 mt-4">
                      ₹12,999 <span className="text-xs text-slate-500 font-normal">/ month</span>
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-700 mt-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">Unlimited Job Postings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">50 Resume Downloads / mo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Direct Candidate Contact Info</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>AI Applicant Matching & Scoring</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>5 Recruiter Seats</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => showToast("Professional Growth is your active plan!")}
                    className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold transition cursor-default shadow-xs"
                  >
                    Active Plan
                  </button>
                </div>

                {/* Tier 3: Enterprise */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-black text-slate-900">Enterprise Scaled</h4>
                    <p className="text-xs text-slate-500 mt-1">For large corporations with high volume hiring</p>
                    <p className="text-2xl font-black text-slate-900 mt-4">
                      ₹29,999 <span className="text-xs text-slate-500 font-normal">/ month</span>
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-600 mt-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Unlimited Job Postings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>250 Resume Downloads / mo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Dedicated Account Manager</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Custom ATS & HRMS Webhooks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Unlimited Recruiter Seats</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setIsUpgradePlanModalOpen(true)}
                    className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    Upgrade to Enterprise
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-slate-200/80">
                <h2 className="text-xl font-black text-slate-900">Portal Settings</h2>
                <p className="text-xs text-slate-500">
                  Configure company preferences and notifications.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">Email Notification for New Applications</p>
                    <p className="text-[11px] text-slate-500">
                      Receive an instant alert whenever a candidate applies.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">Resume Credit Low Balance Alert</p>
                    <p className="text-[11px] text-slate-500">
                      Notify team when available resume credits drop below 5.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">Auto-Acknowledge Applicants</p>
                    <p className="text-[11px] text-slate-500">
                      Send automated receipt confirmation to candidates upon submission.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: POST A NEW JOB (Clean Light Theme) */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Create New Job Posting</h3>
              </div>
              <button
                onClick={() => setIsPostJobModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Bengaluru / Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. ₹18L - ₹24L/yr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUY RESUME CREDITS (Clean Light Theme) */}
      {isBuyCreditsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderDown className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Purchase Resume Credits</h3>
              </div>
              <button
                onClick={() => setIsBuyCreditsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <p className="text-slate-600">
                Credits allow you to instantly unlock full candidate contact details and download
                original resumes.
              </p>

              <div
                onClick={() => handleBuyCredits(20, "₹2,499")}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900">20 Resume Credits</h4>
                  <p className="text-[11px] text-slate-500">₹125 per resume download</p>
                </div>
                <span className="font-black text-emerald-600 text-sm">₹2,499</span>
              </div>

              <div
                onClick={() => handleBuyCredits(50, "₹4,999")}
                className="p-4 rounded-2xl bg-emerald-50/50 border-2 border-emerald-500 transition cursor-pointer flex items-center justify-between relative shadow-xs"
              >
                <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white uppercase">
                  Best Value
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">50 Resume Credits</h4>
                  <p className="text-[11px] text-slate-500">₹100 per resume download</p>
                </div>
                <span className="font-black text-emerald-600 text-sm">₹4,999</span>
              </div>

              <div
                onClick={() => handleBuyCredits(100, "₹8,999")}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900">100 Resume Credits</h4>
                  <p className="text-[11px] text-slate-500">₹90 per resume download</p>
                </div>
                <span className="font-black text-emerald-600 text-sm">₹8,999</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW APPLICANT DETAILS (Clean Light Theme) */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {selectedApplicant.candidateName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedApplicant.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedApplicant.appliedRole}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Email</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApplicant.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Phone</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApplicant.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Experience</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApplicant.experience}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Location</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApplicant.location}</p>
                </div>
              </div>

              {selectedApplicant.notes && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Recruiter Notes</span>
                  <p className="text-slate-700 mt-1">{selectedApplicant.notes}</p>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  <span className="font-bold text-slate-800">
                    {selectedApplicant.resumeFileName}
                  </span>
                </div>
                <button
                  onClick={() =>
                    showToast(`Downloading CV for ${selectedApplicant.candidateName}...`)
                  }
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedApplicant.id, "Rejected");
                    setSelectedApplicant(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-600 hover:text-white transition"
                >
                  Reject Candidate
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedApplicant.id, "Hired");
                    setSelectedApplicant(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs"
                >
                  Hire Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: UPGRADE PLAN (Clean Light Theme) */}
      {isUpgradePlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">Upgrade to Enterprise</h3>
              </div>
              <button
                onClick={() => setIsUpgradePlanModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Unlock 250 resume downloads/month, custom applicant tracking integration, dedicated
                account management, and priority candidate job alerts.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Price</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  ₹29,999 <span className="text-xs text-slate-500 font-normal">/ month</span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpgradePlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPlan("Enterprise Scaled");
                    setTotalResumesPurchased((prev) => prev + 250);
                    setIsUpgradePlanModalOpen(false);
                    showToast("Upgraded to Enterprise Scaled Plan successfully!");
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-bold shadow-md"
                >
                  Confirm Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: IMAGE ACTIONS MODAL (SEE, UPDATE, REMOVE) */}
      {imageModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {imageModalState.type === "profile"
                      ? "Company Profile Logo"
                      : "Company Cover Banner"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Manage your company&apos;s brand image assets
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImageModalState({ ...imageModalState, isOpen: false, mode: "menu" })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode: VIEW (Full Size Lightbox Preview) */}
            {imageModalState.mode === "view" ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center min-h-[220px] max-h-[360px] p-3 border border-slate-200">
                  {imageModalState.type === "profile" ? (
                    profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile Preview"
                        className="max-h-[300px] max-w-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900">
                          {companyName.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">
                          {companyName.split(" ")[1] || "CORP"}
                        </span>
                      </div>
                    )
                  ) : bannerImage ? (
                    <img
                      src={bannerImage}
                      alt="Banner Preview"
                      className="max-h-[300px] w-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-44 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 flex items-center justify-center text-white/70 text-xs font-semibold">
                      Default Corporate Cover Gradient
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setImageModalState({ ...imageModalState, mode: "menu" })}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    ← Back to Options
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (imageModalState.type === "profile") {
                        profileInputRef.current?.click();
                      } else {
                        bannerInputRef.current?.click();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Image</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Mode: MENU (See, Update, Remove Options) */
              <div className="space-y-4">
                {/* Current Image Preview Strip */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden flex items-center justify-center shrink-0">
                    {imageModalState.type === "profile" ? (
                      profileImage ? (
                        <img
                          src={profileImage}
                          alt="Logo"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="font-black text-slate-800 text-sm">
                          {companyName.slice(0, 2).toUpperCase()}
                        </span>
                      )
                    ) : bannerImage ? (
                      <img
                        src={bannerImage}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-indigo-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900">
                      {imageModalState.type === "profile"
                        ? profileImage
                          ? "Custom Company Logo"
                          : "Default Initials Avatar"
                        : bannerImage
                        ? "Custom Cover Banner"
                        : "Default Corporate Gradient"}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {imageModalState.type === "profile"
                        ? "Recommended: 400×400 PNG, JPG or WebP"
                        : "Recommended: 1600×450 PNG, JPG or WebP"}
                    </p>
                  </div>
                </div>

                {/* 3 Action Option Cards: See, Update, Remove */}
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Option 1: SEE IMAGE */}
                  <button
                    type="button"
                    onClick={() => setImageModalState({ ...imageModalState, mode: "view" })}
                    className="w-full p-3.5 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                          See Image (View Full Size)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Preview the current {imageModalState.type === "profile" ? "logo" : "cover"} in high resolution
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  {/* Option 2: UPDATE IMAGE */}
                  <button
                    type="button"
                    onClick={() => {
                      if (imageModalState.type === "profile") {
                        profileInputRef.current?.click();
                      } else {
                        bannerInputRef.current?.click();
                      }
                    }}
                    className="w-full p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                          Update Image (Upload New)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Select a new photo from your device to replace this image
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  {/* Option 3: REMOVE IMAGE */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imageModalState.type)}
                    className="w-full p-3.5 rounded-2xl border border-slate-200/90 hover:border-red-400 hover:bg-red-50/40 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-red-700">
                          Remove Image
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Delete custom asset and restore default branding
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
