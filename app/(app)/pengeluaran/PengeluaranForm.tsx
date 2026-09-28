"use client";

import { useActionState } from "react";
import Link from "next/link";
import { formatTanggal } from "@/lib/format";
import { Card, FieldError, FormAlert, SubmitButton } from "@/components/ui";
import { keluarkanStokAction, type PengeluaranState } from "./actions";

type ObatOpsi = { id: string; nama: string; satuan: string };

export function PengeluaranForm({ daftarObat }: { daftarObat: ObatOpsi[] }) {
  const [state, formAction, isPending] = useActionState(keluarkanStokAction, {} as PengeluaranState);
  const errors = state.errors ?? {};
  const values = state.values;

  return (
    <div className="flex flex-col gap-6">
      <Card className="max-w-xl p-5 sm:p-6">
        <form action={formAction} className="flex flex-col gap-5">
          <FormAlert message={errors._form} />

          <div>
            <label htmlFor="obatId" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
              Obat
            </label>
            <select
              id="obatId"
              name="obatId"
              defaultValue={values?.obatId ?? ""}
              required
              className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
            >
              <option value="" disabled>
                Pilih obat...
              </option>
              {daftarObat.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nama}
                </option>
              ))}
            </select>
            <FieldError message={errors.obatId} />
          </div>

          <div>
            <label htmlFor="jumlah" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
              Jumlah keluar
            </label>
            <input
              id="jumlah"
              name="jumlah"
              type="number"
              min={1}
              defaultValue={values?.jumlah}
              required
              className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] sm:w-48"
            />
            <FieldError message={errors.jumlah} />
          </div>

          <div>
            <label htmlFor="keterangan" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
              Keterangan <span className="font-normal text-[var(--color-ink-subtle)]">(opsional)</span>
            </label>
            <input
              id="keterangan"
              name="keterangan"
              defaultValue={values?.keterangan}
              placeholder="Contoh: penjualan resep, retur distributor"
              className="w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
            />
          </div>

          <p className="text-xs text-[var(--color-ink-subtle)]">
            Sistem otomatis mengeluarkan stok dari batch yang paling dekat kedaluwarsa lebih dulu (FEFO),
            lintas beberapa batch bila perlu.
          </p>

          <div>
            <SubmitButton pending={isPending} pendingText="Memproses...">
              Keluarkan Stok
            </SubmitButton>
          </div>
        </form>
      </Card>

      {state.hasil ? (
        <Card className="max-w-xl border-[var(--color-safe-border)] bg-[var(--color-safe-bg)] p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--color-safe)]">
            Berhasil mengeluarkan {state.hasil.jumlah} unit {state.hasil.obatNama}.
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Diambil mengikuti urutan FEFO dari batch berikut:
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {state.hasil.batchTerpakai.map((b) => (
              <li
                key={b.batchId}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm"
              >
                <div>
                  <p className="font-medium text-[var(--color-ink)]">{b.nomorBatch}</p>
                  <p className="text-xs text-[var(--color-ink-subtle)]">
                    Kedaluwarsa {formatTanggal(b.tanggalKedaluwarsa)}
                  </p>
                </div>
                <span className="font-semibold text-[var(--color-ink)]">{b.jumlahDiambil} unit</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {daftarObat.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-muted)]">
          Belum ada data obat.{" "}
          <Link href="/obat/baru" className="font-medium text-[var(--color-primary)] hover:underline">
            Tambah obat terlebih dahulu
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
