"use client";

import { useActionState } from "react";
import { FormAlert } from "@/components/ui";
import { IconTrash } from "@/components/icons";
import type { DeleteObatState } from "../actions";

export function DeleteObatButton({
  action,
}: {
  action: (state: DeleteObatState) => Promise<DeleteObatState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {} as DeleteObatState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Hapus data obat ini? Tindakan ini tidak bisa dibatalkan.")) {
          e.preventDefault();
        }
      }}
      className="flex flex-col items-end gap-2"
    >
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-critical-border)] px-3.5 py-2 text-sm font-semibold text-[var(--color-critical)] transition-colors hover:bg-[var(--color-critical-bg)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <IconTrash />
        {isPending ? "Menghapus..." : "Hapus Obat"}
      </button>
      {state.error ? (
        <div className="w-72 text-right">
          <FormAlert message={state.error} />
        </div>
      ) : null}
    </form>
  );
}
