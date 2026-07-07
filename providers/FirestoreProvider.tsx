import { PropsWithChildren } from 'react';

import { FirestoreContext, FirestoreContextValue } from '@/contexts/FirestoreContext';
import { firebaseFirestore } from '@/firebase/firestore';

const firestorePlaceholder: FirestoreContextValue = {
  db: firebaseFirestore,
  isReady: true,
};

export function FirestoreProvider({ children }: PropsWithChildren) {
  return <FirestoreContext.Provider value={firestorePlaceholder}>{children}</FirestoreContext.Provider>;
}
