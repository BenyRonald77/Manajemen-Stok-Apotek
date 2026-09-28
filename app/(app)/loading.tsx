export default function Loading() {
  return (
    <div className="flex flex-col gap-4" aria-live="polite" aria-busy="true">
      <div className="h-7 w-56 animate-pulse rounded-md bg-[var(--color-surface-muted)]" />
      <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-[var(--color-surface-muted)]" />
      <div className="mt-2 flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--color-surface-muted)]" />
        ))}
      </div>
      <span className="sr-only">Memuat data...</span>
    </div>
  );
}
