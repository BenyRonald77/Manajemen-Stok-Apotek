"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/ui";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-critical-border)] bg-[var(--color-critical-bg)] px-6 py-14 text-center">
      <p className="text-sm font-semibold text-[var(--color-critical)]">Terjadi kesalahan</p>
      <p className="mt-1.5 max-w-sm text-sm text-[var(--color-ink-muted)]">
        Halaman ini gagal dimuat. Coba muat ulang; jika masalah berlanjut, periksa data yang
        dimasukkan atau hubungi administrator sistem.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-sm font-semibold text-[var(--color-primary-ink)] hover:bg-[var(--color-primary-dark)]"
        >
          Coba lagi
        </button>
        <ButtonLink href="/" variant="secondary">
          Kembali ke Dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
