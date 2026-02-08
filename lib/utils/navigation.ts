import React from "react";
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Wallet,
  BarChart3,
  Droplets,
  BookOpen,
} from "lucide-react";

export type TabType =
  | "pool"
  | "loans"
  | "dashboard"
  | "faucet"
  | "trading"
  | "wallet"
  | "docs";

export interface NavigationItem {
  id: TabType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  href?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview",
    icon: LayoutDashboard,
    href: "/app/dashboard",
  },
  {
    id: "pool",
    label: "Earn",
    description: "Liquidity Pool",
    icon: TrendingUp,
    href: "/app/deposit",
  },
  {
    id: "loans",
    label: "Borrow",
    description: "Leverage",
    icon: DollarSign,
    href: "/app/loans",
  },
  {
    id: "trading",
    label: "Trading",
    description: "DeFi Trading",
    icon: BarChart3,
    href: "/app/trading",
  },
  {
    id: "wallet",
    label: "Wallet",
    description: "Control",
    icon: Wallet,
    href: "/app/wallet",
  },
  {
    id: "faucet",
    label: "Faucet",
    description: "Testnet",
    icon: Droplets,
    href: "/app/faucet",
  },
  {
    id: "docs",
    label: "Docs",
    description: "Guide",
    icon: BookOpen,
    href: "https://invalend-docs-lisk.vercel.app/",
  },
];

export const getNavigationItem = (id: TabType): NavigationItem | undefined => {
  return navigationItems.find((item) => item.id === id);
};

export const isNavigationItem = (id: string): id is TabType => {
  return navigationItems.some((item) => item.id === id);
};
