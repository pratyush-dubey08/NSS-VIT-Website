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
    // Clear any stale persistent localStorage so sessions terminate on browser close
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Use sessionStorage: session automatically terminates when tab/browser is closed
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    const user = storedUser ? normalizeUser(JSON.parse(storedUser)) : null;
    return {
      token,
      user,
      isAuthenticated: !!(token && user)
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
      sessionStorage.setItem('token', token);
      if (normalized) {
        sessionStorage.setItem('user', JSON.stringify(normalized));
      }
      // Clean legacy localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
      sessionStorage.setItem('user', JSON.stringify(normalized));
    }
    set({ user: normalized });
  },
}));
