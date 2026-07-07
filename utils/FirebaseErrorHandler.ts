import { AppError } from '@/utils/AppError';

type FirebaseLikeError = {
  code?: string;
  message?: string;
};

const firebaseAuthMessages: Record<string, string> = {
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-email': 'Email address is required.',
  'auth/missing-password': 'Password is required.',
  'auth/weak-password': 'Password must be at least 8 characters.',
  'auth/email-already-in-use': 'An account already exists for this email address.',
  'auth/account-exists-with-different-credential': 'This email is already connected to another sign-in method.',
  'auth/user-not-found': 'No account was found for this email address.',
  'auth/wrong-password': 'The email or password is incorrect.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/network-request-failed': 'Network unavailable. Check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait before trying again.',
  'auth/requires-recent-login': 'Please log in again before making this account change.',
  'auth/operation-not-allowed': 'Email/password sign-in is not enabled for this Firebase project.',
  'auth/invalid-api-key': 'Firebase Authentication is not configured with a valid API key.',
  'auth/email-not-verified': 'Please verify your email address before continuing.',
};

export function getFriendlyFirebaseAuthMessage(code?: string, fallback?: string) {
  if (code && firebaseAuthMessages[code]) {
    return firebaseAuthMessages[code];
  }

  return fallback ?? 'A Firebase operation failed. Please try again.';
}

export function handleFirebaseError(error: unknown) {
  if (error instanceof AppError) {
    return error;
  }

  const firebaseError = error as FirebaseLikeError;
  const code = firebaseError.code ?? 'firebase/unknown';

  return new AppError(
    code === 'auth/email-not-verified' ? 'auth/email-not-verified' : 'firebase/unknown',
    getFriendlyFirebaseAuthMessage(code, firebaseError.message),
    error,
  );
}
