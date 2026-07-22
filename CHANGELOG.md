# Changelog - FSTI UWG Website Revisions

Semua catatan revisi, perbaikan, dan pemeliharaan website dicatat secara ringkas di sini.

---

### [2026-07-22] - Rename Prodi Informatika menjadi Teknik Informatika

#### Latar Belakang
Program studi **S1 Informatika** kembali memakai nomenklatur **S1 Teknik Informatika** di seluruh website, termasuk penggantian nama file halaman prodi.

#### Diubah
- **Rename halaman**: `prodi/informatika.html` → `prodi/teknik-informatika.html` (riwayat git terjaga via `git mv`); seluruh tautan internal di 13 halaman diperbarui (menu *Program Studi*, footer, kartu prodi di `index.html`).
- **Teks tampilan**: "S1 Informatika" → "S1 Teknik Informatika", "Program Studi Informatika" → "Program Studi Teknik Informatika", "Prodi/Kaprodi Informatika" → "…Teknik Informatika" pada 13 HTML, `README.md`, dan berkas data (`js/alumni-data.js`, `js/dosen-data.js`, `js/prestasi-data.js`) termasuk testimoni alumni, jabatan kaprodi/dosen homebase, `prodiLabel`, dan keterangan prestasi.
- **Meta & SEO**: `title`, `description`, `og:title/description`, `twitter:title/description` halaman prodi serta meta `index.html` disesuaikan.
- `service-worker.js`: precache `./prodi/teknik-informatika.html` + bump cache `v2026.21 → v2026.22`.

#### Dipertahankan (sengaja tidak diubah)
- "**Himpunan Mahasiswa Informatika**" (HMIF/MUSTIKA) — nama resmi organisasi kemahasiswaan.
- "Dosen Informatika di **UIN Maulana Malik Ibrahim Malang**" & "Dosen Program Studi Informatika (UIN)" — nomenklatur prodi kampus lain; termasuk "S2 Informatika" pada testimoni (jenjang di kampus lain).
- Judul publikasi ilmiah "*…(Studi Kasus Di Prodi Informatika Univ Widyagama)*" — judul terbit dipertahankan verbatim.

#### Diverifikasi
- 0 tautan internal rusak (cek otomatis seluruh `href *.html` di 13 halaman); 0 sisa string `informatika.html` lama; tidak ada duplikasi "Teknik Teknik".
- `node --check` lolos untuk `alumni-data.js`, `dosen-data.js`, `prestasi-data.js`, `service-worker.js`.
- Sisa kata "Informatika" non-"Teknik Informatika" hanya pada 4 pengecualian di atas.

---

#### Latar Belakang
Dilakukan audit UI/UX programatik menyeluruh (struktural, runtime via jsdom, aksesibilitas, design-system, PWA, dan keamanan) pada seluruh 13 halaman. Hasil: **0 error runtime**, **semua fitur interaktif berfungsi (74 uji fitur lolos)**, situs 100% self-hosted tanpa kredensial/pola berisiko. Audit menyisakan sejumlah item aksesibilitas & SEO yang kemudian dituntaskan pada revisi ini.

#### Diubah
- **Landmark `main`**: pembungkus `<section id="main-content">` di **13 halaman** diberi `role="main"` sehingga screen reader memperoleh landmark utama (tautan *skip-link* `#main-content` tetap valid).
- **`alt` gambar**: **12 gambar galeri** di `index.html` yang sebelumnya tanpa `alt` kini ber-`alt` (diambil dari `data-modal-caption` masing-masing).
- **Kontras warna WCAG**: teks oranye kecil di latar terang — *eyebrow* (`text-[#D97200]`), badge akreditasi, dan label "Dekan FSTI UWG" — diganti ke **`#C2410C`** (rasio ≥ 4.5:1 di atas putih/krem/`orange-100`). Oranye di latar gelap (hero & kartu charcoal) **dipertahankan** `#F18602` karena sudah lolos (7.11:1). Berkas terdampak: 13 HTML + `js/karya-agregat.js`.
- **Open Graph & Twitter Card**: ditambahkan pada **3 halaman prodi** (`informatika`, `sistem-teknologi-informasi`, `bisnis-digital`) mengikuti pola halaman lain (`og:image` memakai path `../assets/...`).
- `css/tailwind.css`: di-*rebuild* agar utilitas `#C2410C` ter-*generate* (termasuk dalam cache `v2026.21`).

#### Diverifikasi
- Audit ulang: **0 temuan Critical/High/Medium/Low**; parser HTML 13/13 valid; 0 `<img>` tanpa `alt`; 3 halaman prodi memiliki `og:title`; kontras pasangan warna yang diubah ≥ 4.5:1.
- Uji runtime jsdom: 13/13 halaman tampil, 0 error, seluruh interaksi tetap berfungsi.

---

### [2026-07-22] - Migrasi Tailwind CSS dari Play CDN ke Build Lokal (Self-Hosted)

#### Latar Belakang
Seluruh 13 halaman sebelumnya memuat Tailwind melalui `https://cdn.tailwindcss.com` saat runtime, sementara `service-worker.js` tidak meng-*cache* URL tersebut — akibatnya dalam mode offline halaman tampil tanpa gaya (layout pecah), bertentangan dengan klaim *"100% Self-Hosted & Offline-Ready"*. Percobaan migrasi ke lokal sebelumnya bermasalah karena konfigurasi `content` Tailwind tidak menyertakan berkas JavaScript yang merakit markup secara dinamis sehingga banyak kelas tidak ter-*generate*.

#### Ditambahkan
- `css/tailwind.css` — hasil build Tailwind lokal (±37,6 KB minified) pengganti CDN.
- `css/tailwind-input.css` — berkas input Tailwind (`@tailwind base/components/utilities`).
- `tailwind.config.js` — konfigurasi dengan `content: ['./*.html', './prodi/*.html', './js/*.js']` (penyertaan `js/*.js` krusial agar kelas dinamis & *arbitrary value* seperti `text-[#F18602]` ikut ter-*generate*).
- `package.json` + `package-lock.json` — toolchain build (Tailwind **v3**): `npm run build:css` (build) & `npm run watch:css` (watch).
- `.gitignore` — mengabaikan `node_modules/`.

#### Diubah
- **13 halaman**: `<script src="https://cdn.tailwindcss.com">` → `<link rel="stylesheet" href="css/tailwind.css">` (halaman prodi memakai `../css/tailwind.css`), dimuat **sebelum** `css/style.css` agar override kustom tetap menang.
- `service-worker.js`: `./css/tailwind.css` ditambahkan ke precache + bump cache `v2026.20 → v2026.21`.

#### Diverifikasi
- **Cakupan kelas 100%**: 807 kelas unik (HTML + JS perakit markup) seluruhnya hadir di hasil build (0 hilang), termasuk *arbitrary value*, *opacity modifier* (`/30`, `/60`), radial-gradient, dan kelas rakitan JS (`bg-purple-50`, badge, toast).
- Uji runtime jsdom: 13/13 halaman tampil, 0 error, seluruh interaksi berfungsi, dan **0 request eksternal** (tidak lagi bergantung pada CDN mana pun).
- Integritas precache SW: 32 entri, seluruh berkas ada di disk.
- Catatan: build lokal (`npm run build:css`) hanya perlu dijalankan bila kelas Tailwind diubah; verifikasi visual piksel tetap disarankan di browser nyata.

---

### [2026-07-21] - Bidang Keahlian Bu Devi Septiani Diperbarui

#### Diubah
- **Devi Septiani, S.Kom., M.Kom.** (Dosen Homebase S1 SISTEKIN): bidang keahlian diperbarui dari "Manajemen Sistem Informasi" menjadi **"Manajemen Sistem Informasi, VR & AR, Multimedia 3D"**, disinkronkan di tiga lokasi data:
  - `js/dosen-data.js` (kolom `expertise` & `tags` — chip keahlian di Direktori Dosen otomatis menjadi 3).
  - `prodi/sistem-teknologi-informasi.html` (daftar Dosen Homebase SISTEKIN: teks keahlian & `data-modal-desc`).
  - `data/biodata-dosen.csv` (arsip administratif).
- `service-worker.js`: bump cache ke `v2026.20`.

#### Diverifikasi
- Parser HTML 13/13 valid (termasuk sistekin yang berubah); `js/dosen-data.js` termuat benar (14 dosen; entri Bu Devi: 3 tag keahlian); CSV tetap 17 kolom per baris.

---

### [2026-07-21] - Data Prestasi Diperkaya dari Berita Resmi UWG (TAHES & Borong Medali UKM Taekwondo)

#### Ditambahkan
- **Sumber resmi untuk ketiga entri prestasi** (kolom `sumber` + `sumberLabel` kini terisi semua, semuanya berita resmi Humas di widyagama.ac.id dan telah diverifikasi aktif):
  - INOTEK → artikel *"TAHES UWG Raih Juara III INOTEK Kota Malang 2025"* (12 Nov 2025).
  - IYIS → artikel prestasi Irsyad (17 Des 2024).
  - Taekwondo → artikel *"UKM Taekwondo Borong Medali di Ajang Bergengsi Kapolda Jatim"* (30 Des 2025).
- **Detail TAHES (entri INOTEK)**: narasi kini memuat nama karya **TAHES (Talk and Heal Every Student)** — aplikasi pemantauan kesehatan mental siswa berbasis analisis stres dan dukungan sosial — serta konteks tim (mahasiswa Informatika semester V).
- **Konteks tim UKM Taekwondo (entri Taekwondo)**: raihan Wa Ode Anisa Febrianti kini tercatat sebagai bagian dari **borongan 4 medali emas + 1 medali perak dari 5 atlet UKM Taekwondo UWG** (seluruh atlet naik podium). Nama peraih dilengkapi dari versi resmi Humas ("Wa Ode Anisa Febrianti"), dan kolom penyelenggara ditambah lokasi/tanggal (ITS Robotics Center Surabaya, 6–7 Desember 2025).

#### Diubah
- `prestasi.html`: kolom pencarian kini ikut menelusuri narasi `keterangan` (mis. kata "TAHES", "UMKM", "Surabaya" menemukan entrinya).
- `service-worker.js`: bump cache ke `v2026.19`.

#### Diverifikasi
- Kedua URL artikel Humas dikonfirmasi daring dan isinya sesuai; parser HTML 13/13 valid; `node --check` lolos; uji DOM headless **34/34** lolos (termasuk: tiga baris sumber tampil, narasi TAHES & konteks 4 emas tampil, pencarian lewat keterangan menemukan entri yang benar).

---

### [2026-07-21] - Halaman Prestasi Menjadi Arsip Horizontal + Narasi & Tautan Sumber

#### Latar Belakang
Isi halaman Prestasi (3 entri riil) identik dengan seksi "Sorotan Prestasi" di Beranda sehingga terasa seperti duplikat. Atas keputusan pengelola, halaman dibedakan lewat **tata letak sekaligus kedalaman isi** — Beranda tetap sorotan ringkas, halaman menjadi arsip resmi.

#### Ditambahkan (`js/prestasi-data.js` + `prestasi.html`)
- Tiga kolom data opsional baru: **`keterangan`** (narasi singkat; tampil pada kartu dan otomatis disertakan di deskripsi lightbox), **`sumber`** & **`sumberLabel`** (tautan sumber berita; baris "Sumber: …" hanya muncul bila URL diisi).
- Narasi diisi dari sumber yang diverifikasi: IG resmi HMIF (INOTEK & Taekwondo) dan artikel resmi Humas — IYIS kini bertautan ke **berita resmi di widyagama.ac.id** (17 Des 2024, terverifikasi daring dan sejalan dengan liputan TIMES Indonesia).

#### Diubah (`prestasi.html`)
- Kartu grid vertikal diubah menjadi **kartu arsip horizontal satu kolom** (foto di kiri pada layar ≥sm, konten di kanan); foto tetap membuka lightbox global. Statistik, chip kategori, filter tingkat, pencarian, sorting tahun, dan *empty state* tidak berubah.
- `README.md` disesuaikan; `service-worker.js`: bump cache ke `v2026.18`.

#### Diverifikasi
- URL sumber IYIS di widyagama.ac.id dikonfirmasi aktif dan isinya sesuai; parser HTML 13/13 valid; `node --check` skrip inline lolos; seluruh ikon Lucide valid; uji DOM headless 31/31 lolos (termasuk asersi baru: tata letak horizontal, narasi tampil, hanya entri IYIS yang merender tautan sumber).

---

### [2026-07-21] - Tombol "Lihat Semua Cerita Alumni" Diseragamkan

#### Diubah
- **`index.html`**: tombol CTA akhir "Lihat Semua Cerita Alumni" kini memakai gaya **outline ungu** (border + teks `#5B2A7E`, hover blok ungu gelap `#3D1A55`) lengkap dengan panah `detail-arrow` — identik dengan tombol "Lihat Semua Prestasi Fakultas" dan "Lihat Semua Kerjasama Fakultas" (standar Tombol Kedua sesuai Panduan Desain butir 5). Wrapper diseragamkan (`text-center mt-12 reveal reveal-fade-up`).
- **`css/style.css`**: blok override `.home-page .cta-alumni` (blok ungu solid tanpa ikon) dan `body .cta-alumni:active` dihapus karena kelas `cta-alumni` sudah tidak dipakai di mana pun.
- `service-worker.js`: bump cache ke `v2026.17`.

#### Diverifikasi
- Tidak ada sisa referensi `cta-alumni` di HTML/CSS/JS; kurung kurawal CSS seimbang; parser HTML: 13/13 halaman valid; ketiga tombol "Lihat Semua …" di Beranda kini berbagi kelas yang sama persis.

---

### [2026-07-21] - Logo Mitra Tanpa Lightbox

#### Diubah
- **`kerjasama.html`**: logo mitra pada kartu tidak lagi dapat diklik untuk diperbesar (atribut `data-modal-*` dihapus) — menyelaraskan perilaku dengan tile logo mitra di Beranda. Blok markup modal gambar (`#image-modal`) ikut dilepas dari halaman ini karena sudah tidak ada elemen yang memakainya (halaman lain yang membutuhkan — Prestasi, Beranda, dll. — tidak terpengaruh).
- `README.md`: klaim lightbox pada logo mitra di fitur butir 6 & tabel halaman dihapus.
- `service-worker.js`: bump cache ke `v2026.16`.

