"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconAlert, IconCapsule, IconOutflow } from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", Icon: IconAlert },
  { href: "/obat", label: "Data Obat", Icon: IconCapsule },
  { href: "/pengeluaran", label: "Pengeluaran Stok", Icon: IconOutflow },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 md:w-60 md:shrink-0 md:flex-col md:gap-0.5 md:overflow-visible md:border-b-0 md:border-r md:px-3 md:py-4"
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors md:shrink ${
              active
                ? "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
                : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Icon className={active ? "text-[var(--color-primary)]" : "text-[var(--color-ink-subtle)]"} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
