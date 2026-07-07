import { PropsWithChildren } from 'react';

import { ThemeContext, ThemeContextValue } from '@/contexts/ThemeContext';

const themePlaceholder: ThemeContextValue = {
  mode: 'light',
  setMode: () => undefined,
};

export function ThemeProvider({ children }: PropsWithChildren) {
  return <ThemeContext.Provider value={themePlaceholder}>{children}</ThemeContext.Provider>;
}
