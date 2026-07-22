# 11 — Struktur Website & Arsitektur Teknis

## Peta Halaman

| Halaman | Berkas | Fungsi |
|---------|--------|--------|
| Beranda | `index.html` | Hero, kutipan dekan, 3 prodi, sorotan prestasi, galeri, testimoni alumni, mitra, CTA PMB |
| Profil Fakultas | `tentang.html` | Sejarah, visi-misi, struktur org, pimpinan, fasilitas |
| Direktori Dosen | `direktori-dosen.html` | Pencarian, filter, modal biodata 14 dosen |
| Penelitian | `penelitian.html` | Tabel agregat penelitian + filter + salin sitasi |
| Pengabdian | `pengabdian.html` | Tabel agregat pengabdian + filter + salin sitasi |
| Kerjasama | `kerjasama.html` | Grid kartu mitra |
| Prestasi | `prestasi.html` | Grid kartu prestasi |
| Alumni | `alumni.html` | Direktori + testimoni alumni |
| PMB | `pmb.html` | Jalur, jadwal, biaya, beasiswa |
| Pusat Unduhan | `pusat-unduhan.html` | Dokumen akademik |
| Prodi TI | `prodi/teknik-informatika.html` | Profil prodi TI |
| Prodi SISTEKIN | `prodi/sistem-teknologi-informasi.html` | Profil prodi SISTEKIN |
| Prodi BISDIG | `prodi/bisnis-digital.html` | Profil prodi Bisnis Digital |

## Navigasi Utama

```
Beranda
Tentang Kami
  ├─ Profil Fakultas
  │    ├─ Sejarah
  │    ├─ Visi, Misi & Tujuan
  │    ├─ Struktur Organisasi
  │    ├─ Kepemimpinan Fakultas
  │    └─ Fasilitas Fakultas
  └─ Direktori Dosen & Peneliti
Program Studi
  ├─ S1 Teknik Informatika
  ├─ S1 Sistem dan Teknologi Informasi
  └─ S1 Bisnis Digital
Akademik
  ├─ Pusat Unduhan & Dokumen
  ├─ Kerjasama
  ├─ Prestasi
  ├─ Penelitian
  └─ Pengabdian
Alumni
PMB
```

## Stack Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Arsitektur | Static site / PWA (tanpa backend database runtime) |
| Styling | Tailwind CSS (build lokal → `css/tailwind.css` + `css/style.css`) |
| Ikon | Lucide lokal (`js/lucide.min.js`) |
| Font | Inter & Plus Jakarta Sans (self-hosted `assets/fonts/`, woff2) |
| Offline | Service Worker `service-worker.js` + `manifest.json` |
| Proteksi aset | `js/asset-guard.js` (fail-closed preloader) |
| Data dosen/alumni/karya | JS global arrays |
| Agregasi tabel | `js/karya-agregat.js` + `js/util-tabel.js` |
| Interaksi UI | `js/script.js` |

## Struktur Folder Repositori (ringkas)

```
website-fsti-uwg/
├── index.html, tentang.html, pmb.html, ...
├── prodi/
├── js/          # data + logic
├── css/
├── assets/
│   ├── docs/    # PDF KPT dll
│   ├── fonts/
│   └── images/  # dosen, alumni, mitra, kegiatan, fasilitas
├── data/        # CSV cadangan
├── e2e/         # pengujian
└── referensi-data/   # folder ini
```

## Fitur Teknis Unggulan (dari README proyek)

1. 100% self-hosted assets (zero CDN runtime dependency untuk font/ikon utama)
2. AssetGuard fail-closed
3. PWA offline-ready (Cache-First SW)
4. WCAG 2.1 AA/AAA practices (heading hierarchy, aria-label, focus trap modal)
5. Browser history sync untuk modal & anchor
6. Zero CLS (width/height + lazy loading pada gambar)
7. Tabel agregat penelitian/pengabdian dengan filter, sort, lazy load 60 baris, salin sitasi

## Design Tokens (ringkas dari guidelines proyek)

- Nuansa brand: ungu gelap FSTI + aksen warm cream (`#FFF9F2` pada stat cards)
- Kartu statis premium (tanpa lift berlebihan)
- Mikro-interaksi: panah `translateX(4px)`, tekan `scale(.98)`
- Galeri kegiatan: infinite auto-scroll

## File Data yang Sering Diubah Pengelola

| File | Isi |
|------|-----|
| `js/dosen-data.js` | Profil dosen + karya |
| `js/alumni-data.js` | Alumni + testimoni |
| `js/prestasi-data.js` | Prestasi |
| `js/kerjasama-data.js` | Mitra |
| HTML prodi / tentang / pmb | Narasi & angka biaya/jadwal |

## Versi

- Badge README: **Version 2026.28**
- Service Worker cache version mengikuti rilis tersebut
