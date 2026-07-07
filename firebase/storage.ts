import { FirebaseStorage, getStorage } from '@firebase/storage';

import { hasFirebaseEnvironmentConfig } from '@/firebase/config';
import { firebaseApp } from '@/firebase/firebase';

let storageInstance: FirebaseStorage | null = null;

export function getFirebaseStorage() {
  if (!hasFirebaseEnvironmentConfig()) {
    return null;
  }

  if (!storageInstance) {
    storageInstance = getStorage(firebaseApp);
  }

  return storageInstance;
}

export function isFirebaseStorageAvailable() {
  return Boolean(getFirebaseStorage());
}

export const firebaseStorage = getFirebaseStorage();
