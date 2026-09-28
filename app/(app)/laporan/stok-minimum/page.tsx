import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, EmptyState, PageHeader } from "@/components/ui";

export default async function LaporanStokMinimumPage() {
  const obatList = await prisma.obat.findMany({
    include: { batch: { select: { jumlahSisa: true } } },
  });

  const dibawahMinimum = obatList
    .map((obat) => ({
      ...obat,
      totalStok: obat.batch.reduce((sum, b) => sum + b.jumlahSisa, 0),
    }))
    .filter((obat) => obat.totalStok < obat.stokMinimum)
    // Urutkan dari selisih kekurangan terbesar (paling kritis) ke terkecil.
    .sort((a, b) => (b.stokMinimum - b.totalStok) - (a.stokMinimum - a.totalStok));

  return (
    <div>
      <PageHeader
        title="Laporan Stok Minimum"
        description="Obat dengan total stok (gabungan seluruh batch aktif) di bawah ambang batas stok minimum."
      />

      {dibawahMinimum.length === 0 ? (
        <EmptyState
          title="Semua stok aman"
          description="Tidak ada obat yang berada di bawah ambang batas stok minimum saat ini."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink-subtle)]">
                  <th className="px-4 py-3 font-semibold">Obat</th>
                  <th className="px-4 py-3 font-semibold">Stok Saat Ini</th>
                  <th className="px-4 py-3 font-semibold">Stok Minimum</th>
                  <th className="px-4 py-3 font-semibold">Kekurangan</th>
                </tr>
              </thead>
              <tbody>
                {dibawahMinimum.map((obat) => (
                  <tr
                    key={obat.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-muted)]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/obat/${obat.id}`}
                        className="font-medium text-[var(--color-ink)] hover:text-[var(--color-primary)]"
                      >
                        {obat.nama}
                      </Link>
                      <div className="text-xs text-[var(--color-ink-subtle)]">{obat.kategori}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-critical)]">
                      {obat.totalStok} {obat.satuan}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                      {obat.stokMinimum} {obat.satuan}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                      {obat.stokMinimum - obat.totalStok} {obat.satuan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
