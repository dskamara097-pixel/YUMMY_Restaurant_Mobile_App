import {
  AuthCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  updateProfile as updateFirebaseProfile,
  User,
} from '@firebase/auth';

import { getFirebaseAuth } from '@/firebase/auth';
import { AppError } from '@/utils/AppError';
import { handleFirebaseError } from '@/utils/FirebaseErrorHandler';

export type RegisterInput = {
  email: string;
  password: string;
  displayName: string;
  photoURL?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type UpdateProfileInput = {
  displayName?: string;
  photoURL?: string;
};

function requireAuth() {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new AppError(
      'firebase/configuration',
      'Firebase Authentication is not configured. Add approved Firebase environment values before using authentication.',
    );
  }

  return auth;
}

function requireCurrentUser() {
  const auth = requireAuth();

  if (!auth.currentUser) {
    throw new AppError('auth/no-current-user', 'No authenticated user is currently available.');
  }

  return auth.currentUser;
}

export function subscribeToAuthState(onChange: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();

  if (!auth) {
    onChange(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, onChange);
}

export async function loginWithEmailPassword(input: LoginInput) {
  const auth = requireAuth();

  try {
    const credential = await signInWithEmailAndPassword(auth, input.email.trim().toLowerCase(), input.password);
    return credential.user;
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export async function registerWithEmailPassword(input: RegisterInput) {
  const auth = requireAuth();

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      input.email.trim().toLowerCase(),
      input.password,
    );

    await updateFirebaseProfile(credential.user, {
      displayName: input.displayName.trim(),
      photoURL: input.photoURL?.trim() || null,
    });

    await sendEmailVerification(credential.user);
    await reload(credential.user);

    return credential.user;
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export async function logoutUser() {
  const auth = requireAuth();

  try {
    await signOut(auth);
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export async function sendForgotPasswordEmail(email: string) {
  const auth = requireAuth();

  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export async function sendVerificationEmail() {
  const user = requireCurrentUser();

  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export async function refreshCurrentUser() {
  const user = requireCurrentUser();

  try {
    await reload(user);
    return user;
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export async function updateCurrentUserProfile(input: UpdateProfileInput) {
  const user = requireCurrentUser();

  try {
    await updateFirebaseProfile(user, {
      displayName: input.displayName?.trim() || user.displayName,
      photoURL: input.photoURL?.trim() || user.photoURL,
    });
    await reload(user);
    return user;
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export function createEmailCredential(email: string, password: string): AuthCredential {
  return EmailAuthProvider.credential(email.trim().toLowerCase(), password);
}

export async function reauthenticateCurrentUser(email: string, password: string) {
  const user = requireCurrentUser();

  try {
    await reauthenticateWithCredential(user, createEmailCredential(email, password));
    return user;
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export async function deleteCurrentUserAccount(options?: { email?: string; password?: string }) {
  const user = requireCurrentUser();

  try {
    if (options?.email && options.password) {
      await reauthenticateWithCredential(user, createEmailCredential(options.email, options.password));
    }

    await deleteUser(user);
  } catch (error) {
    throw handleFirebaseError(error);
  }
}
