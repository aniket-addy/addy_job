export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface UserSession {
  id: string;
  userId?: string;
  customId?: string;
  email: string;
  role: 'job_seeker' | 'company' | 'admin';
  name: string;
  headline?: string;
  bio?: string;
  languages?: string;
  targetRole?: string;
  experience?: string;
  education?: string;
  highestQualification?: string;
  course?: string;
  courseType?: string;
  specialization?: string;
  university?: string;
  startingYear?: string;
  passingYear?: string;
  gradingSystem?: string;
  gradeScore?: string;
  skills?: string[];
  workStatus?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  resumeName?: string;
  resumeDate?: string;
  resumeUrl?: string;
  appliedJobsCount?: number;
  savedJobsCount?: number;
  interviewsCount?: number;
  profileViewsCount?: number;
  companyName?: string;
  workEmail?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  phone?: string;
  gstNumber?: string;
  status?: string;
  plan?: string;
  permissions?: any;
  purchasedResumes?: any[];
  resumeCredits?: number;
  resumesUsed?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserSession;
}

// Store session in localStorage
export const setAuthSession = (token: string, user: UserSession) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('career_token', token);
    localStorage.setItem('career_user', JSON.stringify(user));
    window.dispatchEvent(new Event('auth_change'));
  }
};

// Clear session
export const clearAuthSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('career_token');
    localStorage.removeItem('career_user');
    localStorage.removeItem('company_profile_data');
    localStorage.removeItem('company_active_plan');
    localStorage.removeItem('company_posted_jobs');
    localStorage.removeItem('company_applicants_data');
    localStorage.removeItem('company_purchased_resumes');
    localStorage.removeItem('company_permissions_active');
    sessionStorage.clear();

    // Expire cookies
    document.cookie = 'career_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'career_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    window.dispatchEvent(new Event('auth_change'));
    window.dispatchEvent(new Event('storage'));
  }
};


// Get stored user from localStorage
export const getStoredUser = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('career_user');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Get token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('career_token');
};

// Register API call
export async function registerUser(payload: {
  role: 'job_seeker' | 'company';
  email: string;
  password?: string;
  fullName?: string;
  name?: string;
  targetRole?: string;
  experience?: string;
  highestQualification?: string;
  course?: string;
  courseType?: string;
  specialization?: string;
  university?: string;
  startingYear?: string;
  passingYear?: string;
  gradingSystem?: string;
  gradeScore?: string;
  skills?: string[];
  workStatus?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  companyName?: string;
  workEmail?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  phone?: string;
  gstNumber?: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'Registration failed. Please try again.',
      };
    }

    return data;
  } catch (error: any) {
    console.error('API register error:', error);
    return {
      success: false,
      message: 'Unable to connect to the backend server. Please make sure the server is running on port 5000.',
    };
  }
}

// Login API call
export async function loginUser(payload: {
  email: string;
  password: string;
  role?: 'job_seeker' | 'company' | 'admin';
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'Invalid email or password.',
      };
    }

    return data;
  } catch (error: any) {
    console.error('API login error:', error);
    return {
      success: false,
      message: 'Unable to connect to the backend server. Please verify backend server is running.',
    };
  }
}

// Get me API call
export async function fetchCurrentUser(): Promise<UserSession | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      clearAuthSession();
      return null;
    }

    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

// Update User Profile API call
export async function updateUserProfile(
  payload: Partial<UserSession>
): Promise<{ success: boolean; message: string; user?: UserSession }> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, message: 'You are not logged in.' };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update profile.',
      };
    }

    if (data.user) {
      setAuthSession(token, data.user);
    }

    return data;
  } catch (error: any) {
    console.error('API update profile error:', error);
    return {
      success: false,
      message: 'Failed to update profile. Please verify network connection.',
    };
  }
}

// ================= SUPER ADMIN APIs =================

