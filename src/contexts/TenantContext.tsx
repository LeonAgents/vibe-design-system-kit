'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_THEME_ID, getThemeById, themes, type ThemeId } from '@/themes';
import { AppThemeProvider } from './ThemeContext';

export interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantBrand: string;
  themeId: ThemeId;
  logoSrc?: string | null;
  logoDataUrl?: string | null;
}

export interface TenantContextValue extends Tenant {
  setThemeId: (themeId: ThemeId) => void;
  setLogoDataUrl: (logoDataUrl: string | null) => void;
  resetBranding: () => void;
}

interface StoredTenantPreferences {
  themeId?: ThemeId;
  logoDataUrl?: string | null;
}

const TENANT_STORAGE_KEY = 'vibe:tenant-preferences:v1';

export const DEFAULT_TENANT: Tenant = {
  tenantId: 'default',
  tenantName: '示例控制台',
  tenantBrand: 'Vibe',
  themeId: DEFAULT_THEME_ID,
  logoSrc: '/brand/logo.svg',
  logoDataUrl: null,
};

const TenantContext = createContext<TenantContextValue>({
  ...DEFAULT_TENANT,
  setThemeId: () => undefined,
  setLogoDataUrl: () => undefined,
  resetBranding: () => undefined,
});

function normalizeThemeId(themeId: ThemeId | undefined): ThemeId {
  return themeId && themes[themeId] ? themeId : DEFAULT_THEME_ID;
}

function readStoredTenantPreferences(): StoredTenantPreferences {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(TENANT_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as StoredTenantPreferences;
    return {
      themeId: normalizeThemeId(parsed.themeId),
      logoDataUrl: parsed.logoDataUrl ?? null,
    };
  } catch {
    return {};
  }
}

export function TenantProvider({
  tenant = DEFAULT_TENANT,
  children,
}: {
  tenant?: Tenant;
  children: ReactNode;
}) {
  const [currentTenant, setCurrentTenant] = useState<Tenant>({
    ...tenant,
    themeId: normalizeThemeId(tenant.themeId),
    logoSrc: tenant.logoSrc ?? DEFAULT_TENANT.logoSrc,
    logoDataUrl: tenant.logoDataUrl ?? null,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedPreferences = readStoredTenantPreferences();

      setCurrentTenant({
        ...tenant,
        themeId: normalizeThemeId(storedPreferences.themeId ?? tenant.themeId),
        logoSrc: tenant.logoSrc ?? DEFAULT_TENANT.logoSrc,
        logoDataUrl: storedPreferences.logoDataUrl ?? tenant.logoDataUrl ?? null,
      });
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [tenant]);

  useEffect(() => {
    if (!hydrated) return;

    const preferences: StoredTenantPreferences = {
      themeId: currentTenant.themeId,
      logoDataUrl: currentTenant.logoDataUrl ?? null,
    };

    window.localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(preferences));
  }, [currentTenant.logoDataUrl, currentTenant.themeId, hydrated]);

  const setThemeId = useCallback((themeId: ThemeId) => {
    setCurrentTenant((value) => ({
      ...value,
      themeId: normalizeThemeId(themeId),
    }));
  }, []);

  const setLogoDataUrl = useCallback((logoDataUrl: string | null) => {
    setCurrentTenant((value) => ({
      ...value,
      logoDataUrl,
    }));
  }, []);

  const resetBranding = useCallback(() => {
    setCurrentTenant((value) => ({
      ...value,
      themeId: DEFAULT_THEME_ID,
      logoDataUrl: null,
    }));
  }, []);

  const contextValue = useMemo<TenantContextValue>(
    () => ({
      ...currentTenant,
      setThemeId,
      setLogoDataUrl,
      resetBranding,
    }),
    [currentTenant, resetBranding, setLogoDataUrl, setThemeId],
  );

  const theme = getThemeById(currentTenant.themeId);

  return (
    <AppThemeProvider theme={theme}>
      <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>
    </AppThemeProvider>
  );
}

export function useTenant(): TenantContextValue {
  return useContext(TenantContext);
}
