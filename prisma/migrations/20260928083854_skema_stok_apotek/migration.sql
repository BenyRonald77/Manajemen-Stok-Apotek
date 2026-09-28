-- CreateTable
CREATE TABLE "Obat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "stokMinimum" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BatchObat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "obatId" TEXT NOT NULL,
    "nomorBatch" TEXT NOT NULL,
    "tanggalMasuk" DATETIME NOT NULL,
    "tanggalKedaluwarsa" DATETIME NOT NULL,
    "jumlahAwal" INTEGER NOT NULL,
    "jumlahSisa" INTEGER NOT NULL,
    "hargaBeli" REAL NOT NULL,
    "supplier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BatchObat_obatId_fkey" FOREIGN KEY ("obatId") REFERENCES "Obat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransaksiStok" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "obatId" TEXT NOT NULL,
    "batchId" TEXT,
    "jenis" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TransaksiStok_obatId_fkey" FOREIGN KEY ("obatId") REFERENCES "Obat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TransaksiStok_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "BatchObat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BatchObat_obatId_idx" ON "BatchObat"("obatId");

-- CreateIndex
CREATE INDEX "BatchObat_tanggalKedaluwarsa_idx" ON "BatchObat"("tanggalKedaluwarsa");

-- CreateIndex
CREATE INDEX "TransaksiStok_obatId_idx" ON "TransaksiStok"("obatId");

-- CreateIndex
CREATE INDEX "TransaksiStok_batchId_idx" ON "TransaksiStok"("batchId");
