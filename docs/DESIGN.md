# Kreava - Design Guidelines

## Visual Identity

### Warna

| Nama | Nilai | Penggunaan |
|------|-------|------------|
| Primary | Indigo-600 (`#4f46e5`) | Tombol utama, link aktif, badge primary |
| Secondary | Slate-600 (`#475569`) | Teks sekunder, border lembut |
| Accent | Emerald-500 (`#10b981`) | Aksi positif, sukses, tombol simpan |
| Danger | Rose-500 (`#f43f5e`) | Error, hapus, peringatan |
| Background | Slate-50 (`#f8fafc`) | Latar halaman |
| Surface | White (`#ffffff`) | Kartu, form, modal |

### Tipografi

- Font utama: **Plus Jakarta Sans** (sudah tersedia via `@fontsource/plus-jakarta-sans`)
- Heading: `font-semibold`, `tracking-tight`
- Body: `font-normal`, `leading-relaxed`
- Mono: untuk kode dan angka teknis

### Gaya Umum

- Minimalis, clean, ruang putih cukup
- Hindari terlalu banyak border, gunakan shadow halus (`shadow-sm`)
- Border-radius sedang (`rounded-md` ~ 0.375rem)
- **Jangan** tampilakannya seperti default Laravel Breeze atau shadcn/ui "out of the box"
- Tidak menggunakan warna blue default shadcn/ui tanpa override

---

## Component Rules

### Prioritas Penggunaan

1. Komponen dari `@/components/ui` (shadcn/ui) — gunakan sebagai dasar
2. Komponen custom di `@/components/shared` — untuk variasi signifikan
3. Hindari membuat one-off komponen langsung di dalam page

### Contoh

```tsx
// ✅ Baik
import { Button } from "@/components/ui/button"

// ❌ Hindari (jika bisa dihindari)
const MyButton = () => <button className="...">...</button>
```

### Penamaan Komponen

- PascalCase untuk file komponen React: `ProductCard.tsx`, `OrderList.tsx`
- camelCase untuk folder: `components/ui/`, `components/shared/`
- Index file: gunakan `index.ts` untuk ekspor jika folder memiliki banyak komponen

---

## Interaction Guidelines

### Loading State

- Setiap tombol aksi (submit, download, delete) harus memiliki loading state
- Gunakan `disabled` + spinner saat memproses
- Contoh: `<Button disabled={isLoading}>{isLoading ? 'Memproses...' : 'Simpan'}</Button>`

### Empty State

- Tampilkan ikon/illustrasi + teks ketika data kosong
- Sertakan tombol aksi yang relevan (misal: "Tambah Produk" jika daftar kosong)
- Jangan biarkan halaman kosong tanpa keterangan

### Error Message

- Warna: rose-500 (tidak merah tua)
- Letak: di atas form field atau di atas konten
- Teks: jelas, singkat, bahasa Indonesia
- Contoh: "Gagal menyimpan produk. Coba lagi nanti."

---

## Anti-Template Checklist

- [ ] Tidak menggunakan warna blue default shadcn/ui tanpa override
- [ ] Setiap halaman memiliki judul yang jelas dan breadcrumbs (jika perlu)
- [ ] Loading state diterapkan pada semua aksi async
- [ ] Empty state ditampilkan ketika data kosong
- [ ] Error message menggunakan warna rose, tidak merah tua
- [ ] Responsif di mobile (minimal 320px width)
- [ ] Setiap form memiliki validasi sisi klien dan server
- [ ] Gambar memiliki `alt` text yang deskriptif