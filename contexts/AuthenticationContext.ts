import { createContext } from 'react';
import type { User } from '@firebase/auth';
import type { UserRole } from '@/models/User';

export type AuthRegisterInput = {
  email: string;
  password: string;
  displayName: string;
  photoURL?: string;
};

export type AuthLoginInput = {
  email: string;
  password: string;
};

export type AuthUpdateProfileInput = {
  displayName?: string;
  photoURL?: string;
};

export type AuthenticationContextValue = {
  currentUser: User | null;
  userId: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  isReady: boolean;
  login: (input: AuthLoginInput) => Promise<User | null>;
  register: (input: AuthRegisterInput) => Promise<User | null>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  updateProfile: (input: AuthUpdateProfileInput) => Promise<User | null>;
  reauthenticate: (email: string, password: string) => Promise<User | null>;
  deleteAccount: (options?: { email?: string; password?: string }) => Promise<void>;
  clearError: () => void;
};

export const AuthenticationContext = createContext<AuthenticationContextValue | undefined>(undefined);
