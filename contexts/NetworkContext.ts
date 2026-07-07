import { createContext } from 'react';

export type NetworkContextValue = {
  isOnline: boolean;
  connectionType: 'unknown' | 'wifi' | 'cellular' | 'offline';
};

export const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);
