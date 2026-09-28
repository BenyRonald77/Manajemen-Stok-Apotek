import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState, ButtonLink } from "@/components/ui";
import { IconPlus } from "@/components/icons";

export default async function DaftarObatPage() {
  const obatList = await prisma.obat.findMany({
    orderBy: { nama: "asc" },
    include: {
      batch: { select: { jumlahSisa: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Data Obat"
        description="Data master obat beserta total stok yang tersimpan lintas seluruh batch."
        action={
          <ButtonLink href="/obat/baru">
            <IconPlus /> Tambah Obat
          </ButtonLink>
        }
      />

      {obatList.length === 0 ? (
        <EmptyState
          title="Belum ada data obat"
          description="Tambahkan obat pertama untuk mulai mencatat batch dan stok."
          action={
            <ButtonLink href="/obat/baru">
              <IconPlus /> Tambah Obat
            </ButtonLink>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink-subtle)]">
                  <th className="px-4 py-3 font-semibold">Nama Obat</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Total Stok</th>
                  <th className="px-4 py-3 font-semibold">Stok Minimum</th>
                </tr>
              </thead>
              <tbody>
                {obatList.map((obat) => {
                  const totalStok = obat.batch.reduce((sum, b) => sum + b.jumlahSisa, 0);
                  const rendah = totalStok < obat.stokMinimum;
                  return (
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
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-muted)]">{obat.kategori}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            rendah
                              ? "font-semibold text-[var(--color-critical)]"
                              : "font-medium text-[var(--color-ink)]"
                          }
                        >
                          {totalStok} {obat.satuan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                        {obat.stokMinimum} {obat.satuan}
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
