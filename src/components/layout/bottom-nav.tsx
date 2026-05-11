"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BibleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 4.5h8.5A2.5 2.5 0 0 1 18 7v12.5H8a2 2 0 0 0-2 2V7a2.5 2.5 0 0 1 1-2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8v5M9.5 10.5h5M8 19.5h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlansIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3.5v3M17 3.5v3M4 8h16M6.5 20h11A1.5 1.5 0 0 0 19 18.5v-10A1.5 1.5 0 0 0 17.5 7h-11A1.5 1.5 0 0 0 5 8.5v10A1.5 1.5 0 0 0 6.5 20Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 14 1.5 1.5 3.5-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GroupsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM4.5 19a4.5 4.5 0 0 1 9 0M13.5 19a3.5 3.5 0 0 1 7 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SavedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v14l-6.5-3-6.5 3V6A1.5 1.5 0 0 1 7 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 19a7 7 0 0 1 14 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navItems = [
  { href: "/hoje", label: "Hoje", icon: <HomeIcon /> },
  { href: "/biblia", label: "Bíblia", icon: <BibleIcon /> },
  { href: "/planos", label: "Planos", icon: <PlansIcon /> },
  { href: "/salvos", label: "Salvos", icon: <SavedIcon /> },
  { href: "/grupos", label: "Grupos", icon: <GroupsIcon /> },
  { href: "/conta", label: "Conta", icon: <AccountIcon /> },
] satisfies { href: string; label: string; icon: ReactNode }[];

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/hoje") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="bottom-nav">
      {navItems.map((item) => {
        const active = isItemActive(pathname, item.href);
        return (
          <Link key={item.href} href={item.href} data-active={active}>
            <span className="bottom-nav__icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