export interface AdminOverviewStats {
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
  rejectedCompanies: number;
  totalJobs: number;
  activeJobs: number;
  expiredJobs: number;
  totalApplications: number;
  totalCandidates: number;
  plansCount: number;
  totalRevenue: string;
}

export async function fetchAdminOverview(): Promise<AdminOverviewStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/overview`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('fetchAdminOverview error:', error);
    return null;
  }
}

export async function fetchAdminCompanies(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/companies`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.companies || [];
  } catch (error) {
    console.error('fetchAdminCompanies error:', error);
    return [];
  }
}

export async function updateCompanyStatus(
  id: string,
  status: 'Approved' | 'Rejected' | 'Pending'
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/companies/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error: any) {
    console.error('updateCompanyStatus error:', error);
    return { success: false, message: 'Failed to update status in database' };
  }
}

export async function deleteAdminCompany(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/companies/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error: any) {
    console.error('deleteAdminCompany error:', error);
    return { success: false, message: 'Failed to delete company' };
  }
}

export interface JobSeekerRecord {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  headline?: string;
  targetRole?: string;
  experience?: string;
  location?: string;
  highestQualification?: string;
  course?: string;
  courseType?: string;
  specialization?: string;
  university?: string;
  startingYear?: string;
  passingYear?: string;
  gradingSystem?: string;
  gradeScore?: string;
  skills?: string[];
  languages?: string;
  workStatus?: string;
  expectedSalary?: string;
  resumeName?: string;
  resumeDate?: string;
  resumeUrl?: string;
  status?: string;
  registeredOn?: string;
  avatarBg?: string;
  avatarLetter?: string;
}

export async function fetchAdminJobSeekers(): Promise<JobSeekerRecord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/jobseekers`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.jobSeekers || [];
  } catch (error) {
    console.error('fetchAdminJobSeekers error:', error);
    return [];
  }
}

export async function deleteAdminJobSeeker(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/jobseekers/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error: any) {
    console.error('deleteAdminJobSeeker error:', error);
    return { success: false, message: 'Failed to delete candidate' };
  }
}

export async function fetchAdminJobs(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/jobs`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.jobs || [];
  } catch (error) {
    console.error('fetchAdminJobs error:', error);
    return [];
  }
}

// Create a new job posting on the backend
export async function createCompanyJob(jobData: any): Promise<{ success: boolean; message: string; job?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    const data = await res.json();
    if (data.success && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('job_created'));
      window.dispatchEvent(new Event('storage'));
    }
    return data;
  } catch (error: any) {
    console.error('createCompanyJob error:', error);
    return { success: false, message: error.message || 'Failed to post job' };
  }
}

// Fetch jobs for a specific company or all jobs
export async function fetchCompanyJobs(params?: { companyId?: string; company?: string }): Promise<any[]> {
  try {
    const query = new URLSearchParams();
    if (params?.companyId) query.set("companyId", params.companyId);
    if (params?.company) query.set("company", params.company);
    const qs = query.toString();
    const url = qs ? `${API_BASE_URL}/jobs?${qs}` : `${API_BASE_URL}/jobs`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return json.jobs || [];
  } catch (error) {
    console.error('fetchCompanyJobs error:', error);
    return [];
  }
}

// Update existing job posting details
export async function updateCompanyJob(id: string, jobData: any): Promise<{ success: boolean; message: string; job?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    const data = await res.json();
    if (data.success && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('job_updated'));
      window.dispatchEvent(new Event('storage'));
    }
    return data;
  } catch (error: any) {
    console.error('updateCompanyJob error:', error);
    return { success: false, message: error.message || 'Failed to update job' };
  }
}

// Update job status (Active, Paused, Closed, Expired)
export async function updateCompanyJobStatus(id: string, status: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('job_updated'));
      window.dispatchEvent(new Event('storage'));
    }
    return data;
  } catch (error: any) {
    console.error('updateCompanyJobStatus error:', error);
    return { success: false, message: 'Failed to update job status' };
  }
}

