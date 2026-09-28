"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obatSchema, flattenZodError } from "@/lib/validation";

export type ObatFormState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export async function createObatAction(
  _prev: ObatFormState,
  formData: FormData
): Promise<ObatFormState> {
  const raw = {
    nama: String(formData.get("nama") ?? ""),
    kategori: String(formData.get("kategori") ?? ""),
    satuan: String(formData.get("satuan") ?? ""),
    stokMinimum: String(formData.get("stokMinimum") ?? ""),
  };

  const parsed = obatSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: flattenZodError(parsed.error), values: raw };
  }

  const obat = await prisma.obat.create({ data: parsed.data });
  revalidatePath("/obat");
  redirect(`/obat/${obat.id}`);
}

export async function updateObatAction(
  obatId: string,
  _prev: ObatFormState,
  formData: FormData
): Promise<ObatFormState> {
  const raw = {
    nama: String(formData.get("nama") ?? ""),
    kategori: String(formData.get("kategori") ?? ""),
    satuan: String(formData.get("satuan") ?? ""),
    stokMinimum: String(formData.get("stokMinimum") ?? ""),
  };

  const parsed = obatSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: flattenZodError(parsed.error), values: raw };
  }

  await prisma.obat.update({ where: { id: obatId }, data: parsed.data });
  revalidatePath("/obat");
  revalidatePath(`/obat/${obatId}`);
  redirect(`/obat/${obatId}`);
}

export type DeleteObatState = { error?: string };

export async function deleteObatAction(
  obatId: string,
  _prev: DeleteObatState
): Promise<DeleteObatState> {
  const stokAktif = await prisma.batchObat.aggregate({
    where: { obatId, jumlahSisa: { gt: 0 } },
    _sum: { jumlahSisa: true },
  });

  const totalStok = stokAktif._sum.jumlahSisa ?? 0;
  if (totalStok > 0) {
    return {
      error: `Obat ini masih memiliki stok aktif sebanyak ${totalStok}. Habiskan atau pindahkan stoknya terlebih dahulu sebelum menghapus data obat.`,
    };
  }

  await prisma.obat.delete({ where: { id: obatId } });
  revalidatePath("/obat");
  redirect("/obat");
}
