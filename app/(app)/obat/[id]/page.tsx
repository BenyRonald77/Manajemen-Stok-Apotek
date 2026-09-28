import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatTanggal, formatTanggalWaktu, selisihHari, tingkatUrgensi } from "@/lib/format";
import { ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import { UrgensiBadge } from "@/components/UrgensiBadge";
import { IconEdit, IconInflow, IconHistory } from "@/components/icons";
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
    include: {
      batch: { orderBy: { tanggalKedaluwarsa: "asc" } },
      transaksi: { orderBy: { tanggal: "asc" }, include: { batch: true } },
    },
  });

  if (!obat) notFound();

  const totalStok = obat.batch.reduce((sum, b) => sum + b.jumlahSisa, 0);
  const batchAktif = obat.batch.filter((b) => b.jumlahSisa > 0);

  // Hitung saldo berjalan dari transaksi terlama ke terbaru, lalu tampilkan
  // dari yang terbaru (lebih relevan untuk ditinjau lebih dulu).
  let saldo = 0;
  const riwayatDenganSaldo = obat.transaksi.map((t) => {
    saldo += t.jenis === "MASUK" ? t.jumlah : -t.jumlah;
    return { ...t, saldoSetelah: saldo };
  });
  const riwayatTerbaruDulu = [...riwayatDenganSaldo].reverse();

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

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
          <IconHistory /> Kartu Stok (Riwayat Transaksi)
        </h2>
        {riwayatTerbaruDulu.length === 0 ? (
          <EmptyState
            title="Belum ada transaksi"
            description="Riwayat masuk dan keluar akan muncul di sini setelah ada transaksi stok."
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink-subtle)]">
                    <th className="px-4 py-3 font-semibold">Tanggal</th>
                    <th className="px-4 py-3 font-semibold">Jenis</th>
                    <th className="px-4 py-3 font-semibold">Batch</th>
                    <th className="px-4 py-3 font-semibold">Jumlah</th>
                    <th className="px-4 py-3 font-semibold">Saldo</th>
                    <th className="px-4 py-3 font-semibold">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatTerbaruDulu.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-muted)]"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--color-ink-muted)]">
                        {formatTanggalWaktu(t.tanggal)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            t.jenis === "MASUK"
                              ? "bg-[var(--color-safe-bg)] text-[var(--color-safe)]"
                              : "bg-[var(--color-warning-bg)] text-[var(--color-warning)]"
                          }`}
                        >
                          {t.jenis === "MASUK" ? "Masuk" : "Keluar"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                        {t.batch?.nomorBatch ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                        {t.jenis === "MASUK" ? "+" : "-"}
                        {t.jumlah}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[var(--color-ink)]">{t.saldoSetelah}</td>
                      <td className="px-4 py-3 text-[var(--color-ink-muted)]">{t.keterangan ?? "—"}</td>
                    </tr>
                  ))}
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
