"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { keluarkanStokFefo, StokTidakCukupError, type BatchTerpakai } from "@/lib/fefo";
import { pengeluaranSchema, flattenZodError } from "@/lib/validation";

export type PengeluaranState = {
  errors?: Record<string, string>;
  values?: { obatId?: string; jumlah?: string; keterangan?: string };
  hasil?: {
    obatNama: string;
    jumlah: number;
    batchTerpakai: BatchTerpakai[];
  };
};

export async function keluarkanStokAction(
  _prev: PengeluaranState,
  formData: FormData
): Promise<PengeluaranState> {
  const raw = {
    obatId: String(formData.get("obatId") ?? ""),
    jumlah: String(formData.get("jumlah") ?? ""),
    keterangan: String(formData.get("keterangan") ?? ""),
  };

  const parsed = pengeluaranSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: flattenZodError(parsed.error), values: raw };
  }

  const obat = await prisma.obat.findUnique({ where: { id: parsed.data.obatId } });
  if (!obat) {
    return { errors: { obatId: "Obat tidak ditemukan." }, values: raw };
  }

  try {
    const batchTerpakai = await keluarkanStokFefo({
      obatId: parsed.data.obatId,
      jumlah: parsed.data.jumlah,
      keterangan: parsed.data.keterangan || null,
    });

    revalidatePath("/");
    revalidatePath("/obat");
    revalidatePath(`/obat/${obat.id}`);
    revalidatePath("/laporan/stok-minimum");

    return {
      values: { obatId: "", jumlah: "", keterangan: "" },
      hasil: {
        obatNama: obat.nama,
        jumlah: parsed.data.jumlah,
        batchTerpakai,
      },
    };
  } catch (err) {
    if (err instanceof StokTidakCukupError) {
      return {
        errors: {
          _form: `Stok tidak mencukupi untuk ${obat.nama}. Diminta ${err.diminta}, tersedia ${err.tersedia}.`,
        },
        values: raw,
      };
    }
    throw err;
  }
}