// Delete job posting
export async function deleteCompanyJob(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('job_updated'));
      window.dispatchEvent(new Event('storage'));
    }
    return data;
  } catch (error: any) {
    console.error('deleteCompanyJob error:', error);
    return { success: false, message: 'Failed to delete job' };
  }
}

export async function updateAdminJobStatus(
  id: string,
  status: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/jobs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error: any) {
    console.error('updateAdminJobStatus error:', error);
    return { success: false, message: 'Failed to update job status' };
  }
}

export async function deleteAdminJob(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/jobs/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error: any) {
    console.error('deleteAdminJob error:', error);
    return { success: false, message: 'Failed to delete job' };
  }
}

export async function fetchAdminApplications(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/applications`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.applications || [];
  } catch (error) {
    console.error('fetchAdminApplications error:', error);
    return [];
  }
}

export async function updateAdminApplicationStatus(
  id: string,
  status: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error: any) {
    console.error('updateAdminApplicationStatus error:', error);
    return { success: false, message: 'Failed to update application status' };
  }
}

export async function createAdminApplication(payload: {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  position?: string;
  company?: string;
  domain: string;
  experience: string;
  skills?: string[];
  pdfData?: string;
  fileName?: string;
  status?: string;
  resumeUrl?: string;
}): Promise<{ success: boolean; message: string; application?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error: any) {
    console.error('createAdminApplication error:', error);
    return { success: false, message: 'Failed to upload resume' };
  }
}

export async function fetchAdminPlans(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/plans`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.plans || [];
  } catch (error) {
    console.error('fetchAdminPlans error:', error);
    return [];
  }
}

export async function createAdminPlan(payload: {
  name: string;
  price: string;
  yearlyPrice?: string;
  billingCycle?: string;
  features?: string[];
  credits?: number;
  status?: string;
}): Promise<{ success: boolean; message: string; plan?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error: any) {
    console.error('createAdminPlan error:', error);
    return { success: false, message: 'Failed to create plan' };
  }
}

export async function updateAdminPlan(
  id: string,
  payload: {
    name?: string;
    price?: string;
    yearlyPrice?: string;
    billingCycle?: string;
    features?: string[];
    credits?: number;
    status?: string;
  }
): Promise<{ success: boolean; message: string; plan?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error: any) {
    console.error('updateAdminPlan error:', error);
    return { success: false, message: 'Failed to update plan' };
  }
}

export async function deleteAdminPlan(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/plans/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error: any) {
    console.error('deleteAdminPlan error:', error);
    return { success: false, message: 'Failed to delete plan' };
  }
}

// ==========================================
// COMPANY PERMISSIONS & AUTO-APPROVAL SYSTEM
// ==========================================

export interface CompanyPermissions {
  dashboard: boolean;
  jobs: boolean;
  applicants: boolean;
  resumes: boolean;
  settings: boolean;
  autoApproveFromSubscription?: boolean;
}

export const DEFAULT_COMPANY_PERMISSIONS: CompanyPermissions = {
  dashboard: false,
  jobs: false,
  applicants: false,
  resumes: false,
  settings: false,
  autoApproveFromSubscription: true,
};

// Plan auto-approval standard rules
export const PLAN_AUTO_PERMISSIONS: Record<string, Partial<CompanyPermissions>> = {
  'Basic Plan': {
    dashboard: false,
    jobs: true,
    applicants: true,
    resumes: false,
    settings: false,
  },
  'Pro Plan': {
    dashboard: true,
    jobs: true,
    applicants: true,
    resumes: true,
    settings: false,
  },
  'Enterprise': {
    dashboard: true,
    jobs: true,
    applicants: true,
    resumes: true,
    settings: true,
  },
};

