import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)] text-lg font-bold text-[var(--color-primary-ink)]">
            RX
          </div>
          <h1 className="text-xl font-bold text-[var(--color-ink)]">
            Manajemen Stok Apotek
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Masuk untuk mengelola stok, batch, dan pengeluaran obat.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <LoginForm redirectTo={redirectTo} />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-ink-subtle)]">
          Alat internal apotek. Hubungi administrator sistem jika lupa kata sandi.
        </p>
      </div>
    </div>
  );
}
