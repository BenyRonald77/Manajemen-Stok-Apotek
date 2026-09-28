import type { TingkatUrgensi } from "@/lib/format";

const URGENSI_STYLES: Record<TingkatUrgensi, { label: string; className: string }> = {
  kritis: {
    label: "Kritis",
    className: "bg-[var(--color-critical-bg)] text-[var(--color-critical)] border-[var(--color-critical-border)]",
  },
  waspada: {
    label: "Waspada",
    className: "bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]",
  },
  perhatian: {
    label: "Perhatian",
    className: "bg-[var(--color-safe-bg)] text-[var(--color-safe)] border-[var(--color-safe-border)]",
  },
};

export function UrgensiBadge({ level }: { level: TingkatUrgensi }) {
  const s = URGENSI_STYLES[level];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  );
}
