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
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    type?: string;
    read: boolean;
    createdAt: string | Date;
  }>;
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

// Fetch fresh user data from server and sync localStorage
export async function fetchCurrentUser(): Promise<UserSession | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('career_user', JSON.stringify(json.user));
        window.dispatchEvent(new Event('auth_change'));
      }
      return json.user;
    }
    return null;
  } catch (error) {
    console.error('fetchCurrentUser error:', error);
    return null;
  }
}

// Mark notifications as read
export async function markNotificationsAsRead(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/notifications/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (json.success && json.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('career_user', JSON.stringify(json.user));
        window.dispatchEvent(new Event('auth_change'));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

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


