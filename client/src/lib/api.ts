export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface UserSession {
  id: string;
  email: string;
  role: 'job_seeker' | 'company' | 'admin';
  name: string;
  targetRole?: string;
  experience?: string;
  companyName?: string;
  workEmail?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  phone?: string;
  gstNumber?: string;
  status?: string;
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
    window.dispatchEvent(new Event('auth_change'));
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
