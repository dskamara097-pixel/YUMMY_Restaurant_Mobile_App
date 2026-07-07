import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

import { firebaseEnvironmentConfig } from '@/firebase/config';

let firebaseAppInstance: FirebaseApp | null = null;

export function getFirebaseApp() {
  if (firebaseAppInstance) {
    return firebaseAppInstance;
  }

  firebaseAppInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseEnvironmentConfig);
  return firebaseAppInstance;
}

export const firebaseApp = getFirebaseApp();
