import { useContext } from 'react';

import { StorageContext, StorageContextValue } from '@/contexts/StorageContext';
import { firebaseStorage } from '@/firebase/storage';

const fallbackStorage: StorageContextValue = {
  storage: firebaseStorage,
  isReady: true,
};

export function useStorage() {
  return useContext(StorageContext) ?? fallbackStorage;
}
