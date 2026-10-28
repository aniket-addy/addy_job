"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Check,
  Search,
  X,
  Phone,
  FileText,
  UploadCloud,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Users,
  Briefcase,
  Camera,
  ShieldCheck,
  Save,
} from "lucide-react";
import { registerUser, setAuthSession } from "@/lib/api";
import EmployerSignupView from "@/components/EmployerSignupView";

export type UserRole = "job_seeker" | "company";

const COURSE_SUGGESTIONS = [
  "B.A - Bachelor of Arts",
  "B.C.A.",
  "B.B.A. / B.M.S.",
  "B.Com",
  "B.Ed",
  "B.Pharma",
  "B.Sc",
  "B.Tech / B.E.",
  "LLB - Bachelor of Laws",
  "Diploma",
];

const SPECIALIZATION_SUGGESTIONS = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Artificial Intelligence & ML",
];

const UNIVERSITY_SUGGESTIONS = [
  "Sanskar Educational Group",
  "Delhi University (DU)",
  "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
  "Guru Gobind Singh Indraprastha University (GGSIPU)",
  "Indian Institute of Technology (IIT) Delhi",
  "Indian Institute of Technology (IIT) Bombay",
  "National Institute of Technology (NIT)",
  "Vellore Institute of Technology (VIT)",
  "Birla Institute of Technology and Science (BITS Pilani)",
  "Mumbai University",
  "Pune University (SPPU)",
  "Amity University",
];

const STARTING_YEAR_SUGGESTIONS = ["2026", "2025", "2024", "2023", "2022"];
const PASSING_YEAR_SUGGESTIONS = ["2029", "2028", "2027", "2026", "2025"];

const GRADING_SYSTEM_SUGGESTIONS = [
  "Scale 10 Grading System",
  "Scale 4 Grading System",
  "% Marks of 100 Maximum",
  "Course Requires a Pass",
];

