import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ButtonLink, Card, PageHeader } from "@/components/ui";
import { IconEdit } from "@/components/icons";
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
    include: { batch: { select: { jumlahSisa: true } } },
  });

  if (!obat) notFound();

  const totalStok = obat.batch.reduce((sum, b) => sum + b.jumlahSisa, 0);
  const deleteAction = deleteObatAction.bind(null, obat.id);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={obat.nama}
        description={`${obat.kategori} · Satuan ${obat.satuan}`}
        action={
          <ButtonLink href={`/obat/${obat.id}/edit`} variant="secondary">
            <IconEdit /> Ubah
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <section className="flex justify-between border-t border-[var(--color-border)] pt-6">
        <Link href="/obat" className="text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
          ← Kembali ke Data Obat
        </Link>
        <DeleteObatButton action={deleteAction} />
      </section>
    </div>
  );
}
