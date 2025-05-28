// src/features/admin/layout/adminNavItems.ts
import {
  LayoutDashboard,
  Users,
  Layers,
  Coffee,
  DollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminSubNavItem {
  title: string;
  url: string;
}
export interface AdminNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean; // This will be dynamically determined
  items?: AdminSubNavItem[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    items: [
      { title: "View Dashboard", url: "/admin" },
    ],
  },
  {
    title: "Waiters",
    url: "/admin/waiters",
    icon: Users,
    items: [
      { title: "View All", url: "/admin/waiters" },
      { title: "Add Waiter", url: "/admin/waiters/add"},
    ],
  },
  {
    title: "Tables",
    url: "/admin/tables",
    icon: Layers,
    items: [
      { title: "View All", url: "/admin/tables" },
      { title: "Add Table", url: "/admin/tables/add"},
    ],
  },
  {
    title: "Foods & Drinks",
    url: "/admin/foods",
    icon: Coffee,
    items: [
      { title: "View All", url: "/admin/foods" },
      { title: "Add Food", url: "/admin/foods/add"},
    ],
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Layers,
    items: [
      { title: "View All", url: "/admin/categories" },
      { title: "Add Category", url: "/admin/categories/add"},
    ],
  },
  {
    title: "Finances",
    url: "/admin/finances",
    icon: DollarSign,
    items: [
      { title: "View Reports", url: "/admin/finances" },
    ],
  },
];