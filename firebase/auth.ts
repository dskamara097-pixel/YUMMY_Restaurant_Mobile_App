import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Auth,
  browserLocalPersistence,
  getAuth,
  inMemoryPersistence,
  initializeAuth,
  setPersistence,
} from '@firebase/auth';
import * as authModule from '@firebase/auth';

import { hasFirebaseEnvironmentConfig } from '@/firebase/config';
import { firebaseApp } from '@/firebase/firebase';

type ReactNativePersistenceFactory = (storage: typeof AsyncStorage) => unknown;

let authInstance: Auth | null = null;

function getPersistence() {
  const reactNativePersistence = (authModule as { getReactNativePersistence?: ReactNativePersistenceFactory })
    .getReactNativePersistence;

  if (reactNativePersistence) {
    return reactNativePersistence(AsyncStorage);
  }

  return browserLocalPersistence ?? inMemoryPersistence;
}

export function getFirebaseAuth() {
  if (!hasFirebaseEnvironmentConfig()) {
    return null;
  }

  if (authInstance) {
    return authInstance;
  }

  try {
    authInstance = initializeAuth(firebaseApp, {
      persistence: getPersistence() as never,
    });
  } catch {
    authInstance = getAuth(firebaseApp);
    void setPersistence(authInstance, getPersistence() as never).catch(() => undefined);
  }

  return authInstance;
}

export const firebaseAuth = getFirebaseAuth();
