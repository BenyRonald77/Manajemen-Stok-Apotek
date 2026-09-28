import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-ink)] sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] px-6 py-14 text-center">
      <p className="text-sm font-semibold text-[var(--color-ink)]">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-[var(--color-ink-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const styles: Record<string, string> = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-primary-ink)] hover:bg-[var(--color-primary-dark)]",
    secondary:
      "border border-[var(--color-border-strong)] text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]",
    ghost: "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]",
    danger: "border border-[var(--color-critical-border)] text-[var(--color-critical)] hover:bg-[var(--color-critical-bg)]",
  };

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}

export function SubmitButton({
  children,
  pending,
  pendingText,
  variant = "primary",
}: {
  children: ReactNode;
  pending: boolean;
  pendingText?: string;
  variant?: "primary" | "danger";
}) {
  const styles =
    variant === "danger"
      ? "bg-[var(--color-critical)] text-white hover:opacity-90"
      : "bg-[var(--color-primary)] text-[var(--color-primary-ink)] hover:bg-[var(--color-primary-dark)]";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles}`}
    >
      {pending ? pendingText ?? "Menyimpan..." : children}
    </button>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-[var(--color-critical)]">{message}</p>;
}

export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-[var(--color-critical-border)] bg-[var(--color-critical-bg)] px-3.5 py-2.5 text-sm text-[var(--color-critical)]"
    >
      {message}
    </p>
  );
}