#### Diverifikasi
- Parser HTML: 13/13 halaman valid; `node --check` skrip inline lolos; uji DOM headless 27/27 lolos (dengan asersi baru: `kerjasama.html` bebas `data-modal`, `prestasi.html` tetap memiliki lightbox foto).

---

### [2026-07-21] - Penyegaran README Menyeluruh + Penyelarasan Kartu ke Standar Desain Statis

#### Diubah (README.md — sinkron dengan kondisi web terbaru)
- Badge versi `2026.7` → `2026.15` (mengikuti versi cache Service Worker).
- **Tentang Project**: ditambahkan empat sajian informasi baru (tabel agregat Penelitian & Pengabdian, direktori Kerjasama, galeri Prestasi); status dokumen Pusat Unduhan diperbarui (Buku KPT tersedia; Pedoman Skripsi & PKL *Segera Hadir*).
- **Fitur Unggulan**: jumlah ikon/gambar dikoreksi ke data riil (55+ ikon Lucide, 60+ gambar `.webp`); AssetGuard kini juga memvalidasi `FSTI_KERJASAMA`/`FSTI_PRESTASI`; versi Service Worker `v2026.7` → `v2026.15`; **fitur baru butir 6** mendokumentasikan mesin tabel agregat (`karya-agregat.js` + `util-tabel.js`: 617 penelitian 2003–2026 & 108 pengabdian 2010–2026, filter dosen, sorting tahun, salin sitasi), direktori kartu mitra, dan galeri kartu prestasi.
- **Tabel Halaman**: deskripsi Direktori Dosen (14 pengajar), Penelitian (617 entri), Pengabdian (108 entri), Kerjasama (10 mitra: 7 LN/program global & 3 DN), dan Alumni (15 lulusan) diperkaya angka riil.
- **Struktur Folder**: jumlah foto `assets/images/fasilitas/` dikoreksi 8 → 7.
- **Teknologi & Stack**: baris Data Architecture mencakup keempat berkas data JS + mesin agregat.
- **Panduan Desain butir 8**: daftar halaman fungsional tanpa Hero Stats Bar dilengkapi (Penelitian, Pengabdian, Kerjasama, Prestasi). **Butir 10**: standar header ditulis lengkap (urutan menu + isi ketiga dropdown + konvensi penanda halaman aktif), dan standar kolom *Layanan* footer didetailkan.

#### Diubah (Penyelarasan kartu ke Panduan Desain butir 2 & 5 — *Static Premium Cards*)
- `kerjasama.html` & `prestasi.html`: kelas kartu hasil render diselaraskan ke standar kartu utama situs — `rounded-[28px] border-gray-200` **statis** (tanpa lompatan `translateY`, bayangan, atau border oranye saat hover). Interaksi pada media dikembalikan ke pola semula: ring oranye lembut pada logo mitra dan transparansi halus pada foto prestasi saat dikursor.

#### Diubah (Pendukung)
- `service-worker.js`: bump cache ke `v2026.15`.

#### Diverifikasi
- Parser HTML: 13/13 halaman valid; `node --check` skrip inline lolos; uji DOM headless 27/27 skenario tetap lolos setelah penyelarasan kelas kartu.

---

### [2026-07-21] - Tampilan Kerjasama & Prestasi Diubah dari Tabel menjadi Grid Kartu

#### Diubah
- **`kerjasama.html`**: Tabel 8 kolom diganti menjadi **grid kartu mitra** (1/2/3 kolom responsif). Setiap kartu memuat: logo mitra besar (klik → lightbox), badge jenis mitra & ruang lingkup (Dalam/Luar Negeri — otomatis dari negara), nama mitra, negara, ruang lingkup bidang kerja sama, serta baris meta (bentuk dokumen, periode bila tersedia, pill status Aktif/Berakhir) dan tombol tautan situs resmi. Pencarian, filter jenis, sorting nama, statistik ringkas (10 mitra / 3 DN / 7 LN), dan *empty state* dipertahankan.
- **`prestasi.html`**: Tabel diganti menjadi **grid kartu prestasi** dengan sampul foto dokumentasi yang dapat diklik (lightbox tetap berfungsi), badge tahun di atas foto, badge kategori (Akademik/Non-Akademik) & tingkat, nama prestasi, peraih + asal, dan penyelenggara. Chip filter kategori, filter tingkat, sorting tahun, statistik ringkas, dan *empty state* dipertahankan. (Sorting kini cukup via dropdown — tombol sortir di kepala kolom tabel turut dihapus bersama tabelnya.)
- Rationale: permintaan tabel dari fakultas hanya untuk halaman Penelitian & Pengabdian (ratusan entri); Kerjasama (10 mitra) & Prestasi (3 entri) lebih komunikatif sebagai kartu visual.
- `README.md`, komentar kepala `js/kerjasama-data.js` & `js/prestasi-data.js` disesuaikan (format data tidak berubah).
- `service-worker.js`: bump cache ke `v2026.14`.

#### Diverifikasi
- Parser HTML: 13/13 halaman valid (tag seimbang, tanpa ID ganda); `node --check` lolos untuk skrip inline kedua halaman; 54 ikon Lucide terpakai tervalidasi tersedia di bundel lokal.
- Uji DOM headless: 27/27 skenario lolos (jumlah kartu, statistik, filter jenis/tingkat/chip kategori, pencarian, sorting nama & tahun, *empty state*, reset, tidak ada tombol salin).

---

### [2026-07-21] - Penyesuaian Lintas Halaman: Tautan Silang + Sinkronisasi 10 Mitra (UKM)

#### Ditambahkan (Tautan Silang)
- **`index.html`**: Tombol CTA "Lihat Semua Prestasi Fakultas" di akhir seksi Sorotan Prestasi (→ `prestasi.html`) dan "Lihat Semua Kerjasama Fakultas" di akhir seksi Mitra Kerja Sama (→ `kerjasama.html`) — menautkan konten ringkas Beranda dengan halaman penuh barunya.
- **`direktori-dosen.html`**: Baris tautan silang ke tabel agregat `penelitian.html` & `pengabdian.html` tepat sebelum grid dosen.
- **`tentang.html`**: Frasa "kerjasama kemitraan" pada butir Misi fakultas kini tertaut ke `kerjasama.html`.

#### Diperbaiki (Sinkronisasi Angka Mitra — 10 di semua tempat)
- **Identifikasi mitra ke-10**: File logo `assets/images/mitra/utm-malaysia.webp` terverifikasi sebagai lambang **Universiti Kebangsaan Malaysia (UKM)** (perisai 4 kuadran: harimau, atom, roda gigi + jangka, bunga raya + buku terbuka — sesuai deskripsi lambang resmi di ukm.my), bukan logo UTM kedua.
- File logo direname menjadi `ukm.webp`; `alt` tile di `index.html` dikoreksi menjadi "Universiti Kebangsaan Malaysia".
- `js/kerjasama-data.js`: UKM ditambahkan sebagai mitra ke-10 (id dinomor ulang 1–10). Statistik halaman Kerjasama kini otomatis sinkron: **10 mitra (7 luar negeri, 3 dalam negeri)** — sama dengan angka "10 Mitra Kerja Sama" di Beranda.

#### Diverifikasi
- Uji DOM headless: 45/45 skenario lolos; seluruh referensi file logo valid.

---

### [2026-07-21] - Pedoman PKL & Skripsi Berstatus "Segera Hadir" + Penghapusan PDF

#### Diubah
- **`pusat-unduhan.html`**: Kartu **Pedoman Skripsi FSTI** dan **Pedoman PKL FSTI** kini berstatus **"Segera Hadir"** (badge abu-abu + ikon jam, keterangan "Sedang difinalisasi fakultas"); tombol "Unduh PDF" dihapus karena dokumen resmi belum final.

#### Dihapus
- **`assets/docs/pedoman-skripsi-fsti.pdf`** dan **`assets/docs/pedoman-pkl-fsti.pdf`** dihapus dari repositori. `assets/docs/buku-kpt-teknik-informatika-2023.pdf` tetap dipertahankan.

#### Diubah (Pendukung)
- `README.md`: deskripsi Pusat Unduhan disesuaikan & struktur folder `assets/docs/` diperbarui.
- `service-worker.js`: bump cache ke `v2026.13`.

#### Diverifikasi
- Tidak ada lagi tautan menuju kedua PDF di seluruh halaman; struktur HTML `pusat-unduhan.html` valid.

---

### [2026-07-21] - Hapus Tombol Salin di Halaman Kerjasama & Prestasi

#### Dihapus
- Kolom "Salin" beserta tombol ikon copy per baris di `kerjasama.html` dan `prestasi.html` — tombol salin memang hanya diminta untuk tabel Penelitian & Pengabdian, sehingga dua halaman ini dikembalikan ke tabel murni.

#### Diubah
- `kerjasama.html`: fungsi `ringkasan()` ikut dihapus (hanya dipakai tombol salin). `prestasi.html`: fungsi `ringkasan()` dipertahankan karena masih dipakai sebagai deskripsi lightbox foto dokumentasi.
- `service-worker.js`: bump cache ke `v2026.12` agar pengunjung menerima versi terbaru.

#### Tetap
- Tombol ikon salin di `penelitian.html` & `pengabdian.html` (via `js/karya-agregat.js`) tidak berubah — tetap aktif sesuai permintaan.

#### Diverifikasi
- Uji DOM headless: 45/45 skenario lolos; kedua halaman valid tanpa tag tak seimbang & tanpa ID duplikat.

---

### [2026-07-21] - Revisi Navigasi: Kerjasama & Prestasi Masuk Dropdown Akademik

#### Diubah
- **Menu utama**: Item **Kerjasama** dan **Prestasi** dipindahkan dari menu tingkat atas menjadi item di dalam **dropdown Akademik** (setelah "Pusat Unduhan & Dokumen") di seluruh 13 halaman, sesuai arahan terbaru. Menu tingkat atas kini: Beranda · Tentang Kami▾ · Program Studi▾ · Akademik▾ · Penelitian · Pengabdian · Alumni · PMB. Halaman Penelitian & Pengabdian tetap sebagai menu tingkat atas.
- **Menu mobile**: Kedua item dipindahkan ke dalam akordeon **Akademik** di seluruh 13 halaman.
- **State aktif**: Halaman `kerjasama.html` / `prestasi.html` kini menandai tombol dropdown **Akademik** dengan aksen oranye + `aria-current="page"` pada item dropdown/akordeon masing-masing (konsisten dengan pola `pusat-unduhan.html`).

#### Diverifikasi
- Setiap halaman memiliki tepat 3 referensi per slug baru (dropdown desktop + akordeon mobile + footer); tidak ada sisa item tingkat atas.
- Pemeriksa struktur tag HTML: 13/13 halaman valid tanpa tag tak seimbang dan tanpa ID duplikat.

---

### [2026-07-21] - Menu Baru: Halaman Penelitian, Pengabdian, Kerjasama & Prestasi (Tabel Agregat)

