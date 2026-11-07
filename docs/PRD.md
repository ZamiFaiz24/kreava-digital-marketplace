# PRD: Kreava Digital Marketplace

**Status dokumen:** Draft
**Versi aktif:** v1 (lihat bagian Scope)
**Rencana berikutnya:** v2 (lihat bagian Scope)
**Tujuan project:** Portofolio

---

## 1. Tujuan

Kreava adalah marketplace produk digital tempat kreator menjual file digital dan pembeli mendapatkan file tersebut setelah pembayaran.

## 2. Pengguna

| Peran | Kebutuhan utama |
|---|---|
| Buyer | Menemukan produk, membeli, dan mengunduh file dari library pribadi |
| Seller (kreator) | Mendaftar, menambah produk, dan melihat produknya sendiri |
| Admin | Di v1 belum ada admin dashboard (lihat Scope) |

## 3. Scope

### v1 (sedang dikerjakan)

- Branding dan landing page
- Marketplace explore dengan pencarian, filter kategori, dan pagination
- Halaman detail produk
- Halaman creators
- Register, login, lupa dan reset kata sandi, verifikasi email
- Keranjang dan wishlist
- Dashboard buyer (orders, downloads, library)
- Seller dashboard dasar: daftar produk, tambah produk, dan pengaturan seller
- Checkout dengan MockPaymentGateway
- Download file digital setelah order berstatus paid

### v2 (di luar scope v1, jangan dikerjakan sekarang)

- Admin dashboard
- Moderasi produk (approve/reject) dan moderasi kreator
- Gateway pembayaran sungguhan (Midtrans atau Xendit)
- Analytics seller
- Payout seller
- Admin dashboard dan fitur lain yang muncul kemudian

## 4. Alur Utama

**Membeli produk:**
lihat produk → tambah ke keranjang → checkout → bayar (mock) → order menjadi paid → file tersedia di library → unduh file

**Menjual produk:**
register sebagai seller → tambah produk (dan file) → produk langsung tayang

## 5. Keputusan

| Keputusan | Alasan | Revisit di |
|---|---|---|
| Pembayaran memakai `MockPaymentGateway` yang mengikuti interface `PaymentGateway` | Portofolio. Menghindari setup tunnel untuk webhook dan verifikasi bisnis | v2 |
| Produk seller langsung tayang tanpa moderasi | Fokus pada alur beli dan unduh | v2 |
| Admin dashboard ditunda | Tidak wajib untuk alur utama v1 | v2 |
| Seller dashboard tetap masuk v1 | Seller harus bisa menambah produk | — |

## 6. Kriteria Selesai

Sebuah fitur dianggap selesai jika kriteria di bawah ini terpenuhi dan ada tesnya.

- **Checkout:** pembeli dapat membuat order dari keranjang. Setelah pembayaran mock dikonfirmasi, order berstatus `paid`.
- **Download:** pembeli dapat mengunduh file hanya jika order-nya `paid`. Pembeli lain tidak bisa mengunduh file yang bukan miliknya.
- **Seller tambah produk:** seller dapat membuat produk dengan judul, harga, kategori, dan file, lalu produk tampil di marketplace.
- **Marketplace explore:** pencarian, filter kategori, dan pagination berfungsi.
- **Auth:** register, login, reset kata sandi, dan verifikasi email berfungsi end-to-end.

## 7. Status

Status di bawah adalah hasil pemeriksaan awal dan **belum diverifikasi**. Ubah menjadi ✅ hanya setelah dicek di kode dan dites.

| Fitur | Status | Catatan |
|---|---|---|
| Landing page | ✅ Selesai | LandingController + route `/` tersedia |
| Marketplace explore | ✅ Selesai | MarketplaceController + route `/marketplace` tersedia |
| Product detail | ✅ Selesai | ProductController + route `/products/{slug}` tersedia |
| Creators | ✅ Selesai | CreatorsController + route `/creators` tersedia |
| Auth lengkap | ✅ Selesai | Semua route auth ada di `routes/auth.php` |
| Keranjang dan wishlist | ✅ Selesai | CartController + WishlistController tersedia |
| Dashboard buyer | ✅ Selesai | Customer orders, downloads routes tersedia |
| Seller dashboard dasar | ⚠️ Sebagian | `products`, `orders` tersedia; `products.new`, `payouts`, `settings` masih placeholder |
| Checkout (mock) | ❌ Belum ada | Tidak ada route checkout di `routes/web.php` |
| Download file | ⚠️ Sebagian | Route `/downloads/{download}/file` tersedia, alur verifikasi belum dicek |

Keterangan: ✅ selesai, ⚠️ sebagian, ❌ belum ada, ⬜ belum diverifikasi.

---

### Known Gaps (Perlu Diperhatikan)

| Masalah | Detail | Prioritas |
|---------|--------|-----------|
| Checkout belum diimplementasi | PRD mencantumkan checkout dalam scope v1, tetapi tidak ada route checkout sama sekali | Tinggi |
| Seller placeholder routes | `products.new`, `payouts`, `settings` masih menggunakan `Inertia::render('seller/placeholder')` | Tinggi |
| Analytics seller | Sudah ada controller dan route, tapi PRD menempatkannya di scope v2 | Sedang |
| Download file flow | Route ada, tapi alur verifikasi (order paid, kepemilikan file) belum diverifikasi | Sedang |