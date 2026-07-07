import { createContext } from 'react';
import { Firestore } from '@firebase/firestore';

export type FirestoreContextValue = {
  db: Firestore | null;
  isReady: boolean;
};

export const FirestoreContext = createContext<FirestoreContextValue | undefined>(undefined);
