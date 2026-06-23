import { defaultTheme } from './default';
import { indigoTheme } from './indigo';
import { jadeGreenTheme } from './jade-green';
import { techBlueTheme } from './tech-blue';
import type { AppTheme, ThemeId } from './types';

export { themeToCssVariables } from './cssVars';

export const DEFAULT_THEME_ID: ThemeId = 'default';

export const themes: Record<string, AppTheme> = {
  default: defaultTheme,
  indigo: indigoTheme,
  'tech-blue': techBlueTheme,
  'jade-green': jadeGreenTheme,
};

export const themeList: AppTheme[] = [
  defaultTheme,
  indigoTheme,
  techBlueTheme,
  jadeGreenTheme,
];

export function getThemeById(themeId: ThemeId): AppTheme {
  return themes[themeId] ?? themes[DEFAULT_THEME_ID];
}