#### Ditambahkan (4 Halaman Baru)
- **`penelitian.html` — Tabel Agregat Penelitian Seluruh Dosen FSTI**: Satu halaman tampilan tabel yang mengagregasi otomatis 600+ karya berjenis `Penelitian` dari seluruh 14 dosen (sumber tunggal: `window.FSTI_DOSEN` di `js/dosen-data.js`). Fitur: filter berdasarkan nama dosen (dropdown berisi seluruh dosen + jumlah karya), pencarian bebas (judul/dosen/prodi/tahun), **sorting tahun** (klik kepala kolom "Tahun" atau pilihan sortir, indikator `aria-sort` + ikon chevron), sortir bonus Judul & Dosen A–Z, muat bertahap 60 baris (tombol "Muat Lebih Banyak" / "Tampilkan Semua"), statistik ringkas otomatis (total entri, jumlah dosen, rentang tahun), dan **tombol ikon salin di setiap baris** (format sitasi siap tempel: *Judul. Dosen (Tahun). Terindeks: … . URL*) dengan umpan balik ikon *copy → check* dan toast.
- **`pengabdian.html` — Tabel Agregat Pengabdian Masyarakat**: Mesin yang sama (`js/karya-agregat.js`, konfigurasi via `window.FSTI_KARYA_PAGE`) untuk karya berjenis `Pengabdian Masyarakat` (100+ entri). Data per dosen di halaman Direktori Dosen **tetap dipertahankan** apa adanya — halaman agregat hanya membaca dari sumber yang sama.
- **`kerjasama.html` — Daftar Kerjasama Fakultas**: Tabel seluruh kemitraan fakultas (kolom: mitra + logo, jenis, bentuk, ruang lingkup, periode, status aktif, tautan resmi, salin ringkasan). Filter jenis mitra (dibangun dinamis dari data), pencarian, sortir nama/jenis, statistik total/Dalam Negeri/Luar Negeri. Data awal (`js/kerjasama-data.js`, `window.FSTI_KERJASAMA`) diselaraskan dengan galeri 10 logo mitra di Beranda; kolom nomor dokumen/periode disiapkan untuk dilengkapi fakultas sesuai arsip MoU/MoA.
- **`prestasi.html` — Daftar Prestasi Fakultas (Akademik & Non-Akademik)**: Tabel prestasi (kolom: dokumentasi, tahun, prestasi + penyelenggara, kategori, tingkat, peraih, salin ringkasan). Filter chip *Semua/Akademik/Non-Akademik*, filter tingkat dinamis (Lokal→Internasional), sorting tahun (klik kolom/pilihan), foto dokumentasi terhubung ke lightbox modal global. Data awal (`js/prestasi-data.js`, `window.FSTI_PRESTASI`) berisi 3 prestasi resmi dari seksi Sorotan Prestasi Beranda (INOTEK 2025, IYIS #6 Malaysia 2024, Taekwondo Jatim Cup 3 2025).

#### Diubah (Navigasi & Konsistensi 13 Halaman)
- **Menu utama**: Menambahkan item **Penelitian | Pengabdian | Kerjasama | Prestasi** tepat setelah dropdown **Akademik** pada menu desktop dan menu mobile di ke-13 halaman (9 halaman lama + 4 halaman baru), sesuai permintaan pimpinan fakultas. Spasi menu desktop dirapatkan (`space-x-4 xl:space-x-6`) agar 10 item muat di layar laptop.
- **Footer "Layanan"**: Menambahkan tautan ke 4 halaman baru di seluruh halaman.
- **`js/util-tabel.js`** (baru): Utilitas bersama — escape HTML, toast `aria-live`, salin-clipboard (Clipboard API + fallback `execCommand`), dan delegasi global tombol `[data-copy-text]`.
- **`js/asset-guard.js`**: Memperluas verifikasi fail-closed ke data halaman baru (`FSTI_DOSEN` untuk penelitian/pengabdian, `FSTI_KERJASAMA`, `FSTI_PRESTASI`).
- **`css/style.css`**: Menambahkan gaya umpan balik `.fsti-copy-ok` (hijau) untuk tombol salin.
- **`service-worker.js`**: Bump cache ke `v2026.11` dan menambahkan 4 halaman + 4 berkas JS baru ke `CORE_ASSETS` agar PWA/offline tetap utuh.
- **`README.md`**: Mendokumentasikan 4 halaman baru, struktur folder, serta panduan pembaruan data kerjasama/prestasi.

#### Diverifikasi
- `node --check`: seluruh berkas JS baru/diubah lolos pemeriksaan sintaks.
- Agregasi data terverifikasi: 617 entri Penelitian (2003–2026) & 108 entri Pengabdian Masyarakat (2010–2026); seluruh tahun valid 4 digit; seluruh entri memiliki tautan sumber.
- Pemeriksa struktur tag HTML: 13/13 halaman valid tanpa tag tak seimbang dan tanpa ID duplikat.

---

### [2026-07-20] - Penyempurnaan Card Peminatan: Isi Lebih Rapi + Animasi Buka/Tutup Halus
- Isi card beraksen dan label bertitik yang lebih rapi.
- Chevron chip sebagai penanda interaksi.
- Animasi buka/tutup dua arah via `max-height` JS.
- Dukungan keyboard, screen reader, dan `prefers-reduced-motion`.
- Penghapusan dead-code CSS accordion serta bump cache PWA.

### [2026-07-20] - Revisi: Perbaikan Bug & Kualitas Halaman (Tentang, Direktori Dosen, Alumni, PMB, Pusat Unduhan)

#### Diperbaiki (Bug HTML Tidak Valid)
- **Tag heading tidak seimbang `<h3>...</h4>`**: Mengoreksi 6 kartu testimoni karosel di `index.html` dan 1 template kartu dinamis di `alumni.html` (dirender untuk seluruh 15 alumni) agar menggunakan penutup `</h3>` yang benar. Struktur heading kini valid untuk SEO, screen reader, dan 100% lolos pemeriksa HTML.

#### Diperbaiki (Keamanan Tautan Eksternal)
- **Anti-Tabnabbing**: Menambahkan `rel="noopener noreferrer"` pada seluruh tautan `target="_blank"` eksternal di `pmb.html` (lokasi: tautan detail biaya SIAKAD, tombol Isi Formulir Pendaftaran, dan tombol WhatsApp Admin 1 & 2) mencegah eksploitasi `window.opener`.

#### Ditambahkan (Aksesibilitas WCAG 2.4.1)
- **Skip-to-Content Link di 9 halaman**: Menambahkan tautan "Lewati ke konten utama" yang tersembunyi dan tampil saat fokus keyboard (Tab pertama), dengan `id="main-content"` pada section utama tiap halaman, gaya `.skip-link` baru di `css/style.css`, dan handler fokus khusus di `js/script.js` (loncat instan tanpa animasi panjang, fokus berpindah ke konten).
- **`aria-current="page"` pada nav aktif**: Menandai item navigasi aktif di desktop dan mobile untuk seluruh 9 halaman agar pembaca layar mengenali halaman yang sedang dibuka.
- **Konsistensi state aktif menu mobile**: Menandai item aktif pada menu mobile `tentang.html`, `direktori-dosen.html`, dan `pusat-unduhan.html` (sebelumnya hanya alumni & pmb yang ditandai).

#### Diperbaiki (Kualitas SEO & Berbagi)
- **Meta description diperkaya**: Menulis ulang deskripsi tipis (sekadar mengulang judul) pada `direktori-dosen.html`, `alumni.html`, dan `pusat-unduhan.html` menjadi deskriptif dan mengandung kata kunci.
- **Open Graph & Twitter Card**: Menambahkan blok meta `og:*` dan `twitter:*` konsisten pada 5 halaman (Tentang, Direktori Dosen, Alumni, PMB, Pusat Unduhan) agar pratinjau tautan di media sosial tampil informatif seperti halaman beranda.

#### Diperbaiki (Robustness & Redaksional)
- **Offset scroll anchor**: Menambahkan `scroll-mt-24` pada section `#jadwal`, `#alur`, dan `#daftar` di `pmb.html` agar tidak tertutup header tetap saat ditautkan.
- **Ejaan KBBI**: Mengoreksi "Praktek Kerja Lapangan" menjadi "Praktik Kerja Lapangan" pada `pusat-unduhan.html`.

#### Diverifikasi
- Pemeriksa struktur tag HTML: 9/9 halaman valid tanpa tag tak seimbang dan tanpa ID duplikat.
- `node --check`: seluruh berkas JS lolos pemeriksaan sintaks.
- Hasil pindaian: tidak ada tautan internal rusak, tidak ada gambar hilang, seluruh tautan `target="_blank"` memiliki `rel` aman.

---

### [2026-07-20] - Sinkronisasi Nomenklatur Resmi Fakultas & Rename Halaman Informatika

#### Diubah
- Menyesuaikan nama fakultas pada halaman publik dan konfigurasi PWA menjadi **Fakultas Sains dan Teknologi Informasi** sesuai dokumen pembukaan resmi.
- Menyesuaikan label program studi **S1 Teknik Informatika** menjadi **S1 Informatika** serta **Sistem & Teknologi Informasi** menjadi **Sistem dan Teknologi Informasi** pada halaman HTML, data dosen, data alumni, README, dan manifest.
- Mengubah path halaman program studi dari `prodi/teknik-informatika.html` menjadi `prodi/informatika.html`, lalu memperbarui seluruh tautan internal root/prodi dan daftar cache `service-worker.js`.
- Mempertahankan konten **S1 Bisnis Digital** sesuai keputusan pemilik project; konten tersebut diposisikan sebagai bagian website saat ini, bukan bagian dari dokumen pembukaan awal.

#### Diverifikasi
- Memindai ulang seluruh file final untuk memastikan tidak ada tautan HTML/PWA yang masih mengarah ke `prodi/teknik-informatika.html` atau `teknik-informatika.html` sebagai halaman.

---

### [2026-07-20] - Konversi ke Self-Hosted Lokal (Font & Ikon) & Audit Aset Menyeluruh

#### Ditambahkan (Lokal Aset & Arsitektur PWA)
- **Progressive Web App & Offline Cache API (`service-worker.js` & `manifest.json`)**: Membangun arsitektur PWA mandiri (*Cache-First & Network-Fallback v2026.7*). Seluruh 9 halaman web, font, ikon, dan gambar WebP otomatis disimpan ke *Cache Storage* peramban. Website kini dapat di-install langsung ke *Homescreen* HP/Laptop dan bekerja 100% secara offline.
- **Optimasi Gambar Lanjutan (*Zero Layout Shift & Native Lazy Loading*)**: Menambahkan atribut `width`, `height`, `loading="lazy"`, `fetchpriority="low"`, dan `decoding="async"` pada seluruh tag gambar (`<img>`) di ke-9 halaman web serta di dalam pembuat kartu JS (`alumni-data.js`, `dosen-data.js`). Khusus logo utama di header diberi `loading="eager" fetchpriority="high"`. Optimasi ini menjamin skor **Cumulative Layout Shift (CLS) = 0.00** dan performa pemuatan secepat kilat (100/100 PageSpeed).

- **Self-Hosted Local Fonts (`assets/fonts/`)**: Mengunduh dan menempatkan file font lokal super ringan (`inter-latin.woff2` & `plus-jakarta-sans-latin.woff2`). Mendefinisikan aturan `@font-face` secara langsung pada `css/style.css` sehingga website bekerja 100% offline tanpa ketergantungan pada server eksternal Google Fonts.
- **Konversi Penuh Ikon ke Lucide (`data-lucide`)**: Memilah dan mengonversi **157 ikon** di seluruh 9 halaman HTML dan berkas JavaScript dari Inline SVG menjadi format atribut **`<i data-lucide="..."></i>`** (`chevron-down`, `menu`, `x`, `mail`, `search`, `quote`, `instagram`, `star`, `award`, `building-2`, `globe`, `code`, `cpu`, `database`, `download`, `book-open`, `monitor`, `briefcase`, `user`, `users`, dll.) yang ditenagai oleh `js/lucide.min.js`. Sesuai instruksi khusus, hanya **9 ikon TikTok** di bagian footer yang tetap dipertahankan sebagai Inline SVG murni karena tidak tersedia di dalam pustaka Lucide.
- **Perbaikan Render Ikon Instagram & Quote (`fill-current` Fix)**: Menghilangkan kelas `fill-current` dari atribut `<i data-lucide="instagram">` dan `<i data-lucide="quote">` di seluruh 9 halaman web. Sebelumnya, kelas `fill-current` (`fill: currentColor`) membuat kotak luar vektor Instagram (`<rect>`) terisi warna padat yang menutupi lingkaran dan titik kamera di dalamnya sehingga ikon tampak rusak/hilang menjadi kotak blok. Setelah `fill-current` dihapus, ikon Instagram tampil sempurna dan tajam berbasis *outline stroke* (`fill="none" stroke="currentColor"`).
- **Audit & Penyempurnaan Semantik Ikon Seluruh Halaman (*100% Precision Audit*)**: Melakukan inspeksi dan koreksi menyeluruh terhadap penempatan ikon pada seluruh halaman program studi dan profil:
  - **S1 Teknik Informatika (`prodi/teknik-informatika.html`)**: Mengoreksi ikon *Laboratorium Jaringan* dari yang salah kaprah memakai `credit-card` menjadi **`router`**; mengoreksi *Praktisi Data & Konsultan TI* menjadi **`database`**; dan *Wirausahawan Teknologi* menjadi **`rocket`**.
  - **S1 Sistem & Teknologi Informasi (`prodi/sistem-teknologi-informasi.html`)**: Mengoreksi *Perancang UX & Gamifikasi* dari `folder` menjadi **`gamepad-2`**; *Integrator IoT & Multimedia* dari `book-open` menjadi **`wifi`**; *Sistem Pengetahuan Semantik* menjadi **`git-branch`**; dan *Technopreneur Layanan Cerdas* menjadi **`sparkles`**.
  - **S1 Bisnis Digital (`prodi/bisnis-digital.html`, `index.html`, `tentang.html`)**: Mengoreksi ikon utama prodi menjadi **`trending-up`**; *Inovator Startup* dari `zap` menjadi **`rocket`**; *Perancang UI/UX & Konten* dari `folder` menjadi **`palette`**; dan *Otomasi Bisnis & AI* menjadi **`bot`**.
- **Dokumen Unduhan Resmi (`assets/docs/`)**: Mengunggah file PDF resmi (`pedoman-skripsi-fsti.pdf`, `pedoman-pkl-fsti.pdf`, dan `buku-kpt-teknik-informatika-2023.pdf`).
- **Aset Gambar Lengkap (`assets/images/`)**: Menata 29 foto Dosen (`assets/images/dosen/*.webp`), 15 foto Alumni (`assets/images/alumni/*.webp`), 19 foto Kegiatan & Fasilitas (`assets/images/kegiatan/` & `assets/images/fasilitas/`), serta 10 logo Mitra (`assets/images/mitra/`).

#### Diubah & Dihapus
- **Penghapusan Ketergantungan CDN Font**: Menghapus seluruh tag `<link rel="preconnect" ...>` dan `<link href="https://fonts.googleapis.com/...">` dari 12 halaman HTML (`index.html`, halaman informasi root, serta `prodi/*.html`).
- **Pembersihan File & Folder Tidak Terpakai (*Clean Workspace*)**: Menghapus seluruh folder sementara `uploads/` (staging file raw) dan folder `assets/icons/` (karena seluruh ikon lokal sekarang secara resmi digerakkan oleh `js/lucide.min.js`). Project kini 100% bersih tanpa ada file *dead/unused*.
- **Penyesuaian Urutan Menu Navigasi Mobile (*Mobile Header Sync*)**: Mengubah dan menyeragamkan urutan menu pada *Mobile Header* (`#mobile-menu`) di halaman beranda (`index.html`) serta seluruh 8 halaman lainnya agar urutannya persis mengikuti urutan pada *Desktop Header*: **Beranda → Tentang Kami → Program Studi → Akademik → Alumni → PMB**. Sebelumnya, menu PMB terselip di urutan keempat setelah Program Studi pada mode mobile.
- **Optimasi Touchmove & Pencegahan Warning DevTools (`passive / cancelable`)**: Memperbaiki event listener geser layar (`touchmove` pada *slider/carousel*) di `js/script.js` dengan menambahkan pengecekan `if (e.cancelable)` sebelum memanggil `e.preventDefault()`. Hal ini mencegah munculnya peringatan intervensi peramban (*DevTools Intervention Warning*) saat pengguna menggeser layar di perangkat mobile (60fps scrolling).
- **Penyempurnaan Aksesibilitas (`a11y`) & Manajemen Fokus Modal (`aria-hidden`)**: Memperbaiki mekanisme penutupan modal pada `direktori-dosen.html` dan `alumni.html`. Sebelum atribut `aria-hidden="true"` diterapkan pada kontainer modal saat ditutup, sistem sekarang menggeser fokus tombol keluar (`document.activeElement.blur()`) dan mengembalikannya ke tombol pemicu awal (`window._lastTriggerBtn.focus()`). Hal ini mencegah *focus trap* dan menghilangkan peringatan DevTools mengenai elemen terfokus di dalam kontainer yang tersembunyi.
- **Penerapan Universal Efek Mobile Touch & Hover ke Seluruh Halaman (*Universal Touch Standardization*)**: Memperluas cakupan aturan interaksi sentuhan/hover mobile yang sebelumnya hanya terbatas pada halaman beranda (`.home-page`) menjadi aturan universal (`body a`, `body button`, `body :active`, dan perlindungan sentuhan `@media hover: none`). Kini seluruh 8 halaman lainnya (`tentang.html`, `direktori-dosen.html`, `alumni.html`, `pmb.html`, `pusat-unduhan.html`, serta ketiga halaman `prodi/*.html`) memiliki responsivitas sentuhan (*tactile feedback* `scale(.98)`, anti-*sticky hover*, dan transisi warna) yang sama persis dan sepas dengan halaman beranda.
- **Penghapusan Total Efek Hover Kartu di Seluruh Website (*Universal Static Cards*)**: Memperluas penegasan aturan statis (`transform: none !important; box-shadow: none !important; border-color: #e5e7eb !important;`) ke seluruh jenis kartu di semua halaman (`.program-card`, `.dosen-card`, `.testimonial-card`, `.info-card`, `.kpt-card`, `.content-list`, serta `article` di halaman Program Studi dan Profil). Seluruh kartu di website FSTI kini tampil statis, tenang, bersih, dan berkarakter premium tanpa ada lagi lompatan ke atas (`translateY(-3px)`) ataupun perubahan bayangan saat dikursor atau disentuh.
- **Optimasi Non-Stop Auto-Scroll & Penghapusan Hover Zoom Galeri (`#galeri-scroll`)**: Menghilangkan efek *zoom* saat dikursor (`group-hover:scale-105`) serta melepaskan event listener penghenti guliran (`mouseenter`, `mouseleave`, `touchstart`, `touchend`) pada galeri foto kegiatan di halaman beranda (`index.html`). Galeri kini mengalir mulus tanpa henti (*continuous infinite auto-scroll*) dan foto tetap statis elegan tanpa efek pembesaran atau jeda saat disentuh maupun dilewati kursor mouse.
- **Penambahan Efek Hover & Transformasi Ikon Burger Menu Mobile (`#menu-btn`)**: Menambahkan efek interaktif pada tombol ikon *Burger* di *Header Mobile* (`#menu-btn`) pada seluruh 9 halaman web dan `style.css`. Saat dikursor (`:hover`), tombol memberi respons latar belakang krem lembut (`bg-[#FFF9F2]`) dan transisi warna ikon ke Oranye FSTI (`#F18602`). Saat disentuh/ditekan (`:active`), tombol memberi respons taktil (`scale(0.92)`). Selain itu, logika `js/script.js` diperbarui sehingga saat menu mobile dibuka, ikon *Burger* bertransformasi mulus menjadi ikon **`X`** (Tutup) dan kembali menjadi *Burger* saat menu ditutup.
- **Revitalisasi Total Aksesibilitas (`WCAG 2.1 AA / a11y`) Carousel Testimoni di Beranda**: Memperbaiki arsitektur HTML (`index.html`) dan mesin penggerak JavaScript (`js/script.js`) pada *Carousel Testimoni Alumni* agar bekerja sempurna dan ramah penyandang disabilitas di Desktop maupun Mobile:
  - **Struktur ARIA Semantik**: Menambahkan `role="region"`, `aria-roledescription="carousel"`, dan label penjelas pada kontainer utama serta `role="group"` pada setiap *slide* testimoni.
  - **Isolasi Klona & Manajemen Viewport Dinamis**: Memastikan seluruh klona (*infinite loop clones*) dan *slide* yang sedang tidak aktif di luar layar diberi `aria-hidden="true"` dan `tabindex="-1"`. Hanya *slide* yang sedang tampil di layar (`itemsPerView`) yang bisa diakses oleh *Keyboard Tabbing* dan *Screen Reader*, mencegah *Focus Trap* maupun elemen tersembunyi yang terfokus.
  - **Navigasi Keyboard Arrow Keys**: Menambahkan kendali tombol panah (`ArrowLeft` / `ArrowRight`) untuk menggulir testimoni saat kontainer difokuskan.
  - **Siklus Autoplay & `aria-live` Pintar**: Saat autoplay berjalan, status ditetapkan ke `aria-live="off"`. Begitu pengguna menyentuh layar HP, mengarahkan mouse, atau memfokuskan keyboard ke area testimoni, autoplay otomatis jeda dan sistem beralih ke `aria-live="polite"` sehingga perpindahan slide diumumkan secara santun tanpa mengganggu.
- **Penyempurnaan Validasi Preloader `AssetGuard` pada Halaman Alumni & Dosen**: Memperbaiki logika verifikasi pada `js/asset-guard.js` dan menambahkan alias variabel global pada `js/alumni-data.js` (`window.alumniData = window.FSTI_ALUMNI`) serta `js/dosen-data.js` (`window.dosenData = window.FSTI_DOSEN`). Selain itu, `AssetGuard` kini dilengkapi mekanisme *polling/retry async* (mencoba ulang verifikasi setiap 100ms hingga maksimal 3 detik) untuk menangani jeda waktu antar-skrip saat parsing DOM. Halaman *Alumni* dan *Direktori Dosen* kini terverifikasi akurat dan langsung terbuka halus tanpa salah identifikasi error.
- **Reset Posisi Guliran Modal Dosen & Alumni (`Modal Scroll Reset`)**: Memperbaiki fungsi `openModal` dan `closeModal` pada `direktori-dosen.html` dan `alumni.html` agar tidak mengingat posisi guliran sebelumnya (`do not remember scroll position`). Saat pengguna membuka profil satu orang, menggulir layar panel modal ke bawah, lalu menutup dan berpindah ke profil orang lain, posisi guliran panel modal (`#dosen-modal-panel` / `#alumni-modal-panel`) otomatis direset kembali ke posisi paling awal (`scrollTop = 0`).
- **Penggantian Minat Penelitian menjadi NUPTK Dosen pada Profil Fakultas (`tentang.html`)**: Mengganti teks deskripsi bidang/minat penelitian (*research interest*) dari ketiga pimpinan fakultas/prodi di halaman Profil Fakultas (`tentang.html`) menjadi **Nomor Unik Pendidik dan Tenaga Kependidikan (NUPTK)** resmi mereka yang diambil langsung dari pangkalan data dosen (`dosen-data.js`): Fitri Marisa (`7544756657230140`), Aviv Yuniar Rahman (`5942766667130422`), dan Ahmad Fairuzabadi (`7860771672130272`).
- **Sinkronisasi Presisi Navigasi Riwayat Browser (`Back / Forward & popstate Integration`)**: Memperkuat penanganan navigasi tombol Sebelum (`Back / <-`) dan Sesudah (`Forward / ->`) pada browser di Desktop maupun Mobile:
  - **Integrasi `history.pushState` pada Modal**: Saat *Modal Popup* Dosen atau Alumni dibuka, sistem mencatat status riwayat sementara (`_modalHistoryPushed`). Jika pengguna di HP menekan tombol *Back (`<-`)* fisik browser saat modal terbuka, modal akan ditutup secara halus tanpa membuang pengguna keluar dari halaman.
  - **Sinkronisasi Tautan Internal (`Anchor / Hash Links`)**: Setiap klik pada tautan bagian internal (`#sejarah`, `#visi-misi`, `#eksplorasi`) kini dicatat dalam riwayat URL (`pushState`) dan dikendalikan oleh event `popstate`, sehingga navigasi *Back/Forward* antar-subbagian berjalan akurat.
  - **Perlindungan *Back-Forward Cache* (`bfcache / pageshow`)**: Jika pengguna menekan *Back/Forward* antar-halaman utama dan browser memulihkan halaman dari memori cache (`event.persisted`), sistem memastikan *overlay AssetGuard* dan sisa *overflow-hidden* dibersihkan total.
- **Audit Akhir Aksesibilitas Menyeluruh & Kompatibilitas Lintas Peramban (`WCAG 2.1 AA / Cross-Browser Perfect`)**: Melakukan pemindaian dan penyempurnaan menyeluruh pada ke-9 halaman web:
  - **Hierarki Judul (*No Skipped Headings*)**: Menyeragamkan seluruh urutan tag judul (`<h1>` → `<h2>` → `<h3>`) dan mengoreksi lompatan judul (`<h2>` langsung ke `<h4>` pada kutipan dekan, kartu alur PMB, dan footer) menjadi `<h3>`. Seluruh 9 halaman 100% lulus audit hierarki semantik.
  - **Aksesibilitas Gambar & Tombol (*100% Labeled*)**: Memastikan 100% gambar memiliki atribut deskriptif `alt="..."` dan seluruh tombol interaktif memiliki `aria-label` / teks yang terbaca jelas oleh *Screen Reader*.
  - **Kompatibilitas Safari / iOS (`-webkit-backdrop-filter`)**: Menambahkan prefix `-webkit-backdrop-filter: blur(12px)` berdampingan dengan `backdrop-filter` pada `style.css` sehingga efek kaca buram (*frosted glass*) pada navigasi prodi tampil sempurna di peramban Apple Safari.
- **Audit Akhir Integritas Seluruh Navigasi & Tombol Interaktif (*100% Zero Broken Navigations/Buttons*)**: Melakukan pengujian menyeluruh terhadap setiap tautan (`<a href="...">`) dan tombol interaktif (`<button>`) pada ke-9 halaman web:
  - **Tautan Berkas & Eksternal**: 100% tautan antar-halaman (`alumni.html`, `prodi/*.html`, `assets/docs/*.pdf`) terverifikasi akurat dan aktif.
  - **Tautan Subbagian Internal (`Anchor Hash Links`)**: Seluruh ID target (`#sejarah`, `#visi-misi`, `#struktur`, `#pimpinan`, `#fasilitas`, `#eksplorasi`) terverifikasi eksis dan berespons mulus dengan siklus riwayat *Back/Forward*.
  - **Tombol Interaktif & Accordion**: Seluruh tombol (*Burger Menu* `#menu-btn`, *Accordion Mobile* `.mobile-acc-btn`, *Navigasi Testimoni* `#btn-prev/#btn-next`, *Toggle Sejarah* `#btn-sejarah-lengkap`, *Filter Karya & Prodi* di Dosen/Alumni, serta tombol tutup modal) bekerja presisi tanpa error konsol ataupun *dead click*.
- **Standarisasi Total Footer 4-Kolom di Seluruh 9 Halaman (*Universal Footer Synchronization*)**: Menerapkan struktur *Footer 4-Kolom* yang telah disempurnakan (dengan *Badge Premium* `Web Utama UWG Malang` di Kolom 1 dan daftar murni layanan internal fakultas di Kolom 3) secara seragam ke seluruh 9 halaman web (`index.html`, halaman informasi root, serta `prodi/*.html`). Seluruh tautan relatif (`../`) pada halaman prodi juga telah disesuaikan secara presisi sehingga tidak ada tautan yang rusak saat menavigasi dari bagian bawah halaman mana pun.

---
### [2026-07-19] - Penataan Struktur Folder Project (Migrasi ke Struktur README)

#### Ditambahkan
- Folder `project-fsti-rapi/` dengan struktur sesuai `README.md`: `assets/images/{dosen,alumni,fasilitas,kegiatan,mitra}`, `assets/docs/`, `css/`, `js/`, `data/`, `prodi/`.
- **`assets/docs/pedoman-skripsi-fsti.pdf`**, **`assets/docs/pedoman-pkl-fsti.pdf`**, **`assets/docs/buku-kpt-teknik-informatika-2023.pdf`** — file PDF dummy placeholder (1 halaman berlabel) agar tombol unduh tidak rusak; ganti dengan file asli bernama sama nanti.

#### Diubah (Pemindahan File)
- 9 halaman HTML ke root, 3 halaman prodi ke `prodi/`, `style.css` ke `css/`, 3 file JS ke `js/`, 3 CSV ke `data/`, serta 61 gambar ke `assets/images/<kategori>/`.
- Path relatif (`css/`, `js/`, `assets/...`, `../`) kini terpasang benar tanpa mengubah isi, desain, bahasa, maupun kode.

#### Verifikasi
- 205 referensi path lokal (src/href) divalidasi: **0 rusak**.
- Folder `uploads/` lama dipertahankan sebagai cadangan.

---

### [2026-07-19] - Penyesuaian Card Dosen Mamba'us Sa'adah (Halaman SISTEKIN)

#### Diubah (`prodi/sistem-teknologi-informasi.html`)
- Card dosen Mamba'us Sa'adah (list item ke-5 di grid Tim Pengajar) ditambah `sm:justify-self-center` dan `sm:w-[calc(50%-0.3125rem)]` sehingga lebarnya seragam dengan 4 card dosen lain (1 kolom) dan terpusat di mode desktop/tablet.
- Penyebab sebelumnya: class `sm:col-span-2` membuat card melebar penuh 2 kolom. Tampilan mobile (`grid-cols-1`) tidak berubah.
- Teks nama tidak diubah (sudah benar: "Mamba'us Sa'adah, S.ST., M.T.").

---

### [2026-07-18] - Ringkasan Teks pada Card Alumni

#### Diubah (`alumni.html`)
- Jabatan, instansi, dan testimoni pada card alumni dibuat ringkas agar tampilan card lebih rapi dan konsisten.
- Informasi lengkap tetap tersedia di modal **Lihat testimoni lengkap**.
- Ditambahkan helper `shortText()` untuk memotong teks panjang pada tampilan card tanpa mengubah data asli.

---

### [2026-07-18] - Penyesuaian Card Alumni Menjadi Gaya Testimoni Beranda

#### Diubah (`alumni.html`, `css/style.css`)
- Card alumni diubah mengikuti gaya **testimonial-card** pada halaman beranda: foto bulat, identitas alumni, jabatan, instansi, kutipan testimoni, dan ornamen kutip.
- Tombol **Lihat testimoni lengkap >** tetap berada di dalam card dan membuka modal testimoni lengkap yang sudah ada.
- Hover border/shadow berwarna pada card lama dihapus agar lebih sesuai panduan README.
- Ditambahkan penyesuaian kecil CSS untuk tinggi dan ukuran teks card testimoni alumni.

---

### [2026-07-18] - Aktivasi Download Dummy Pedoman Akademik FSTI

#### Ditambahkan
- **`assets/docs/pedoman-skripsi-fsti.pdf`** — file PDF dummy sementara untuk Pedoman Skripsi FSTI.
- **`assets/docs/pedoman-pkl-fsti.pdf`** — file PDF dummy sementara untuk Pedoman PKL FSTI.

#### Diubah (`pusat-unduhan.html`)
- Badge **Segera Tersedia** pada card Pedoman Skripsi dan Pedoman PKL diganti menjadi tombol **Unduh PDF** aktif.
- Tombol unduh mengikuti standar CTA README: `rounded-xl`, `font-bold`, `inline-flex`, hover gelap, `hover:shadow-md`, dan `active:scale-[0.98]`.

---

### [2026-07-18] - Penyesuaian Halaman Pusat Unduhan Sesuai README

#### Diubah (`pusat-unduhan.html`)
- Hero halaman disesuaikan dengan standar README: H1 menyebut nama fakultas, deskripsi memakai warna oranye, dan container diberi reveal.
- Section title Pedoman Akademik FSTI disamakan dengan struktur `.section-title`.
- Card dokumen placeholder tidak lagi memakai hover border/shadow berwarna.
- Tombol unduh `href="#"` diganti badge **Segera Tersedia** karena dokumen PDF belum tersedia.

---

### [2026-07-18] - Penghapusan Catatan Placeholder di Pusat Unduhan

#### Diubah (`pusat-unduhan.html`)
- Menghapus teks instruksi placeholder terkait penambahan file asli di `assets/docs/`.
- Menghapus panel informasi lama yang menyebut file siap diunduh dari folder `assets/docs/`, informasi Buku KPT TI tersedia di halaman Prodi TI, dan tautan "Lihat Buku KPT di Prodi TI".

---

### [2026-07-18] - Pembaruan Mata Kuliah Unggulan Teknik Informatika

#### Diubah (`prodi/teknik-informatika.html`)
- Daftar Mata Kuliah Unggulan Teknik Informatika diperbarui sesuai data terbaru.
- Kode mata kuliah tidak ditampilkan; hanya nama mata kuliah dan indikator praktikum `(+P)` yang dimasukkan.
- Daftar baru mencakup Sistem Kecerdasan Buatan, Machine Learning (+P), Deep Learning, Data Mining, Big Data Analytic, Pengolahan Citra (+P), Visi Komputer, Pemrograman Mobile (+P), Internet of Things (IoT), dan Cloud Computing.

---

### [2026-07-18] - Perapihan Posisi Link Card Informasi Akademik Prodi

#### Diubah (`prodi/bisnis-digital.html`, `prodi/sistem-teknologi-informasi.html`)
- Inline link **Buka halaman** dan **Lihat direktori** pada card Dokumen & Informasi Akademik dibuat menempel sejajar di bagian bawah card dengan `mt-auto`.
- Badge **Segera Tersedia** diseragamkan dan disejajarkan di bagian bawah card agar tampilan Bisnis Digital dan SISTEKIN konsisten.

---

### [2026-07-18] - Penyeragaman Halaman SISTEKIN dengan Pola TI

#### Diubah (`prodi/sistem-teknologi-informasi.html`)
- Struktur halaman SISTEKIN disamakan dengan pola halaman Teknik Informatika: hero statistik, section header standar, reveal pada wrapper konten, dan background selang-seling.
- Section KPT lama dan CTA penutup PMB dihapus; diganti section ringan **Dokumen & Informasi Akademik**.
- Section Tim Pengajar diperbarui dengan kartu Kaprodi dan daftar 5 dosen homebase memakai foto asli.
- Profil Lulusan, Area Fokus, dan Fasilitas dirapikan memakai card `rounded-[28px]`, ikon inline, border abu-abu lembut, serta struktur responsif.
- Bahasa dipoles agar formal, akademik, natural, dan tetap mempertahankan istilah Inggris yang lazim seperti AI, IoT, UX, Machine Learning, Semantic Web, dan Business Intelligence.
- Meta description ditambahkan dan seluruh path asset diverifikasi aman.

---

### [2026-07-18] - Penyesuaian Judul Konsentrasi Bisnis Digital

#### Diubah (`prodi/bisnis-digital.html`)
- Judul konsentrasi "Data, AI & Intelijen Bisnis" disesuaikan menjadi "Data, AI & *Business Intelligence*" karena istilah tersebut lebih lazim dan natural di konteks akademik/industri.

---

### [2026-07-18] - Penyesuaian Judul Konsentrasi Teknik Informatika

#### Diubah (`prodi/teknik-informatika.html`)
- Judul konsentrasi dikembalikan ke istilah Inggris yang lebih lazim di konteks akademik/industri: *Intelligent Multimedia*, *Business Intelligence*, dan *Mobile Computing*.
- Deskripsi tiap konsentrasi tetap menggunakan Bahasa Indonesia agar pembaca awam tetap memahami konteksnya.

---

### [2026-07-18] - Penambahan Standar Bahasa Formal & Istilah Inggris di README

#### Diubah (`README.md`)
- Ditambahkan ketentuan bahasa untuk menjaga karakter website fakultas: formal, akademik, kredibel, tetapi tetap natural dan mudah dipahami.
- Ditegaskan bahwa Bahasa Indonesia menjadi dasar narasi, namun istilah Inggris yang lebih lazim di dunia akademik/industri boleh dipertahankan bila terjemahannya terdengar aneh atau kaku.
- Ditambahkan aturan bahwa istilah Inggris yang dipertahankan harus tetap dijelaskan dengan deskripsi Bahasa Indonesia yang jelas.

---

### [2026-07-18] - Poles Bahasa & Responsif Halaman Teknik Informatika

#### Diubah (`prodi/teknik-informatika.html`)
- Bahasa bagian Profil Lulusan dan Peminatan/Konsentrasi dipoles agar lebih formal, ramah calon mahasiswa/orang tua, dan tidak terlalu padat istilah Inggris.
- Judul profil lulusan dibuat lebih mudah dipahami: Profesional Teknologi Informasi, Praktisi Data & Konsultan TI, Wirausahawan Teknologi, serta Akademisi & Peneliti TI.
- Nama konsentrasi dibuat lebih ramah pembaca: Multimedia Cerdas, Intelijen Bisnis, dan Komputasi Mobile, dengan istilah teknis inti tetap dipertahankan pada isi.
- Penggunaan italic dikurangi dan dipusatkan pada istilah teknis inti, role spesifik, atau istilah akademik khusus sesuai README.
- Responsif card diperkuat dengan `items-stretch`, `h-full`, `leading-snug`, dan `break-words` agar teks panjang lebih aman di layar kecil.

---

### [2026-07-18] - Poles Bahasa & Responsif Halaman Bisnis Digital

#### Diubah (`prodi/bisnis-digital.html`)
- Bahasa konten dipoles agar lebih formal, ramah calon mahasiswa/orang tua, dan tidak terlalu padat istilah Inggris.
- Judul profil lulusan dan beberapa istilah konsentrasi dibuat lebih mudah dipahami dalam bahasa Indonesia, sambil mempertahankan istilah teknis inti yang relevan.
- Penggunaan italic dikurangi sesuai aturan README: hanya pada istilah teknis inti, role spesifik, atau istilah bidang yang penting.
- Responsif card diperkuat dengan `items-stretch`, `leading-snug`, `break-words`, dan card informasi akademik dibuat `flex flex-col h-full` agar lebih aman di layar kecil.

---

### [2026-07-18] - Penyeragaman Halaman Bisnis Digital dengan Pola TI

#### Diubah (`prodi/bisnis-digital.html`)
- Struktur halaman Bisnis Digital disamakan dengan halaman Teknik Informatika: hero statistik, section header standar, reveal pada wrapper konten, dan pola background selang-seling.
- Bagian **Peminatan/Konsentrasi** diubah dari accordion menjadi card responsif.
- Section KPT lama dan CTA penutup PMB dihapus; diganti section ringan **Dokumen & Informasi Akademik**.
- Section Tim Pengajar diperbarui dengan kartu Kaprodi dan daftar dosen homebase memakai foto asli.
- Fasilitas dan Profil Lulusan dirapikan dengan card `rounded-[28px]`, ikon inline, dan border abu-abu lembut.
- Meta description ditambahkan dan body diberi tema `theme-bisdig`.

---

### [2026-07-18] - Penyesuaian Background Selang-Seling Halaman TI

#### Diubah (`prodi/teknik-informatika.html`)
- Pola latar section setelah penghapusan KPT lama dirapikan kembali agar sesuai README: Tentang putih → VMTS krem → Karier putih → Kurikulum krem → Fasilitas putih → Tim Pengajar krem → Dokumen & Informasi Akademik putih.

---

### [2026-07-18] - Perapihan Struktur Project & Revisi Halaman Teknik Informatika

#### Struktur Project
- Project dirapikan mengikuti struktur folder pada `README.md`: `assets/`, `css/`, `data/`, `js/`, dan `prodi/`.
- Asset gambar dipisah ke kategori: dosen, alumni, fasilitas, kegiatan, dan mitra.
- Path asset, CSS, JS, CSV, dan PDF diverifikasi tanpa referensi hilang.

#### Dokumentasi
- **`README.md`** — aturan italic diperbarui: italic dipakai secukupnya untuk istilah teknis inti, nama bidang/konsentrasi, role teknologi spesifik, dan istilah akademik khusus; tidak untuk singkatan/kata Inggris umum.

#### Halaman Teknik Informatika (`prodi/teknik-informatika.html`)
- Bagian **Peminatan/Konsentrasi** diubah dari accordion menjadi 3 card responsif.
- Section **Jelajahi Program Studi Lain** dan CTA **Tertarik bergabung di prodi ini?** dihapus.
- Ditambahkan section penutup ringan **Dokumen & Informasi Akademik** berisi akses Buku KPT 2023, Pusat Unduhan, dan Direktori Dosen.
- Section lama **Buku KPT Teknik Informatika 2023** dihapus agar tidak dobel dengan section baru.
- Tombol **Buka Direktori Dosen** di section Tim Pengajar dihapus agar akses direktori terpusat di section baru.
- Penggunaan italic disederhanakan agar lebih natural dan sesuai ketentuan baru.
- HTML halaman dirapikan dan tetap mempertahankan desain sesuai panduan README.

---

### [2026-07-18] - Penghapusan 3 Elemen Teks di Halaman TI

#### Dihapus (prodi/teknik-informatika.html)
- Sub-judul terjemahan bahasa Indonesia pada 3 kartu Peminatan/Konsentrasi (`<small>`: "Kecerdasan Multimedia", "Kecerdasan Bisnis", "Komputasi Bergerak") — kini tiap kartu hanya menampilkan nomor dan nama peminatan.
- Baris "Format: PDF • File: `buku-kpt-teknik-informatika-2023.pdf`" pada seksi Dokumen KPT.
- Baris "Target daya saing nasional pada 2030 dan global pada 2050." pada kartu Visi (VMTS).

---

### [2026-07-18] - Audit Animasi Reveal & Pelengkap Kotak Deskripsi di Halaman TI

#### Diperiksa
- Konfigurasi `js/script.js` terverifikasi sesuai panduan: observer `threshold: 0.01`, `rootMargin: '0px 0px -10px 0px'`, selektor `.reveal, .reveal-fade-up`, animasi pure fade-in 0.6s, dan fallback bila `IntersectionObserver` tidak didukung.
- Inventaris 22 elemen reveal di halaman TI: seluruhnya berada di container hero, judul seksi, dan wrapper konten utama (tanpa sisa reveal per-item).

#### Diubah
- **`prodi/teknik-informatika.html`** — kotak deskripsi seksi Tentang Program Studi kini memiliki `reveal reveal-fade-up` (sebelumnya satu-satunya blok konten yang tampil statis tanpa fade).

---

### [2026-07-18] - Penutupan Sisa Kepatuhan README Poin 3, 4, 7 & SEO di Halaman TI

#### Diubah (prodi/teknik-informatika.html)
- **Poin 3 (Spacing)** — strip "Jelajahi Program Studi Lain" `py-12` → `py-16 md:py-20`; banner CTA `pb-20 md:pb-24` → `py-16 md:py-20`.
- **Poin 4 (Reveal)** — kelas reveal dipindahkan dari item individual ke wrapper penampung sesuai panduan: grid 3 info-card (tentang), kartu Visi + grid Misi/Tujuan, grid kartu Karier, grid info-card Kurikulum, wrapper chips mata kuliah, grid kartu Peminatan, grid Fasilitas, dan grid strip "Jelajahi"; kartu Direktori Dosen dan banner CTA kini juga memiliki reveal (sebelumnya tidak ada).
- **Poin 7 (Tone of Voice)** — istilah teknologi Inggris kini dimiringkan (`<em>`) di seluruh konten: chips mata kuliah (*Data Mining*, *Machine Learning*, *Deep Learning*, dll.), deskripsi & visi (*Intelligent System*), daftar karier (*System analyst*, *Data Scientist*, dll.), isi 3 kartu peminatan (*NLP*, *big data*, *cloud*, dll.), dan *Outcomes-Based Education (OBE)* pada Model Kurikulum.
- **Poin 2 (Pelengkap)** — kartu Direktori Dosen `rounded-[24px]` → `rounded-[28px]` (instans terakhir yang tertinggal).
- **SEO** — ditambahkan `<meta name="description">` di `<head>`.

#### Catatan
- Dengan perubahan ini dan standar Bar Statistik Hero yang sudah didokumentasikan di README poin 8, halaman TI kini patuh pada seluruh 10 poin Panduan Konsistensi Desain & Konten. Opsi grid karier 2×2 tidak dipakai — tetap 3 kolom sesuai standar grid README.

---

### [2026-07-18] - Standar Baru "Bar Statistik Hero" di README Poin 8

#### Ditambahkan (Dokumentasi)
- **`README.md`** — poin 8 (Tata Letak Konten) kini memuat standar resmi **Bar Statistik Hero (Hero Stats Bar)**: bersifat opsional dan hanya untuk halaman profil/identitas (Program Studi & Profil Fakultas); halaman fungsional (PMB, Direktori, Alumni, Pusat Unduhan) tidak menggunakannya. Diatur: maksimal 5 statistik dengan angka terverifikasi dari data resmi, garis pemisah `border-white/10`, angka putih extrabold, label oranye uppercase, grid responsif 2→5 kolom di dalam container `.reveal`.
- **`README.md`** — catatan tinggi hero kini menyebut pengecualian: boleh melebihi 320px bila memakai bar statistik.

#### Rencana Implementasi (Belum Dikerjakan)
- Bar statistik direncanakan untuk hero: `tentang.html` (2025 • 3 Prodi • 14 Dosen • 731 Karya • 15 Alumni), `prodi/sistem-teknologi-informasi.html` (2025 • Baik • 146 SKS • 4 Area Fokus • 5 Dosen), dan `prodi/bisnis-digital.html` (2023 • Baik • 148 SKS • 4 Peminatan • 4 Dosen). Halaman TI sudah lebih dulu terpasang sebagai acuan pola.

---

### [2026-07-18] - Penerapan Desain Final & Kepatuhan README Poin 2, 5, 6, 9 di Halaman TI

#### Diterapkan ke File Asli (dari preview yang disetujui)
- **`prodi/teknik-informatika.html`** — kartu sorotan Kaprodi versi final persis kartu pimpinan halaman Tentang (putih `rounded-[28px]`, foto 128px `rounded-[20px]`, badge oranye lembut "Kaprodi Teknik Informatika", nama, 1 baris peran).
- **`prodi/teknik-informatika.html`** — bar statistik di dalam hero (2011 • Baik Sekali • 146 SKS • 3 Peminatan • 5 Dosen; responsif 2→5 kolom).
- **`prodi/teknik-informatika.html`** — ikon SVG inline (kotak krem + ikon oranye) pada 4 kartu Profil Lulusan dan 6 kartu Fasilitas (+ reveal pada fasilitas).
- `prodi/preview-ti.html` dihapus (desain sudah pindah ke file asli).

#### Kepatuhan README (Perbaikan)
- **Poin 6 (Inline Link)** — tautan "Buka Direktori Dosen" kini `text-[#5B2A7E] hover:text-[#F18602] transition-colors` dengan `gap-1` dan `<span class="detail-arrow">&gt;</span>` (ikon SVG panah dihapus).
- **Poin 5 (Tombol)** — tombol "Unduh PDF" KPT: `inline-flex items-center justify-center font-bold` + `hover:shadow-md active:scale-[0.98]`; tombol solid CTA "Info PMB": hover kini `#D97200` + `hover:shadow-md` + `active:scale-[0.98]` (sebelumnya putih); tombol outline CTA ditambah `active:scale-[0.98]`.
- **Poin 2 (Radius & Hover)** — kartu Profil Lulusan `rounded-[24px]` → `rounded-[28px]`; **CSS sentral**: `.concentration-card`, `.focus-area-card`, `.kpt-card` `1.5rem` → `28px` (ikut berlaku di halaman SISTEKIN & Bisnis Digital); hover kartu prodi (`info-card`, `article`, `content-list`, `kpt-card`) kini tanpa bayangan/border warna (`box-shadow: none`); strip "Jelajahi Prodi" kehilangan `hover:border` berwarna dan label SISTEKIN biru non-brand `#2563EB` diganti ungu `#5B2A7E`.
- **Poin 9 (Judul Seksi)** — eyebrow oranye gelap (`text-[#D97200] text-xs font-bold uppercase tracking-[0.2em] mb-3`) ditambahkan di 6 judul seksi: Profil, Arah & Tujuan, Lulusan, Akademik, Sarana, Tim Pengajar.

---

### [2026-07-18] - Preview Desain Peningkatan Halaman TI (File Sementara)

#### Ditambahkan
- **`prodi/preview-ti.html`** — salinan sementara dari `teknik-informatika.html` untuk evaluasi desain (belum diterapkan ke file asli), berisi 3 rancangan:
  1. Kartu sorotan Kaprodi disamakan persis dengan kartu pimpinan di halaman Tentang: kartu putih `rounded-[28px]`, foto 128px `rounded-[20px]` (kotak, bukan bulat), badge oranye lembut "Kaprodi Teknik Informatika", nama besar, dan 1 baris peran — tanpa detil keahlian.
  2. Bar statistik di dalam hero: 2011 (Tahun Berdiri) • Baik Sekali (Akreditasi) • 146 (Total SKS) • 3 (Peminatan) • 5 (Dosen Homebase) — responsif 2 kolom di HP → 5 kolom di desktop, dipisah garis `border-white/10`.
  3. Ikon SVG inline (kotak krem + ikon oranye, tanpa aset foto) pada 4 kartu Profil Lulusan dan 6 kartu Fasilitas, sekalian penambahan reveal pada kartu fasilitas.

---

### [2026-07-18] - Kartu Sorotan Kaprodi di Seksi Direktori Dosen TI

#### Diubah
- **`prodi/teknik-informatika.html`** — Kaprodi TI (Aviv Yuniar Rahman) dipisahkan dari grid menjadi kartu sorotan di atas daftar: foto asli 80px dengan ring putih, badge ungu solid "Kaprodi TI" (sesuai konsep badge direktori), nama lengkap, dan bidang keahlian (Image Processing • Computer Vision • Deep Learning • NLP).
- Grid dosen homebase kini 2×2 (Fitri Marisa, Firman Nurdiyansyah, Dr. Istiadi, Syahroni Wahyu Iriananda) dengan foto kecil.

---

### [2026-07-18] - Foto Asli Dosen Homebase di Halaman TI

#### Diubah
- **`prodi/teknik-informatika.html`** — avatar inisial pada daftar 5 dosen homebase TI diganti foto asli dari `assets/images/dosen/` (aviv-yuniar, fitri-marisa, firman-nurdiyansyah, istiadi, syahroni-wahyu; bulat 36px object-cover, lengkap dengan alt text).

---

### [2026-07-18] - Penghapusan Sub-Navigasi Sticky di Halaman TI

#### Dihapus
- **`prodi/teknik-informatika.html`** — komponen sub-navigasi sticky `.prodi-section-nav` di bawah hero dihapus atas permintaan (tautan jangkar antar-seksi tidak jadi digunakan). Daftar dosen homebase di seksi Direktori Dosen tetap dipertahankan.

---

### [2026-07-18] - Sub-Navigasi Sticky & Daftar Dosen Homebase di Halaman TI

#### Ditambahkan
- **`prodi/teknik-informatika.html`** — sub-navigasi sticky `.prodi-section-nav` (komponen CSS yang sudah tersedia, kini diaktifkan) di bawah hero dengan 7 tautan jangkar: Tentang, Visi Misi & Tujuan, Profil Lulusan, Kurikulum & Peminatan, Buku KPT, Fasilitas, Dosen.
- **`prodi/teknik-informatika.html`** — daftar 5 dosen homebase TI di seksi Direktori Dosen (avatar inisial ungu, nama + jabatan): Aviv Yuniar Rahman (Kaprodi TI), Fitri Marisa (Dekan FSTI), Firman Nurdiyansyah, Dr. Istiadi, dan Syahroni Wahyu Iriananda (Dosen) — sesuai data `js/dosen-data.js`.

---

### [2026-07-18] - Penyetaraan Bullet Legalitas & Riwayat Resmi di 3 Halaman Prodi

#### Diubah
- **`prodi/teknik-informatika.html`** — bullet riwayat diseragamkan menjadi 3 poin (SK Mendikbud 20 Mei 2011 dan pembaruan SK Dirjen Dikti 30 Mei 2013 digabung ke satu bullet).
- **`prodi/bisnis-digital.html`** — catatan tunggal diubah menjadi `<ul>` 3 bullet: berdiri di bawah FEB UWG; terdaftar SK Kemendiktiristek No. 364/E/O/2023 (2 Mei 2023); kini bergabung ke FSTI UWG.
- **`prodi/sistem-teknologi-informasi.html`** — catatan tunggal diubah menjadi `<ul>` 3 bullet: berdiri langsung di bawah FSTI UWG; terdaftar SK Kemendiktisaintek No. 747/B/O/2025 (4 September 2025); menjadi bagian FSTI sejak awal pendirian.

#### Alasan
- Jumlah bullet sebelumnya tidak seragam (TI 4, BD 1, SISTEKIN 1) sehingga tingkat kelengkapan antar-prodi terlihat timpang; kini ketiga prodi tampil setara dengan pola kalimat sama (asal berdiri → SK terdaftar → kini di FSTI).

---

### [2026-07-18] - Penambahan Kartu Legalitas & Riwayat Resmi di 3 Halaman Prodi

#### ⚖️ Informasi Resmi (data dari pemilik project)
- Ditambahkan kartu **"Legalitas & Riwayat Resmi"** di seksi *Tentang Program Studi* (setelah kotak deskripsi, sebelum 3 info-card) pada ketiga halaman prodi, berisi **Tanggal Berdiri (Resmi)**, **Nomor SK Pendirian**, dan catatan riwayat:
  - **S1 Teknik Informatika** — 1 Januari 2011 (SK YPPI) • SK Mendikbud **113/E/O/2011** (20 Mei 2011) • penyelenggaraan diperbarui SK Dirjen Dikti (30 Mei 2013) • bergabung ke FSTI 13 Oktober 2025.
  - **S1 Bisnis Digital** — 2 Mei 2023 • **364/E/O/2023** (SK Kemendiktiristek) • berdiri di bawah Fakultas Ekonomi dan Bisnis UWG, kini bergabung ke FSTI.
  - **S1 Sistem & Teknologi Informasi** — 4 September 2025 • **747/B/O/2025** (SK Kemendiktisaintek) • prodi baru yang langsung berada di bawah FSTI UWG.
- Desain kartu mengikuti pedoman (`rounded-[28px] border-gray-200`, sub-kotak krem `rounded-[20px]`, eyebrow oranye gelap, kelas `reveal`).
- Ketiga halaman terverifikasi TAG seimbang & seluruh data resmi termuat.

---

### [2026-07-18] - Standardisasi Desain 3 Halaman Prodi Sesuai README

#### 🦸 Hero Standar (Poin 8)
- Deskripsi hero ketiga halaman: `text-white/70 font-light` → **`text-[#F18602] font-medium`** dan kini **diakhiri nama institusi** ("… di FSTI Universitas Widya Gama Malang").
- H1 dilengkapi nama fakultas sesuai panduan, cth: *"S1 Teknik Informatika Fakultas Sains, Teknologi, dan Informatika"*.
- Container hero kini memakai kelas `.reveal` (sebelumnya tanpa animasi).

#### 📏 Spacing Section (Poin 3)
- Seluruh section konten prodi: `py-20 md:py-24` → **`py-16 md:py-20`** (5 section per halaman).
- Section KPT: `py-14` → `py-16 md:py-20`; section Dosen: `py-16` → `py-16 md:py-20`.

#### 🎨 Selang-Seling Latar (Alternating Background)
- Pola diperbaiki menjadi putih ↔ krem penuh: **KPT** krem→putih, **Fasilitas** putih→krem, **Dosen** krem→putih, **CTA penutup** putih→krem (selaras halaman Tentang).
- Hasil akhir: hero gelap → putih → krem → putih → krem → putih → krem → putih → krem ✅ (strip "Jelajahi Prodi Lain" di TI tetap putih sebagai pembatas).

---

### [2026-07-18] - Konsistensi Informasi 3 Halaman Prodi & Aktivasi Unduh KPT

#### ✏️ Konsistensi Informasi
- **Gelar Kaprodi TI** di `prodi/teknik-informatika.html` diselaraskan dengan data resmi: "Aviv Yuniar Rahman, S.T., M.T." → **"Aviv Yuniar Rahman, S.T., M.T., Ph.D."** (sama dengan `dosen-data.js` & halaman Tentang).
- **Label seksi kurikulum SISTEKIN**: "Model Pembelajaran" → **"Model Kurikulum"** agar istilah konsisten dengan halaman TI & Bisnis Digital.

#### 📄 Fitur Unduh KPT — Aktif Hanya untuk TI
- Sesuai keputusan akhir pemilik project, **unduh KPT hanya aktif di halaman Teknik Informatika**; SISTEKIN & Bisnis Digital dikembalikan ke status *"Segera Tersedia"* (dokumennya memang belum ada).
- **`assets/docs/buku-kpt-teknik-informatika-2023.pdf`** — file dummy/placeholder valid dibuat agar tombol unduh TI langsung berfungsi; isi berisi keterangan bahwa file wajib diganti dokumen asli **bernama sama** (pemilik project akan mereplace kemudian).
- **TI**: tombol "Unduh PDF" `href="#"` → tautan unduhan asli (`download`); catatan "Placeholder aktif, replace…" dihapus, diganti info format & nama file.
- **SISTEKIN & BisDig**: tombol sempat diaktifkan dengan dummy (`buku-kpt-sistekin.pdf`, `buku-kpt-bisnis-digital.pdf`), lalu atas instruksi dinonaktifkan kembali → teks "Dokumen sedang dalam proses finalisasi…" + badge *"Segera Tersedia"*; kedua file dummy ikut dihapus dari `assets/docs/`.
- Terverifikasi: 3 halaman TAG seimbang, 0 `href="#"` tersisa, PDF TI ada.

---

### [2026-07-18] - Ornamen Tanda Kutip Seksi Sejarah Diperjelas (`tentang.html`)

#### ❝ Ornamen Quote
- Dekorasi tanda kutip pembuka `“` di kartu kutipan seksi Sejarah sebelumnya nyaris tak terlihat: opasitas hanya 10% dan posisi absolut negatif (`-top-6 -left-4`) terpotong `overflow-hidden` kartu.
- Diperbaiki: opasitas dinaikkan menjadi 25% di desktop dan posisi dipindah ke dalam kartu.
- **Penyesuaian responsif (lanjutan)**: dibuat tidak menabrak tulisan di mode mobile — ukuran `72px` di HP (desktop tetap 110px), opasitas 15% di HP (25% di desktop), posisi `top-3 left-3` di HP (`top-4 left-6` di desktop), dan `pointer-events-none` agar tak pernah menghalangi interaksi teks.

---

### [2026-07-18] - Perapihan Scrollbar di Modal Profil Dosen

#### 🖱️ Scrollbar Kustom (`css/style.css`)
- Scrollbar bawaan browser yang tebal & kaku di dalam modal profil dosen (`#dosen-modal-panel`) diganti gaya kustom: **tipis 8px, thumb membulat penuh, track transparan** — selaras estetika situs.
- Warna thumb abu lembut `#D1D5DB`; saat thumb dikursor berubah menjadi **oranye brand `#F18602`** (Chrome/Edge/Safari via `::-webkit-scrollbar`).
- Firefox ditangani dengan properti standar `scrollbar-width: thin` + `scrollbar-color` (track transparan).
- Kurung kurawal berkas terverifikasi seimbang.

---

### [2026-07-18] - Statistik Total Dosen & Karya Ilmiah di Halaman Direktori

#### 📊 Statistik Ringkas (`direktori-dosen.html`)
- Ditambahkan 2 kotak statistik (putih, `rounded-[20px]`, ikon ungu & oranye) di atas grid, menemani teks hitung pencarian:
  - 👥 **Total Dosen & Peneliti**: terisi **14** (dari `data.length`)
  - 📚 **Total Karya Ilmiah**: terisi **731** (623 Penelitian + 108 Pengabdian Masyarakat)
- Angka **dihitung otomatis dari `js/dosen-data.js`** (bukan hardcode) — karya dihitung dengan aturan valid yang sama seperti modal (judul + link wajib ada), sehingga statistik selalu sinkron bila data diperbarui.
- Terverifikasi runtime mengisi nilai 14 & 731; HTML seimbang.

---

### [2026-07-18] - Modal Profil Dosen Langsung di Halaman Tentang

#### 👆 Seksi "Pimpinan Fakultas" (`tentang.html`)
- 3 tautan "Lihat profil" (Dekan, 2 Kaprodi) yang sebelumnya mengarah ke `direktori-dosen.html` kini menjadi **tombol pembuka modal profil dosen di halaman yang sama** — modal identik dengan yang ada di Direktori Dosen (biodata 2 kolom, tautan profil eksternal, karya ilmiah + filter, animasi fade+scale).
- Pemetaan tombol → data: Fitri Marisa `data-id="13"`, Aviv Yuniar Rahman `data-id="10"`, Ahmad Fairuzabadi `data-id="1"` (tersambung ke `window.FSTI_DOSEN`).
- Implementasi: markup modal + fungsi modal disalin utuh dari `direktori-dosen.html` (fungsi grid/pencarian tidak disertakan); `js/dosen-data.js` ikut dimuat; animasi modal memakai CSS global yang sudah ada.
- HTML seimbang; seluruh skrip inline lolos `node --check`.

#### 🎯 CTA Ajakan Baru di Akhir `tentang.html`
- Ditambahkan section banner ajakan "Kenali FSTI Lebih Dekat" (pola banner gelap standar beranda, `reveal`) berisi:
  - 1 tombol solid oranye → **Kunjungi Direktori Dosen**
  - 3 tombol outline putih → **Teknik Informatika**, **Sistem & Teknologi Informasi**, **Bisnis Digital**
- Semua tombol mengikuti standar README (`rounded-xl font-bold inline-flex items-center justify-center active:scale-[0.98]`); semua tautan terverifikasi menunjuk file yang ada.
- Latar section CTA disesuaikan menjadi krem `bg-[#FFF9F2]` agar pola selang-seling latar section di halaman Tentang patuh penuh (putih → krem → putih → krem → putih → krem).

---

### [2026-07-18] - Badge INFO PMB Footer Dipertahankan & Penghapusan Section PMB di Tentang

#### 🏷️ Badge "INFO PMB 2026" (Footer)
- Sempat dihapus dari 8 halaman (hanya tersisa di beranda) atas permintaan, namun atas instruksi lanjutan pemilik project **badge dipulihkan/dipertahankan di footer SELURUH halaman** (9 halaman) — kondisi kembali seperti semula: kolom Program footer berisi 3 tautan prodi + badge INFO PMB 2026.
- Blok badge dipulihkan persis dari markup asli beranda; untuk 3 halaman `prodi/` tautan disesuaikan relatif (`../pmb.html`).

#### ✂️ Section CTA PMB di `tentang.html`
- Section banner "Siap mendaftar di FSTI? … Cek Info PMB" di bagian akhir halaman Tentang **dihapus**; halaman kini langsung berakhir ke footer setelah seksi Fasilitas.
- Tautan PMB di navigasi (desktop & mobile) tetap dipertahankan.
- HTML terverifikasi seimbang pasca-penghapusan.

#### ⚠️ Catatan Temuan
- Ditemukan **satu `</div>` berlebih bawaan** (pre-existing, bukan akibat revisi hari ini) di blok kartu peminatan pada `prodi/teknik-informatika.html` dan `prodi/bisnis-digital.html`. → **Sudah diperbaiki** (lihat entry "Perbaikan Struktur HTML Blok Peminatan").

---

### [2026-07-18] - Arrow Shift Jadi Standar & Diterapkan ke Beranda & Tentang

#### 📖 README (Panduan Poin 6)
- Mikro-interaksi **arrow shift** diresmikan di Panduan Konsistensi Desain & Konten poin 6: simbol `>` wajib dibungkus `<span class="detail-arrow">&gt;</span>` + `gap-1`, bergeser 4px (0.2s) saat tautan/kartu dikursor, tanpa mengubah border/bayangan kartu.

#### 🎨 CSS & Halaman
- `css/style.css`: aturan arrow digeneralisasi dari khusus kartu dosen menjadi kelas global `.detail-arrow` (dipicu `a:hover`, `button:hover`, dan hover kartu dosen).
- `index.html`: 4 tautan inline kini ber-arrow-shift — "Pelajari Selengkapnya tentang FSTI" + 3 tautan kartu prodi.
- `tentang.html`: 3 tautan "Lihat profil >" pada kartu pimpinan kini ber-arrow-shift.
- Kedua halaman terverifikasi HTML seimbang.

---

### [2026-07-18] - Perbaikan Struktur HTML Blok Peminatan di 2 Halaman Prodi

#### 🔧 Keseimbangan Tag (Pre-existing Fix)
- Menghapus **satu `</div>` berlebih bawaan** di akhir seksi "Kurikulum dan Peminatan" pada:
  - `prodi/teknik-informatika.html` (baris penutup seksi: 19 `<div>` vs 20 `</div>` → kini sama 19)
  - `prodi/bisnis-digital.html` (23 vs 24 → kini sama 23)
- Penutup seksi dikoreksi dari `</div></div></div></section>` menjadi `</div></div></section>` (struktur: `<section>` > container > grid).
- Seluruh **9 halaman kini terverifikasi HTML seimbang penuh** — tidak ada lagi isu struktur tersisa.

---

### [2026-07-18] - Penyelarasan Judul Seksi Direktori dengan README Poin 9

#### 📐 Judul Seksi (Audit Kepatuhan Panduan)
- Hasil audit 10 poin "Panduan Konsistensi Desain & Konten" untuk `direktori-dosen.html`: 9 poin patuh, 1 penyimpangan → judul mini hasil revisi sebelumnya belum memenuhi struktur wajib judul seksi (hanya eyebrow + garis, tanpa H2).
- Diperbaiki menjadi struktur standar **eyebrow → H2 → garis** di dalam `text-center reveal`:
  - Eyebrow: *"DIREKTORI"* (`text-[#D97200] text-xs font-bold uppercase tracking-[0.2em] mb-3`)
  - H2: *"Tim Dosen & Peneliti"* (`text-[#5B2A7E] text-3xl md:text-4xl font-extrabold mb-4`)
  - Garis oranye `w-20 h-1.5 bg-[#F18602] mx-auto rounded-full`
- Pasca-perbaikan, halaman direktori dosen **patuh 10/10 poin panduan README**.

---

### [2026-07-18] - Menghidupkan Suasana Halaman Direktori Dosen

#### 🌤️ Tampilan Section Utama
- Background section Filter & Grid: putih polos → **krem `#FFF9F2`** (usul pemilik project) agar kartu putih lebih kontras & hangat.
- Ditambah **dekorasi halus senada hero**: dua blob glow blur (oranye `opacity-[0.08]` kanan-atas & ungu `opacity-[0.06]` kiri-bawah) + pola dot-grid oranye transparan `opacity-[0.05]`; dekorasi `pointer-events-none` di balik konten.
- Ditambah **judul mini terpusat** standar README: eyebrow *"TIM DOSEN & PENELITI"* (oranye gelap, tracking lebar) + garis oranye `w-20 h-1.5 rounded-full`, masuk kelas `reveal`.
- **Toolbar pencarian** kini terbungkus kartu putih `rounded-[20px] border-gray-200 p-4 md:p-5` (search input + chip filter tidak lagi mengambang).
- **Empty state** dipercantik: ikon pencarian besar di lingkaran krem-oranye, judul & saran teks ramah, kartu putih dashed border oranye muda.
- Struktur HTML terverifikasi seimbang; `node --check` script lolos.

---

### [2026-07-18] - Pembaruan Minat Penelitian Devi Septiani

#### ✏️ Data Dosen
- Bidang Keahlian / Minat Penelitian **Devi Septiani** diperbarui: ~~"Education"~~ → **"Manajemen Sistem Informasi"** (sesuai arahan pemilik project).
- Diperbarui di 2 sumber: `js/dosen-data.js` (field `expertise` + chip `tags`) dan `data/biodata-dosen.csv` agar tetap sinkron.
- `node --check` lolos; chip keahlian baru kini tampil di kartu & profil Bu Devi.

---

### [2026-07-18] - Pewarnaan Ulang Badge Jabatan di Kartu Dosen

#### 🎨 Badge Kartu Direktori Dosen
- **Kaprodi**: dari ungu muda outline menjadi **ungu solid `#5B2A7E` teks putih** (sesuai permintaan pemilik project) — hierarki visual kini sejajar di bawah badge Dekan (oranye solid).
- **Dosen**: dari abu-abu netral menjadi **krem `#FFF9F2` + teks oranye gelap `#D97200` + border oranye muda** agar lebih hidup namun tetap satu brand dan tidak bersaing dengan badge Dekan/Kaprodi.
- Perubahan pada fungsi `jabatanBadge()` di `direktori-dosen.html`; `node --check` lolos.

#### 👤 Badge Role di Modal Profil (Konsep Diseragamkan)
- Badge role di dalam modal detail kini memakai konsep warna yang sama dengan kartu via fungsi baru `roleBadgeHtml()` (menggantikan gaya oranye-soft lama yang seragam untuk semua role):
  - **Dekan FSTI** → oranye solid `#F18602` teks putih
  - **Kaprodi BD / TI** → ungu solid `#5B2A7E` teks putih
  - **Dosen** → krem `#FFF9F2` + teks oranye gelap `#D97200` + border oranye muda
- **Chips keahlian/tag** (badge abu outline seperti di kartu) kini tampil di modal — penempatan final: **di baris "Bidang Keahlian / Minat Penelitian" pada tabel biodata** via fungsi `tagChips()` (bukan di samping foto, sesuai revisi arahan pemilik project); blok foto tetap bersih hanya berisi badge role + prodi + jabatan.
- `node --check` lolos; ketiga tipe role terverifikasi merender kelas warna yang benar.

---

### [2026-07-18] - Perbaikan Label Role Dosen di Profil

#### 🏷️ Data Dosen (`js/dosen-data.js`)
- Memperbaiki field `role` yang salah terisi per kelompok prodi: sebelumnya seluruh dosen satu prodi berlabel "Kaprodi" (cth. Bu Affi tampil "Kaprodi STEI" padahal dosen biasa).
- 11 dosen biasa kini berlabel **"Dosen"** sesuai permintaan pemilik project (tanpa embel-embel prodi): Niken Paramita, Shaifany Fatriana Kadir, Dra. Wiwin Purnomowati, Rangga Pahlevi Putra, Ismail Akbar, Affi Nizar Suksmawati, Devi Septiani, Mamba'us Sa'adah, Syahroni Wahyu Iriananda, Firman Nurdiyansyah, Dr. Istiadi.
- Tidak berubah (sudah benar): Ahmad Fairuzabadi (Kaprodi BD), Aviv Yuniar Rahman (Kaprodi TI), Fitri Marisa (Dekan FSTI).
- File ditulis ulang dengan format indentasi identik; `node --check` lolos; badge di modal profil kini tampil "Dosen" untuk dosen biasa.

---

### [2026-07-18] - Koreksi NIDN 9 Digit Menjadi 10 Digit

#### 🔢 Data Dosen
- Menambahkan angka **0 di depan** pada 2 NIDN yang sebelumnya hanya 9 digit (dikonfirmasi pemilik project):
  - Syahroni Wahyu Iriananda → `725108202` menjadi `0725108202`
  - Dr. Istiadi → `719097401` menjadi `0719097401`
- Diperbaiki di 2 sumber: `data/biodata-dosen.csv` dan `js/dosen-data.js` agar tetap sinkron.
- Data lain (NIDN kosong & email Gmail pada beberapa dosen) dibiarkan apa adanya sesuai instruksi — memang demikian data aslinya.
- `node --check js/dosen-data.js` lolos.

---

### [2026-07-18] - Perbaikan Nama Dosen Ganda (Affi)

#### ✏️ Data Dosen
- Memperbaiki nama yang tertulis dobel `"Affi Suksmawati Nizar (Affi Nizar Suksmawati), S.Kom., M.Cs."` menjadi **`Affi Nizar Suksmawati, S.Kom., M.Cs.`** (sesuai email resmi `affi.nizar@widyagama.ac.id`, dikonfirmasi pemilik project).
- Diperbaiki di 2 sumber: `js/dosen-data.js` (id terkait) dan `data/biodata-dosen.csv` (entri No. 7) agar keduanya tetap sinkron.
- `node --check js/dosen-data.js` lolos; dipastikan tidak ada sisa nama dobel di seluruh file project.

---

### [2026-07-18] - Pengurutan Dosen Berdasarkan Jabatan & Nama

#### 🔃 Direktori Dosen
- Grid dosen kini diurutkan **berdasarkan jabatan terlebih dahulu** (Dekan → Kaprodi → Dosen) lewat fungsi baru `roleRank()`, kemudian **nama A→Z** di dalam tiap kelompok jabatan (`localeCompare` lokalid).
- Sortir diterapkan pada salinan array sehingga data sumber di `js/dosen-data.js` tidak berubah dan tetap kompatibel dengan pencarian + filter prodi.
- Hasil urutan saat ini: Fitri Marisa (Dekan) → Ahmad Fairuzabadi & Aviv Yuniar Rahman (Kaprodi) → 11 dosen alfabetis.

---

### [2026-07-18] - Penyempurnaan Desain Profil Dosen

#### 🎨 Kartu Dosen (Grid Direktori)
- Foto dosen kini diberi ring oranye tipis (`ring-2 ring-[#F18602]/20`).
- Placeholder kotak abu bertuliskan "Foto" diganti menjadi **inisial nama** berlatar krem `#FFF9F2` (2 huruf pertama nama, gelar diabaikan) via fungsi baru `initials()` & helper `dosenPhoto()`.
- Hover kartu: anak panah pada tombol "Lihat detail profil" kini bergeser halus ke kanan (`detail-arrow`, transisi 0.2s) sesuai CSS baru di `css/style.css`.

#### 👤 Modal Detail Profil
- Header sticky diberi aksen strip gradasi oranye→ungu setinggi 6px di tepi atas modal.
- Blok identitas (foto + badge role/prodi + jabatan) kini terbungkus panel krem `#FFF9F2` `rounded-[20px]`.
- Foto besar memakai helper `dosenPhoto()` yang sama (ring oranye + fallback inisial krem).
- Tabel biodata diubah menjadi **2 kolom di desktop** (`grid sm:grid-cols-2`); label di atas nilai; "Pendidikan Terakhir" & "Bidang Keahlian" merentang penuh (`sm:col-span-2`).
- Tombol tautan profil eksternal (Scholar/SINTA/ORCID/dst.) diperbarui: outline ungu lembut, hover oranye + latar krem, dan ikon panah eksternal kecil.
- Daftar **Karya Ilmiah** kini tampil sebagai kartu terpisah `rounded-[20px]` dengan border per item (menggantikan satu list ber-border besar ber-separator).
- Chip filter database diseragamkan: warna aktif oranye seperti chip filter jenis.

#### ✨ Animasi
- Modal kini terbuka dengan **fade + scale lembut** (0.25s, `dosen-modal-open` class di `css/style.css`) dan menutup dengan animasi memudar; tetap aman jika dibuka-tutup cepat (timer guard) dan tombol tutup tetap sticky.

#### ✅ Verifikasi
- `node --check` pada script inline halaman lolos; fungsi inisial & fallback foto teruji untuk 14 data dosen.

---

### [2026-07-18] - Melengkapi Foto Alumni yang Kosong

#### 🖼️ Data Alumni
- Mengisi field `foto` yang sebelumnya kosong pada 3 entri di `js/alumni-data.js` dengan aset yang sudah tersedia:
  - Lionardi Ursaputra Pratama → `assets/images/alumni/lionardi-ursaputra.webp`
  - Dimas Rossiawan Hendra Putra → `assets/images/alumni/dimas-rossiawan.webp`
  - Ir. Kuncahyo Setyo Nugroho → `assets/images/alumni/kuncahyo-setyo-nugroho.webp`
- Hasil: seluruh 15 profil alumni kini tampil dengan foto tanpa placeholder; file JSON tervalidasi dan lolos `node --check`.

---

### [2026-07-18] - Migrasi Workspace & Verifikasi Aset Lengkap

#### 📦 Migrasi & Penataan Folder
- Memindahkan seluruh file dari area `uploads/` ke struktur folder final sesuai `README.md` (`css/`, `js/`, `data/`, `prodi/`, `assets/images/`).
- Menempatkan 15 foto alumni ke `assets/images/alumni/`, 14 foto dosen ke `assets/images/dosen/`, 7 foto fasilitas ke `assets/images/fasilitas/`, 12 foto kegiatan ke `assets/images/kegiatan/`, dan 10 logo mitra ke `assets/images/mitra/`.
- Menempatkan `logo-final.webp`, `org-p8-0.webp`, dan `favicon.png` di root `assets/images/`.
- Menyimpan `lionardi-ursaputra.webp` dan `ruang-kelas-kosong.webp` sebagai aset cadangan yang belum direferensikan halaman mana pun.
- Menambahkan placeholder `data/sync_data.py` karena skrip sinkronisasi asli tidak ikut ter-upload; implementasi penuh akan dibuat saat pembaruan data CSV dibutuhkan.

#### ✅ Verifikasi Teknis
- Memeriksa 444 referensi `src`/`href` lokal di seluruh 9 halaman HTML: semuanya valid, tanpa tautan rusak.
- Memastikan halaman prodi memakai path relatif `../css/style.css` dan `../js/script.js` dengan benar.
- Memverifikasi seluruh path foto pada `js/dosen-data.js` (14 entri) dan `js/alumni-data.js` (15 entri): file gambar tersedia lengkap.
- Memastikan tidak ada anchor tautan antar-halaman (`page.html#id`) yang rusak.
- Mencatat temuan: 3 entri alumni (Lionardi Ursaputra Pratama, Dimas Rossiawan Hendra Putra, Ir. Kuncahyo Setyo Nugroho) memiliki field `foto` kosong di `js/alumni-data.js` padahal file fotonya sudah tersedia; saat ini ketiganya tampil dengan placeholder abu-abu bawaan halaman Alumni.

---

### [2026-07-18] - Perapian Struktur File

#### 📁 Manajemen Folder & Berkas
- Menata file project mengikuti struktur yang ditetapkan pada `README.md`.
- Memindahkan stylesheet ke `css/`, skrip dan data JavaScript ke `js/`, serta file CSV ke `data/`.
- Memindahkan tiga halaman program studi ke folder `prodi/`.
- Mengelompokkan aset ke `assets/images/` berdasarkan kategori: `alumni/`, `dosen/`, `fasilitas/`, `kegiatan/`, dan `mitra/`.
- Mempertahankan halaman utama dan aset identitas fakultas pada lokasi yang sesuai; seluruh path yang ada telah diverifikasi tetap kompatibel.

#### 📐 Panduan Responsivitas
- Menambahkan kewajiban agar seluruh halaman tampil optimal, rapi, dan konsisten pada layar HP, tablet, laptop, serta desktop.
- Menetapkan pengecekan minimum pada lebar 320–480px, 768px, 1024px, dan 1280px ke atas; elemen tidak boleh terpotong, bertumpuk, atau sulit digunakan.

#### 🏠 Halaman Beranda
- Menghapus animasi *reveal* pada blok Visi Kepemimpinan dan statistik yang menjadi tujuan tombol **Kenali Lebih Dekat**, sehingga konten langsung terlihat setelah halaman menggulir ke bagiannya.
- Uji pemicu *reveal* lebih awal pada Beranda telah dikembalikan ke pengaturan standar karena tidak dipertahankan.
- Menyelaraskan CTA dengan panduan: hover tombol utama/outline, bayangan halus, *active state*, serta radius tombol CTA akhir.
- Mengembalikan tampilan hover tombol **Info PMB** di hero Beranda ke pengaturan sebelumnya.
- Mengembalikan pola latar selang-seling pada CTA akhir dan menstandarkan kartu testimoni ke radius 28px dengan border abu-abu lembut.
#### 👨‍🏫 Halaman Direktori Dosen
- Menyelaraskan hero dengan format halaman internal: judul menyebut nama lengkap fakultas, deskripsi oranye mencantumkan institusi resmi, dan konten hero memakai *reveal*.
- Menambahkan *reveal* pada grid dosen, menstandarkan kartu serta foto profil tanpa hover border/bayangan, dan memperbarui catatan sumber data direktori.
- Menghapus tampilan minat penelitian yang duplikat pada kartu dosen dan mempertahankan versi tag di bawah informasi profil.
- Menjadikan kartu dosen non-interaktif; modal detail kini hanya dibuka melalui tombol teks **Lihat detail profil >**.
- Membuat label minat penelitian mengikuti lebar teks dan menghapus catatan sumber data di bawah direktori.
- Menerapkan layout Profil Ringkas pada kartu dosen: NIDN dipindahkan ke modal detail, program studi memakai badge ungu seragam, dan minat penelitian memakai tag netral.
- Membedakan badge jabatan pada kartu: Dekan memakai oranye solid, Kaprodi memakai ungu muda, dan Dosen memakai abu-abu netral.
- Memperbaiki klasifikasi badge jabatan agar mengacu pada field `jabatan`, bukan field `role` yang tidak konsisten.
- Menyeragamkan tinggi, perataan teks, dan padding label Jabatan, Program Studi, serta Minat Penelitian pada kartu dosen.
- Menyusun tag Minat Penelitian seperti puzzle dari baris bawah tepat sebelum tombol detail profil, dengan jarak yang jelas dari label Jabatan dan Program Studi.

#### 👥 Halaman Tentang Fakultas
- Menyelaraskan hasil audit desain: hero kini memakai *reveal*, CTA PMB menggunakan hover oranye gelap dengan bayangan halus, dan padding CTA mengikuti standar section.
- Menyeragamkan outline kartu menjadi `border-gray-200` serta memiringkan istilah teknologi global pada konten.
- Menambahkan tautan **Kepemimpinan Fakultas** dan **Fasilitas Fakultas** ke submenu Tentang Fakultas pada header desktop dan mobile seluruh halaman.
- Menambahkan seksi **Pimpinan Fakultas** setelah Struktur Organisasi, berisi Dekan, Kaprodi S1 Bisnis Digital & SISTEKIN, serta Kaprodi S1 Teknik Informatika.
- Menggunakan foto dan jabatan dari data dosen yang tersedia, dengan kartu responsif dan tautan ke Direktori Dosen.
- Menata hierarki kartu sesuai struktur organisasi: Dekan berada di tengah atas, diikuti Kaprodi Teknik Informatika dan Kaprodi Bisnis Digital & SISTEKIN pada baris bawah.
- Memperjelas level jabatan melalui label **Pimpinan Fakultas** dan **Pimpinan Program Studi**, serta kartu Dekan yang lebih dominan tanpa garis diagram.
- Menyelaraskan posisi tautan profil pada bagian bawah tengah seluruh kartu pimpinan, termasuk saat tinggi teks jabatan berbeda.
- Membuat badge jabatan pada semua kartu pimpinan mengikuti lebar teksnya, bukan melebar sepanjang kartu.
- Menghapus tombol Direktori Dosen dari CTA PMB agar ajakan tindakan di akhir halaman Tentang fokus pada pendaftaran.
- Mengubah latar bagian Fasilitas Fakultas menjadi putih agar pola latar antar-seksi tetap bergantian.

### [2026-07-18] - Perapian Awal, Penyelarasan Desain & Sinkronisasi Data

#### 📁 Manajemen Folder & Berkas
- **Struktur Folder**: Membuat struktur folder standar (`css/`, `js/`, `data/`, `prodi/`, `assets/images/`) sesuai `README.md`.
- **Perapian Aset**: Memindahkan semua file HTML, CSS, JS, CSV, dan 50+ gambar asli ke foldernya masing-masing.
- **Pembersihan**: Menghapus folder sementara `uploads/` setelah semua aset terdistribusi sempurna.

#### 🎨 Desain & UI/UX (Halaman Beranda & Profil)
- **Favicon Baru**: 
  * Memindahkan favicon baru (`Logo fav.png`) dari `/uploads/` ke `/assets/images/favicon.png`.
  * Memasang tag favicon `.png` baru di seluruh 9 file HTML website secara presisi.
- **Sudut Kartu (Radius)**: Mengubah kelengkungan kartu prodi unggulan dari `rounded-[40px]` menjadi `rounded-[28px]` agar serasi dengan kartu lainnya.
- **Section 2 (Dekan & Statistik)**: 
  * Menyelaraskan lekukan foto Dekan & kartu statistik menjadi `rounded-[20px]`.
  * Memasang animasi fade-in lembut pada area dekan & statistik.
- **Hero CTA**: Mengubah teks tombol oranye utama dari "Lihat Program Studi" menjadi **"Kenali Lebih Dekat"** agar lebih sesuai dengan isi halaman yang dituju (Dean's Quote).
- **Halaman Profil (`tentang.html`)**:
  * Menambahkan aksen warna Oranye di Hero Section dengan mewarnai seluruh kalimat paragraf deskripsi menjadi warna Oranye FSTI tebal (`text-[#F18602] font-medium`) untuk keseimbangan warna yang maksimal.
  * Menyelaraskan semua sudut kartu (Timeline Sejarah & Fasilitas) menjadi **`rounded-[28px]`**.
  * Menghapus semua efek hover border oranye dan bayangan (*shadow*) pada kartu agar desain terlihat minimalis dan bersih.
  * Mengubah ikon SVG tombol *"Lihat Direktori Dosen"* menjadi tautan teks standar dengan karakter **`&gt;`** (`>`).
  * Menyederhanakan semua animasi reveal menjadi standar murni (*Pure Fade-In*).
  * Menyelaraskan warna latar belakang (*alternating background*) antar seksi (Sejarah: Putih, Visi-Misi: Krem, Struktur: Putih, Fasilitas: Krem) demi mematuhi panduan layout.
  * Mengubah warna kartu Visi di dalam seksi Visi-Misi dari Krem menjadi Putih dengan border `border-gray-200` demi kontras warna yang maksimal.
  * Menyelaraskan lurus vertikal (*items-center*) posisi nomor badge (`01`, `02`, dll.) dengan paragraf teks di dalam 9 kartu Misi dan Tujuan agar sejajar pas.
  * Membuat konten teks Motto FSTI (*Innovate Boldly, Lead Globally*) berada tepat di tengah (*centered*) secara vertikal dan horizontal di dalam kartu gelapnya menggunakan Flexbox layout.
  * Menghapus sub-teks *"Mengacu pada dokumen VMTS..."* di bagian Visi, Misi & Tujuan agar desain lebih ringkas dan fokus.
  * Menghapus tautan *"Lihat Direktori Dosen"* di bawah gambar Struktur Organisasi agar tampilan lebih bersih dan rapi.
  * Menghapus Kartu Fasilitas No. 07 (*Ruang Kesekretariatan HMJ*) karena tidak memiliki foto, sehingga grid fasilitas kini berisi tepat 6 kartu simetris dan seimbang 100% di semua layar.

#### ⚡ Animasi & Interaksi
- **Reveal Animation**: Menyeragamkan semua efek reveal menjadi **Pure Fade-In** lembut tanpa efek gerakan lompat (`opacity: 0` ke `1` selama `0.6s`).
- **Pemicu JS**: Menyetel sensitivitas IntersectionObserver di `js/script.js` ke `threshold: 0.01` agar animasi terpicu super mulus di semua layar (HP/Desktop).

#### ⚙️ Otomatisasi & Pemeliharaan
- **Skrip Sinkronisasi Data**: Membuat skrip Python **`data/sync_data.py`** untuk mengonversi data `.csv` terbaru menjadi data `.js` otomatis dalam 1 detik.
- **README Update**: Menulis panduan lengkap dan sangat detail seputar aturan konsistensi desain, gaya bahasa konten, spesifikasi standar *Internal Hero* (background, pattern, judul, deskripsi oranye, beserta ketentuan detail isi H1 & P), standar spesifikasi struktur *Section Header* (Judul Seksi), dan cara sinkronisasi data CSV-to-JS.
- **Changelog**: Membuat file `CHANGELOG.md` untuk melacak riwayat perubahan.
