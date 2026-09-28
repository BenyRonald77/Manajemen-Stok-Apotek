import { prisma } from "@/lib/prisma";

export class StokTidakCukupError extends Error {
  tersedia: number;
  diminta: number;

  constructor(tersedia: number, diminta: number) {
    super(
      `Stok tidak mencukupi. Diminta ${diminta}, tersedia ${tersedia}.`
    );
    this.name = "StokTidakCukupError";
    this.tersedia = tersedia;
    this.diminta = diminta;
  }
}

export type BatchTerpakai = {
  batchId: string;
  nomorBatch: string;
  tanggalKedaluwarsa: Date;
  jumlahDiambil: number;
};

/**
 * Mengeluarkan stok obat mengikuti FEFO (First-Expired-First-Out): batch
 * dengan tanggalKedaluwarsa paling dekat diambil lebih dulu, lintas beberapa
 * batch bila perlu, sampai jumlah yang diminta terpenuhi. Seluruh perubahan
 * (jumlahSisa batch + pencatatan TransaksiStok) dijalankan dalam satu
 * transaksi database agar atomic: gagal di tengah jalan berarti tidak ada
 * perubahan sama sekali.
 */
export async function keluarkanStokFefo(params: {
  obatId: string;
  jumlah: number;
  keterangan?: string | null;
}): Promise<BatchTerpakai[]> {
  const { obatId, jumlah, keterangan } = params;

  return prisma.$transaction(async (tx) => {
    const batchTersedia = await tx.batchObat.findMany({
      where: { obatId, jumlahSisa: { gt: 0 } },
      orderBy: { tanggalKedaluwarsa: "asc" },
    });

    const totalTersedia = batchTersedia.reduce((sum, b) => sum + b.jumlahSisa, 0);
    if (totalTersedia < jumlah) {
      throw new StokTidakCukupError(totalTersedia, jumlah);
    }

    let sisaKebutuhan = jumlah;
    const terpakai: BatchTerpakai[] = [];

    for (const batch of batchTersedia) {
      if (sisaKebutuhan <= 0) break;

      const diambil = Math.min(batch.jumlahSisa, sisaKebutuhan);

      await tx.batchObat.update({
        where: { id: batch.id },
        data: { jumlahSisa: { decrement: diambil } },
      });

      await tx.transaksiStok.create({
        data: {
          obatId,
          batchId: batch.id,
          jenis: "KELUAR",
          jumlah: diambil,
          keterangan: keterangan || null,
        },
      });

      terpakai.push({
        batchId: batch.id,
        nomorBatch: batch.nomorBatch,
        tanggalKedaluwarsa: batch.tanggalKedaluwarsa,
        jumlahDiambil: diambil,
      });

      sisaKebutuhan -= diambil;
    }

    return terpakai;
  });
}
