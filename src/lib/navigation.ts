import {
  BarChart3,
  BellRing,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  UserCog,
  type LucideIcon,
} from 'lucide-react';

type NavIcon = LucideIcon;

export type NavItemStatus = 'active' | 'comingSoon';

export type NavGroupKey =
  | 'overview'
  | 'analysis'
  | 'manage'
  | 'system';

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: NavIcon;
  status: NavItemStatus;
  group: NavGroupKey;
  description?: string;
}

export interface NavGroup {
  key: NavGroupKey;
  label: string;
  order: number;
}

export const navGroups: NavGroup[] = [
  { key: 'overview', label: '概览', order: 1 },
  { key: 'analysis', label: '分析', order: 2 },
  { key: 'manage', label: '管理', order: 3 },
  { key: 'system', label: '系统', order: 4 },
];

// 通用示例导航——仅用于设计系统预览，不代表任何真实产品功能。
export const navItems: NavItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    path: '/dashboard',
    icon: LayoutDashboard,
    status: 'active',
    group: 'overview',
    description: '关键指标总览与实时动态',
  },
  {
    key: 'analytics',
    label: '数据分析',
    path: '/analytics',
    icon: BarChart3,
    status: 'active',
    group: 'overview',
    description: '多维数据分析与趋势洞察',
  },
  {
    key: 'reports',
    label: '报表中心',
    path: '/reports',
    icon: FileText,
    status: 'active',
    group: 'analysis',
    description: '可视化报表与导出',
  },
  {
    key: 'monitor',
    label: '监控告警',
    path: '/monitor',
    icon: BellRing,
    status: 'active',
    group: 'analysis',
    description: '指标监控与阈值告警',
  },
  {
    key: 'users',
    label: '用户管理',
    path: '/users',
    icon: Users,
    status: 'active',
    group: 'manage',
    description: '用户列表与权限分配',
  },
  {
    key: 'team',
    label: '团队成员',
    path: '/team',
    icon: UserCog,
    status: 'active',
    group: 'manage',
    description: '成员与角色管理',
  },
  {
    key: 'settings',
    label: '设置',
    path: '/settings',
    icon: Settings,
    status: 'active',
    group: 'system',
    description: '偏好、通知与集成',
  },
];

export function getNavItemByPath(pathname: string): NavItem | undefined {
  return navItems.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
}

export function getNavItemsByGroup(group: NavGroupKey): NavItem[] {
  return navItems.filter((item) => item.group === group);
}
