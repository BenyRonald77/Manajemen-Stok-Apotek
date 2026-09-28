# PRD: Sistem Manajemen Stok Apotek

## 1. Latar Belakang & Tujuan

Apotek menyimpan obat dalam banyak batch dengan tanggal kedaluwarsa yang berbeda-beda. Pengelolaan manual menggunakan buku atau spreadsheet rawan menyebabkan:

- Obat yang kedaluwarsa lebih dulu tidak dikeluarkan lebih dulu (bukan FEFO/First-Expired-First-Out), sehingga obat menumpuk dan kedaluwarsa sia-sia.
- Tidak ada peringatan dini sebelum obat kedaluwarsa, sehingga kerugian baru diketahui setelah terlambat.
- Stok obat penting habis tanpa disadari karena tidak ada pemantauan stok minimum.
- Tidak ada riwayat transaksi yang jelas per obat untuk audit dan rekonsiliasi.

Tujuan aplikasi ini adalah menyediakan sistem pencatatan stok obat berbasis batch yang:

1. Mencatat setiap obat masuk sebagai batch dengan nomor batch dan tanggal kedaluwarsa.
2. Mengeluarkan stok secara otomatis mengikuti aturan FEFO (batch dengan tanggal kedaluwarsa paling dekat dikeluarkan lebih dulu).
3. Memberi peringatan visual untuk batch yang mendekati kedaluwarsa.
4. Menyediakan laporan obat dengan stok di bawah batas minimum.
5. Menyediakan kartu stok (riwayat transaksi) per obat untuk transparansi dan audit.

## 2. Target Pengguna

- **Admin/Petugas Apotek**: pengguna utama, bertanggung jawab mencatat obat masuk, mengeluarkan stok, dan memantau dashboard peringatan. Aplikasi ini adalah alat internal apotek, seluruh fitur berada di balik login, tidak ada halaman publik.
- Skala penggunaan: apotek tunggal (bukan multi-cabang), dengan satu akun admin.

## 3. Ruang Lingkup

### Termasuk (in-scope)

- CRUD data master obat (nama, kategori, satuan, stok minimum).
- Pencatatan batch stok masuk (nomor batch, tanggal kedaluwarsa, jumlah, harga beli, supplier, tanggal masuk).
- Pengeluaran stok otomatis dengan algoritma FEFO lintas batch.
- Dashboard peringatan obat mendekati kedaluwarsa dengan filter rentang hari (30/60/90).
- Laporan stok minimum (obat dengan total stok di bawah ambang batas).
- Kartu stok / riwayat transaksi per obat dengan saldo berjalan.
- Autentikasi admin sederhana (login/logout) berbasis cookie session.
- Seed data contoh untuk demo dan pengujian.

### Tidak termasuk (out of scope)

- Manajemen multi-cabang/multi-apotek.
- Modul penjualan/kasir (POS) dan integrasi resep dokter.
- Modul pembelian/purchase order ke supplier (pencatatan batch masuk dianggap sudah hasil pembelian).
- Multi-role/multi-user dengan hak akses berjenjang (hanya satu akun admin).
- Notifikasi via email/WhatsApp/SMS (peringatan hanya ditampilkan di dashboard aplikasi).
- Laporan keuangan/akuntansi dan integrasi pajak.
- Aplikasi mobile native (hanya web, responsif untuk desktop dan tablet).

## 4. Daftar Fitur & User Story

### F1. Autentikasi Admin
- Sebagai admin, saya ingin login dengan username dan password agar hanya saya yang bisa mengubah data stok.
- Sebagai admin, saya ingin logout agar sesi saya aman ketika perangkat digunakan orang lain.

### F2. CRUD Data Obat
- Sebagai admin, saya ingin menambah data obat baru (nama, kategori, satuan, stok minimum) agar obat bisa dicatat batch-nya.
- Sebagai admin, saya ingin mengubah data obat agar informasi tetap akurat.
- Sebagai admin, saya ingin menghapus data obat yang tidak lagi dijual, dengan proteksi agar obat yang masih punya riwayat transaksi tidak terhapus sembarangan.
- Sebagai admin, saya ingin melihat daftar seluruh obat beserta total stok saat ini.

### F3. Input Batch Stok Masuk
- Sebagai admin, saya ingin mencatat batch baru saat obat datang dari supplier (nomor batch, tanggal masuk, tanggal kedaluwarsa, jumlah, harga beli, supplier) agar stok bertambah dan tercatat sumbernya.
- Sebagai admin, sistem harus otomatis mencatat transaksi MASUK setiap kali batch baru dibuat.

### F4. Pengeluaran Stok Otomatis FEFO
- Sebagai admin, saya ingin memilih obat dan memasukkan jumlah keluar, lalu sistem otomatis memilih batch mana yang dipakai berdasarkan FEFO, agar saya tidak perlu menghitung manual batch mana yang harus dikeluarkan lebih dulu.
- Sebagai admin, saya ingin sistem menolak transaksi dengan pesan jelas jika total stok obat tidak mencukupi.
- Sebagai admin, saya ingin melihat rincian batch apa saja (nomor batch, jumlah yang diambil) yang terpakai setelah transaksi keluar berhasil.

