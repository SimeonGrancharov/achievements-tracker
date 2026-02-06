import { createContext, useState, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeColors = {
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
};

export type ThemeMode = 'light' | 'dark' | 'system';

const light: ThemeColors = {
  background: '#fff',
  text: '#333',
  textSecondary: '#999',
  border: '#e0e0e0',
  primary: '#007AFF',
};

const dark: ThemeColors = {
  background: '#1c1c1e',
  text: '#e5e5e5',
  textSecondary: '#666',
  border: '#3a3a3c',
  primary: '#0A84FF',
};

export type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  colors: light,
  isDark: false,
  theme: 'system',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const systemScheme = useColorScheme();

  const isDark = useMemo(() => {
    const resolved = theme === 'system' ? (systemScheme ?? 'light') : theme;
    return resolved === 'dark';
  }, [theme, systemScheme]);

  const colors = isDark ? dark : light;

  const value = useMemo(() => ({ colors, isDark, theme, setTheme }), [colors, isDark, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
