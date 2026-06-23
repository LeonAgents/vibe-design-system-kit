'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface CurrentUser {
  id: string;
  name: string;
  email?: string;
  role: 'analyst' | 'admin' | 'viewer';
  avatarUrl?: string;
}

const PLACEHOLDER_USER: CurrentUser = {
  id: 'internal-001',
  name: '内部用户',
  email: 'internal@example.local',
  role: 'analyst',
};

const UserContext = createContext<CurrentUser>(PLACEHOLDER_USER);

export function UserProvider({
  user = PLACEHOLDER_USER,
  children,
}: {
  user?: CurrentUser;
  children: ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useCurrentUser(): CurrentUser {
  return useContext(UserContext);
}
