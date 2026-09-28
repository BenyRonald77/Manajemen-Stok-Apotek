import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
import { ObatForm } from "../../ObatForm";
import { updateObatAction } from "../../actions";

export default async function EditObatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const obat = await prisma.obat.findUnique({ where: { id } });
  if (!obat) notFound();

  const action = updateObatAction.bind(null, obat.id);

  return (
    <div>
      <PageHeader title={`Ubah Obat: ${obat.nama}`} description="Perbarui data master obat." />
      <Card className="max-w-2xl p-5 sm:p-6">
        <ObatForm
          action={action}
          initial={{
            nama: obat.nama,
            kategori: obat.kategori,
            satuan: obat.satuan,
            stokMinimum: String(obat.stokMinimum),
          }}
          submitLabel="Simpan Perubahan"
          pendingLabel="Menyimpan..."
        />
      </Card>
    </div>
  );
}
