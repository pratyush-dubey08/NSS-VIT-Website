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
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
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
      localStorage.setItem('token', token);
      if (normalized) {
        localStorage.setItem('user', JSON.stringify(normalized));
      }
    }
    set({ user: normalized, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => {
    const normalized = normalizeUser(user);
    if (typeof window !== 'undefined' && normalized) {
      localStorage.setItem('user', JSON.stringify(normalized));
    }
    set({ user: normalized });
  },
}));
