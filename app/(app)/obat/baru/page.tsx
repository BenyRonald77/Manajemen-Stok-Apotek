import { Card, PageHeader } from "@/components/ui";
import { ObatForm } from "../ObatForm";
import { createObatAction } from "../actions";

export default function TambahObatPage() {
  return (
    <div>
      <PageHeader title="Tambah Obat" description="Buat data master obat baru." />
      <Card className="max-w-2xl p-5 sm:p-6">
        <ObatForm action={createObatAction} submitLabel="Simpan Obat" pendingLabel="Menyimpan..." />
      </Card>
    </div>
  );
}
