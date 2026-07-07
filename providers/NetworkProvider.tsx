import { PropsWithChildren } from 'react';

import { NetworkContext, NetworkContextValue } from '@/contexts/NetworkContext';

const networkPlaceholder: NetworkContextValue = {
  isOnline: true,
  connectionType: 'unknown',
};

export function NetworkProvider({ children }: PropsWithChildren) {
  return <NetworkContext.Provider value={networkPlaceholder}>{children}</NetworkContext.Provider>;
}
