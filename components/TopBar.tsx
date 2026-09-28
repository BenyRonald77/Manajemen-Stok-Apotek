import { logoutAction } from "@/app/(auth)/login/actions";
import { IconLogout } from "./icons";

export function TopBar({ username }: { username: string }) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-xs font-bold text-[var(--color-primary-ink)]">
          RX
        </div>
        <span className="text-sm font-semibold text-[var(--color-ink)]">
          Manajemen Stok Apotek
        </span>
      </div>

      <form action={logoutAction} className="flex items-center gap-3">
        <span className="hidden text-sm text-[var(--color-ink-muted)] sm:inline">
          {username}
        </span>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]"
        >
          <IconLogout />
          <span>Keluar</span>
        </button>
      </form>
    </header>
  );
}
