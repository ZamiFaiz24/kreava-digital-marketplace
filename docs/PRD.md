# PRD: Kreava Digital Marketplace

**Status dokumen:** Draft v1.2
**Tujuan project:** Portofolio
**Versi aktif:** v2 (selesai dan diverifikasi)
**Rencana berikutnya:** v3 dan v3 lanjutan, lalu v4 (lihat bagian Scope)

---

## 1. Tujuan

Kreava adalah marketplace produk digital tempat kreator menjual file digital dan pembeli mengunduh file tersebut setelah pembayaran.

## 2. Pengguna

| Peran | Kebutuhan utama |
|---|---|
| Buyer | Menemukan produk, membeli, mengunduh file dari library, dan memberi ulasan produk yang sudah dibeli |
| Seller (kreator) | Mendaftar, menambah dan mengelola produk, melihat analytics dan pendapatan, melihat ulasan produk sendiri |
| Admin | Memoderasi produk, mengelola pengguna dan pesanan, mengatur koleksi unggulan, memantau aktivitas platform |
| Pengunjung (tanpa login) | Menjelajahi marketplace, melihat produk, koleksi, dan profil seller |

## 3. Scope

### v1 (selesai)

- Branding dan landing page
- Marketplace explore dengan pencarian, filter kategori, dan pagination
- Halaman detail produk
- Halaman creators
- Register, login, lupa dan reset kata sandi, verifikasi email
- Keranjang dan wishlist
- Dashboard buyer: orders, downloads, library
- Seller dashboard dasar: daftar produk, tambah produk, pengaturan seller
- Checkout dengan `MockPaymentGateway`
- Download file digital setelah order berstatus `paid`

### v2 (selesai dan diverifikasi)

- Admin dashboard
- Moderasi produk: approve, reject
- Moderasi kreator
- Analytics seller dasar
- Perbaikan placeholder seller: `products.new`, `payouts`, `settings`
- Perbaikan alur download (verifikasi order paid dan kepemilikan file)

### v3 (rencana, belum dikerjakan)

Urutan pengerjaan mengikuti nomor. Satu item per sesi agent.

1. **Seller: edit, unpublish, dan hapus produk.** Seller dapat mengubah data produk, menonaktifkan produk tanpa menghapusnya, dan menghapus produk yang belum pernah dibeli.
2. **Seller: analytics dengan filter periode dan pendapatan.** Lihat bagian 6.
3. **Admin: moderasi produk.** Approve, reject, dan takedown produk yang sudah tayang.
4. **Admin: kelola pengguna.** Mengubah role dan menonaktifkan akun.
5. **Admin: kelola pesanan.** Melihat semua order dan menandai refund. Admin tidak dapat mengubah status pembayaran secara manual.
6. **Admin: audit log.** Mencatat setiap aksi admin: siapa, apa, target, dan kapan.
7. **Seller: pendapatan per kategori.**
8. **Export CSV** untuk laporan pendapatan seller dan order admin.

### v3 lanjutan (rencana)

9. **Ulasan dan rating produk.** Lihat bagian 5 untuk aturan ulasan. Seller dapat melihat ulasan produknya, dan admin dapat menghapus ulasan yang melanggar.
10. **Curated collections.** Admin membuat koleksi produk yang dikurasi (misalnya "Best Seller UI Kits") dan menentukan urutannya. Koleksi tampil di landing page dan halaman khusus koleksi.
11. **Order detail dan invoice.** Halaman detail order berisi tanggal pembelian, status, daftar produk, harga saat transaksi, dan file yang didapat. Buyer dapat mengunduh invoice sederhana (PDF) untuk order `paid`.

### v4 (rencana jangka panjang)

12. **Product comparison.** Pengunjung dapat memilih hingga 3 produk dan melihat harga, kategori, rating, dan jumlah ulasan berdampingan.
13. **Product badges.** Badge tampil di kartu produk sesuai aturan di bagian 6.
14. **Advanced search filter.** Filter rentang harga, rating minimum, tanggal upload, dan tipe file. Tipe file baru dikerjakan setelah data produk konsisten.
15. **Seller profile page.** Halaman profil seller berisi daftar produk, statistik ringkas, dan ulasan pembeli. Tombol ikuti atau berlangganan tidak termasuk.
16. **FAQ / help center.** Halaman statis untuk pembeli dan seller.

### Di luar scope (dicatat, belum direncanakan)

- Notifikasi center dalam aplikasi, termasuk notifikasi payout (payout belum dibuat)
- Refund request dari buyer. Admin tetap satu-satunya pihak yang menandai refund
- Wishlist collections dan fitur berbagi koleksi
- Save for later terpisah dari wishlist
- Newsletter dan langganan email
- Tracking konversi dan page view
- Pengaturan sistem dan maintenance mode
- Gateway pembayaran sungguhan (Midtrans atau Xendit)
- Kupon dan diskon
- Upload versi file baru untuk produk yang sudah dibeli
- Tombol ikuti atau berlangganan seller

## 4. Alur Utama

**Membeli produk:**
lihat produk → tambah ke keranjang → checkout → bayar (mock) → order menjadi `paid` → file tersedia di library → unduh file atau invoice