export async function updateCompanyPermissions(
  id: string,
  permissions: Partial<CompanyPermissions>,
  extra?: { name?: string; email?: string; plan?: string }
): Promise<{ success: boolean; message: string; permissions?: CompanyPermissions; company?: any; plan?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/companies/${id}/permissions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        permissions,
        name: extra?.name,
        email: extra?.email,
        plan: extra?.plan,
      }),
    });
    const json = await res.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem(`company_permissions_${id}`, JSON.stringify(permissions));
      if (extra?.email) {
        localStorage.setItem(`company_permissions_${extra.email.toLowerCase()}`, JSON.stringify(permissions));
      }
      if (json.company?.id) {
        localStorage.setItem(`company_permissions_${json.company.id}`, JSON.stringify(permissions));
      }
      if (extra?.plan) {
        localStorage.setItem('company_active_plan', extra.plan);
        const storedUser = getStoredUser();
        if (storedUser) {
          localStorage.setItem('career_user', JSON.stringify({ ...storedUser, plan: extra.plan, permissions }));
        }
      }
      window.dispatchEvent(new Event('company_permissions_updated'));
      window.dispatchEvent(new Event('storage'));
    }
    return json;
  } catch (error: any) {
    console.error('updateCompanyPermissions error:', error);
    return { success: false, message: 'Failed to update company permissions' };
  }
}

