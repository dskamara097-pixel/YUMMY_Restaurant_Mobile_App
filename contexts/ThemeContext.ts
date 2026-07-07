import { createContext } from 'react';

export type ThemeContextValue = {
  mode: 'light';
  setMode: (mode: 'light') => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
