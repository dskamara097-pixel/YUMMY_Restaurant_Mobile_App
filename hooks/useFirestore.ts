import { useContext } from 'react';

import { FirestoreContext, FirestoreContextValue } from '@/contexts/FirestoreContext';
import { firebaseFirestore } from '@/firebase/firestore';

const fallbackFirestore: FirestoreContextValue = {
  db: firebaseFirestore,
  isReady: true,
};

export function useFirestore() {
  return useContext(FirestoreContext) ?? fallbackFirestore;
}
