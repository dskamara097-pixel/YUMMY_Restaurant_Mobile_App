import {
  enableIndexedDbPersistence,
  Firestore,
  getFirestore,
} from '@firebase/firestore';

import { firebaseApp } from '@/firebase/firebase';
import { hasFirebaseEnvironmentConfig } from '@/firebase/config';

let firestoreInstance: Firestore | null = null;
let offlinePersistenceAttempted = false;
let offlinePersistenceEnabled = false;

export function getFirebaseFirestore() {
  if (!hasFirebaseEnvironmentConfig()) {
    return null;
  }

  if (!firestoreInstance) {
    firestoreInstance = getFirestore(firebaseApp);
  }

  return firestoreInstance;
}

export async function enableFirestoreOfflinePersistence() {
  const db = getFirebaseFirestore();

  if (!db || offlinePersistenceAttempted) {
    return offlinePersistenceEnabled;
  }

  offlinePersistenceAttempted = true;

  try {
    await enableIndexedDbPersistence(db);
    offlinePersistenceEnabled = true;
  } catch {
    offlinePersistenceEnabled = false;
  }

  return offlinePersistenceEnabled;
}

export function isFirestoreAvailable() {
  return Boolean(getFirebaseFirestore());
}

export const firebaseFirestore = getFirebaseFirestore();
