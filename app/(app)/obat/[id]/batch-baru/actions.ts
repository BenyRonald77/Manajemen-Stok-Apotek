"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { batchSchema, flattenZodError } from "@/lib/validation";

export type BatchFormState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export async function createBatchAction(
  obatId: string,
  _prev: BatchFormState,
  formData: FormData
): Promise<BatchFormState> {
  const raw = {
    nomorBatch: String(formData.get("nomorBatch") ?? ""),
    tanggalMasuk: String(formData.get("tanggalMasuk") ?? ""),
    tanggalKedaluwarsa: String(formData.get("tanggalKedaluwarsa") ?? ""),
    jumlahAwal: String(formData.get("jumlahAwal") ?? ""),
    hargaBeli: String(formData.get("hargaBeli") ?? ""),
    supplier: String(formData.get("supplier") ?? ""),
  };

  const parsed = batchSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: flattenZodError(parsed.error), values: raw };
  }

  const obat = await prisma.obat.findUnique({ where: { id: obatId } });
  if (!obat) {
    return { errors: { _form: "Obat tidak ditemukan." }, values: raw };
  }

  await prisma.$transaction(async (tx) => {
    const batch = await tx.batchObat.create({
      data: {
        obatId,
        nomorBatch: parsed.data.nomorBatch,
        tanggalMasuk: new Date(parsed.data.tanggalMasuk),
        tanggalKedaluwarsa: new Date(parsed.data.tanggalKedaluwarsa),
        jumlahAwal: parsed.data.jumlahAwal,
        jumlahSisa: parsed.data.jumlahAwal,
        hargaBeli: parsed.data.hargaBeli,
        supplier: parsed.data.supplier,
      },
    });

    await tx.transaksiStok.create({
      data: {
        obatId,
        batchId: batch.id,
        jenis: "MASUK",
        jumlah: parsed.data.jumlahAwal,
        tanggal: new Date(parsed.data.tanggalMasuk),
        keterangan: `Stok masuk batch ${parsed.data.nomorBatch} dari ${parsed.data.supplier}`,
      },
    });
  });

  revalidatePath(`/obat/${obatId}`);
  revalidatePath("/obat");
  revalidatePath("/");
  redirect(`/obat/${obatId}`);
}
