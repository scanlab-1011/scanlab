'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'security-scan-theme',
}) {
  const [theme, setThemeState] = useState(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) || defaultTheme;
    setThemeState(savedTheme);
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove('light', 'dark');

    let activeTheme = theme;

    // If theme is set to 'system', respect system preferences
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeTheme = systemPrefersDark ? 'dark' : 'light';
    }

    // Apply the theme to the root element
    root.classList.add(activeTheme);
    localStorage.setItem(storageKey, activeTheme);
  }, [theme, storageKey]);

  // Update the theme
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