**Menjual produk:**
register sebagai seller → tambah produk dan file → produk masuk status `pending` → admin approve → produk tayang di marketplace
*[PUTUSKAN: konfirmasi apakah alur ini sudah sesuai implementasi. Jika seller boleh langsung tayang, ubah bagian ini dan Keputusan.]*

**Moderasi (admin):**
lihat antrean produk `pending` → review → approve atau reject dengan alasan → seller melihat status produknya

**Memberi ulasan:**
buka produk yang sudah dibeli → beri bintang dan komentar → ulasan tampil di halaman produk

## 5. Keputusan

| Keputusan | Alasan | Revisit di |
|---|---|---|
| Pembayaran memakai `MockPaymentGateway` yang mengikuti interface `PaymentGateway` | Portofolio. Menghindari setup tunnel untuk webhook dan verifikasi bisnis | Setelah v4 |
| Produk seller masuk status `pending` dan tayang setelah approve admin | Moderasi adalah bagian dari kualitas marketplace | Jika ada kebutuhan auto-approve |
| Admin tidak mengubah status pembayaran secara manual, hanya menandai refund | Menjaga konsistensi data karena pembayaran memakai mock | Setelah gateway sungguhan |
| Seller dashboard tetap bagian dari v1 | Seller harus bisa menambah produk | — |
| Harga disimpan di `order_items` saat transaksi | Pendapatan historis tidak berubah ketika harga produk diubah | — |
| Pendapatan gross dan net dihitung dari data order, bukan disimpan manual | Mengurangi duplikasi data dan kesalahan | — |
| Ulasan hanya bisa dibuat pembeli yang memiliki order `paid` untuk produk tersebut, dan satu user hanya boleh satu ulasan per produk | Mencegah ulasan palsu dan spam | — |
| Refund request dari buyer tidak dibuat di v3 | Bertentangan dengan keputusan admin sebagai satu-satunya penanda refund. Dibahas ulang di v4 jika diperlukan | v4 |
| Koleksi unggulan dan badge "Staff Pick" ditentukan manual oleh admin | Kurasi tidak bisa diotomatisasi dengan data yang masih kecil | — |

## 6. Definisi Analytics, Pendapatan, dan Badge

### Analytics dan pendapatan

Bagian ini dipakai sebagai acuan semua angka di dashboard seller dan admin.

- **Pendapatan gross:** total `order_items.price` dari order berstatus `paid`, dalam periode yang dipilih.
- **Potongan platform:** *[PUTUSKAN: persentase fee platform, misalnya 0% atau 10%. Jika 0%, net = gross dikurangi refund.]*
- **Pendapatan net:** gross dikurangi potongan platform dan dikurangi nilai refund dalam periode yang sama.
- **Refund:** order yang ditandai refund tidak dihitung sebagai pendapatan. Refund dihitung pada tanggal refund ditandai, bukan tanggal order dibuat.
- **Periode filter:** hari ini, 7 hari terakhir, 30 hari terakhir, bulan ini, dan rentang tanggal custom.
- **Perbandingan:** setiap angka utama menampilkan selisih persen dengan periode sebelumnya yang durasinya sama.
- **Granularitas grafik:** rentang 31 hari atau kurang ditampilkan per hari. Rentang lebih dari 31 hari ditampilkan per bulan.
- **Saldo seller:** *[PUTUSKAN: pendapatan dianggap tersedia setelah berapa hari, misalnya 7 hari setelah order `paid` dan tanpa refund. Jika payout belum dibuat, cukup tampilkan "tertahan" dan "tersedia" sebagai angka.]*

### Aturan badge (v4)

Setiap badge harus punya aturan tertulis agar agent tidak membuat versinya sendiri.

- **New:** produk diunggah dalam 14 hari terakhir.
- **Best Seller:** 10 produk teratas berdasarkan jumlah order `paid` dalam 30 hari terakhir. Produk harus tayang.
- **Trending:** *[PUTUSKAN: contoh, produk dengan kenaikan jumlah order `paid` terbesar dibanding 7 hari sebelumnya, minimal 5 order.]*
- **Staff Pick:** ditandai manual oleh admin.
- Satu produk boleh memiliki lebih dari satu badge. Urutan tampilan: Staff Pick, Best Seller, Trending, New.

## 7. Kriteria Selesai

Sebuah fitur dianggap selesai jika kriteria di bawah terpenuhi, ada tes yang membuktikannya, dan `php artisan test` lulus.

**v1 dan v2**

- **Checkout:** pembeli dapat membuat order dari keranjang. Setelah pembayaran mock dikonfirmasi, order berstatus `paid`.
- **Download:** pembeli hanya dapat mengunduh file jika order-nya `paid`. Pembeli lain tidak bisa mengunduh file tersebut. Tes harus mencakup kasus ditolak.
- **Seller tambah produk:** seller dapat membuat produk dengan judul, harga, kategori, dan file. Produk tampil sesuai statusnya.
- **Marketplace explore:** pencarian, filter kategori, dan pagination berfungsi.
- **Auth:** register, login, reset kata sandi, dan verifikasi email berfungsi end-to-end.
- **Otorisasi admin:** route admin hanya dapat diakses user dengan role admin. Buyer dan seller yang membuka route admin harus ditolak. Tes harus mencakup kasus ini.

