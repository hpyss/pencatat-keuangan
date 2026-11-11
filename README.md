# KeuanganKu - Aplikasi Pencatat Keuangan Pribadi

**KeuanganKu** adalah aplikasi web modern untuk mengelola dan mencatat arus kas keuangan pribadi (pemasukan dan pengeluaran) secara rapi, cepat, dan terstruktur. Dirancang dengan antarmuka yang bersih, elegan, dan profesional tanpa elemen visual yang berlebihan.

---

## Fitur Utama

### 1. Autentikasi Pengguna & Multi-Akun
* **Halaman Khusus Login & Daftar:** Antarmuka autentikasi mandiri yang terpisah dari dashboard.
* **Isolasi Data Per-Akun:** Data transaksi dan kategori tersimpan terpisah untuk setiap pengguna di `localStorage`.
* **Akses Cepat Akun Demo:** Uji coba dashboard langsung dengan satu klik tanpa perlu registrasi form.
* **Profil Pengguna:** Melihat informasi akun, jumlah transaksi tercatat, opsi ganti akun, atau keluar (*logout*).

### 2. Dashboard Finansial Ringkas
* **Kartu Saldo:** Menampilkan saldo saat ini, total pemasukan, total pengeluaran, dan sisa uang bulan berjalan.
* **Grafik Mini Pemasukan vs Pengeluaran:** Perbandingan tren 6 bulan terakhir.
* **Transaksi Terbaru:** 5 aktivitas keuangan terakhir dengan akses cepat untuk melihat bukti lampiran atau mengedit data.

### 3. Pencatatan Transaksi
* Input tipe transaksi: **Pemasukan** atau **Pengeluaran**.
* Input nominal dengan pemformatan mata uang Rupiah otomatis.
* Pemilihan tanggal dan metode pembayaran (Tunai, Transfer Bank, E-Wallet, Kartu Kredit, QRIS, dll).
* Pemilihan kategori transaksi dinamis.
* Catatan/keterangan transaksi.
* Unggah foto bukti struk / nota pembayaran (opsional) dengan fitur pratinjau (*preview*) dan unduh.

### 4. Riwayat & Pencarian Transaksi
* Daftar seluruh transaksi yang dikelompokkan berdasarkan tanggal.
* Fitur pencarian instan berdasarkan keterangan, kategori, atau nominal.
* Filter transaksi fleksibel:
  * Rentang tanggal (Hari Ini, Mingguan, Bulanan, Kustom).
  * Jenis transaksi (Pemasukan / Pengeluaran).
  * Kategori transaksi.
  * Metode pembayaran.
* Aksi **Edit** dan **Hapus** transaksi dengan konfirmasi keamanan.

### 5. Manajemen Kategori (CRUD)
* Kategori bawaan: Makanan, Transportasi, Belanja, Tagihan, Hiburan, Pendidikan, Kesehatan, Gaji, Bonus, dan Lainnya.
* Tambah kategori baru dengan pilihan warna kustom dan ikon yang variatif.
* Edit nama, jenis, dan warna kategori.
* Hapus kategori dengan dialog konfirmasi aman.
* Indikator jumlah transaksi yang menggunakan masing-masing kategori.
* Tombol **Reset Default** untuk mengembalikan daftar kategori awal kapan saja.

### 6. Laporan Keuangan Berkala
* Laporan dengan navigator periode: **Harian**, **Mingguan**, **Bulanan**, dan **Tahunan**.
* Ringkasan total pemasukan, pengeluaran, dan selisih (surplus / defisit).
* Rincian pengeluaran per kategori lengkap dengan persentase dan visual progress bar.

### 7. Visualisasi & Grafik Interaktif
* **Donut / Pie Chart:** Distribusi alokasi pengeluaran per kategori.
* **Dual Bar Chart:** Perbandingan visual pemasukan vs pengeluaran.
* **Line & Area Chart:** Grafik perkembangan akumulasi saldo dengan titik interaktif dan panduan kursor vertikal yang presisi.

---

## Standar Desain & Palet Warna

Aplikasi ini menggunakan palet warna solid yang dirancang untuk kenyamanan visual jangka panjang:

* **Primary:** `#0F172A` (Navy gelap)
* **Accent:** `#10B981` (Emerald)
* **Background:** `#F8FAFC` (Putih kebiruan)
* **Card Surface:** `#FFFFFF`
* **Text Primary:** `#1E293B`
* **Secondary Text:** `#64748B`
* **Danger / Pengeluaran:** `#EF4444`
* **Warning:** `#F59E0B`
* **Border:** `#E2E8F0`

### Tipografi
* Menggunakan font keluarga **Plus Jakarta Sans**:
  * Heading & Angka Saldo: **Bold (700)**
  * Subheading: **Semibold (600)**
  * Body text: **Regular (400)**

---

## Teknologi yang Digunakan

* **Framework:** [Next.js](https://nextjs.org/) 16 (App Router + Turbopack)
* **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
* **Ikon:** [Lucide React](https://lucide.dev/)
* **Animasi:** [Framer Motion](https://www.framer.com/motion/)
* **Penyimpanan:** Browser `localStorage` (Aman, cepat, dan berjalan tanpa konfigurasi database server tambahan)

---

## Cara Menjalankan Secara Lokal

1. **Clone repositori:**
   ```bash
   git clone https://github.com/hpyss/pencatat-keuangan.git
   cd pencatat-keuangan
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

4. **Uji Build & Linting:**
   ```bash
   npm run lint
   npm run build
   ```

---

## Deploy ke Vercel

Aplikasi ini sudah dioptimalkan dan siap di-deploy langsung ke [Vercel](https://vercel.com):

1. Masuk ke akun Vercel Anda di [vercel.com](https://vercel.com).
2. Pilih **"Add New..."** > **"Project"**.
3. Hubungkan repositori GitHub `hpyss/pencatat-keuangan`.
4. Klik tombol **"Deploy"**. Vercel akan otomatis mengenali konfigurasi Next.js dan membangun proyek secara instan.
