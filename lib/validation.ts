import { z } from "zod";

export const obatSchema = z.object({
  nama: z.string().trim().min(2, "Nama obat minimal 2 karakter.").max(120),
  kategori: z.string().trim().min(2, "Kategori wajib diisi.").max(60),
  satuan: z.string().trim().min(1, "Satuan wajib diisi.").max(30),
  stokMinimum: z.coerce
    .number({ message: "Stok minimum harus berupa angka." })
    .int("Stok minimum harus bilangan bulat.")
    .min(0, "Stok minimum tidak boleh negatif."),
});

export type ObatInput = z.infer<typeof obatSchema>;

export const batchSchema = z
  .object({
    nomorBatch: z.string().trim().min(1, "Nomor batch wajib diisi.").max(60),
    tanggalMasuk: z.string().min(1, "Tanggal masuk wajib diisi."),
    tanggalKedaluwarsa: z.string().min(1, "Tanggal kedaluwarsa wajib diisi."),
    jumlahAwal: z.coerce
      .number({ message: "Jumlah harus berupa angka." })
      .int("Jumlah harus bilangan bulat.")
      .positive("Jumlah harus lebih dari 0."),
    hargaBeli: z.coerce
      .number({ message: "Harga beli harus berupa angka." })
      .min(0, "Harga beli tidak boleh negatif."),
    supplier: z.string().trim().min(1, "Supplier wajib diisi.").max(120),
  })
  .refine(
    (data) => new Date(data.tanggalKedaluwarsa) > new Date(data.tanggalMasuk),
    {
      message: "Tanggal kedaluwarsa harus setelah tanggal masuk.",
      path: ["tanggalKedaluwarsa"],
    }
  );

export type BatchInput = z.infer<typeof batchSchema>;

export const pengeluaranSchema = z.object({
  obatId: z.string().min(1, "Pilih obat terlebih dahulu."),
  jumlah: z.coerce
    .number({ message: "Jumlah harus berupa angka." })
    .int("Jumlah harus bilangan bulat.")
    .positive("Jumlah harus lebih dari 0."),
  keterangan: z.string().trim().max(200).optional().or(z.literal("")),
});

export type PengeluaranInput = z.infer<typeof pengeluaranSchema>;

export function flattenZodError(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
