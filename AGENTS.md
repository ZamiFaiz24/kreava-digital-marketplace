# AGENTS.md

## Proyek

Kreava adalah marketplace produk digital. Sebelum mengerjakan apa pun, baca `docs/PRD.md` untuk tujuan, scope, keputusan, dan kriteria selesai.

## Stack

- Laravel 12, PHP 8.2+
- Inertia.js 2.x dengan React 19
- Tailwind CSS v4, shadcn/ui, Radix UI
- Vite 6
- Database: SQLite
- Testing: Pest PHP 3.x

## Aturan kerja

- Kerjakan satu tugas per sesi. Jika tugas terlalu besar, usulkan pemecahannya dulu.
- Jangan menambahkan fitur yang termasuk v2 di `docs/PRD.md`, misalnya admin dashboard, moderasi, atau gateway pembayaran sungguhan.
- Pembayaran hanya memakai `MockPaymentGateway` melalui interface `PaymentGateway`. Jangan menambahkan SDK Midtrans atau Xendit.
- Produk seller langsung tayang. Jangan menambahkan status approval.
- Jangan mengubah status di `docs/PRD.md` kecuali sudah ada kode dan tes yang membuktikannya.
- Sebelum menyatakan suatu fitur selesai, tulis atau jalankan tes untuk kriteria selesai fitur tersebut.
- Jika menemukan kode yang bertentangan dengan PRD, laporkan dulu. Jangan langsung mengubah PRD.

## Perintah

- Install: `composer install` lalu `npm install`
- Jalankan: `php artisan serve` dan `npm run dev`
- Tes: `php artisan test`

Verifikasi perintah di atas dengan menjalankannya. Perbarui bagian ini jika ada yang berbeda.

## Aturan Commit

- **Jangan commit otomatis.** Agent hanya memberikan saran pesan commit.
- User yang melakukan commit secara manual setelah review perubahan.
- Gunakan Conventional Commits:
  - `feat:` â€” Fitur baru
  - `fix:` â€” Perbaikan bug
  - `docs:` â€” Dokumentasi
  - `style:` â€” Perbaikan formatting
  - `refactor:` â€” Refactoring kode
  - `test:` â€” Menambahkan atau mengubah tes
  - `chore:` â€” Tugas pemeliharaan

### Contoh pesan commit

```bash
git commit -m "feat: add checkout route and MockPaymentGateway controller"
git commit -m "fix: verify download file for paid order"
git commit -m "docs: update AGENTS.md with commit rules"
```

## Sebelum Commit

Pastikan berikut ini telah dijalankan:

- `php artisan test` â€” semua tes lulus
- `npm run format:check` â€” formatting konsisten

Jika ada tes yang gagal atau formatting tidak konsisten, jangan commit. Perbaiki terlebih dahulu.

## UI/UX

Setiap perubahan tampilan harus merujuk ke `docs/DESIGN.md`.
Jangan membuat tampilan yang terlalu generic/template shadcn/ui.

## Kode Minimum (PonyTail Principle)

- Reuse kode yang sudah ada di codebase sebelum membuat baru.
- Pakai standard library atau platform yang tersedia sebelum install dependensi baru.
- Buat minimum yang works, plus satu tes jika ada logic.

## Known Gaps (Dari Verifikasi Kode)

| Masalah | Detail | Prioritas |
|---------|--------|-----------|
| Checkout belum diimplementasi | PRD mencantumkan checkout dalam scope v1, tetapi tidak ada route checkout sama sekali | Tinggi |
| Seller placeholder routes | `products.new`, `payouts`, `settings` masih menggunakan `Inertia::render('seller/placeholder')` | Tinggi |
| Download file flow | Route ada, tapi alur verifikasi (order paid, kepemilikan file) belum diverifikasi | Sedang |

Sebelum menyatakan fitur v1 selesai, pastikan gaps di atas sudah terpenuhi dengan kode dan tes.

