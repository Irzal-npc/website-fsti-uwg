# Referensi Data Website FSTI UWG Malang

> Folder ini berisi **dokumentasi data lengkap** yang diekstrak dari website resmi Fakultas Sains dan Teknologi Informasi (FSTI) Universitas Widya Gama Malang.
> Tujuan: menjadi **sumber referensi** untuk pengembangan project ke depan (konten, data, salinan teks, struktur informasi).

**Sumber:** repositori `website-fsti-uwg` (static PWA)  
**Tanggal ekstraksi:** 2026-07-22  
**Versi website acuan:** 2026.28 (lihat README & CHANGELOG proyek)

---

## Daftar Isi Folder

| No | File | Isi |
|----|------|-----|
| 00 | [README.md](./README.md) | Indeks folder referensi |
| 01 | [01-profil-fakultas.md](./01-profil-fakultas.md) | Identitas, sejarah, visi-misi, pimpinan, fasilitas, kontak |
| 02 | [02-program-studi.md](./02-program-studi.md) | TI, SISTEKIN, Bisnis Digital (lengkap) |
| 03 | [03-direktori-dosen.md](./03-direktori-dosen.md) | 14 dosen + biodata + ringkasan karya |
| 04 | [04-penelitian.md](./04-penelitian.md) | Agregat karya penelitian seluruh dosen |
| 05 | [05-pengabdian.md](./05-pengabdian.md) | Agregat karya pengabdian masyarakat |
| 06 | [06-alumni.md](./06-alumni.md) | Direktori & testimoni alumni |
| 07 | [07-prestasi.md](./07-prestasi.md) | Prestasi akademik & non-akademik |
| 08 | [08-kerjasama.md](./08-kerjasama.md) | Mitra kerjasama dalam/luar negeri |
| 09 | [09-pmb.md](./09-pmb.md) | Jalur masuk, jadwal, biaya, beasiswa |
| 10 | [10-dokumen-unduhan.md](./10-dokumen-unduhan.md) | Pusat unduhan & status dokumen |
| 11 | [11-struktur-website.md](./11-struktur-website.md) | Peta halaman, navigasi, arsitektur teknis |
| 12 | [12-kontak-tautan.md](./12-kontak-tautan.md) | Kontak, media sosial, tautan eksternal |

---

## Ringkasan Statistik (dari data website)

| Metrik | Nilai |
|--------|------:|
| Program studi | 3 |
| Dosen / peneliti | 14 |
| Mahasiswa aktif (counter beranda) | 222 |
| Mitra kerjasama | 15 |
| Alumni (profil di website) | 15 |
| Karya penelitian (agregat) | 617 |
| Karya pengabdian (agregat) | 108 |
| Total karya ilmiah tercatat | 725 |
| Prestasi (entri galeri) | 3 |

> Catatan: angka karya di halaman Profil Fakultas ditampilkan **725**; agregat dari `dosen-data.js` saat ekstraksi = **725** (penelitian + pengabdian). Gunakan angka dari file data JS sebagai sumber truth teknis.

---

## Sumber Data Asli di Repositori

| Data | File sumber |
|------|-------------|
| Dosen + karya | `js/dosen-data.js` (`window.FSTI_DOSEN`) |
| Alumni | `js/alumni-data.js` (`window.FSTI_ALUMNI`) |
| Prestasi | `js/prestasi-data.js` (`window.FSTI_PRESTASI`) |
| Kerjasama | `js/kerjasama-data.js` (`window.FSTI_KERJASAMA`) |
| CSV cadangan | `data/biodata-dosen.csv`, `data/alumni.csv`, `data/Karya-Ilmiah-dosen-FSTI-clean.csv` |
| Konten naratif | `index.html`, `tentang.html`, `pmb.html`, `prodi/*.html`, dll. |

---

## Cara Pakai untuk Project Berikutnya

1. Baca file topik yang relevan (mis. `03-direktori-dosen.md` untuk UI direktori).
2. Untuk regenerasi data mentah, salin ulang dari file JS di folder `js/`.
3. Jangan mengandalkan folder ini sebagai *source of truth* runtime — folder ini **referensi dokumentasi**, bukan data produksi website.
4. Saat konten website berubah, ekstrak ulang / perbarui file `.md` di folder ini.

---

*Dibuat otomatis sebagai arsip referensi konten website FSTI UWG Malang.*