### F5. Dashboard Peringatan Kedaluwarsa
- Sebagai admin, saya ingin melihat daftar batch yang akan kedaluwarsa dalam 30/60/90 hari ke depan, diurutkan dari yang paling dekat, agar saya bisa memprioritaskan penjualan atau retur.
- Sebagai admin, saya ingin indikator visual tingkat urgensi (misalnya kritis <7 hari, waspada <30 hari, perhatian <90 hari) agar cepat mengenali prioritas.

### F6. Laporan Stok Minimum
- Sebagai admin, saya ingin melihat daftar obat yang total stoknya (gabungan seluruh batch aktif) di bawah stok minimum, agar saya tahu obat apa yang perlu segera dipesan ulang.

### F7. Kartu Stok / Riwayat Transaksi per Obat
- Sebagai admin, saya ingin membuka detail satu obat dan melihat seluruh riwayat transaksi (masuk & keluar) berurutan waktu dengan saldo berjalan, agar saya bisa menelusuri pergerakan stok untuk audit.

## 5. Alur Proses Utama

### 5.1 Alur Obat Masuk
1. Admin memilih obat pada halaman detail obat atau form batch masuk.
2. Admin mengisi nomor batch, tanggal masuk, tanggal kedaluwarsa, jumlah, harga beli, dan supplier.
3. Sistem membuat record `BatchObat` baru dengan `jumlahSisa = jumlahAwal`.
4. Sistem mencatat `TransaksiStok` jenis MASUK terkait batch tersebut.
5. Stok total obat bertambah sesuai jumlah yang diinput.

### 5.2 Alur Pengeluaran Stok (FEFO) — alur inti aplikasi
1. Admin membuka form pengeluaran stok, memilih obat, dan memasukkan jumlah yang ingin dikeluarkan beserta keterangan (misal: "penjualan", "retur ke distributor", dll).
2. Sistem mengambil seluruh `BatchObat` milik obat tersebut dengan `jumlahSisa > 0`, diurutkan `tanggalKedaluwarsa ASC` (paling cepat kedaluwarsa di urutan pertama).
3. Sistem menjumlahkan `jumlahSisa` seluruh batch tersebut. Jika total lebih kecil dari jumlah yang diminta, transaksi ditolak dengan pesan error yang menyebutkan stok tersedia vs jumlah diminta.
4. Jika stok cukup, sistem melakukan iterasi batch demi batch (dari yang paling dekat kedaluwarsa):
   - Ambil sebanyak mungkin dari batch saat ini (`min(jumlahSisa batch, sisa kebutuhan)`).
   - Kurangi `jumlahSisa` batch tersebut.
   - Catat satu `TransaksiStok` jenis KELUAR untuk batch tersebut dengan jumlah yang diambil.
   - Lanjut ke batch berikutnya jika kebutuhan belum terpenuhi.
5. Seluruh langkah 3-4 dijalankan dalam satu transaksi database (atomic) agar tidak terjadi kondisi stok tidak konsisten jika terjadi kegagalan di tengah proses.
6. Setelah berhasil, sistem menampilkan ringkasan: daftar batch yang terpakai (nomor batch, tanggal kedaluwarsa, jumlah diambil).

### 5.3 Alur Peringatan Kedaluwarsa
1. Admin membuka dashboard, memilih rentang hari (default 30, bisa 60/90).
2. Sistem mengambil seluruh `BatchObat` dengan `jumlahSisa > 0` dan `tanggalKedaluwarsa <= hari ini + N hari`, diurutkan `tanggalKedaluwarsa ASC`.
3. Setiap baris diberi label urgensi: **Kritis** (sudah lewat atau ≤7 hari), **Waspada** (8-30 hari), **Perhatian** (31 hari ke rentang yang dipilih).

### 5.4 Alur Laporan Stok Minimum
1. Sistem menghitung total `jumlahSisa` seluruh batch aktif per obat.
2. Obat dengan total tersebut `< stokMinimum` ditampilkan dalam daftar, diurutkan dari yang paling kritis (selisih terbesar dari ambang batas, atau stok 0 di atas).

## 6. Skema Data (Entitas & Field)

### Obat
| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| nama | String | Nama obat |
| kategori | String | Contoh: Analgesik, Antibiotik, Vitamin |
| satuan | String | Contoh: tablet, botol, strip, kapsul |
| stokMinimum | Int | Ambang batas stok minimum |
| createdAt / updatedAt | DateTime | Audit |

### BatchObat
| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| obatId | String | FK ke Obat |
| nomorBatch | String | Nomor batch/lot dari supplier |
| tanggalMasuk | DateTime | Tanggal batch diterima |
| tanggalKedaluwarsa | DateTime | Tanggal kedaluwarsa |
| jumlahAwal | Int | Jumlah awal saat masuk |
| jumlahSisa | Int | Sisa stok batch ini saat ini |
| hargaBeli | Decimal/Float | Harga beli per satuan |
| supplier | String | Nama pemasok |
| createdAt | DateTime | Audit |

