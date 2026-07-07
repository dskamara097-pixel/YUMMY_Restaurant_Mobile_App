import { useContext } from 'react';

import { ThemeContext, ThemeContextValue } from '@/contexts/ThemeContext';

const fallbackTheme: ThemeContextValue = {
  mode: 'light',
  setMode: () => undefined,
};

export function useTheme() {
  return useContext(ThemeContext) ?? fallbackTheme;
}
