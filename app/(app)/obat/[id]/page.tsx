import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatTanggal, selisihHari, tingkatUrgensi } from "@/lib/format";
import { ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import { UrgensiBadge } from "@/components/UrgensiBadge";
import { IconEdit, IconInflow } from "@/components/icons";
import { DeleteObatButton } from "./DeleteObatButton";
import { deleteObatAction } from "../actions";

export default async function DetailObatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const obat = await prisma.obat.findUnique({
    where: { id },
    include: { batch: { orderBy: { tanggalKedaluwarsa: "asc" } } },
  });

  if (!obat) notFound();

  const totalStok = obat.batch.reduce((sum, b) => sum + b.jumlahSisa, 0);
  const batchAktif = obat.batch.filter((b) => b.jumlahSisa > 0);

  const deleteAction = deleteObatAction.bind(null, obat.id);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={obat.nama}
        description={`${obat.kategori} · Satuan ${obat.satuan}`}
        action={
          <div className="flex items-center gap-2">
            <ButtonLink href={`/obat/${obat.id}/edit`} variant="secondary">
              <IconEdit /> Ubah
            </ButtonLink>
            <ButtonLink href={`/obat/${obat.id}/batch-baru`}>
              <IconInflow /> Stok Masuk
            </ButtonLink>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-subtle)]">
            Total Stok
          </p>
          <p
            className={`mt-1.5 text-2xl font-bold ${
              totalStok < obat.stokMinimum ? "text-[var(--color-critical)]" : "text-[var(--color-ink)]"
            }`}
          >
            {totalStok} <span className="text-sm font-medium text-[var(--color-ink-muted)]">{obat.satuan}</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-subtle)]">
            Stok Minimum
          </p>
          <p className="mt-1.5 text-2xl font-bold text-[var(--color-ink)]">
            {obat.stokMinimum} <span className="text-sm font-medium text-[var(--color-ink-muted)]">{obat.satuan}</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-subtle)]">
            Batch Aktif
          </p>
          <p className="mt-1.5 text-2xl font-bold text-[var(--color-ink)]">{batchAktif.length}</p>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Batch Stok
        </h2>
        {obat.batch.length === 0 ? (
          <EmptyState
            title="Belum ada batch untuk obat ini"
            description="Tambahkan batch pertama untuk mulai mencatat stok masuk."
            action={
              <ButtonLink href={`/obat/${obat.id}/batch-baru`}>
                <IconInflow /> Stok Masuk
              </ButtonLink>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink-subtle)]">
                    <th className="px-4 py-3 font-semibold">No. Batch</th>
                    <th className="px-4 py-3 font-semibold">Supplier</th>
                    <th className="px-4 py-3 font-semibold">Kedaluwarsa</th>
                    <th className="px-4 py-3 font-semibold">Sisa / Awal</th>
                    <th className="px-4 py-3 font-semibold">Harga Beli</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {obat.batch.map((batch) => {
                    const habis = batch.jumlahSisa === 0;
                    const hari = selisihHari(batch.tanggalKedaluwarsa);
                    const level = tingkatUrgensi(hari);
                    return (
                      <tr
                        key={batch.id}
                        className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-muted)]"
                      >
                        <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{batch.nomorBatch}</td>
                        <td className="px-4 py-3 text-[var(--color-ink-muted)]">{batch.supplier}</td>
                        <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                          {formatTanggal(batch.tanggalKedaluwarsa)}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                          {batch.jumlahSisa} / {batch.jumlahAwal}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink-muted)]">{formatRupiah(batch.hargaBeli)}</td>
                        <td className="px-4 py-3">
                          {habis ? (
                            <span className="inline-flex items-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-ink-subtle)]">
                              Habis
                            </span>
                          ) : (
                            <UrgensiBadge level={level} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>

      <section className="flex justify-between border-t border-[var(--color-border)] pt-6">
        <Link href="/obat" className="text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
          ← Kembali ke Data Obat
        </Link>
        <DeleteObatButton action={deleteAction} />
      </section>
    </div>
  );
}
