import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysFromNow(offset: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

type BatchSeed = {
  nomorBatch: string;
  masukOffset: number; // hari relatif dari sekarang saat batch diterima
  kedaluwarsaOffset: number; // hari relatif dari sekarang saat batch kedaluwarsa
  jumlahAwal: number;
  hargaBeli: number;
  supplier: string;
  keluar?: number; // opsional: jumlah yang sudah dikeluarkan sejak batch ini masuk (FEFO manual di seed)
};

type ObatSeed = {
  nama: string;
  kategori: string;
  satuan: string;
  stokMinimum: number;
  batch: BatchSeed[];
};

const DATA: ObatSeed[] = [
  {
    nama: "Paracetamol 500mg",
    kategori: "Analgesik",
    satuan: "tablet",
    stokMinimum: 200,
    batch: [
      { nomorBatch: "PCT-2609-01", masukOffset: -60, kedaluwarsaOffset: 4, jumlahAwal: 300, hargaBeli: 350, supplier: "PT Kimia Farma Trading" },
      { nomorBatch: "PCT-2609-02", masukOffset: -10, kedaluwarsaOffset: 380, jumlahAwal: 400, hargaBeli: 360, supplier: "PT Kimia Farma Trading" },
    ],
  },
  {
    nama: "Amoxicillin 500mg",
    kategori: "Antibiotik",
    satuan: "kapsul",
    stokMinimum: 100,
    batch: [
      { nomorBatch: "AMX-2607-11", masukOffset: -90, kedaluwarsaOffset: 18, jumlahAwal: 150, hargaBeli: 900, supplier: "PT Anugerah Pharmindo", keluar: 40 },
      { nomorBatch: "AMX-2609-05", masukOffset: -5, kedaluwarsaOffset: 300, jumlahAwal: 120, hargaBeli: 920, supplier: "PT Anugerah Pharmindo" },
    ],
  },
  {
    nama: "Vitamin C 500mg",
    kategori: "Vitamin & Suplemen",
    satuan: "tablet",
    stokMinimum: 150,
    batch: [
      { nomorBatch: "VTC-2608-07", masukOffset: -45, kedaluwarsaOffset: 55, jumlahAwal: 250, hargaBeli: 400, supplier: "PT Sarana Sehat Distribusi" },
    ],
  },
  {
    nama: "Cetirizine 10mg",
    kategori: "Antihistamin",
    satuan: "tablet",
    stokMinimum: 80,
    batch: [
      { nomorBatch: "CTZ-2607-02", masukOffset: -80, kedaluwarsaOffset: -3, jumlahAwal: 100, hargaBeli: 500, supplier: "PT Distribusi Farma Utama", keluar: 90 },
      { nomorBatch: "CTZ-2609-09", masukOffset: -3, kedaluwarsaOffset: 250, jumlahAwal: 100, hargaBeli: 520, supplier: "PT Distribusi Farma Utama" },
    ],
  },
  {
    nama: "Obat Batuk Hitam (OBH)",
    kategori: "Obat Batuk & Flu",
    satuan: "botol",
    stokMinimum: 40,
    batch: [
      { nomorBatch: "OBH-2606-14", masukOffset: -110, kedaluwarsaOffset: 9, jumlahAwal: 60, hargaBeli: 8500, supplier: "PT Herbal Nusantara" },
    ],
  },
  {
    nama: "Antasida Doen Tablet Kunyah",
    kategori: "Obat Lambung",
    satuan: "tablet",
    stokMinimum: 100,
    batch: [
      { nomorBatch: "ANT-2605-03", masukOffset: -130, kedaluwarsaOffset: 60, jumlahAwal: 200, hargaBeli: 250, supplier: "PT Kimia Farma Trading" },
      { nomorBatch: "ANT-2609-01", masukOffset: -2, kedaluwarsaOffset: 400, jumlahAwal: 150, hargaBeli: 260, supplier: "PT Kimia Farma Trading" },
    ],
  },
  {
    nama: "Betadine Larutan Antiseptik",
    kategori: "Antiseptik",
    satuan: "botol",
    stokMinimum: 25,
    batch: [
      { nomorBatch: "BTD-2604-08", masukOffset: -150, kedaluwarsaOffset: 500, jumlahAwal: 30, hargaBeli: 15000, supplier: "PT Mahakam Beta Farma" },
    ],
  },
  {
    nama: "Dexamethasone 0.5mg",
    kategori: "Antiinflamasi",
    satuan: "tablet",
    stokMinimum: 60,
    batch: [
      { nomorBatch: "DEX-2607-06", masukOffset: -70, kedaluwarsaOffset: 25, jumlahAwal: 80, hargaBeli: 150, supplier: "PT Anugerah Pharmindo" },
    ],
  },
  {
    nama: "Omeprazole 20mg",
    kategori: "Obat Lambung",
    satuan: "kapsul",
    stokMinimum: 70,
    batch: [
      { nomorBatch: "OMZ-2608-02", masukOffset: -40, kedaluwarsaOffset: 200, jumlahAwal: 90, hargaBeli: 1200, supplier: "PT Sarana Sehat Distribusi", keluar: 30 },
    ],
  },
  {
    nama: "Salbutamol Inhaler 100mcg",
    kategori: "Obat Saluran Napas",
    satuan: "tabung",
    stokMinimum: 15,
    batch: [
      { nomorBatch: "SAL-2606-01", masukOffset: -95, kedaluwarsaOffset: 6, jumlahAwal: 20, hargaBeli: 35000, supplier: "PT Distribusi Farma Utama" },
    ],
  },
  {
    nama: "Metformin 500mg",
    kategori: "Antidiabetes",
    satuan: "tablet",
    stokMinimum: 120,
    batch: [
      { nomorBatch: "MET-2607-09", masukOffset: -75, kedaluwarsaOffset: 40, jumlahAwal: 200, hargaBeli: 300, supplier: "PT Kimia Farma Trading" },
      { nomorBatch: "MET-2609-04", masukOffset: -8, kedaluwarsaOffset: 420, jumlahAwal: 150, hargaBeli: 310, supplier: "PT Kimia Farma Trading" },
    ],
  },
  {
    nama: "Ibuprofen 400mg",
    kategori: "Analgesik",
    satuan: "tablet",
    stokMinimum: 150,
    batch: [
      { nomorBatch: "IBU-2608-05", masukOffset: -50, kedaluwarsaOffset: 70, jumlahAwal: 180, hargaBeli: 450, supplier: "PT Anugerah Pharmindo" },
    ],
  },
];

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "apotek123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
  console.log(`Admin siap: username="${username}"`);

  // Bersihkan data stok lama agar seed bisa dijalankan berulang kali dengan hasil konsisten.
  await prisma.transaksiStok.deleteMany();
  await prisma.batchObat.deleteMany();
  await prisma.obat.deleteMany();

  for (const item of DATA) {
    const obat = await prisma.obat.create({
      data: {
        nama: item.nama,
        kategori: item.kategori,
        satuan: item.satuan,
        stokMinimum: item.stokMinimum,
      },
    });

    for (const b of item.batch) {
      const tanggalMasuk = daysFromNow(b.masukOffset);
      const tanggalKedaluwarsa = daysFromNow(b.kedaluwarsaOffset);
      const keluar = b.keluar ?? 0;
      const jumlahSisa = b.jumlahAwal - keluar;

      const batch = await prisma.batchObat.create({
        data: {
          obatId: obat.id,
          nomorBatch: b.nomorBatch,
          tanggalMasuk,
          tanggalKedaluwarsa,
          jumlahAwal: b.jumlahAwal,
          jumlahSisa,
          hargaBeli: b.hargaBeli,
          supplier: b.supplier,
        },
      });

      await prisma.transaksiStok.create({
        data: {
          obatId: obat.id,
          batchId: batch.id,
          jenis: "MASUK",
          jumlah: b.jumlahAwal,
          tanggal: tanggalMasuk,
          keterangan: `Stok masuk batch ${b.nomorBatch} dari ${b.supplier}`,
        },
      });

      if (keluar > 0) {
        // Tanggal keluar disimulasikan di tengah antara tanggal masuk dan hari ini.
        const tengah = new Date(
          tanggalMasuk.getTime() + (Date.now() - tanggalMasuk.getTime()) / 2
        );
        await prisma.transaksiStok.create({
          data: {
            obatId: obat.id,
            batchId: batch.id,
            jenis: "KELUAR",
            jumlah: keluar,
            tanggal: tengah,
            keterangan: "Penjualan resep (data contoh)",
          },
        });
      }
    }
  }

  console.log(`Seed selesai: ${DATA.length} obat beserta batch dan riwayat transaksinya.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