### TransaksiStok
| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| obatId | String | FK ke Obat |
| batchId | String? | FK ke BatchObat, nullable (fleksibilitas histori) |
| jenis | Enum | MASUK / KELUAR |
| jumlah | Int | Jumlah pada transaksi ini |
| tanggal | DateTime | Waktu transaksi |
| keterangan | String? | Catatan bebas |

### Admin
| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| username | String (unique) | Untuk login |
| passwordHash | String | Hash bcrypt |

## 7. Kriteria Penerimaan per Fitur

**F1 Autentikasi**
- Akses ke seluruh route data (obat, batch, transaksi, dashboard, laporan) ditolak dan diarahkan ke halaman login jika belum login.
- Login gagal dengan kredensial salah menampilkan pesan error, tidak membocorkan apakah username atau password yang salah.
- Sesi tersimpan di cookie httpOnly dan bertahan sampai logout atau kedaluwarsa sesi.

**F2 CRUD Obat**
- Form tambah/edit obat memvalidasi field wajib (nama, kategori, satuan, stok minimum ≥ 0).
- Obat yang punya batch/transaksi tidak bisa dihapus permanen tanpa konfirmasi eksplisit; sistem mencegah penghapusan jika masih ada batch aktif dengan stok > 0, dengan pesan error jelas.
- Daftar obat menampilkan total stok terkini (sum jumlahSisa semua batch) di samping data master.

**F3 Input Batch**
- Semua field wajib divalidasi (jumlah > 0, tanggal kedaluwarsa harus valid, harga beli ≥ 0).
- Setelah simpan, `TransaksiStok` MASUK otomatis muncul di kartu stok obat terkait dengan jumlah yang sama.

**F4 Pengeluaran FEFO**
- Ketika stok mencukupi lintas beberapa batch, pengurangan dilakukan mulai dari `tanggalKedaluwarsa` paling dekat lebih dulu, dan hasil pemakaian batch ditampilkan setelah transaksi berhasil.
- Ketika total stok tidak mencukupi, tidak ada perubahan data (rollback penuh) dan pesan error menyebutkan jumlah diminta vs stok tersedia.
- Batch dengan `jumlahSisa = 0` tidak pernah dipilih.

**F5 Dashboard Kedaluwarsa**
- Filter 30/60/90 hari mengubah daftar sesuai rentang tanpa reload penuh (dapat via query param).
- Batch dengan status "Kritis" (≤7 hari atau sudah lewat) secara visual paling menonjol dibanding "Waspada" dan "Perhatian".
- Batch dengan `jumlahSisa = 0` tidak ditampilkan (sudah habis, tidak relevan untuk peringatan).

**F6 Laporan Stok Minimum**
- Hanya obat dengan total stok aktual < stokMinimum yang muncul.
- Ketika tidak ada obat yang memenuhi kondisi tersebut, halaman menampilkan status kosong yang jelas ("semua stok aman"), bukan tabel kosong tanpa penjelasan.

**F7 Kartu Stok**
- Riwayat transaksi diurutkan dari yang terbaru atau terlama (dapat dibalik), menampilkan jenis, jumlah, tanggal, keterangan, dan saldo berjalan setelah transaksi tersebut.
- Saldo berjalan yang dihitung konsisten dengan total `jumlahSisa` batch aktif saat ini.

## 8. Rencana Teknis

- **Framework**: Next.js 14+ (App Router), TypeScript.
- **Styling**: Tailwind CSS dengan palet dan tipografi kustom (lihat identitas visual di README/kode, bukan default shadcn tanpa modifikasi).
- **ORM & Database**: Prisma ORM dengan SQLite (`prisma/dev.db`), zero external dependency, cocok untuk instalasi lokal apotek tunggal.
- **Validasi**: Zod untuk validasi input form/API.
- **Autentikasi**: Session cookie httpOnly sederhana, password admin di-hash dengan bcrypt, akun admin disediakan lewat seed script.
- **Package manager**: npm.
- **Struktur**: App Router dengan route groups: `(auth)` untuk login, `(app)` untuk seluruh halaman terproteksi (obat, batch, pengeluaran, dashboard kedaluwarsa, laporan stok minimum, kartu stok).

## 9. Batasan / Asumsi

- Aplikasi berjalan single-tenant untuk satu apotek, satu akun admin (tidak ada manajemen banyak user di versi ini).
- Tidak ada integrasi pembayaran atau modul kasir; fokus murni pada pencatatan stok.
- SQLite dipilih untuk kemudahan instalasi tanpa server database eksternal; untuk skala lebih besar (banyak cabang/concurrent user tinggi) migrasi ke PostgreSQL dapat dipertimbangkan di masa depan namun di luar lingkup versi ini.
- Zona waktu server diasumsikan sesuai zona waktu lokal server tempat aplikasi dijalankan (WIB/WITA/WIT tidak dikonversi otomatis per pengguna karena hanya ada satu lokasi apotek).
- Harga beli dicatat untuk keperluan pencatatan biaya batch, namun laporan keuangan/margin tidak termasuk dalam lingkup versi ini.
