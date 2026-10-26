import { create } from 'zustand';

export interface User {
  id: string;
  _id?: string;
  name: string;
  role: string;
  registrationNumber: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  batch?: string;
  residenceType?: string;
  department?: string;
  year?: string;
  accumulatedHours?: number;
  bunks?: number;
  certificates?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const normalizeUser = (u: any): User | null => {
  if (!u) return null;
  const uid = (u._id || u.id || '').toString();
  return {
    ...u,
    _id: uid,
    id: uid,
  };
};

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false };
  }
  try {
    // 1. Check persistent localStorage first (keeps volunteer logged in forever)
    const localToken = localStorage.getItem('token');
    const localUser = localStorage.getItem('user');

    if (localToken && localUser) {
      const user = normalizeUser(JSON.parse(localUser));
      return {
        token: localToken,
        user,
        isAuthenticated: true
      };
    }

    // 2. Fall back to sessionStorage (for admin tabs)
    const sessionToken = sessionStorage.getItem('token');
    const sessionUser = sessionStorage.getItem('user');
    const user = sessionUser ? normalizeUser(JSON.parse(sessionUser)) : null;

    return {
      token: sessionToken,
      user,
      isAuthenticated: !!(sessionToken && user)
    };
  } catch (e) {
    return { user: null, token: null, isAuthenticated: false };
  }
};

const initialState = getInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  token: initialState.token,
  isAuthenticated: initialState.isAuthenticated,
  login: (user, token) => {
    const normalized = normalizeUser(user);
    if (typeof window !== 'undefined') {
      // If volunteer or standard member, save to localStorage so they stay logged in permanently
      if (!normalized?.role || normalized.role === 'VOLUNTEER') {
        localStorage.setItem('token', token);
        if (normalized) {
          localStorage.setItem('user', JSON.stringify(normalized));
        }
      } else {
        // Admin: session storage
        sessionStorage.setItem('token', token);
        if (normalized) {
          sessionStorage.setItem('user', JSON.stringify(normalized));
        }
      }
    }
    set({ user: normalized, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => {
    const normalized = normalizeUser(user);
    if (typeof window !== 'undefined' && normalized) {
      if (localStorage.getItem('token')) {
        localStorage.setItem('user', JSON.stringify(normalized));
      }
      if (sessionStorage.getItem('token')) {
        sessionStorage.setItem('user', JSON.stringify(normalized));
      }
    }
    set({ user: normalized });
  },
}));