const POPULAR_SKILLS = [
  "React.js",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "HTML",
  "CSS",
  "SQL",
  "MongoDB",
  "Next.js",
  "Tailwind CSS",
  "Git",
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stage 1: "select_role" | Stage 2: "form"
  const [stage, setStage] = useState<"select_role" | "form">("select_role");
  const [selectedRole, setSelectedRole] = useState<UserRole>("job_seeker");

  // Multi-step for Job Seeker: 1: Basic details, 2: Education, 3: Last step
  const [jobSeekerStep, setJobSeekerStep] = useState<1 | 2 | 3>(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);
  const [apiSuccessMsg, setApiSuccessMsg] = useState<string | null>(null);

  // Validation errors on Step 2 (matching uploaded screenshots)
  const [universityError, setUniversityError] = useState(false);
  const [skillsError, setSkillsError] = useState(false);

  // Auto-suggest dropdown states
  const [showUnivDropdown, setShowUnivDropdown] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // Check URL parameters on mount
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "company") {
      setSelectedRole("company");
    } else if (roleParam === "job_seeker") {
      setSelectedRole("job_seeker");
    }
    setJobSeekerStep(1);
    setStage("select_role");
  }, [searchParams]);

  // ================= Form States =================
  // Step 1: Basic Details
  const [basicDetails, setBasicDetails] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    workStatus: "fresher" as "fresher" | "experienced",
    resumeFileName: "",
    profilePhoto: "",
  });

  // Step 2: Education Details (Matching the exact uploaded screenshots)
  const [educationDetails, setEducationDetails] = useState({
    highestQualification: "Graduation/Diploma",
    course: "B.Tech / B.E.",
    courseType: "Full Time",
    specialization: "Computer Science and Engineering",
    university: "",
    startingYear: "2026",
    passingYear: "2026",
    gradingSystem: "Scale 10 Grading System",
    gradeScore: "",
    keySkills: [] as string[],
  });

  // Step 3: Last step (Preferences)
  const [lastStepDetails, setLastStepDetails] = useState({
    targetRole: "Frontend Developer",
    preferredLocation: "Delhi NCR / Noida",
    expectedSalary: "₹4 - 6 LPA",
  });

  const photoInputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setApiErrorMsg("Profile photo must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBasicDetails((prev) => ({
          ...prev,
          profilePhoto: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Company registration form (for employer role)
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    workEmail: "",
    password: "",
    industry: "Information Technology",
    companySize: "11-50 employees",
    location: "Bengaluru, India",
    phone: "",
    gstNumber: "",
  });

  // ================= Skill Add / Remove =================
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!educationDetails.keySkills.includes(trimmed)) {
      setEducationDetails((prev) => ({
        ...prev,
        keySkills: [...prev.keySkills, trimmed],
      }));
      setSkillsError(false);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEducationDetails((prev) => ({
      ...prev,
      keySkills: prev.keySkills.filter((s) => s !== skillToRemove),
    }));
  };

  // Select role and go to form
  const handleChooseRoleAndContinue = (role: UserRole) => {
    setSelectedRole(role);
    setApiErrorMsg(null);
    setApiSuccessMsg(null);
    if (role === "job_seeker") {
      setJobSeekerStep(1);
      setStage("form");
    } else {
      router.push("/signup/employer");
    }
  };

  // ================= Validation Helpers =================
  const validateBasicDetails = (showAlert: boolean = true): boolean => {
    if (!basicDetails.fullName.trim()) {
      if (showAlert) setApiErrorMsg("Please enter your Full Name.");
      return false;
    }
    if (!basicDetails.email.trim()) {
      if (showAlert) setApiErrorMsg("Please enter your Email ID.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(basicDetails.email.trim())) {
      if (showAlert) setApiErrorMsg("Please enter a valid Email ID.");
      return false;
    }
    if (!basicDetails.mobile.trim() || basicDetails.mobile.replace(/\D/g, "").length < 10) {
      if (showAlert) setApiErrorMsg("Please enter a valid 10-digit Mobile Number.");
      return false;
    }
    if (!basicDetails.password || basicDetails.password.length < 6) {
      if (showAlert) setApiErrorMsg("Password must be at least 6 characters long.");
      return false;
    }
    if (basicDetails.password !== basicDetails.confirmPassword) {
      if (showAlert) setApiErrorMsg("Passwords do not match. Please verify Confirm Password.");
      return false;
    }
    return true;
  };

  const isBasicDetailsFilled = () => {
    return validateBasicDetails(false);
  };

  // Strict Guard: Never allow viewing Step 2 or 3 if basic details are not filled
  useEffect(() => {
    if (jobSeekerStep > 1 && !isBasicDetailsFilled()) {
      setJobSeekerStep(1);
    }
  }, [jobSeekerStep, basicDetails]);

  // Safe navigation between steps in the top stepper
  const handleNavigateToStep = (targetStep: 1 | 2 | 3) => {
    if (targetStep === 1) {
      setJobSeekerStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Basic details are strictly mandatory before moving forward
    if (!validateBasicDetails(true)) {
      setJobSeekerStep(1);
      return;
    }

    setApiErrorMsg(null);
    setJobSeekerStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 1 Submit
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBasicDetails(true)) {
      return;
    }
    setApiErrorMsg(null);
    setJobSeekerStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 Skip (Skip education for now)
  const handleStep2Skip = () => {
    setUniversityError(false);
    setSkillsError(false);
    setApiErrorMsg(null);
    setJobSeekerStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 Save & Continue (Validation matching screenshots)
  const handleStep2SaveAndContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let hasError = false;

    // Validate University (matches screenshot red error: "Please enter university/institute Name")
    if (!educationDetails.university.trim()) {
      setUniversityError(true);
      hasError = true;
    } else {
      setUniversityError(false);
    }

    // Validate Skills (matches screenshot red error: "Please specify atleast one key skill")
    if (educationDetails.keySkills.length === 0) {
      setSkillsError(true);
      hasError = true;
    } else {
      setSkillsError(false);
    }

    if (hasError) {
      return;
    }

    setApiErrorMsg(null);
    setJobSeekerStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final Registration Call
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateBasicDetails(true)) {
      setJobSeekerStep(1);
      return;
    }
    setIsLoading(true);
    setApiErrorMsg(null);
    setApiSuccessMsg(null);

    try {
      if (selectedRole === "job_seeker") {
        const payload = {
          role: "job_seeker" as const,
          email: basicDetails.email.trim().toLowerCase(),
          password: basicDetails.password || "Password@123",
          fullName: basicDetails.fullName.trim(),
          name: basicDetails.fullName.trim(),
          targetRole: lastStepDetails.targetRole,
          experience: basicDetails.workStatus === "fresher" ? "Fresher" : "1-3 Years",
          highestQualification: educationDetails.highestQualification,
          course: educationDetails.course,
          courseType: educationDetails.courseType,
          specialization: educationDetails.specialization,
          university: educationDetails.university,
          startingYear: educationDetails.startingYear,
          passingYear: educationDetails.passingYear,
          gradingSystem: educationDetails.gradingSystem,
          gradeScore: educationDetails.gradeScore,
          skills: educationDetails.keySkills,
          workStatus: basicDetails.workStatus,
          preferredLocation: lastStepDetails.preferredLocation,
          expectedSalary: lastStepDetails.expectedSalary,
          phone: basicDetails.mobile,
        };

        const res = await registerUser(payload);
        if (!res.success || !res.token || !res.user) {
          setApiErrorMsg(res.message || "Registration failed. Please try again.");
          setIsLoading(false);
          return;
        }

        setApiSuccessMsg("Account created successfully! Opening your dashboard...");
        setAuthSession(res.token, res.user);

        setTimeout(() => {
          router.push("/candidate/dashboard");
        }, 1000);
      } else {
        // Employer Registration
        if (!companyForm.phone?.trim()) {
          setApiErrorMsg("Please enter your contact phone number.");
          setIsLoading(false);
          return;
        }
        if (!companyForm.password || companyForm.password.length < 8) {
          setApiErrorMsg("Password must be at least 8 characters long.");
          setIsLoading(false);
          return;
        }
        if (!/^[A-Z]/.test(companyForm.password)) {
          setApiErrorMsg("Password must start with a Capital letter (A-Z).");
          setIsLoading(false);
          return;
        }
        if (!/[a-z]/.test(companyForm.password)) {
          setApiErrorMsg("Password must contain at least one lowercase letter (a-z).");
          setIsLoading(false);
          return;
        }
        if (!/[0-9]/.test(companyForm.password)) {
          setApiErrorMsg("Password must contain at least one number (0-9).");
          setIsLoading(false);
          return;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(companyForm.password)) {
          setApiErrorMsg("Password must contain at least one special character (@, #, $, %, etc.).");
          setIsLoading(false);
          return;
        }

        const res = await registerUser({
          role: "company",
          email: companyForm.workEmail.trim().toLowerCase(),
          workEmail: companyForm.workEmail.trim().toLowerCase(),
          password: companyForm.password,
          companyName: companyForm.companyName,
          industry: companyForm.industry,
          companySize: companyForm.companySize,
          location: companyForm.location,
          phone: companyForm.phone,
          gstNumber: companyForm.gstNumber,
        });

        if (!res.success || !res.token || !res.user) {
          setApiErrorMsg(res.message || "Registration failed. Please try again.");
          setIsLoading(false);
          return;
        }

        setApiSuccessMsg("Company registered successfully! Opening your dashboard...");
        setAuthSession(res.token, res.user);

        setTimeout(() => {
          router.push("/company/dashboard");
        }, 1000);
      }
    } catch (err: any) {
      setApiErrorMsg(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (stage === "form" && selectedRole === "company") {
    return (
      <EmployerSignupView
        onSwitchToJobSeeker={() => {
          setSelectedRole("job_seeker");
          setStage("select_role");
        }}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white ${
        stage === "select_role" ? "lg:h-screen lg:max-h-screen lg:overflow-hidden" : ""
      }`}
      style={{
        background:
          stage === "select_role"
            ? "linear-gradient(to right, #E1ECFD 0%, #E1ECFD 50%, #DAF6E9 50%, #DAF6E9 100%)"
            : "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef5fe 100%)",
      }}
    >
      {/* ================= TOP HEADER (ONLY SHOWN FOR STAGE 2 FORM) ================= */}
      {stage === "form" && (
        <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 py-3.5 px-4 sm:px-8 lg:px-12 sticky top-0 shadow-xs z-40">
          <div className="max-w-[1550px] mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center shrink-0">
                <Image
                  src="/addyjob-logo.png"
                  alt="AddyJob"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Addy<span className="text-blue-600">Job</span>
              </span>
            </Link>

            {/* Right Header */}
            <div className="flex items-center gap-4 sm:gap-6">
              {selectedRole === "job_seeker" && (
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  Welcome,{" "}
                  <span className="font-semibold text-slate-900">
                    {basicDetails.fullName || "Candidate"}
                  </span>
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setStage("select_role");
                  setApiErrorMsg(null);
                }}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all bg-white cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Role</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main
        className={`flex-1 w-full flex flex-col justify-center ${
          stage === "select_role"
            ? "p-0 m-0 max-w-none h-full overflow-hidden"
            : selectedRole === "job_seeker"
            ? "w-full max-w-[1550px] mx-auto px-3 sm:px-6 py-6 sm:py-8"
            : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
        }`}
      >
        {/* Error / Success Toast Messages */}
        {apiErrorMsg && (
          <div className="mb-4 max-w-2xl mx-auto w-full p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{apiErrorMsg}</span>
          </div>
        )}
        {apiSuccessMsg && (
          <div className="mb-4 max-w-2xl mx-auto w-full p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{apiSuccessMsg}</span>
          </div>
        )}

        {/* ================= STAGE 1: ROLE SELECTION ================= */}
        {stage === "select_role" ? (
          <>
            {/* ----------------- 1. DESKTOP VIEW (100% FIXED 100vh VIEWPORT - ZERO SCROLL - BOTTOM ANCHORED) ----------------- */}
            <div className="hidden lg:flex w-full h-full relative items-center justify-center select-none overflow-hidden">
              {/* Background Graphic anchored cleanly to bottom with zero gap */}
              <Image
                src="/signup-hero-artwork-clean.png"
                alt="AddyJob Hero Visual"
                fill
                className="object-cover object-bottom pointer-events-none"
                priority
              />

              {/* Real Top Header (Razor-sharp vector logo & links) */}
              <div className="absolute top-4 xl:top-6 inset-x-8 xl:inset-x-14 flex items-center justify-between z-30 pointer-events-auto">
                <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-xs">
                    <Image
                      src="/addyjob-logo.png"
                      alt="AddyJob"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    Addy<span className="text-blue-600">Job</span>
                  </span>
                </Link>

                <div className="flex items-center gap-1.5 text-xs xl:text-sm text-slate-500 font-medium">
                  <span>Already registered?</span>
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 transition-colors hover:underline"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Real Left Hero Typography & Badges (Zero Blur) */}
              <div className="absolute top-[11%] xl:top-[13%] left-[3.5%] xl:left-[4.5%] w-[24%] max-w-[320px] z-20 flex flex-col items-start select-text text-left">
                {/* Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dbeafe] text-[#1d4ed8] text-[11px] xl:text-xs font-bold tracking-wide shadow-xs border border-blue-200/60">
                  <User className="w-3.5 h-3.5 text-[#1d4ed8]" />
                  <span>For Job Seekers</span>
                </div>

                {/* Heading */}
                <h2 className="text-2xl xl:text-[34px] font-extrabold text-[#0f172a] leading-[1.12] tracking-tight mt-2 xl:mt-2.5">
                  Find Your<br />Dream Job
                </h2>

                {/* Subtitle */}
                <p className="text-[11px] xl:text-[12.5px] text-slate-500 mt-1.5 xl:mt-2 leading-relaxed max-w-[250px]">
                  Explore thousands of job opportunities, connect with top companies and build your future.
                </p>

                {/* Checklist */}
                <div className="mt-2.5 xl:mt-3 space-y-1.5 xl:space-y-2 text-[11px] xl:text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Apply in minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Get personalized recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Track your applications</span>
                  </div>
                </div>

                {/* Doodle Arrow pointing down towards candidate / card */}
                <div className="w-full flex justify-end pr-1 mt-0.5 pointer-events-none">
                  <svg className="w-7 h-9 text-[#3b82f6] -rotate-12" viewBox="0 0 50 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5 C 35 15, 45 35, 25 45 C 10 52, 12 35, 30 35 C 38 35, 42 45, 42 55" />
                    <path d="M35 52 L 42 55 L 45 48" />
                  </svg>
                </div>
              </div>

              {/* Real Right Hero Typography & Badges (Zero Blur) */}
              <div className="absolute top-[11%] xl:top-[13%] right-[3.5%] xl:right-[4.5%] w-[24%] max-w-[320px] z-20 flex flex-col items-start select-text text-left">
                {/* Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-[11px] xl:text-xs font-bold tracking-wide shadow-xs border border-emerald-200/60">
                  <Building2 className="w-3.5 h-3.5 text-[#065f46]" />
                  <span>For Companies</span>
                </div>

                {/* Heading */}
                <h2 className="text-2xl xl:text-[34px] font-extrabold text-[#0f172a] leading-[1.12] tracking-tight mt-2 xl:mt-2.5">
                  Hire Top<br />Talent
                </h2>

                {/* Subtitle */}
                <p className="text-[11px] xl:text-[12.5px] text-slate-500 mt-1.5 xl:mt-2 leading-relaxed max-w-[250px]">
                  Find skilled professionals, streamline your hiring process and grow your team faster.
                </p>

                {/* Checklist */}
                <div className="mt-2.5 xl:mt-3 space-y-1.5 xl:space-y-2 text-[11px] xl:text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Access verified talent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Post jobs in minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Manage your hiring easily</span>
                  </div>
                </div>

                {/* Doodle Arrow pointing down towards recruiter / card */}
                <div className="w-full flex justify-start pl-1 mt-0.5 pointer-events-none">
                  <svg className="w-7 h-9 text-[#10b981] rotate-12" viewBox="0 0 50 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M35 5 C 15 15, 5 35, 25 45 C 40 52, 38 35, 20 35 C 12 35, 8 45, 8 55" />
                    <path d="M15 52 L 8 55 L 5 48" />
                  </svg>
                </div>
              </div>

              {/* Clickable Left/Right Hero Areas to quickly switch role */}
              <div
                onClick={() => setSelectedRole("job_seeker")}
                className="absolute inset-y-0 left-0 w-[26%] z-20 cursor-pointer"
                title="Click to select Job Seeker"
              />
              <div
                onClick={() => setSelectedRole("company")}
                className="absolute inset-y-0 right-0 w-[26%] z-20 cursor-pointer"
                title="Click to select Employer"
              />

              {/* Centered Elevated Interactive White Card */}
              <div className="relative z-30 w-[42%] min-w-[460px] max-w-[580px] bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] p-4 sm:p-5 xl:p-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2 border border-blue-100/70">
                    <Users className="w-3.5 h-3.5" />
                    <span>Join AddyJob</span>
                  </div>
                  <h1 className="text-xl sm:text-[25px] font-extrabold text-slate-900 tracking-tight leading-tight">
                    How would you like to join?
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                    Choose your account type below to get started with a customized experience.
                  </p>
                </div>

                {/* 2 Choice Role Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Option 1: Job Seeker Card */}
                  <div
                    onClick={() => setSelectedRole("job_seeker")}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer group relative ${
                      selectedRole === "job_seeker"
                        ? "border-blue-600 bg-white ring-4 ring-blue-50/80 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
                          <User className="w-4 h-4" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            selectedRole === "job_seeker"
                              ? "bg-blue-600 text-white"
                              : "border-2 border-slate-300 bg-white"
                          }`}
                        >
                          {selectedRole === "job_seeker" && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        I am a Job Seeker
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Looking for dream roles, tech opportunities, and internships.
                      </p>

                      <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Explore 1,200+ verified jobs</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>1-Click easy resume application</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Track application status live</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseRoleAndContinue("job_seeker");
                        }}
                        className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedRole === "job_seeker"
                            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 shadow-blue-500/20"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>Sign up as Job Seeker</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Employer Card */}
                  <div
                    onClick={() => setSelectedRole("company")}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer group relative ${
                      selectedRole === "company"
                        ? "border-blue-600 bg-white ring-4 ring-blue-50/80 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center transition-transform group-hover:scale-105">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            selectedRole === "company"
                              ? "bg-blue-600 text-white"
                              : "border-2 border-slate-300 bg-white"
                          }`}
                        >
                          {selectedRole === "company" && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        I am an Employer
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Hiring top talent, posting vacancies, and screening candidates.
                      </p>

                      <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Post openings to 50,000+ candidates</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Screen & shortlist verified profiles</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Manage entire hiring pipeline</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseRoleAndContinue("company");
                        }}
                        className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedRole === "company"
                            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 shadow-blue-500/20"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>Sign up as Employer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
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
                    onClick={() => handleChooseRoleAndContinue(selectedRole)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ----------------- 2. MOBILE PHONE VIEW (MATCHING ATTACHED PHONE MOCKUP EXACTLY) ----------------- */}
            <div className="flex lg:hidden flex-col min-h-screen w-full bg-[#f8fbff] px-4 py-4 pb-10 select-none overflow-y-auto">
              {/* Mobile Header Bar */}
              <div className="w-full flex items-center justify-between pb-3 pt-1">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-xs">
                    <Image
                      src="/addyjob-logo.png"
                      alt="AddyJob"
                      width={28}
                      height={28}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Addy<span className="text-blue-600">Job</span>
                  </span>
                </Link>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block leading-tight">Already registered?</span>
                  <Link
                    href="/login"
                    className="text-xs text-blue-600 font-bold inline-flex items-center gap-0.5 hover:underline"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </Link>
                </div>
              </div>

              {/* Mobile Role Selection Card (Vertical Stacked, exactly like iPhone screenshot) */}
              <div className="w-full max-w-md mx-auto my-auto bg-white rounded-3xl p-5 mb-4 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold mb-2 border border-blue-100/70">
                    <Users className="w-3.5 h-3.5" />
                    <span>Join AddyJob</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    How would you like to join?
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Choose your account type below to get started with a customized experience.
                  </p>
                </div>

                {/* Vertical Stacked Cards */}
                <div className="space-y-3.5">
                  {/* Option 1: Job Seeker Card */}
                  <div
                    onClick={() => setSelectedRole("job_seeker")}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      selectedRole === "job_seeker"
                        ? "border-blue-600 bg-white ring-4 ring-blue-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            selectedRole === "job_seeker"
                              ? "bg-blue-600 text-white"
                              : "border-2 border-slate-300 bg-white"
                          }`}
                        >
                          {selectedRole === "job_seeker" && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        I am a Job Seeker
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Looking for dream roles, tech opportunities, and internships.
                      </p>

                      <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Explore 1,200+ verified jobs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>1-Click easy resume application</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Track application status live</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseRoleAndContinue("job_seeker");
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedRole === "job_seeker"
                            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 shadow-blue-500/20"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>Sign up as Job Seeker</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Employer Card */}
                  <div
                    onClick={() => setSelectedRole("company")}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      selectedRole === "company"
                        ? "border-blue-600 bg-white ring-4 ring-blue-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            selectedRole === "company"
                              ? "bg-blue-600 text-white"
                              : "border-2 border-slate-300 bg-white"
                          }`}
                        >
                          {selectedRole === "company" && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        I am an Employer
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Hiring top talent, posting vacancies, and screening candidates.
                      </p>

                      <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Post openings to 50,000+ candidates</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Screen & shortlist verified profiles</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Manage entire hiring pipeline</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseRoleAndContinue("company");
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedRole === "company"
                            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 shadow-blue-500/20"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>Sign up as Employer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
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
                    onClick={() => handleChooseRoleAndContinue(selectedRole)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ================= STAGE 2: FORM FLOW ================= */
          selectedRole === "job_seeker" ? (
            /* ================= JOB SEEKER MULTI-STEP FLOW (IMAGE 1 & IMAGE 2 REDESIGN) ================= */
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 xl:gap-8 animate-in fade-in duration-200 relative">
              {/* ---------------- 1. LEFT SIDE ART (IMAGE 1) ---------------- */}
              <div className="hidden lg:flex w-[230px] xl:w-[260px] shrink-0 flex-col pt-4 select-none sticky top-24">
                {/* Title & Subtitle */}
                <div className="mb-7">
                  <h2 className="text-3xl xl:text-[34px] font-extrabold text-[#3b82f6] tracking-tight leading-[1.12]">
                    Build Your<br />Better Future
                  </h2>
                  <p className="text-xs xl:text-[13px] text-slate-400 font-medium mt-2 max-w-[210px] leading-relaxed">
                    Great opportunities are just a step away.
                  </p>
                </div>

                {/* Floating Graphics: Resume Card + Magnifier + Paper Plane + Growth Chart */}
                <div className="relative w-full h-[300px]">
                  {/* Subtle Glow & Dots */}
                  <div className="absolute top-2 left-6 w-3 h-3 rounded-full bg-blue-200/50" />
                  <div className="absolute top-20 right-4 w-2 h-2 rounded-full bg-blue-300/40" />
                  <div className="absolute bottom-6 right-6 w-3.5 h-3.5 rounded-full bg-blue-100/70" />

                  {/* Paper Plane */}
                  <div className="absolute top-4 right-2 text-blue-400/80 animate-pulse">
                    <svg className="w-8 h-8 -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </div>

                  {/* Floating Resume Card */}
                  <div className="absolute left-1 top-8 w-44 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_35px_rgba(37,99,235,0.08)] border border-blue-100/80 p-4 transform -rotate-3 hover:rotate-0 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-blue-200/80 rounded-full w-24" />
                      <div className="h-1.5 bg-slate-200/80 rounded-full w-32" />
                      <div className="h-1.5 bg-slate-200/80 rounded-full w-20" />
                      <div className="h-1.5 bg-slate-200/80 rounded-full w-28" />
                    </div>
                  </div>

                  {/* Magnifying Glass floating over card */}
                  <div className="absolute right-4 top-28 z-10">
                    <div className="w-14 h-14 rounded-full border-4 border-blue-400 bg-white/50 backdrop-blur-md shadow-lg flex items-center justify-center relative">
                      <div className="w-3.5 h-3.5 rounded-full border border-blue-300/40" />
                      <div className="absolute -bottom-3.5 -right-2.5 w-6 h-3 bg-blue-400 rounded-full transform rotate-45" />
                    </div>
                  </div>

                  {/* Mini Growth Bar Chart */}
                  <div className="absolute left-4 bottom-3 flex items-end gap-1.5 p-2 rounded-xl bg-white/90 border border-blue-100/70 shadow-xs">
                    <div className="w-2.5 h-4 bg-blue-200 rounded-xs" />
                    <div className="w-2.5 h-7 bg-blue-400 rounded-xs" />
                    <div className="w-2.5 h-10 bg-blue-600 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* ---------------- 2. CENTER COLUMN: UNIFIED PROCESS BAR + MAIN CARD ---------------- */}
              <div className="w-full max-w-[820px] xl:max-w-[860px] flex flex-col">
                {/* ================= UNIFIED SINGLE PROCESS BAR WITH 3 POINTS (EXACT IMAGE 2 & 1) ================= */}
                <div className="w-full mb-5 px-1 sm:px-2 select-none">
                  {/* Status text: "Step 1 of 3 • 33% complete" */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-bold text-blue-600 tracking-tight">
                      Step {jobSeekerStep} of 3 • {jobSeekerStep === 1 ? "33%" : jobSeekerStep === 2 ? "66%" : "100%"} complete
                    </span>
                  </div>

                  {/* Single Continuous Progress Bar Line (Exact Image 2) */}
                  <div className="w-full h-1.5 sm:h-2 bg-slate-200/90 rounded-full overflow-hidden shadow-inner mb-3.5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: jobSeekerStep === 1 ? "33.33%" : jobSeekerStep === 2 ? "66.66%" : "100%",
                      }}
                    />
                  </div>

                  {/* 3 Step Points */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {/* Point 1 */}
                    <div
                      onClick={() => handleNavigateToStep(1)}
                      className="cursor-pointer group flex items-start gap-2 sm:gap-3"
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          jobSeekerStep === 1
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                            : jobSeekerStep > 1
                            ? "bg-blue-600 text-white"
                            : "bg-white border-2 border-slate-300 text-slate-500"
                        }`}
                      >
                        {jobSeekerStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${
                            jobSeekerStep === 1 ? "text-slate-900" : "text-slate-600 group-hover:text-blue-600"
                          }`}
                        >
                          Basic details
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                          Personal & account info
                        </p>
                      </div>
                    </div>

                    {/* Point 2 */}
                    <div
                      onClick={() => {
                        if (isBasicDetailsFilled()) handleNavigateToStep(2);
                      }}
                      className={`flex items-start gap-2 sm:gap-3 transition-all ${
                        isBasicDetailsFilled()
                          ? "cursor-pointer group"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          jobSeekerStep === 2
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                            : jobSeekerStep > 2
                            ? "bg-blue-600 text-white"
                            : "bg-white border-2 border-slate-300 text-slate-500"
                        }`}
                      >
                        {jobSeekerStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4
                            className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${
                              jobSeekerStep === 2 ? "text-slate-900" : "text-slate-600 group-hover:text-blue-600"
                            }`}
                          >
                            Education
                          </h4>
                          {!isBasicDetailsFilled() && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                          Your academic background
                        </p>
                      </div>
                    </div>

                    {/* Point 3 */}
                    <div
                      onClick={() => {
                        if (isBasicDetailsFilled()) handleNavigateToStep(3);
                      }}
                      className={`flex items-start gap-2 sm:gap-3 transition-all ${
                        isBasicDetailsFilled()
                          ? "cursor-pointer group"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          jobSeekerStep === 3
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                            : "bg-white border-2 border-slate-300 text-slate-500"
                        }`}
                      >
                        3
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4
                            className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${
                              jobSeekerStep === 3 ? "text-slate-900" : "text-slate-600 group-hover:text-blue-600"
                            }`}
                          >
                            Last step
                          </h4>
                          {!isBasicDetailsFilled() && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                          Complete your profile
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= MAIN ELEVATED WHITE CARD (IMAGE 1) ================= */}
                <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-100 shadow-[0_12px_45px_rgba(37,99,235,0.06)] p-6 sm:p-8 xl:p-9 transition-all">
                  {/* ---------------- STEP 1 FORM: EXACT DESIGN MATCH TO IMAGE 1 ---------------- */}
                  {(jobSeekerStep === 1 || !isBasicDetailsFilled()) && (
                    <form onSubmit={handleStep1Submit} className="space-y-6">
                      {/* 1. Personal Details Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                              Personal Details
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Tell us about yourself. This information will be visible to employers.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Full Name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Full Name <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                required
                                placeholder="e.g. Shivam Kumar"
                                value={basicDetails.fullName}
                                onChange={(e) =>
                                  setBasicDetails({ ...basicDetails, fullName: e.target.value })
                                }
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                              />
                            </div>
                          </div>

                          {/* Email ID */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Email ID <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={basicDetails.email}
                                onChange={(e) =>
                                  setBasicDetails({ ...basicDetails, email: e.target.value })
                                }
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                              />
                            </div>
                          </div>

                          {/* Mobile Number */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Mobile Number <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="tel"
                                required
                                placeholder="+91 98765 43210"
                                value={basicDetails.mobile}
                                onChange={(e) =>
                                  setBasicDetails({ ...basicDetails, mobile: e.target.value })
                                }
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. Account Security Section */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                              Account Security
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Create a secure password for your account.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {/* Create Password */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Create Password <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={basicDetails.password}
                                onChange={(e) =>
                                  setBasicDetails({ ...basicDetails, password: e.target.value })
                                }
                                className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Confirm Password <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="Re-enter your password"
                                value={basicDetails.confirmPassword}
                                onChange={(e) =>
                                  setBasicDetails({ ...basicDetails, confirmPassword: e.target.value })
                                }
                                className={`w-full pl-9 pr-9 py-2 bg-white border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                                  basicDetails.confirmPassword &&
                                  basicDetails.password !== basicDetails.confirmPassword
                                    ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                                    : "border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {basicDetails.confirmPassword &&
                              basicDetails.password !== basicDetails.confirmPassword && (
                                <p className="text-[10px] text-rose-500 mt-1 font-medium">
                                  Passwords do not match
                                </p>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* 4. Work Status Section */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Briefcase className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                              Work Status
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Select your current work status. This helps us show you relevant job opportunities.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {/* Fresher Card */}
                          <div
                            onClick={() =>
                              setBasicDetails({ ...basicDetails, workStatus: "fresher" })
                            }
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                              basicDetails.workStatus === "fresher"
                                ? "border-blue-600 bg-blue-50/40 shadow-xs"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  basicDetails.workStatus === "fresher"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                  I&apos;m a fresher
                                </h5>
                                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 max-w-[210px]">
                                  I am a recent graduate or looking for my first job opportunity.
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 ml-2">
                              {basicDetails.workStatus === "fresher" ? (
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </div>

                          {/* Experienced Card */}
                          <div
                            onClick={() =>
                              setBasicDetails({ ...basicDetails, workStatus: "experienced" })
                            }
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                              basicDetails.workStatus === "experienced"
                                ? "border-blue-600 bg-blue-50/40 shadow-xs"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  basicDetails.workStatus === "experienced"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                  I&apos;m experienced
                                </h5>
                                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 max-w-[210px]">
                                  I have work experience and looking for better opportunities.
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 ml-2">
                              {basicDetails.workStatus === "experienced" ? (
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 5. Card Footer (Matching Image 1) */}
                      <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setApiSuccessMsg("Details saved. You can continue anytime.");
                          }}
                          className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Save className="w-3.5 h-3.5 text-slate-400" />
                          <span>Save & continue later</span>
                        </button>

                        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>Your information is safe and secure with us</span>
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Continue to Education</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  )}

                {/* ---------------- STEP 2 FORM: EDUCATION DETAILS (EXACT MATCH TO SCREENSHOTS) ---------------- */}
                {jobSeekerStep === 2 && isBasicDetailsFilled() && (
                  <div>
                    {/* Form Title & Subtitle */}
                    <div className="mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        Education details
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        These details help recruiters identify your background
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleStep2SaveAndContinue();
                      }}
                      className="space-y-6"
                    >
                      {/* 1. Highest qualification/Degree currently pursuing* */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Highest qualification/Degree currently pursuing
                          <span className="text-rose-500">*</span>
                        </label>
                        {educationDetails.highestQualification ? (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                            <span>{educationDetails.highestQualification}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setEducationDetails({
                                  ...educationDetails,
                                  highestQualification: "",
                                })
                              }
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Graduation/Diploma",
                              "Post Graduation/Masters",
                              "Doctorate/PhD",
                              "12th",
                              "10th",
                            ].map((qual) => (
                              <button
                                key={qual}
                                type="button"
                                onClick={() =>
                                  setEducationDetails({
                                    ...educationDetails,
                                    highestQualification: qual,
                                  })
                                }
                                className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-400 bg-white transition-all cursor-pointer"
                              >
                                {qual}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 2. Course* */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Course<span className="text-rose-500">*</span>
                        </label>
                        {/* Course input display box */}
                        <div className="w-full border border-slate-200 rounded-2xl p-2.5 bg-white min-h-[46px] flex items-center">
                          {educationDetails.course ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                              <span>{educationDetails.course}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setEducationDetails({
                                    ...educationDetails,
                                    course: "",
                                  })
                                }
                                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder="Eg. B.Tech"
                              value={educationDetails.course}
                              onChange={(e) =>
                                setEducationDetails({
                                  ...educationDetails,
                                  course: e.target.value,
                                })
                              }
                              className="w-full px-2 text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                            />
                          )}
                        </div>

                        {/* Suggestions */}
                        <div className="mt-2.5">
                          <span className="text-[11px] font-medium text-slate-400 block mb-2">
                            Suggestions
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {COURSE_SUGGESTIONS.map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() =>
                                  setEducationDetails({
                                    ...educationDetails,
                                    course: item,
                                  })
                                }
                                className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${educationDetails.course === item
                                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                    : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                                  }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3. Course type* */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Course type<span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {["Full Time", "Part Time", "Distance Learning"].map(
                            (type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  setEducationDetails({
                                    ...educationDetails,
                                    courseType: type,
                                  })
                                }
                                className={`px-4 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1.5 ${educationDetails.courseType === type
                                    ? "border-slate-400 bg-slate-100 text-slate-800 font-semibold"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                                  }`}
                              >
                                <span>{type}</span>
                                {educationDetails.courseType === type && (
                                  <X className="w-3 h-3 text-slate-400" />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* 4. Specialization* */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Specialization<span className="text-rose-500">*</span>
                        </label>
                        <div className="w-full border border-slate-200 rounded-2xl p-2.5 bg-white min-h-[46px] flex items-center">
                          {educationDetails.specialization ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                              <span>{educationDetails.specialization}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setEducationDetails({
                                    ...educationDetails,
                                    specialization: "",
                                  })
                                }
                                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder="Eg. Computer Science and Engineering"
                              value={educationDetails.specialization}
                              onChange={(e) =>
                                setEducationDetails({
                                  ...educationDetails,
                                  specialization: e.target.value,
                                })
                              }
                              className="w-full px-2 text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                            />
                          )}
                        </div>

                        {/* Suggestions */}
                        <div className="mt-2.5">
                          <span className="text-[11px] font-medium text-slate-400 block mb-2">
                            Suggestions
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {SPECIALIZATION_SUGGESTIONS.map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() =>
                                  setEducationDetails({
                                    ...educationDetails,
                                    specialization: item,
                                  })
                                }
                                className={`px-3 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer ${educationDetails.specialization === item
                                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                                  }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 5. University / Institute* (Search input with magnifying glass & error state) */}
                      <div className="relative">
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          University / Institute
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Eg. Delhi University, Mumbai University, AKTU..."
                            value={educationDetails.university}
                            onFocus={() => setShowUnivDropdown(true)}
                            onChange={(e) => {
                              setEducationDetails({
                                ...educationDetails,
                                university: e.target.value,
                              });
                              if (universityError) setUniversityError(false);
                            }}
                            className={`w-full pl-4 pr-10 py-2.5 bg-white border rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none transition-all ${universityError
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                                : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                              }`}
                          />
                          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Validation Error Message matching Screenshot */}
                        {universityError && (
                          <p className="text-[11px] text-rose-500 mt-1 font-medium">
                            Please enter university/institute Name
                          </p>
                        )}

                        {/* University Dropdown Suggestions */}
                        {showUnivDropdown && (
                          <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto p-1.5">
                            {UNIVERSITY_SUGGESTIONS.filter((u) =>
                              u
                                .toLowerCase()
                                .includes(
                                  educationDetails.university.toLowerCase()
                                )
                            ).map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setEducationDetails({
                                    ...educationDetails,
                                    university: item,
                                  });
                                  setShowUnivDropdown(false);
                                  setUniversityError(false);
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors cursor-pointer"
                              >
                                {item}
                              </button>
                            ))}
                            <div className="p-1 border-t border-slate-100 text-right">
                              <button
                                type="button"
                                onClick={() => setShowUnivDropdown(false)}
                                className="text-[11px] text-slate-400 hover:text-slate-600 px-2 py-0.5 cursor-pointer"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 6. Starting year* */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Starting year<span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Eg. 2026"
                          value={educationDetails.startingYear}
                          onChange={(e) =>
                            setEducationDetails({
                              ...educationDetails,
                              startingYear: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                        {/* Suggestion Pills */}
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {STARTING_YEAR_SUGGESTIONS.map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() =>
                                setEducationDetails({
                                  ...educationDetails,
                                  startingYear: year,
                                })
                              }
                              className={`px-3.5 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer ${educationDetails.startingYear === year
                                  ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                  : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                                }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 7. Passing year* */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Passing year<span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Eg. 2026"
                          value={educationDetails.passingYear}
                          onChange={(e) =>
                            setEducationDetails({
                              ...educationDetails,
                              passingYear: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                        {/* Suggestion Pills */}
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {PASSING_YEAR_SUGGESTIONS.map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() =>
                                setEducationDetails({
                                  ...educationDetails,
                                  passingYear: year,
                                })
                              }
                              className={`px-3.5 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer ${educationDetails.passingYear === year
                                  ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                  : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                                }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 8. Grading System* */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Grading System<span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Select grading system"
                          value={educationDetails.gradingSystem}
                          onChange={(e) =>
                            setEducationDetails({
                              ...educationDetails,
                              gradingSystem: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />

                        {/* Suggestions */}
                        <div className="mt-2.5">
                          <span className="text-[11px] font-medium text-slate-400 block mb-2">
                            Suggestions
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {GRADING_SYSTEM_SUGGESTIONS.map((system) => (
                              <button
                                key={system}
                                type="button"
                                onClick={() =>
                                  setEducationDetails({
                                    ...educationDetails,
                                    gradingSystem: system,
                                  })
                                }
                                className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${educationDetails.gradingSystem === system
                                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                    : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                                  }`}
                              >
                                {system}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 9. Key skills* (Box with placeholder and red validation text) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Key skills<span className="text-rose-500">*</span>
                        </label>

                        {/* Skills Container Box */}
                        <div
                          className={`w-full min-h-[96px] p-3 rounded-2xl border bg-white transition-all flex flex-col justify-between ${skillsError
                              ? "border-rose-400 ring-1 ring-rose-100"
                              : "border-slate-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-100"
                            }`}
                        >
                          <div className="flex flex-wrap gap-2 mb-2">
                            {educationDetails.keySkills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Key skills are crucial for recruiters to hire you"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === ",") {
                                  e.preventDefault();
                                  handleAddSkill(skillInput);
                                }
                              }}
                              className="w-full text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                            />
                            {skillInput && (
                              <button
                                type="button"
                                onClick={() => handleAddSkill(skillInput)}
                                className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0 cursor-pointer"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Validation Error Message matching Screenshot */}
                        {skillsError && (
                          <p className="text-[11px] text-rose-500 mt-1 font-medium">
                            Please specify atleast one key skill
                          </p>
                        )}

                        {/* Popular Skills Suggestions */}
                        <div className="mt-2.5">
                          <span className="text-[11px] font-medium text-slate-400 block mb-2">
                            Popular skills
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {POPULAR_SKILLS.map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => handleAddSkill(item)}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${educationDetails.keySkills.includes(item)
                                    ? "bg-slate-100 border-slate-300 text-slate-400"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                              >
                                + {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Back, Skip for now, Save and continue */}
                      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleNavigateToStep(1)}
                          className="py-2.5 px-5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                        >
                          ← Back
                        </button>

                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={handleStep2Skip}
                            className="py-2.5 px-5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Skip for now</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          <button
                            type="submit"
                            className="py-2.5 px-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                          >
                            Save and continue
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* ---------------- STEP 3 FORM: LAST STEP (PREFERENCES & FINISH) ---------------- */}
                {jobSeekerStep === 3 && isBasicDetailsFilled() && (
                  <div>
                    <div className="mb-7">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        Last step
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Tell us your career preferences to get customized job alerts
                      </p>
                    </div>

                    <form onSubmit={handleFinalSubmit} className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Preferred Job Role / Domain
                          <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={lastStepDetails.targetRole}
                          onChange={(e) =>
                            setLastStepDetails({
                              ...lastStepDetails,
                              targetRole: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
                        >
                          <option value="Frontend Developer">
                            Frontend Developer
                          </option>
                          <option value="Backend Developer">
                            Backend Developer
                          </option>
                          <option value="Full Stack Developer">
                            Full Stack Developer
                          </option>
                          <option value="UI/UX Designer">
                            UI/UX Designer
                          </option>
                          <option value="DevOps Engineer">
                            DevOps Engineer
                          </option>
                          <option value="Data Analyst">Data Analyst</option>
                          <option value="Product Manager">
                            Product Manager
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Preferred Job Location
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Noida, Delhi NCR, Bengaluru, Remote"
                          value={lastStepDetails.preferredLocation}
                          onChange={(e) =>
                            setLastStepDetails({
                              ...lastStepDetails,
                              preferredLocation: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          Expected CTC / Annual Salary
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["₹3 - 5 LPA", "₹5 - 8 LPA", "₹8 - 12 LPA", "₹12+ LPA"].map(
                            (salary) => (
                              <button
                                key={salary}
                                type="button"
                                onClick={() =>
                                  setLastStepDetails({
                                    ...lastStepDetails,
                                    expectedSalary: salary,
                                  })
                                }
                                className={`px-4 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${lastStepDetails.expectedSalary === salary
                                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                                  }`}
                              >
                                {salary}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Summary Box */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                        <p className="font-bold text-slate-800">
                          Profile Ready for Review:
                        </p>
                        <p>
                          Candidate:{" "}
                          <span className="font-semibold text-slate-900">
                            {basicDetails.fullName || "Candidate"}
                          </span>{" "}
                          ({basicDetails.email || "No email"})
                        </p>
                        <p>
                          Qualification:{" "}
                          <span className="font-semibold text-slate-900">
                            {educationDetails.course} ({educationDetails.specialization})
                          </span>
                        </p>
                        <p>
                          University:{" "}
                          <span className="font-semibold text-slate-900">
                            {educationDetails.university || "Not provided"}
                          </span>
                        </p>
                        <p>
                          Key Skills:{" "}
                          <span className="font-semibold text-slate-900">
                            {educationDetails.keySkills.length > 0
                              ? educationDetails.keySkills.join(", ")
                              : "None"}
                          </span>
                        </p>
                      </div>

                      {/* Final Submit Buttons: Back, Skip for now, Complete Registration */}
                      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleNavigateToStep(2)}
                          className="py-2.5 px-5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                        >
                          ← Back
                        </button>

                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleFinalSubmit()}
                            disabled={isLoading}
                            className="py-2.5 px-5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                          >
                            Skip for now
                          </button>

                          <button
                            type="submit"
                            disabled={isLoading}
                            className="py-2.5 px-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <span>Creating your account...</span>
                            ) : (
                              <>
                                <span>Complete Registration</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------- 3. RIGHT SIDE ART (IMAGE 1) ---------------- */}
            <div className="hidden lg:flex w-[230px] xl:w-[260px] shrink-0 flex-col pt-4 select-none sticky top-24 h-[520px] justify-between">
              {/* Team Avatar Bubble Badge */}
              <div className="self-end mr-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100/90 flex items-center justify-center text-blue-500 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Stylized Building Silhouette Outline */}
              <div className="absolute top-10 right-2 opacity-25 pointer-events-none">
                <svg className="w-44 h-60 text-blue-500" viewBox="0 0 100 140" fill="currentColor">
                  <path d="M10 140 L10 35 L45 10 L80 35 L80 140 Z" />
                  <rect x="20" y="45" width="8" height="10" rx="1.5" fill="#eff6ff" />
                  <rect x="36" y="45" width="8" height="10" rx="1.5" fill="#eff6ff" />
                  <rect x="52" y="45" width="8" height="10" rx="1.5" fill="#eff6ff" />
                  <rect x="20" y="65" width="8" height="10" rx="1.5" fill="#eff6ff" />
                  <rect x="36" y="65" width="8" height="10" rx="1.5" fill="#eff6ff" />
                  <rect x="52" y="65" width="8" height="10" rx="1.5" fill="#eff6ff" />
                  <rect x="20" y="85" width="8" height="10" rx="1.5" fill="#eff6ff" />
                  <rect x="36" y="85" width="8" height="10" rx="1.5" fill="#eff6ff" />
                  <rect x="52" y="85" width="8" height="10" rx="1.5" fill="#eff6ff" />
                </svg>
              </div>

              {/* Floating Briefcase Badge */}
              <div className="self-center mt-12 relative z-10">
                <div className="w-16 h-14 rounded-2xl bg-white/95 border border-blue-100 shadow-[0_8px_25px_rgba(37,99,235,0.08)] flex items-center justify-center text-blue-500 transform rotate-6">
                  <Briefcase className="w-7 h-7" />
                </div>
              </div>

              {/* Script / Cursive: "Your Career Matters" */}
              <div className="self-end mt-auto text-right select-none pr-3 pb-2">
                <span
                  style={{ fontFamily: "Georgia, cursive" }}
                  className="text-2xl xl:text-3xl font-medium text-blue-400 italic tracking-wider block"
                >
                  Your Career
                </span>
                <span
                  style={{ fontFamily: "Georgia, cursive" }}
                  className="text-3xl xl:text-4xl font-bold text-blue-500 italic tracking-wide block -mt-1"
                >
                  Matters
                </span>
              </div>
            </div>
          </div>
        ) : (
            /* ================= EMPLOYER / COMPANY SIGNUP ================= */
            <div className="max-w-xl mx-auto w-full bg-white rounded-3xl sm:rounded-[32px] border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-6 sm:p-10 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Employer / Company Registration
                  </h2>
                  <p className="text-xs text-slate-500">
                    Post job openings to over 50,000+ candidates
                  </p>
                </div>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Tech Pvt Ltd"
                      value={companyForm.companyName}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Work Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="hr@acme.com"
                      value={companyForm.workEmail}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          workEmail: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact / Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={companyForm.phone}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GST Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="29AAAAA0000A1Z5"
                      value={companyForm.gstNumber}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          gstNumber: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm uppercase font-mono text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Create Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={companyForm.password}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span>Registering company...</span>
                    ) : (
                      <>
                        <span>Complete Employer Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )
        )}
      </main>

      {/* ================= FOOTER (MATCHING EXACTLY IMAGE 5) ================= */}
      {/* <footer className="w-full py-8 mt-auto border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-blue-600 font-medium mb-3">
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <Link href="/about" className="hover:underline">
              Contact Us
            </Link>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <a href="#" className="hover:underline">
              FAQs
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <a href="#" className="hover:underline">
              Terms and Conditions
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <a href="#" className="hover:underline">
              Report a Problem
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
          <p className="text-[11px] text-slate-400">
            All rights reserved © 2026 Info Edge India Ltd. / Addy Job Ltd.
          </p>
        </div>
      </footer> */}
    </div>
  );
}

export default function SignupPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading registration...
        </div>
      }
    >
      <SignupContent />
    </React.Suspense>
  );
}
