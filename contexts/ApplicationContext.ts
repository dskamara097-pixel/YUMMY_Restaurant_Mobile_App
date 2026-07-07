import { createContext } from 'react';

export type ApplicationContextValue = {
  phase: string;
  backendReady: boolean;
};

export const ApplicationContext = createContext<ApplicationContextValue | undefined>(undefined);
