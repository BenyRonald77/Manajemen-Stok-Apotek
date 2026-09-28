# Manajemen Stok Apotek

Aplikasi internal untuk mencatat stok obat per batch dengan tanggal kedaluwarsa,
mengeluarkan stok secara otomatis mengikuti aturan **FEFO** (First-Expired-First-Out),
memberi peringatan dini obat yang mendekati kedaluwarsa, dan melaporkan obat dengan
stok di bawah ambang batas minimum.

Lihat [`PRD.md`](./PRD.md) untuk detail latar belakang, ruang lingkup, dan spesifikasi
lengkap fitur.

## Ringkasan Fitur

- **CRUD Data Obat** — kelola data master obat (nama, kategori, satuan, stok minimum).
- **Input Batch Stok Masuk** — catat batch baru dari supplier (nomor batch, tanggal
  kedaluwarsa, jumlah, harga beli), otomatis tercatat sebagai transaksi stok masuk.
- **Pengeluaran Stok Otomatis (FEFO)** — pilih obat dan jumlah keluar, sistem otomatis
  mengambil dari batch yang paling dekat kedaluwarsa lebih dulu, lintas beberapa batch
  bila perlu, dan menolak transaksi jika stok tidak mencukupi.
- **Dashboard Peringatan Kedaluwarsa** — daftar batch yang mendekati kedaluwarsa dalam
  30/60/90 hari ke depan, dengan indikator urgensi (Kritis / Waspada / Perhatian).
- **Laporan Stok Minimum** — daftar obat dengan total stok (gabungan seluruh batch aktif)
  di bawah ambang batas stok minimum.
- **Kartu Stok (Riwayat Transaksi)** — riwayat transaksi masuk dan keluar per obat
  dengan saldo berjalan, untuk keperluan audit.
- **Login Admin** — satu akun admin, sesi berbasis cookie, seluruh halaman data
  terlindungi di balik login.

## Cara Menjalankan (Development)

### Prasyarat

- Node.js 20 atau lebih baru
- npm

### Langkah instalasi

1. Salin berkas environment:

   ```bash
   cp .env.example .env
   ```

   Sesuaikan `ADMIN_USERNAME`, `ADMIN_PASSWORD`, dan `SESSION_SECRET` bila perlu.
   `DATABASE_URL` sudah diarahkan ke berkas SQLite lokal (`prisma/dev.db`), tidak
   memerlukan server database eksternal.

2. Pasang dependensi:

   ```bash
   npm install
   ```

3. Jalankan migrasi database (membuat `prisma/dev.db` beserta tabelnya):

   ```bash
   npx prisma migrate dev
   ```

4. Isi database dengan data contoh (akun admin + 12 obat beserta batch dan riwayat
   transaksi, termasuk beberapa batch yang sengaja dibuat mendekati/sudah lewat
   kedaluwarsa untuk menguji dashboard peringatan):

   ```bash
   npm run db:seed
   ```

5. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

### Kredensial admin default

Kredensial berikut dibuat oleh `npm run db:seed` sesuai nilai di `.env`:

| Username | Password    |
| -------- | ----------- |
| `admin`  | `apotek123` |

**Ganti password ini setelah instalasi pertama** dengan mengubah `ADMIN_PASSWORD` di
`.env` lalu menjalankan ulang `npm run db:seed` (skrip ini melakukan upsert, aman
dijalankan berulang kali dan tidak akan menduplikasi data obat berkat pembersihan
tabel stok di awal skrip).

## Build Produksi

```bash
npm run build
npm run start
```

## Struktur Proyek Singkat

- `app/(auth)/login` — halaman dan aksi login/logout.
- `app/(app)/*` — seluruh halaman yang memerlukan login (dashboard, data obat,
  pengeluaran stok, laporan). Dilindungi oleh `proxy.ts` (Next.js Proxy) yang
  memeriksa cookie sesi pada setiap request.
- `lib/fefo.ts` — logika inti algoritma FEFO, dijalankan dalam satu transaksi
  database agar atomic.
- `lib/validation.ts` — skema validasi input (Zod) untuk obat, batch, dan pengeluaran.
- `prisma/schema.prisma` — skema database (Admin, Obat, BatchObat, TransaksiStok).
- `prisma/seed.ts` — skrip seed data contoh.

## Batasan Versi Ini

- Single-tenant: satu apotek, satu akun admin (lihat `PRD.md` bagian Batasan/Asumsi
  untuk daftar lengkap di luar lingkup versi ini, seperti modul kasir/POS, multi-cabang,
  dan notifikasi via email/WhatsApp).
- Basis data SQLite berbasis berkas (`prisma/dev.db`), cocok untuk instalasi lokal satu
  apotek; migrasi ke database server dapat dipertimbangkan bila kebutuhan berkembang.

## Kontributor

- BenyRonald77
