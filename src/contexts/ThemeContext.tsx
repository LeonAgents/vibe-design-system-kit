'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { DEFAULT_THEME_ID, getThemeById, themeToCssVariables, type AppTheme } from '@/themes';

const DEFAULT_THEME = getThemeById(DEFAULT_THEME_ID);

const ThemeContext = createContext<AppTheme>(DEFAULT_THEME);

function formatThemeCss(theme: AppTheme): string {
  const declarations = Object.entries(themeToCssVariables(theme))
    .map(([name, value]) => `${name}:${value};`)
    .join('');

  return `:root{${declarations}}`;
}

function ThemeVariables({ theme }: { theme: AppTheme }) {
  useEffect(() => {
    const root = document.documentElement;
    const variables = themeToCssVariables(theme);

    root.dataset.theme = theme.id;
    for (const [name, value] of Object.entries(variables)) {
      root.style.setProperty(name, value);
    }
  }, [theme]);

  return (
    <style
      id="app-theme-variables"
      dangerouslySetInnerHTML={{ __html: formatThemeCss(theme) }}
    />
  );
}

export function AppThemeProvider({
  theme = DEFAULT_THEME,
  children,
}: {
  theme?: AppTheme;
  children: ReactNode;
}) {
  return (
    <ThemeContext.Provider value={theme}>
      <ThemeVariables theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): AppTheme {
  return useContext(ThemeContext);
}