export async function fetchAdminPermissionsSettings(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/permissions-settings`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.settings || null;
  } catch (error) {
    console.error('fetchAdminPermissionsSettings error:', error);
    return null;
  }
}

export async function updateAdminPermissionsSettings(settings: any): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/permissions-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    return await res.json();
  } catch (error: any) {
    console.error('updateAdminPermissionsSettings error:', error);
    return { success: false, message: 'Failed to update permissions settings' };
  }
}

// Helper to get matching plan rule safely
export function getMatchingPlanRule(planName?: string): Partial<CompanyPermissions> | undefined {
  if (!planName) return undefined;
  const p = planName.trim().toLowerCase();

  // 1. Direct key match or substring match from PLAN_AUTO_PERMISSIONS
  for (const [key, rule] of Object.entries(PLAN_AUTO_PERMISSIONS)) {
    const k = key.trim().toLowerCase();
    if (p === k || p.includes(k) || k.includes(p)) {
      return rule;
    }
  }

  // 2. Fallbacks based on standard tiers
  if (p.includes('starter') || p.includes('basic')) return PLAN_AUTO_PERMISSIONS['Basic Plan'];
  if (p.includes('growth') || p.includes('pro')) return PLAN_AUTO_PERMISSIONS['Pro Plan'];
  if (p.includes('enterprise')) return PLAN_AUTO_PERMISSIONS['Enterprise'];
  return undefined;
}

// Sync global permission settings from server or localStorage
export async function syncGlobalPermissionsRules(): Promise<Record<string, Partial<CompanyPermissions>>> {
  // First sync from localStorage if available
  if (typeof window !== 'undefined') {
    const cachedSettings = localStorage.getItem('addyjob_permissions_settings');
    if (cachedSettings) {
      try {
        const parsed = JSON.parse(cachedSettings);
        if (parsed.planRules) {
          Object.keys(parsed.planRules).forEach((k) => {
            PLAN_AUTO_PERMISSIONS[k] = parsed.planRules[k];
          });
        }
      } catch (e) {}
    }
  }

  // Then fetch authoritative settings from backend
  try {
    const remote = await fetchAdminPermissionsSettings();
    if (remote?.planRules) {
      Object.keys(remote.planRules).forEach((k) => {
        PLAN_AUTO_PERMISSIONS[k] = remote.planRules[k];
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('addyjob_permissions_settings', JSON.stringify(remote));
        window.dispatchEvent(new Event('company_permissions_updated'));
      }
    }
  } catch (e) {
    console.warn('syncGlobalPermissionsRules failed:', e);
  }
  return PLAN_AUTO_PERMISSIONS;
}

export function getEffectiveCompanyPermissions(company?: {
  id?: string;
  plan?: string;
  permissions?: Partial<CompanyPermissions>;
} | null): CompanyPermissions {
  // Base default: all feature tabs disabled (only profile & subscription are always accessible)
  let result: CompanyPermissions = { ...DEFAULT_COMPANY_PERMISSIONS };

  if (typeof window !== 'undefined') {
    // Ensure PLAN_AUTO_PERMISSIONS incorporates any saved settings from localStorage
    const cachedSettings = localStorage.getItem('addyjob_permissions_settings');
    if (cachedSettings) {
      try {
        const parsed = JSON.parse(cachedSettings);
        if (parsed.planRules) {
          Object.keys(parsed.planRules).forEach((k) => {
            PLAN_AUTO_PERMISSIONS[k] = parsed.planRules[k];
          });
        }
      } catch (e) {}
    }

    // 1. Check if there are local overrides for this company
    const localKey = company?.id ? `company_permissions_${company.id}` : 'company_permissions_active';
    const cached = localStorage.getItem(localKey);
    let cachedPerms: Partial<CompanyPermissions> | null = null;
    if (cached) {
      try {
        cachedPerms = JSON.parse(cached);
      } catch (e) {}
    }

    const currentPermissions = {
      ...(company?.permissions || {}),
      ...(cachedPerms || {}),
    };

    const autoApprove = currentPermissions.autoApproveFromSubscription !== false;
    const activePlan = company?.plan || localStorage.getItem('company_active_plan') || undefined;

    // 2. If auto-approval is enabled, apply plan permissions
    if (autoApprove && activePlan) {
      const planRule = getMatchingPlanRule(activePlan);
      if (planRule) {
        result = { ...result, ...planRule };
      }
    }

    // 3. Apply manual overrides
    result = {
      ...result,
      ...currentPermissions,
      autoApproveFromSubscription: autoApprove,
    };
    return result;
  }

  // Fallback for SSR
  if (company?.permissions) {
    result = { ...result, ...company.permissions };
  }
  return result;
}

// ================= PUBLIC JOBS & COMPANIES APIs =================

export async function fetchPublicJobs(params?: Record<string, string>): Promise<any[]> {
  try {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE_URL}/jobs${query}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.jobs || [];
  } catch (error) {
    console.error('fetchPublicJobs error:', error);
    return [];
  }
}

export async function fetchPublicJobById(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.job || null;
  } catch (error) {
    console.error('fetchPublicJobById error:', error);
    return null;
  }
}

export async function createPublicJob(payload: any): Promise<{ success: boolean; message: string; job?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error: any) {
    console.error('createPublicJob error:', error);
    return { success: false, message: 'Failed to post job to database' };
  }
}

export async function fetchPublicCompanies(params?: Record<string, string>): Promise<any[]> {
  try {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE_URL}/companies${query}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.companies || [];
  } catch (error) {
    console.error('fetchPublicCompanies error:', error);
    return [];
  }
}

export async function fetchPublicCompanyById(id: string): Promise<{ company: any; jobs: any[] } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('fetchPublicCompanyById error:', error);
    return null;
  }
}

// ================= CANDIDATE APPLICATIONS & SAVED JOBS =================

export async function submitJobApplication(jobId: string, payload: any): Promise<{ success: boolean; message: string; application?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    console.error('submitJobApplication error:', err);
    return { success: false, message: 'Could not connect to application service.' };
  }
}

export async function fetchCandidateApplicationsFromDB(email?: string): Promise<any[]> {
  try {
    if (!email) return [];
    const res = await fetch(`${API_BASE_URL}/jobs/applied/candidate?email=${encodeURIComponent(email)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.applications || [];
  } catch (err) {
    console.error('fetchCandidateApplications error:', err);
    return [];
  }
}

export function getLocalAppliedJobs(uid: string): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`candidate_applied_jobs_${uid}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalAppliedJob(uid: string, jobItem: any): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getLocalAppliedJobs(uid);
    const existingIdx = current.findIndex((j: any) => (j.id || j.jobId) === (jobItem.id || jobItem.jobId));
    let updated;
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...jobItem };
    } else {
      updated = [jobItem, ...current];
    }
    localStorage.setItem(`candidate_applied_jobs_${uid}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('applied_jobs_change'));
    return updated;
  } catch {
    return [];
  }
}

