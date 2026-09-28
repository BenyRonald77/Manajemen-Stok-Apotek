import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import { PengeluaranForm } from "./PengeluaranForm";

export default async function PengeluaranPage() {
  const daftarObat = await prisma.obat.findMany({
    orderBy: { nama: "asc" },
    select: { id: true, nama: true, satuan: true },
  });

  return (
    <div>
      <PageHeader
        title="Pengeluaran Stok"
        description="Pilih obat dan jumlah keluar. Batch yang paling dekat kedaluwarsa akan diambil lebih dulu secara otomatis (FEFO)."
      />
      <PengeluaranForm daftarObat={daftarObat} />
    </div>
  );
}
