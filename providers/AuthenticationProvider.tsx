import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@firebase/auth';

import {
  AuthLoginInput,
  AuthRegisterInput,
  AuthUpdateProfileInput,
  AuthenticationContext,
  AuthenticationContextValue,
} from '@/contexts/AuthenticationContext';
import {
  deleteCurrentUserAccount,
  loginWithEmailPassword,
  logoutUser,
  reauthenticateCurrentUser,
  refreshCurrentUser,
  registerWithEmailPassword,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  subscribeToAuthState,
  updateCurrentUserProfile,
} from '@/services/authService';
import { getFriendlyFirebaseAuthMessage } from '@/utils/FirebaseErrorHandler';

function readErrorMessage(error: unknown) {
  const firebaseError = error as { code?: string; message?: string };
  return getFriendlyFirebaseAuthMessage(firebaseError.code, firebaseError.message);
}

export function AuthenticationProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
      setInitialized(true);
    });

    return unsubscribe;
  }, []);

  const runAuthAction = useCallback(async <T,>(action: () => Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      return await action();
    } catch (nextError) {
      const message = readErrorMessage(nextError);
      setError(message);
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (input: AuthLoginInput) => runAuthAction(async () => loginWithEmailPassword(input)),
    [runAuthAction],
  );

  const register = useCallback(
    (input: AuthRegisterInput) => runAuthAction(async () => registerWithEmailPassword(input)),
    [runAuthAction],
  );

  const logout = useCallback(
    () => runAuthAction(async () => {
      await logoutUser();
      setCurrentUser(null);
    }),
    [runAuthAction],
  );

  const forgotPassword = useCallback(
    (email: string) => runAuthAction(async () => sendForgotPasswordEmail(email)),
    [runAuthAction],
  );

  const verifyEmail = useCallback(
    () => runAuthAction(async () => sendVerificationEmail()),
    [runAuthAction],
  );

  const refreshUser = useCallback(
    () => runAuthAction(async () => {
      const user = await refreshCurrentUser();
      setCurrentUser(user);
      return user;
    }),
    [runAuthAction],
  );

  const updateProfile = useCallback(
    (input: AuthUpdateProfileInput) => runAuthAction(async () => {
      const user = await updateCurrentUserProfile(input);
      setCurrentUser(user);
      return user;
    }),
    [runAuthAction],
  );

  const reauthenticate = useCallback(
    (email: string, password: string) => runAuthAction(async () => reauthenticateCurrentUser(email, password)),
    [runAuthAction],
  );

  const deleteAccount = useCallback(
    (options?: { email?: string; password?: string }) => runAuthAction(async () => {
      await deleteCurrentUserAccount(options);
      setCurrentUser(null);
    }),
    [runAuthAction],
  );

  const value = useMemo<AuthenticationContextValue>(
    () => ({
      currentUser,
      userId: currentUser?.uid ?? null,
      email: currentUser?.email ?? null,
      displayName: currentUser?.displayName ?? null,
      photoURL: currentUser?.photoURL ?? null,
      emailVerified: currentUser?.emailVerified ?? false,
      role: currentUser ? 'customer' : null,
      loading,
      error,
      authenticated: Boolean(currentUser),
      isAuthenticated: Boolean(currentUser),
      initialized,
      isReady: initialized,
      login,
      register,
      logout,
      forgotPassword,
      verifyEmail,
      refreshUser,
      updateProfile,
      reauthenticate,
      deleteAccount,
      clearError: () => setError(null),
    }),
    [
      currentUser,
      deleteAccount,
      error,
      forgotPassword,
      initialized,
      loading,
      login,
      logout,
      reauthenticate,
      refreshUser,
      register,
      updateProfile,
      verifyEmail,
    ],
  );

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
}
