import { useContext } from 'react';

import { NetworkContext, NetworkContextValue } from '@/contexts/NetworkContext';

const fallbackNetwork: NetworkContextValue = {
  isOnline: true,
  connectionType: 'unknown',
};

export function useNetwork() {
  return useContext(NetworkContext) ?? fallbackNetwork;
}
