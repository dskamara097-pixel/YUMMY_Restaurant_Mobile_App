import { useContext } from 'react';
import type { User } from '@firebase/auth';

import { AuthenticationContext, AuthenticationContextValue } from '@/contexts/AuthenticationContext';

async function unavailableUser(): Promise<User | null> {
  throw new Error('AuthenticationProvider is not mounted.');
}

async function unavailableVoid(): Promise<void> {
  throw new Error('AuthenticationProvider is not mounted.');
}

const fallbackAuth: AuthenticationContextValue = {
  currentUser: null,
  userId: null,
  email: null,
  displayName: null,
  photoURL: null,
  emailVerified: false,
  role: null,
  loading: false,
  error: null,
  authenticated: false,
  isAuthenticated: false,
  initialized: true,
  isReady: true,
  login: unavailableUser,
  register: unavailableUser,
  logout: unavailableVoid,
  forgotPassword: unavailableVoid,
  verifyEmail: unavailableVoid,
  refreshUser: unavailableUser,
  updateProfile: unavailableUser,
  reauthenticate: unavailableUser,
  deleteAccount: unavailableVoid,
  clearError: () => undefined,
};

export function useAuth() {
  return useContext(AuthenticationContext) ?? fallbackAuth;
}
