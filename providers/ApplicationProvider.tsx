import { PropsWithChildren } from 'react';

import { ApplicationContext, ApplicationContextValue } from '@/contexts/ApplicationContext';

const applicationPlaceholder: ApplicationContextValue = {
  phase: '6A Firebase Foundation',
  backendReady: true,
};

export function ApplicationProvider({ children }: PropsWithChildren) {
  return <ApplicationContext.Provider value={applicationPlaceholder}>{children}</ApplicationContext.Provider>;
}
