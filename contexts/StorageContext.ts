import { createContext } from 'react';
import { FirebaseStorage } from '@firebase/storage';

export type StorageContextValue = {
  storage: FirebaseStorage | null;
  isReady: boolean;
};

export const StorageContext = createContext<StorageContextValue | undefined>(undefined);
