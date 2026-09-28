"use client";

import { useActionState } from "react";
import { FieldError, FormAlert, SubmitButton } from "@/components/ui";
import type { BatchFormState } from "./actions";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function BatchForm({
  action,
  satuan,
}: {
  action: (state: BatchFormState, formData: FormData) => Promise<BatchFormState>;
  satuan: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {} as BatchFormState);
  const values = state.values;
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormAlert message={errors._form} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nomorBatch" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Nomor batch
          </label>
          <input
            id="nomorBatch"
            name="nomorBatch"
            defaultValue={values?.nomorBatch}
            required
            placeholder="Contoh: BTC-2026-0091"
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <FieldError message={errors.nomorBatch} />
        </div>

        <div>
          <label htmlFor="supplier" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Supplier
          </label>
          <input
            id="supplier"
            name="supplier"
            defaultValue={values?.supplier}
            required
            placeholder="Contoh: PT Kimia Farma Trading"
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <FieldError message={errors.supplier} />
        </div>

        <div>
          <label htmlFor="tanggalMasuk" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Tanggal masuk
          </label>
          <input
            id="tanggalMasuk"
            name="tanggalMasuk"
            type="date"
            defaultValue={values?.tanggalMasuk ?? todayISO()}
            required
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <FieldError message={errors.tanggalMasuk} />
        </div>

        <div>
          <label htmlFor="tanggalKedaluwarsa" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Tanggal kedaluwarsa
          </label>
          <input
            id="tanggalKedaluwarsa"
            name="tanggalKedaluwarsa"
            type="date"
            defaultValue={values?.tanggalKedaluwarsa}
            required
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <FieldError message={errors.tanggalKedaluwarsa} />
        </div>

        <div>
          <label htmlFor="jumlahAwal" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Jumlah ({satuan})
          </label>
          <input
            id="jumlahAwal"
            name="jumlahAwal"
            type="number"
            min={1}
            defaultValue={values?.jumlahAwal}
            required
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <FieldError message={errors.jumlahAwal} />
        </div>

        <div>
          <label htmlFor="hargaBeli" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
            Harga beli per {satuan} (Rp)
          </label>
          <input
            id="hargaBeli"
            name="hargaBeli"
            type="number"
            min={0}
            step="1"
            defaultValue={values?.hargaBeli}
            required
            className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          <FieldError message={errors.hargaBeli} />
        </div>
      </div>

      <div>
        <SubmitButton pending={isPending} pendingText="Menyimpan...">
          Simpan Batch Masuk
        </SubmitButton>
      </div>
    </form>
  );
}
