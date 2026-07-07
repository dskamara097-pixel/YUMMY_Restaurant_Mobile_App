import { PropsWithChildren } from 'react';

import { StorageContext, StorageContextValue } from '@/contexts/StorageContext';
import { firebaseStorage } from '@/firebase/storage';

const storagePlaceholder: StorageContextValue = {
  storage: firebaseStorage,
  isReady: true,
};

export function StorageProvider({ children }: PropsWithChildren) {
  return <StorageContext.Provider value={storagePlaceholder}>{children}</StorageContext.Provider>;
}
