import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTanggal, selisihHari, tingkatUrgensi } from "@/lib/format";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { UrgensiBadge } from "@/components/UrgensiBadge";
import { IconAlert } from "@/components/icons";

const RENTANG_OPSI = [30, 60, 90] as const;

export default async function DashboardKedaluwarsaPage({
  searchParams,
}: {
  searchParams: Promise<{ rentang?: string }>;
}) {
  const params = await searchParams;
  const rentangParsed = Number(params.rentang);
  const rentang = RENTANG_OPSI.includes(rentangParsed as 30 | 60 | 90)
    ? (rentangParsed as 30 | 60 | 90)
    : 30;

  const batasWaktu = new Date();
  batasWaktu.setDate(batasWaktu.getDate() + rentang);
  batasWaktu.setHours(23, 59, 59, 999);

  const batchList = await prisma.batchObat.findMany({
    where: {
      jumlahSisa: { gt: 0 },
      tanggalKedaluwarsa: { lte: batasWaktu },
    },
    include: { obat: true },
    orderBy: { tanggalKedaluwarsa: "asc" },
  });

  const kritisCount = batchList.filter((b) => tingkatUrgensi(selisihHari(b.tanggalKedaluwarsa)) === "kritis").length;

  return (
    <div>
      <PageHeader
        title="Peringatan Kedaluwarsa"
        description={`Batch obat yang akan kedaluwarsa dalam ${rentang} hari ke depan, diurutkan dari yang paling dekat.`}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-sm text-[var(--color-ink-muted)]">Rentang:</span>
        {RENTANG_OPSI.map((opsi) => (
          <Link
            key={opsi}
            href={`/?rentang=${opsi}`}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              rentang === opsi
                ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
                : "border-[var(--color-border-strong)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)]"
            }`}
          >
            {opsi} hari
          </Link>
        ))}

        {kritisCount > 0 ? (
          <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-critical)]">
            <IconAlert className="h-4 w-4" />
            {kritisCount} batch berstatus kritis
          </span>
        ) : null}
      </div>

      {batchList.length === 0 ? (
        <EmptyState
          title={`Tidak ada obat yang mendekati kedaluwarsa dalam ${rentang} hari`}
          description="Semua batch stok aktif masih memiliki masa simpan yang cukup panjang. Coba perbesar rentang untuk melihat lebih jauh ke depan."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink-subtle)]">
                  <th className="px-4 py-3 font-semibold">Obat</th>
                  <th className="px-4 py-3 font-semibold">No. Batch</th>
                  <th className="px-4 py-3 font-semibold">Kedaluwarsa</th>
                  <th className="px-4 py-3 font-semibold">Sisa Hari</th>
                  <th className="px-4 py-3 font-semibold">Stok Sisa</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {batchList.map((batch) => {
                  const hari = selisihHari(batch.tanggalKedaluwarsa);
                  const level = tingkatUrgensi(hari);
                  return (
                    <tr
                      key={batch.id}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-muted)]"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/obat/${batch.obatId}`}
                          className="font-medium text-[var(--color-ink)] hover:text-[var(--color-primary)]"
                        >
                          {batch.obat.nama}
                        </Link>
                        <div className="text-xs text-[var(--color-ink-subtle)]">{batch.obat.kategori}</div>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-muted)]">{batch.nomorBatch}</td>
                      <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                        {formatTanggal(batch.tanggalKedaluwarsa)}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                        {hari < 0 ? `Lewat ${Math.abs(hari)} hari` : `${hari} hari`}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                        {batch.jumlahSisa} {batch.obat.satuan}
                      </td>
                      <td className="px-4 py-3">
                        <UrgensiBadge level={level} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
