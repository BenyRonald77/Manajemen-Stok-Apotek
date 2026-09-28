import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
import { BatchForm } from "./BatchForm";
import { createBatchAction } from "./actions";

export default async function TambahBatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const obat = await prisma.obat.findUnique({ where: { id } });
  if (!obat) notFound();

  const action = createBatchAction.bind(null, obat.id);

  return (
    <div>
      <PageHeader
        title={`Stok Masuk: ${obat.nama}`}
        description="Catat batch baru dari supplier. Sistem otomatis mencatat transaksi stok masuk."
      />
      <Card className="max-w-2xl p-5 sm:p-6">
        <BatchForm action={action} satuan={obat.satuan} />
      </Card>
    </div>
  );
}
