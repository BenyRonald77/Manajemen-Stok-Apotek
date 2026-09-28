"use client";

import { useActionState } from "react";
import { FieldError, SubmitButton } from "@/components/ui";
import type { ObatFormState } from "./actions";

type Action = (state: ObatFormState, formData: FormData) => Promise<ObatFormState>;

const KATEGORI_SARAN = [
  "Analgesik",
  "Antibiotik",
  "Antihistamin",
  "Vitamin & Suplemen",
  "Obat Batuk & Flu",
  "Obat Lambung",
  "Antiseptik",
];

const SATUAN_SARAN = ["tablet", "kapsul", "strip", "botol", "tube", "sachet", "ampul"];

export function ObatForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
}: {
  action: Action;
  initial?: { nama: string; kategori: string; satuan: string; stokMinimum: string };
  submitLabel: string;
  pendingLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {} as ObatFormState);
  const values = state.values ?? initial;
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Nama obat
          </label>
          <input
            id="nama"
            name="nama"
            defaultValue={values?.nama}
            required
            placeholder="Contoh: Paracetamol 500mg"
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <FieldError message={errors.nama} />
        </div>

        <div>
          <label htmlFor="kategori" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Kategori
          </label>
          <input
            id="kategori"
            name="kategori"
            list="kategori-saran"
            defaultValue={values?.kategori}
            required
            placeholder="Contoh: Analgesik"
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <datalist id="kategori-saran">
            {KATEGORI_SARAN.map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
          <FieldError message={errors.kategori} />
        </div>

        <div>
          <label htmlFor="satuan" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Satuan
          </label>
          <input
            id="satuan"
            name="satuan"
            list="satuan-saran"
            defaultValue={values?.satuan}
            required
            placeholder="Contoh: tablet"
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <datalist id="satuan-saran">
            {SATUAN_SARAN.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <FieldError message={errors.satuan} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="stokMinimum" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Stok minimum
          </label>
          <input
            id="stokMinimum"
            name="stokMinimum"
            type="number"
            min={0}
            defaultValue={values?.stokMinimum}
            required
            placeholder="Contoh: 20"
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] sm:w-48"
          />
          <p className="mt-1.5 text-xs text-[var(--color-ink-subtle)]">
            Ambang batas total stok (gabungan semua batch) untuk laporan stok minimum.
          </p>
          <FieldError message={errors.stokMinimum} />
        </div>
      </div>

      <div>
        <SubmitButton pending={isPending} pendingText={pendingLabel}>
          {submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