**v3**

- **Edit, unpublish, dan hapus produk:** seller hanya dapat mengubah produk miliknya. Produk yang sudah pernah dibeli tidak bisa dihapus permanen, hanya di-unpublish.
- **Analytics:** filter periode berfungsi. Angka gross, net, dan refund sesuai bagian 6, dibuktikan dengan data uji yang sudah diketahui hasilnya.
- **Moderasi produk:** approve mengubah status ke tayang. Reject wajib mencantumkan alasan. Takedown menurunkan produk yang sudah tayang.
- **Kelola pengguna:** admin dapat mengubah role dan menonaktifkan akun. Akun yang nonaktif tidak bisa login.
- **Kelola pesanan:** admin dapat melihat dan mencari order, serta menandai refund. Penandaan refund tercatat di audit log.
- **Audit log:** setiap aksi admin tercatat dengan user, aksi, target, dan waktu. Log tidak bisa diubah dari UI.
- **Pendapatan per kategori:** angka pendapatan dikelompokkan per kategori dan mengikuti filter periode.
- **Export CSV:** file CSV berisi data sesuai filter yang aktif dan bisa dibuka di spreadsheet tanpa error encoding.

**v3 lanjutan**

- **Ulasan:** hanya pembeli dengan order `paid` untuk produk tersebut yang bisa mengulas. Satu user hanya satu ulasan per produk. Tes harus mencakup kasus ditolak dan kasus duplikat.
- **Curated collections:** admin dapat membuat, mengurutkan, dan menghapus koleksi. Koleksi tampil di landing page sesuai urutan.
- **Order detail dan invoice:** order `paid` menampilkan detail lengkap dan invoice PDF dapat diunduh. Order milik user lain tidak bisa dibuka.

**v4**

- **Product comparison:** maksimal 3 produk dapat dibandingkan. Pemilihan keempat ditolak dengan pesan yang jelas.
- **Badges:** badge tampil sesuai aturan di bagian 6. Tes menguji setiap aturan dengan data uji.
- **Advanced filter:** setiap filter baru berfungsi sendiri dan kombinasinya tidak merusak hasil pencarian.
- **Seller profile:** halaman profil menampilkan produk tayang, statistik, dan ulasan milik seller tersebut saja.
- **FAQ:** halaman dapat diakses tanpa login dan tampil di menu bantuan.

## 8. Status

Tanda ✅ hanya dipasang jika ada bukti: nama file tes, atau hasil `php artisan test`. Status yang hanya dilaporkan tetapi belum dites ditandai ⬜.

**v1**

| Fitur | Status | Bukti |
|---|---|---|
| Landing page | ✅ | DashboardTest.php |
| Marketplace explore | ✅ | DashboardTest.php |
| Product detail | ✅ | DashboardTest.php |
| Creators | ✅ | DashboardTest.php |
| Auth lengkap | ✅ | tests\Feature\Auth\ (RegistrationTest, PasswordResetTest, dll.) |
| Keranjang dan wishlist | ✅ | SellerRoutesTest.php |
| Dashboard buyer | ✅ | DashboardTest.php |
| Seller dashboard dasar | ✅ | SellerRoutesTest.php |
| Checkout (mock) | ✅ | CheckoutTest.php |
| Download file | ✅ | DownloadFlowTest.php |

**v2**

| Fitur | Status | Bukti |
|---|---|---|
| Admin dashboard | ✅ | AdminDashboardTest.php |
| Moderasi produk | ✅ | AdminModerationTest.php |
| Moderasi kreator | ✅ | AdminModerationTest.php |
| Analytics seller dasar | ✅ | SellerAnalyticsTest.php |
| Placeholder seller diganti | ✅ | SellerRoutesTest.php |
| Verifikasi alur download | ✅ | DownloadFlowTest.php |

**v3**

| Fitur | Status | Bukti |
|---|---|---|
| Edit, unpublish, hapus produk | ❌ | |
| Analytics dengan filter periode | ❌ | |
| Moderasi produk (admin) | ❌ | |
| Kelola pengguna | ❌ | |
| Kelola pesanan | ❌ | |
| Audit log | ❌ | |
| Pendapatan per kategori | ❌ | |
| Export CSV | ❌ | |

**v3 lanjutan**

| Fitur | Status | Bukti |
|---|---|---|
| Ulasan dan rating | ❌ | |
| Curated collections | ❌ | |
| Order detail dan invoice | ❌ | |

**v4**

| Fitur | Status | Bukti |
|---|---|---|
| Product comparison | ❌ | |
| Product badges | ❌ | |
| Advanced filter | ❌ | |
| Seller profile page | ❌ | |
| FAQ | ❌ | |

Keterangan: ✅ selesai dan dites, ⚠️ sebagian, ❌ belum ada, ⬜ dilaporkan atau belum diverifikasi.