export function getLocalSavedJobs(uid: string): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`candidate_saved_jobs_${uid}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleLocalSavedJob(uid: string, jobItem: any): { saved: boolean; list: any[] } {
  if (typeof window === 'undefined') return { saved: false, list: [] };
  try {
    const current = getLocalSavedJobs(uid);
    const jId = jobItem.id || jobItem._id || jobItem.jobId;
    const exists = current.some((j: any) => (j.id || j._id || j.jobId) === jId);
    let updated;
    let saved;
    if (exists) {
      updated = current.filter((j: any) => (j.id || j._id || j.jobId) !== jId);
      saved = false;
    } else {
      updated = [jobItem, ...current];
      saved = true;
    }
    localStorage.setItem(`candidate_saved_jobs_${uid}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('saved_jobs_change'));
    return { saved, list: updated };
  } catch {
    return { saved: false, list: [] };
  }
}

export function getLocalCandidateMessages(uid: string): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`candidate_messages_${uid}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCandidateMessages(uid: string, messages: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`candidate_messages_${uid}`, JSON.stringify(messages));
    window.dispatchEvent(new Event('messages_change'));
  } catch {}
}

// Bulk send candidate resumes to a company
export async function sendBulkResumesToCompany(
  companyId: string,
  resumes: any[]
): Promise<{
  success: boolean;
  message: string;
  sentResumesCount?: number;
  company?: any;
  purchasedResumes?: any[];
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/resumes/bulk-send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId, resumes }),
    });
    const data = await res.json();

    // Sync to localStorage for instant reactivity in any open dashboard tab
    if (typeof window !== 'undefined' && data.success) {
      const storageKey = `company_purchased_resumes_${companyId}`;
      const existingStr = localStorage.getItem(storageKey);
      let existing: any[] = [];
      if (existingStr) {
        try {
          existing = JSON.parse(existingStr);
        } catch (e) {}
      }
      const existingIds = new Set(existing.map((r: any) => r.id));
      const newItems = (data.purchasedResumes || resumes).filter((r: any) => !existingIds.has(r.id)).map((r: any) => ({
        ...r,
        candidateName: r.candidateName || r.name || 'Candidate',
        title: r.title || r.targetRole || r.headline || 'Candidate Profile',
        experience: r.experience || 'Fresher',
        location: r.location || 'India',
        purchasedDate: r.purchasedDate || new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        email: r.email || r.candidateEmail || `${String(r.name || 'candidate').toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: r.phone || r.candidatePhone || '+91 98765 43210',
        skills: Array.isArray(r.skills)
          ? r.skills
          : typeof r.skills === 'string' && r.skills.trim()
          ? r.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : r.specialization
          ? [r.specialization]
          : r.domain
          ? [r.domain]
          : [],
        isUnlocked: Boolean(r.isUnlocked),
        unlockedAt: r.unlockedAt || '',
      }));
      const updatedVault = [...newItems, ...existing];
      localStorage.setItem(storageKey, JSON.stringify(updatedVault));

      // Also unlock resumes permission locally
      const permKey = `company_permissions_${companyId}`;
      const cachedPermStr = localStorage.getItem(permKey);
      let cachedPerm = {};
      if (cachedPermStr) {
        try {
          cachedPerm = JSON.parse(cachedPermStr);
        } catch (e) {}
      }
      localStorage.setItem(permKey, JSON.stringify({ ...cachedPerm, resumes: true }));

      // Dispatch events
      window.dispatchEvent(new Event('purchased_resumes_updated'));
      window.dispatchEvent(new Event('company_permissions_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return data;
  } catch (error: any) {
    console.error('sendBulkResumesToCompany error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send resumes to company',
    };
  }
}
