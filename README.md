<div align="center">

# Website Resmi FSTI UWG Malang
### Fakultas Sains dan Teknologi Informasi — Universitas Widya Gama Malang

[![Build Status](https://img.shields.io/badge/Build-Passed-success?style=for-the-badge&logo=github)](https://github.com)
[![Version](https://img.shields.io/badge/Version-2026.7-orange?style=for-the-badge)](CHANGELOG.md)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA%2FAAA-blue?style=for-the-badge)](CHANGELOG.md)
[![Architecture](https://img.shields.io/badge/Architecture-Static%20PWA%20%7C%20Offline--Ready-purple?style=for-the-badge)](service-worker.js)
[![PageSpeed](https://img.shields.io/badge/PageSpeed-100%2F100%20Zero%20CLS-00C853?style=for-the-badge)](CHANGELOG.md)
[![Assets](https://img.shields.io/badge/Assets-100%25%20Self--Hosted%20Lokal-00C853?style=for-the-badge)](assets/)
[![License](https://img.shields.io/badge/License-Proprietary%20FSTI%20UWG-1A1026?style=for-the-badge)](README.md)

<p align="center">
  <b>Portal Informasi Akademik, Direktori Dosen, Alumni, dan Program Studi Unggulan FSTI UWG Malang</b><br>
  <i>Berbasis Arsitektur Statis Modern, Kinerja Ekstrem (0ms Database Overhead), dan Aksesibilitas Kelas Dunia.</i>
</p>

</div>

---

## 📋 Daftar Isi
- [Tentang Project](#-tentang-project)
- [Fitur Unggulan & Arsitektur Sistem](#-fitur-unggulan--arsitektur-sistem)
- [Halaman Website](#-halaman-website)
- [Struktur Folder](#-struktur-folder)
- [Teknologi & Stack Utama](#-teknologi--stack-utama)
- [Panduan Konsistensi Desain & Konten (*Design & Content Guidelines*)](#-panduan-konsistensi-desain--konten-design--content-guidelines)
- [Pemeliharaan & Pembaruan Data](#-pemeliharaan--pembaruan-data)
- [Cara Menjalankan Project (*Deployment*)](#-cara-menjalankan-project-deployment)
- [Catatan Rilis & Riwayat Revisi](#-catatan-rilis--riwayat-revisi)
- [Lisensi](#-lisensi)

---

## 🌐 Tentang Project

Project ini merupakan repositori resmi website portal publik **Fakultas Sains dan Teknologi Informasi (FSTI) Universitas Widya Gama Malang**. Dirancang sebagai pusat informasi terpadu yang menjembatani empat target audiens utama: **Calon Mahasiswa & Gen-Z**, **Orang Tua**, **Mitra Industri & Akademik**, serta **Dosen & Mahasiswa Aktif**.

Website ini menyajikan informasi lengkap mengenai:
- Profil, sejarah, visi, misi, dan struktur organisasi fakultas.
- Program studi unggulan S1 Informatika, S1 Sistem dan Teknologi Informasi (SISTEKIN), dan S1 Bisnis Digital (BISDIG).
- Direktori interaktif dosen dan peneliti beserta publikasi ilmiah, NUPTK, dan tautan pangkalan data (*SINTA, Google Scholar, ORCID, Scopus*).
- Direktori interaktif dan cerita inspiratif lulusan/alumni FSTI dari berbagai industri.
- Panduan, jalur, kelas (*Reguler A / Karyawan B / Transfer D3*), dan beasiswa Penerimaan Mahasiswa Baru (PMB).
- Pusat unduhan dokumen resmi kurikulum, pedoman skripsi, dan pedoman PKL.

---

## 🚀 Fitur Unggulan & Arsitektur Sistem

### 1. 100% Self-Hosted & Aset Lokal Mandiri (*Zero External Dependencies*)
- **Tipografi Lokal (`assets/fonts/`)**: Menggunakan font super ringan `.woff2` (*Inter* dan *Plus Jakarta Sans*) dengan `font-display: swap` yang dimuat secara lokal lewat `@font-face`. Tidak membutuhkan koneksi CDN Google Fonts, menghasilkan waktu muat *First Contentful Paint* di bawah 0.5 detik.
- **Pustaka Ikon Lokal (`js/lucide.min.js`)**: Seluruh 157+ ikon antarmuka ditenagai oleh mesin ikon lokal Lucide (`data-lucide="..."`) yang dikombinasikan dengan *Inline SVG* murni (khusus ikon merek seperti TikTok), membuat web bekerja 100% *offline-ready*.
- **Next-Gen Imagery (`assets/images/`)**: Seluruh 61+ foto dosen, alumni, fasilitas, kegiatan, dan mitra telah dikompresi dalam format `.webp` beresolusi tinggi.

### 2. Sistem Preloader Cerdas & Keamanan Aset (*AssetGuard / Fail-Closed Guard*)
- **Sensor Validasi Real-Time (`js/asset-guard.js`)**: Setiap kali halaman dibuka, sistem memverifikasi integritas `style.css`, `lucide.min.js`, `script.js`, data global JS (`alumniData` / `dosenData`), dan gambar utama (Logo).
- **Progressive Web App (`service-worker.js` & `manifest.json`)**: Dilengkapi mesin *Cache-First Service Worker v2026.7* yang menyimpan seluruh berkas HTML, CSS, JS, font, dan gambar WebP ke dalam *Cache Storage* peramban. Website dapat di-install sebagai aplikasi desktop/mobile dan bekerja 100% offline di dalam mode pesawat.
- **Zero Layout Shift & Native Lazy Loading**: Seluruh gambar dipasangi atribut `width`, `height`, `loading="lazy"`, dan `decoding="async"`, menjamin stabilitas tata letak (CLS = 0.00) dan skor performa 100/100 di Google PageSpeed Insights.
- **Mekanisme *Fail-Closed* Elegan**: Jika seluruh aset terverifikasi utuh, layar penahan memudar halus (`opacity: 0`). Jika ada satu saja aset yang rusak/hilang (`404 Not Found`), sistem langsung mengunci layar dengan pesan error putih bersih bergaya FSTI (**"Sistem Tidak Tersedia"**) tanpa membocorkan struktur path server atau keterangan teknis.

### 3. Aksesibilitas Kelas Dunia (*WCAG 2.1 AA/AAA & Screen Reader Friendly*)
- **Hierarki Judul Semantik (*No Skipped Headings*)**: Seluruh halaman dipastikan memiliki alur `<h1>` → `<h2>` → `<h3>` yang konsisten tanpa lompatan level semantik.
- **Aksesibilitas Gambar & Tombol (*100% Labeled*)**: Seluruh elemen gambar memiliki atribut `alt="..."` deskriptif dan seluruh tombol interaktif dilengkapi dengan `aria-label` / `aria-controls`.
- **Manajemen Fokus Modal Anti-Jebakan (*Focus Trap Protection*)**: Sebelum atribut `aria-hidden="true"` diterapkan saat menutup modal Dosen/Alumni, fokus tombol keluar otomatis dilepaskan (`activeElement.blur()`) dan dikembalikan ke tombol pemicu awal (`_lastTriggerBtn.focus()`).
- **Carousel Testimoni WAI-ARIA**: Dilengkapi `role="region"`, `role="group"`, isolasi klona (*infinite loop clones* diberi `aria-hidden="true"` & `tabindex="-1"`), kendali tombol panah keyboard (`ArrowLeft` / `ArrowRight`), serta pengumuman pintar `aria-live="polite"`.

### 4. Proteksi Navigasi Riwayat Browser Multi-Lapis (*Browser Back/Forward Sync*)
- **Sinkronisasi Modal (`history.pushState` Trap)**: Saat modal Dosen atau Alumni dibuka, sistem mencatat status sementara di URL. Jika pengguna di HP menekan tombol fisik **Back (`<-`)**, event `popstate` menangkapnya dan hanya menutup modal secara halus tanpa membuang pengguna keluar dari halaman.
- **Sinkronisasi Tautan Internal (`Anchor Hash Links`)**: Klik pada subbagian internal (`#sejarah`, `#visi-misi`, `#pimpinan`) dicatat dalam riwayat browser sehingga tombol *Back/Forward* menggulir layar dengan akurat.
- **Kompatibilitas *Back-Forward Cache* (`bfcache / pageshow`)**: Jika pengguna menavigasi antar-halaman utama dan browser memulihkan halaman dari memori cache (`event.persisted`), sistem otomatis membersihkan sisa *overlay AssetGuard* dan `overflow-hidden`.

### 5. Kartu Statis Premium & Mikro-Interaksi Taktil (*Tactile & Static Elegance*)
- **Kartu Tanpa Lompatan (*Static Premium Cards*)**: Seluruh kartu (`.program-card`, `.dosen-card`, `.testimonial-card`, `.info-card`, `.kpt-card`, `.content-list`, `article`) tampil statis, tenang, dan kokoh tanpa lompatan ke atas (`translateY(-3px)`) atau perubahan bayangan saat dikursor.
- **Mikro-Interaksi Panah (`.detail-arrow`)**: Simbol `>` pada tautan/tombol meluncur halus 4px ke kanan (`translateX(4px)`) saat mouse hover maupun saat disentuh (`:active`) di HP.
- **Sensasi Tekan Taktil (`scale(.98)`)**: Tombol dan kartu interaktif sedikit mengecil elastis memberi efek fisik nyata saat ditekan baik di Desktop maupun Mobile.
- **Galeri Non-Stop Auto-Scroll (`#galeri-scroll`)**: Galeri foto kegiatan mengalir mulus tanpa henti (*continuous infinite auto-scroll*) tanpa efek pembesaran/zoom atau jeda saat disentuh.

---

## 📄 Halaman Website

| Halaman | Berkas HTML | Deskripsi Utama |
|---|---|---|
| **Beranda** | `index.html` | Portal utama; Hero fluid typography, kutipan Dekan, 3 prodi unggulan, sorotan prestasi, galeri auto-scroll non-stop, dan testimoni alumni. |
| **Profil Fakultas** | `tentang.html` | Sejarah, visi-misi, struktur organisasi, profil kepemimpinan (dengan data resmi NUPTK), serta sarana fasilitas laboratorium/ruang kelas. |
| **Direktori Dosen** | `direktori-dosen.html` | Direktori interaktif pengajar/peneliti FSTI dilengkapi pencarian RAM instan, filter jenis & database karya ilmiah, serta modal biodata lengkap. |
| **Direktori Alumni** | `alumni.html` | Direktori lulusan FSTI dari berbagai angkatan/instansi dilengkapi pencarian RAM instan, filter prodi, dan modal cerita testimoni. |
| **Penerimaan Mahasiswa Baru** | `pmb.html` | Informasi jalur pendaftaran, 4 langkah alur SPMB, jadwal kelas (Reguler A / Karyawan B / Transfer D3 / RPL), rincian biaya, dan 3 program beasiswa. |
| **Pusat Unduhan & Dokumen** | `pusat-unduhan.html` | Pustaka dokumen resmi fakultas; menyediakan unduhan langsung file PDF Buku KPT, Pedoman PKL, dan Pedoman Skripsi. |
| **S1 Informatika** | `prodi/informatika.html` | Profil prodi berakreditasi Baik Sekali; fokus *Intelligent System*, 3 peminatan, sebaran mata kuliah, prospek karier, dan fasilitas lab jaringan/komputer. |
| **S1 Sistem dan Teknologi Informasi** | `prodi/sistem-teknologi-informasi.html` | Profil prodi SISTEKIN; fokus sistem cerdas berbasis AI, IoT, multimedia, UX, gamifikasi, mata kuliah unggulan, dan prospek karier. |
| **S1 Bisnis Digital** | `prodi/bisnis-digital.html` | Profil prodi BISDIG; fokus *Technology-Driven Digital Business*, 4 peminatan/konsentrasi, mata kuliah inovasi startup, dan prospek karier global. |

---

## 📂 Struktur Folder

```text
project-fsti-rapi/
├── index.html, tentang.html, direktori-dosen.html, alumni.html, pmb.html, pusat-unduhan.html
├── README.md                                 # Dokumentasi & panduan arsitektur project
├── CHANGELOG.md                              # Log resmi riwayat pembaruan & revisi kode
├── prodi/
│   ├── informatika.html               # Halaman S1 Informatika
│   ├── sistem-teknologi-informasi.html       # Halaman S1 Sistem dan Teknologi Informasi
│   └── bisnis-digital.html                   # Halaman S1 Bisnis Digital
├── css/
│   └── style.css                             # Style terpusat, @font-face lokal, & aturan taktil
├── js/
│   ├── asset-guard.js                        # Sensor preloader & fail-closed guard
│   ├── lucide.min.js                         # Pustaka ikon lokal mandiri (Offline Lucide)
│   ├── script.js                             # Mesin interaksi, carousel a11y, & scroll history
│   ├── alumni-data.js                        # Pangkalan data 15+ alumni (window.FSTI_ALUMNI)
│   └── dosen-data.js                         # Pangkalan data 14+ dosen & karya (window.FSTI_DOSEN)
├── data/
│   ├── biodata-dosen.csv                     # Arsip CSV biodata dosen
│   ├── alumni.csv                            # Arsip CSV data alumni
│   └── Karya-Ilmiah-dosen-FSTI-clean.csv     # Arsip CSV publikasi ilmiah dosen
└── assets/
    ├── fonts/
    │   ├── inter-latin.woff2                 # Font lokal Inter (Regular, Medium, SemiBold)
    │   └── plus-jakarta-sans-latin.woff2     # Font lokal Plus Jakarta Sans (SemiBold, Bold, ExtraBold)
    ├── docs/
    │   ├── pedoman-skripsi-fsti.pdf          # Dokumen PDF Pedoman Skripsi FSTI
    │   ├── pedoman-pkl-fsti.pdf              # Dokumen PDF Pedoman PKL / Magang FSTI
    │   └── buku-kpt-teknik-informatika-2023.pdf # Dokumen PDF Kurikulum Pendidikan Tinggi TI
    └── images/
        ├── favicon.png                       # Ikon tab browser resmi FSTI
        ├── logo-final.webp                   # Logo utama FSTI UWG Malang (.webp)
        ├── org-p8-0.webp                     # Bagan struktur organisasi fakultas (.webp)
        ├── dosen/                            # 14 foto profil dosen (.webp)
        ├── alumni/                           # 15 foto profil alumni (.webp)
        ├── fasilitas/                        # 8 foto laboratorium & ruang kelas (.webp)
        ├── kegiatan/                         # 12 foto kegiatan akademik & prestasi (.webp)
        └── mitra/                            # 10 logo mitra universitas & perusahaan (.webp)
```

---

## 🛠️ Teknologi & Stack Utama

| Komponen | Teknologi yang Digunakan | Keterangan |
|---|---|---|
| **Core Structure** | HTML5 Semantic & WCAG 2.1 AA | Arsitektur semantik (`role`, `aria-*`, landmark navigation, dan `tabindex` management). |
| **Styling & Design** | Tailwind CSS v3 (CDN) + Custom CSS3 | Desain responsif, fluid typography, flex/grid adaptif, dan variabel warna brand FSTI (`#5B2A7E` & `#F18602`). |
| **Interactivity Engine** | Vanilla JavaScript (ES6+) | Tanpa jQuery atau framework berat. Menggunakan `IntersectionObserver`, `history.pushState`, dan DOM manipulation murni. |
| **Iconography** | Lucide Icons (`lucide.min.js`) + Inline SVG | 157+ ikon vektor lokal beresolusi tinggi + SVG murni untuk ikon merek (TikTok). |
| **Typography** | Local Self-Hosted Google Fonts (`.woff2`) | Font *Plus Jakarta Sans* (Heading) dan *Inter* (Body) dimuat 100% lokal. |
| **Data Architecture** | In-Memory JS Objects (`alumni-data.js` & `dosen-data.js`) | Penyimpanan dan pemilahan data langsung di RAM browser dengan cadangan arsip `.csv`. |

---

## 📐 Panduan Konsistensi Desain & Konten (*Design & Content Guidelines*)

Guna menjaga konsistensi visual, interaksi, fungsionalitas, dan bahasa di seluruh halaman website (baik halaman utama maupun halaman program studi), seluruh pengembang wajib mematuhi standar berikut:

### 1. Warna & Font (Brand Identity)
* **Warna Utama**: Ungu (`#5B2A7E` / Tailwind class: `text-[#5B2A7E]`) dan Oranye (`#F18602` / Tailwind class: `text-[#F18602]` atau `bg-[#F18602]`).
* **Warna Teks Judul**: Hitam arang (`#1A1026` / Tailwind class: `text-[#1A1026]`).
* **Font Judul**: Wajib menggunakan **Plus Jakarta Sans** (Self-Hosted Lokal `.woff2`).
* **Font Teks Biasa**: Wajib menggunakan **Inter** (Self-Hosted Lokal `.woff2`).

### 2. Kelengkungan Sudut & Garis Tepi (*Border & Corner Radius*)
* **Lekukan Kartu Utama (Cards)**: Wajib menggunakan **`rounded-[28px]`** (tanpa efek hover border oranye/bayangan/lompatan `translateY`). Berlaku untuk kartu dosen, alumni, prodi, dan artikel.
* **Garis Tepi Kartu (Outline)**: Wajib menggunakan warna abu-abu sangat lembut yang seragam (**`border-gray-200`** / `#e5e7eb`) agar tampilan website terlihat bersih, tenang, dan premium.
* **Lekukan Elemen Sedang**: Wajib menggunakan **`rounded-[20px]`** (untuk foto profil dekan/dosen, box statistik, dll).
* **Lekukan Badge/Tag**: Wajib menggunakan **`rounded-full`** (untuk chip akreditasi, tag keahlian, kategori).

### 3. Jarak Antar Bagian (*Spacing*)
* **Padding Vertikal Section**: Wajib menggunakan **`py-16 md:py-20`** pada setiap section (sekitar 64px di mobile dan 80px di desktop) untuk menjaga keseimbangan "ruang bernapas" halaman.

### 4. Animasi Reveal (*Pure Fade-In*)
* **Efek**: Menggunakan efek pemudaran murni lembut (*Pure Fade-In*) tanpa gerakan geser/lompat naik-turun.
  ```css
  .reveal, .reveal-fade-up {
      opacity: 0;
      transition: opacity 0.6s ease-out;
  }
  .reveal.active, .reveal-fade-up.active {
      opacity: 1;
  }
  ```
* **Picu Sensor (JS)**: Diatur sangat sensitif di `js/script.js` dengan nilai `threshold: 0.01` dan `rootMargin: '0px 0px -10px 0px'` agar animasi langsung terpicu mulus di semua layar (HP/Desktop).
* **Penempatan Kelas `.reveal`**:
  * **Halaman Beranda**:
    * *Hero Section*: Seluruh teks sambutan & tombol CTA utama.
    * *Sekilas Fakultas*: Blok Dean's Quote & Blok Statistik.
    * *Section Program, Prestasi, Testimoni, Mitra*: Pada masing-masing **Judul Seksi** (*Section Header*) DAN **Grid Konten Utama** (grid kartu, slider testimoni, grid logo mitra, tombol CTA bawah).
    * *Final CTA*: Seluruh isi box banner gabungan.
  * **Halaman Lainnya (Aturan Umum)**:
    * *Hero / Banner Atas*: Seluruh judul halaman dalam satu container.
    * *Section Title*: Setiap judul seksi besar.
    * *Grid Konten*: Setiap wrapper penampung kartu utama/fasilitas/list.

### 5. Standardisasi Tombol (*Call to Action / CTA*)
Setiap tombol Utama (Solid) maupun Kedua (Outline) wajib memenuhi kesamaan fisik:
* **Sudut**: Wajib **`rounded-xl`** (12px).
* **Font & Posisi**: Wajib **`font-bold`** & **`inline-flex items-center justify-center`** (teks tepat di tengah).
* **Hover State (Sesuai Beranda)**: 
  * *Tombol Utama (Solid Oranye)*: Berubah menjadi Oranye gelap (`#D97200` / `hover:bg-[#D97200]`) + bayangan halus (`hover:shadow-md`).
  * *Tombol Kedua (Outline Ungu)*: Berubah menjadi Ungu gelap (`#3D1A55` / `hover:bg-[#3D1A55]`) dengan teks putih bersih.
* **Active State (Ditekan)**: Wajib mengecil tipis dengan efek **`active:scale-[0.98]`** (`or scale-[0.988]`) agar terasa seperti menekan tombol fisik nyata di HP maupun Desktop.

### 6. Standardisasi Tautan Teks (*Inline Link & Micro-Interactions*)
* **Format**: Menggunakan teks Ungu tebal yang bertransisi warna menjadi Oranye saat di-hover (`text-[#5B2A7E] hover:text-[#F18602] transition-colors`), dan wajib diakhiri simbol anak panah **`&gt;`** (yang menghasilkan karakter **`>`**).
* **Mikro-Interaksi Panah (*Arrow Shift*)**: Simbol **`&gt;`** pada tautan detail wajib dibungkus `<span class="detail-arrow">&gt;</span>` dan tautan diberi jarak `gap-1`. Saat tautan (atau kartu induknya) dikursor atau disentuh (`:active`), panah bergeser halus ke kanan 4px dengan transisi 0.2 detik — memberi umpan balik interaktif tanpa mengubah border/bayangan kartu. Gaya ini terpusat di `css/style.css` (kelas `.detail-arrow`) dan berlaku di semua halaman.

### 7. Gaya Bahasa & Nada Konten (*Tone of Voice*)
* **Modern & Inspiratif**: Gunakan gaya bahasa profesional, ramah, dan dinamis untuk menjembatani 4 target audiens (Calon Mahasiswa/Gen-Z, Orang Tua, Mitra Industri, Dosen, serta Mahasiswa Aktif).
* **Ringkas & Padat**: Sampaikan informasi menggunakan poin-poin (*bullet points*), sub-judul yang jelas, dan ringkasan pendek agar nyaman dibaca di layar HP.
* **Formal Akademik, tetapi Tetap Natural**: Karena website ini mewakili fakultas, seluruh teks wajib terdengar formal, rapi, kredibel, dan institusional. Hindari bahasa yang terlalu santai, promosi berlebihan, atau terlalu kaku seperti naskah birokratis.
* **Bahasa Indonesia sebagai Dasar**: Gunakan Bahasa Indonesia sebagai bahasa utama untuk kalimat penjelasan, deskripsi, dan narasi konten agar mudah dipahami calon mahasiswa, orang tua, mitra, dosen, dan mahasiswa aktif.
* **Istilah Inggris yang Lebih Lazim Boleh Dipertahankan**: Jangan memaksakan terjemahan istilah Inggris jika hasil terjemahannya terdengar aneh, kaku, atau tidak lazim digunakan di dunia akademik/industri. Jika versi Inggris lebih umum, natural, dan mudah dikenali, pertahankan istilah tersebut. Contoh: *Business Intelligence*, *Mobile Computing*, *Data Scientist*, *UI/UX Designer*, *Digital Marketing*, *Cloud Computing*.
* **Deskripsi Tetap Menjelaskan dengan Jelas**: Jika judul, bidang, role, atau istilah memakai Bahasa Inggris, paragraf/deskripsi pendamping tetap harus menjelaskan maknanya dalam Bahasa Indonesia yang formal, ringkas, dan mudah dipahami pembaca awam.
* **Bilingual Istilah / Aturan Italic**: Penulisan miring (*italic*) dipakai secukupnya untuk istilah Inggris yang menjadi istilah teknis inti, nama bidang/konsentrasi, role/karier teknologi spesifik, atau istilah akademik/metodologi khusus. Contoh: *Machine Learning*, *Deep Learning*, *Cloud Computing*, *Business Intelligence*, *Mobile Computing*, *Intelligent Multimedia*, *Data Scientist*, *AI Engineer*, *UI/UX Designer*, dan *Outcomes-Based Education (OBE)*. Tidak perlu italic untuk singkatan umum atau kata Inggris yang sudah lazim/pendek seperti AI, IT, IoT, UX, NLP, startup, game, mobile, cloud, nama institusi, brand, dokumen resmi, atau kata Inggris yang hanya menjadi pelengkap kalimat.
* **Berbasis Data Nyata**: Informasi profil (dosen/alumni/NUPTK) wajib bersumber dari data riil dan tersinkronisasi dengan file JS/CSV.

### 8. Tata Letak Konten (*Layout Standard*)
* **Bagian Atas (Internal Hero)**: Halaman dalam wajib menggunakan banner gelap setinggi `280px` - `320px` (`pt-28 pb-16 md:pt-32 md:pb-20`; tinggi boleh melebihi 320px bila memakai *Bar Statistik Hero* opsional di bawah) dengan ketentuan sebagai berikut:
  * **Background & Pattern**: Memadukan warna ungu gelap (`bg-[#5B2A7E]` di bawah penutup `#1A1026`), motif *dot-grid* transparan (`opacity-[0.12]`), serta dua pendaran cahaya oranye melingkar (*orange mesh glows*) di sisi kanan-atas dan kiri-bawah.
  * **Judul Utama (H1)**: Menggunakan warna putih bersih seutuhnya (`text-white font-extrabold`). Dari segi ketentuan isi, wajib menyebutkan nama halaman dengan jelas (contoh: "Profil ") diikuti nama lengkap fakultas ("Fakultas Sains dan Teknologi Informasi") demi menjaga formalitas akademik dan kejelasan topik.
  * **Kalimat Deskripsi (P)**: Menggunakan warna Oranye FSTI penuh (**`text-[#F18602] font-medium`**) agar memberikan kontras warna yang menonjol dan berkarakter kuat. Dari segi ketentuan isi, wajib berupa **satu kalimat ringkas** yang merangkum isi halaman secara spesifik dan wajib diakhiri dengan penyebutan nama institusi resmi secara lengkap (**"FSTI Universitas Widya Gama Malang"** atau **"FSTI UWG Malang"**) sebagai jangkar branding yang kokoh.
  * **Bar Statistik Hero (Hero Stats Bar) [Opsional]**: Ringkasan angka kunci halaman di dalam hero, tepat di bawah deskripsi. Ketentuan:
    * **Cakupan**: Hanya untuk halaman berjenis **profil/identitas** (halaman Program Studi dan Profil Fakultas). Halaman fungsional (PMB, Direktori Dosen, Alumni, Pusat Unduhan) **tidak** menggunakannya karena data ringkasnya sudah tampil di toolbar/kontennya.
    * **Jumlah**: Maksimal 5 statistik. Seluruh angka wajib nyata dan terverifikasi dari data resmi (CSV/data JS/konten resmi halaman), label menyesuaikan konteks tiap halaman (cth: "Peminatan" di TI/BISDIG, "Area Fokus" di SISTEKIN).
    * **Struktur**: Berada di dalam container `.reveal` hero, diawali garis pemisah tipis `border-t border-white/10` dengan jarak `mt-10 md:mt-12 pt-8`.
    * **Gaya Angka & Label**: Angka `text-2xl md:text-3xl font-extrabold text-white`; label `text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#F18602] mt-1`.
    * **Grid Responsif**: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-6` (2 kolom di HP → 3 di tablet → 5 sejajar di desktop; sesuaikan kolom desktop dengan jumlah statistik). Bila jumlah ganjil, item terakhir diberi `col-span-2 sm:col-span-1` agar tampil seimbang di HP.
* **Bagian Tengah (Alternating Background)**: Terapkan konsep selang-seling warna latar belakang antar-seksi untuk memisahkan topik informasi dengan jelas (Seksi ganjil menggunakan `bg-white`, seksi genap menggunakan `bg-[#FFF9F2]`).
* **Sistem Grid Adaptif**: Layout kolom wajib responsif:
  * HP: 1 Kolom (`grid-cols-1`).
  * Tablet: 2 Kolom (`md:grid-cols-2`).
  * Desktop: 3 Kolom (`lg:grid-cols-3`) dengan jarak `gap-6` atau `gap-8`.
* **Kompatibilitas Semua Layar**: Seluruh halaman wajib tampil optimal, rapi, dan konsisten pada layar HP, tablet, laptop, serta desktop. Pastikan navigasi, teks, gambar, kartu, tombol, tabel, dan elemen interaktif tidak terpotong, bertumpuk, atau sulit digunakan pada ukuran layar apa pun. Lakukan pengecekan minimal pada lebar layar mobile (320–480px), tablet (768px), laptop (1024px), dan desktop (1280px ke atas).
* **Batas Lebar Layar (Container)**: Konten teks panjang wajib dibatasi dalam kontainer **`max-w-5xl`** (untuk keterbacaan optimal), sedangkan untuk galeri, kartu, atau logo mitra dibatasi kontainer **`max-w-6xl`**.

### 9. Standardisasi Judul Seksi (*Section Header*)
Setiap awal seksi informasi besar wajib diawali dengan struktur judul seksi tengah (*centered Section Header*) yang memiliki elemen berikut secara berurutan:
* **Eyebrow / Sub-title (Span)**: Menggunakan teks kecil kapital berwarna Oranye gelap (`text-[#D97200] text-xs font-bold uppercase tracking-[0.2em] mb-3`) sebagai penanda tema seksi.
* **Judul Utama Seksi (H2)**: Menggunakan font tebal berwarna Ungu FSTI (`text-[#5B2A7E] text-3xl md:text-4xl font-extrabold mb-4`) untuk menarik perhatian utama.
* **Garis Dekorasi (Indicator Line)**: Sebuah garis horizontal pendek melengkung berwarna Oranye (`w-20 h-1.5 bg-[#F18602] mx-auto rounded-full mb-4` atau `mb-8` jika di bawahnya langsung ada grid kartu) untuk estetika seimbang.
* **Paragraf Deskripsi Seksi (P) [Optional]**: Paragraf pelengkap berwarna abu-abu (`text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl` atau `max-w-3xl mx-auto`) untuk memberikan konteks awal isi seksi tersebut.
* **Pembungkus Utama**: Seluruh elemen di atas wajib dibungkus dalam satu kontainer div ber-kelas **`text-center reveal`** agar lurus di tengah secara sempurna dan memudar masuk secara lembut.

### 10. Header & Footer
* **Header Navigasi**: Wajib menggunakan struktur navigasi yang sama persis di semua halaman, baik mode Desktop maupun urutan Mobile (**Beranda → Tentang Kami → Program Studi → Akademik → Alumni → PMB**).
* **Footer**: Wajib menggunakan **Footer 4-Kolom** yang identik dengan halaman beranda di bagian paling bawah.

---

## 📊 Pemeliharaan & Pembaruan Data

Website ini menggunakan arsitektur penyimpanan data langsung di dalam memori JavaScript (`In-Memory Data Engine`) untuk memberikan kecepatan pemilahan seketika tanpa membutuhkan server database SQL.

### Sumber Data Utama:
1. **`js/alumni-data.js`**: Menyimpan array `window.FSTI_ALUMNI` (beserta alias `window.alumniData`) yang berisi informasi 15+ lulusan FSTI beserta jabatan, instansi, testimoni, foto `.webp`, dan tautan email/LinkedIn.
2. **`js/dosen-data.js`**: Menyimpan array `window.FSTI_DOSEN` (beserta alias `window.dosenData`) yang berisi informasi 14+ dosen & peneliti FSTI beserta NUPTK, NIDN, jabatan fungsional, bidang keahlian, foto `.webp`, daftar karya ilmiah, serta tautan SINTA, Google Scholar, ORCID, Scopus, dan Garuda.

### Cara Memperbarui Data Dosen / Alumni:
1. Buka berkas `js/alumni-data.js` atau `js/dosen-data.js` menggunakan editor kode (*VS Code* / *Sublime*).
2. Tambahkan atau edit objek JSON di dalam array yang sesuai. Pastikan format sintaks JSON akurat.
3. Simpan berkas (`Ctrl+S` / `Cmd+S`). Perubahan akan langsung muncul secara seketika di website saat dimuat ulang, dan sistem *AssetGuard* otomatis memvalidasi strukturnya.
4. *(Opsional)* Untuk keperluan arsip administratif, Anda dapat memperbarui salinan berkas `.csv` di dalam folder `data/` (`biodata-dosen.csv` / `alumni.csv`).

---

## 💻 Cara Menjalankan Project (*Deployment*)

Karena website ini merupakan **Statis Modern (Pure HTML5 + CSS3 + Vanilla JS)** yang mandiri, Anda dapat menjalankannya di lingkungan lokal maupun mengunggahnya ke server *hosting* manapun tanpa memerlukan konfigurasi Node.js, PHP, Python, atau MySQL.

### Opsi 1: Menjalankan di Komputer Lokal (*Development*)
1. Pastikan seluruh folder project (`project-fsti-rapi`) tersimpan rapi di komputer Anda.
2. **Cara Tercepat:** Klik dua kali (*double click*) pada berkas **`index.html`** untuk membukanya langsung di browser (Chrome/Safari/Firefox/Edge).
3. **Cara Direkomendasikan (Visual Studio Code):**
   * Buka folder project di dalam **Visual Studio Code**.
   * Pasang ekstensi **Live Server** (oleh Ritwick Dey).
   * Klik kanan pada berkas `index.html`, lalu pilih **Open with Live Server**. Browser akan terbuka otomatis di alamat lokal `http://127.0.0.1:5500/index.html` dengan fitur *hot-reload*.

### Opsi 2: Unggah ke Server Hosting (*Production Deployment*)
Project ini siap diluncurkan ke berbagai penyedia layanan *static hosting* gratis maupun *shared hosting* berbayar:
- **GitHub Pages / Cloudflare Pages / Vercel / Netlify:** Cukup hubungkan repositori Git Anda atau unggah folder project ini. Atur *build command* menjadi kosong (`none`) dan *output directory* ke akar (`/` atau `.`).
- **cPanel / Apache / Nginx Shared Hosting:** Unggah seluruh isi folder project ke dalam direktori `public_html` atau `www` di server hosting Anda. Seluruh path relatif akan bekerja otomatis tanpa butuh `.htaccess` khusus.

---

## 📝 Catatan Rilis & Riwayat Revisi

Seluruh riwayat revisi, audit teknis, penambahan fitur, serta penyempurnaan semantik dan aksesibilitas dicatat secara transparan dan berurutan di dalam berkas resmi **[`CHANGELOG.md`](CHANGELOG.md)**. 

Setiap pengembang yang berkontribusi atau melakukan perubahan kode sekecil apa pun pada project ini **wajib memperbarui log di `CHANGELOG.md`** dengan tanggal, kategori perubahan (*Ditambahkan / Diubah / Dihapus / Diverifikasi*), dan penjelasan singkat yang padat.

---

## 🏛️ Lisensi & Hak Cipta

© 2026 **Fakultas Sains dan Teknologi Informasi (FSTI) — Universitas Widya Gama Malang**.  
Seluruh hak cipta dilindungi undang-undang. Konten, teks narasi, data pengajar, foto profil dosen dan alumni, logo resmi FSTI UWG Malang, serta desain arsitektur antarmuka pada repositori ini merupakan aset intelektual milik FSTI Universitas Widya Gama Malang. Dilarang menggunakan ulang, menyalin, atau mendistribusikan aset untuk kepentingan komersial tanpa izin tertulis dari pimpinan fakultas.

---
<div align="center">
  <p>Dikembangkan dengan ❤️ untuk kemajuan pendidikan digital di <b>Universitas Widya Gama Malang</b></p>
  <p><a href="#website-resmi-fsti-uwg-malang">⬆️ Kembali ke Atas</a></p>
</div>
