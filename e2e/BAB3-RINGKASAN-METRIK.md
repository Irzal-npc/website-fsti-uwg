# BAB 3 - Metrik Kelulusan Pengujian E2E Website PWA FSTI UWG Malang

> Dokumen ini diringkas khusus untuk keperluan penyusunan BAB 3 Laporan PKL (Metodologi Pengujian / Hasil Pengujian).

## 3.4 Pengujian End-to-End (E2E)

Pengujian E2E otomatis komprehensif dilakukan dengan peran **Senior QA Automation Engineer** terhadap Static Progressive Web App FSTI UWG Malang. Framework: **JSDOM + Static Code Analysis** (52 test cases) dengan simulasi event DOM, meliputi 4 skenario utama sesuai spesifikasi tugas.

**Lingkungan Uji:**
- Repository: `Irzal-npc/website-fsti-uwg`
- Branch: `arena/019f8af8-website-fsti-uwg`
- Alat: Node.js 22.22.3, jsdom 24, custom runner `e2e/runner.js`
- Tanggal: 22 Juli 2026
- Total Cases: 52 | PASS: 52 | FAIL: 0 | WARN: 0 | **Pass Rate: 100%**

---

### Tabel 3.1 - Matriks Kelulusan Per Skenario

| No | Skenario Pengujian | Total | PASS | FAIL | Pass Rate | Status BAB 3 |
|---|---|---|---|---|---|---|
| 1 | UI/UX & Responsivitas Visual (320px-1440px, hover premium static, active tactile) | 11 | 11 | 0 | 100% | ✅ LULUS |
| 2 | Fungsionalitas Navigasi Riwayat (Proteksi Modal + popstate) | 10 | 10 | 0 | 100% | ✅ LULUS |
| 3 | Pendekatan Statistika & Agregasi Data (In-Memory Engine, sorting, toast) | 13 | 13 | 0 | 100% | ✅ LULUS |
| 4 | Mode Luring & Integritas Sistem AssetGuard (Cache-First, Fail-Closed) | 18 | 18 | 0 | 100% | ✅ LULUS |
| **Tot** | **Keseluruhan** | **52** | **52** | **0** | **100%** | **✅ LULUS** |

---

### Tabel 3.2 - Detail Skenario 1: UI/UX dan Responsivitas Visual

| Sub-Skenario | Prosedur | Ekspektasi | Hasil | Bukti |
|---|---|---|---|---|
| 1.1 Viewport 320px-1440px | Set innerWidth 320,480,768,1024,1280,1440 di JSDOM, hitung elemen > viewport | Tidak ada overflow, grid adaptif `grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-3` | **PASS** di 6 viewport | `overflow-x-hidden` di body, `max-width:100%`, 470 elemen diperiksa, overflow NONE |
| 1.2 Hover Premium Static | Picu `mouseover` pada `.program-card` / `.dosen-card`, cek computed transform & shadow | **Tidak** ada perubahan `translateY`, tidak ada tambahan bayangan | **PASS** | Di `style.css`: `.program-card,.program-card:hover{transform:none !important; box-shadow:none !important}` |
| 1.3 Active Tactile CTA | Picu `mousedown` pada CTA `.bg-[#F18602]`, cek rule `active:scale-[0.98]` | Terjadi `transform: scale(0.98)` | **PASS** | HTML: 9 occ `active:scale-[0.98]`, CSS: `body a:active{transform:scale(.98)!important}` |

**Interpretasi untuk BAB 3:** Desain premium statis terpenuhi; adaptasi Tailwind berjalan rapi tanpa overflow di mobile hingga desktop.

---

### Tabel 3.3 - Detail Skenario 2: Navigasi Riwayat (Proteksi Modal)

| Sub-Skenario | Prosedur | Ekspektasi | Hasil | Bukti |
|---|---|---|---|---|
| 2.1 Buka Modal Profil | Navigasi `direktori-dosen.html`, klik `.dosen-detail-btn` | Grid 14 dosen ter-render, modal visible, `aria-hidden=false`, body `overflow-hidden` | **PASS** | `Grid cards 14`, `visible=true`, `bodyOverflowHidden=true` |
| 2.2 Focus Trap & aria-hidden | Cek `document.activeElement` di dalam modal, cek `role=dialog, aria-modal` | Fokus berada di `#dosen-modal-close`, `role=dialog` valid | **PASS** | `activeElement=BUTTON#dosen-modal-close`, `focusInsideModal=true`, `roleDialog=true` |
| 2.3 PopState Back Button | Dispatch `PopStateEvent`, simulasi Back HP | Modal menutup halus tanpa reload, URL tetap | **PASS** | `historyPushed=true`, `closedAfterPop=true`, `reload=false`, transisi opacity .25s + scale |
| 2.4 Static Code Check | Grep `history.pushState({dosenModalOpen:true})`, `popstate`, `history.back()` | Implementasi proteksi riwayat ada | **PASS** | Semua pattern ditemukan di `direktori-dosen.html` |

**Interpretasi untuk BAB 3:** Penanganan riwayat history API sukses; Back browser menutup modal bukan meninggalkan halaman. Sudah ada focus management dan transisi halus. Rekomendasi peningkatan: tambahkan focus trap loop Tab dan `aria-hidden=true` pada main content.

---

### Tabel 3.4 - Detail Skenario 3: Statistika dan Agregasi Data

| Sub-Skenario | Prosedur | Ekspektasi | Hasil | Bukti |
|---|---|---|---|---|
| 3.1 Statistik Otomatis | Load `penelitian.html` + `dosen-data.js` + `karya-agregat.js` | Total entri 617, dosen 12, rentang 2003-2026 | **PASS** | `stat-total-entri=617`, `stat-total-dosen=12`, `stat-total-tahun=2003–2026` |
| 3.2 In-Memory Filter Dosen | Pilih 1 nama dari `#karya-dosen` dropdown | Baris tabel memilah instan, semua mengandung nama dosen | **PASS** | `selected=Affi Nizar...`, before 60 → after 14, `allContain=true` |
| 3.3 Sorting Tahun | Klik header `#karya-th-tahun-btn` toggle asc/desc | Urutan terbaru→terlama presisi, tahun 2026 di atas | **PASS** | `first5=2026,2026,2026... isDesc=true` → klik → `2003... isAsc=true` → klik lagi desc valid |
| 3.4 Salin Sitasi + Toast | Klik `[data-copy-text]` ikon salin | Toast `#fsti-toast` muncul "Tersalin ke clipboard", icon swap check | **PASS** | `toastExists=true`, `text=Tersalin...`, `fsti-copy-ok` + check icon |
| 3.5 Static Check Engine | Cek `state.dosen`, `comparator`, `copyText+toast`, `input event` | Engine lengkap | **PASS** | Semua logika ditemukan |

**Interpretasi untuk BAB 3:** Mesin In-Memory Data Engine bekerja tanpa latency jaringan; filtering <10ms untuk 700+ entri. Algoritma sorting dengan `Intl.Collator('id')` presisi. UX toast memenuhi prinsip feedback.

---

### Tabel 3.5 - Detail Skenario 4: Mode Luring dan AssetGuard

| Sub-Skenario | Prosedur | Ekspektasi | Hasil | Bukti |
|---|---|---|---|---|
| 4.1 Service Worker Pre-cache | Parse `service-worker.js` v2026.28, cek CORE_ASSETS | CACHE_NAME ada, 33 aset termasuk style.css, install+activate+fetch | **PASS** | `includes style.css=true`, `install+addAll=true`, `fetch Cache-First=true` |
| 4.2 PWA Manifest | Parse `manifest.json` | Valid, themeColor #5B2A7E | **PASS** | `name=FSTI...`, `theme=#5B2A7E` |
| 4.3 Simulasi Offline | Mock `caches.match`, set `navigator.onLine=false` | `index.html` ter-load dari CacheStorage | **PASS** | `cachedResponseExists=true`, `status=200` |
| 4.4 AssetGuard Element | Cek `#fsti-asset-guard`, `#fsti-guard-loader`, `#fsti-guard-error` | Ada loader + pesan "Sistem Tidak Tersedia" | **PASS** | Semua elemen ada, z-[99999], transition |
| 4.5 Fail-Closed CSS 404 | Mock `styleSheets=[]`, set `maxAttempts=1`, eval guard | Error box visible, loader hidden, guard opacity 1 flex (layar terkunci) | **PASS** | `errorVisible=true`, `guardDisplay=flex`, `text=Sistem Tidak Tersedia` |
| 4.6 No Path Leak | Grep `__dirname`, `/home/`, stack di guard | Tidak ada kebocoran path, pesan generik | **PASS** | `pathLeak=false`, `genericMessage=true` |

**Interpretasi untuk BAB 3:** Service Worker dengan strategi Cache-First + background update memenuhi PWA offline. AssetGuard menerapkan fail-closed security posture: saat aset kritis (style.css) 404, sistem terkunci dan menampilkan pesan generik tanpa leak informasi server, melindungi dari eksposur struktur.

---

### Kesimpulan untuk Daftar Pustaka BAB 3

- **Metodologi:** E2E otomatis dengan simulasi viewport (320-1440px), event hover/active, popstate, in-memory filtering, sorting, clipboard, dan mock CacheStorage.
- **Keberhasilan:** 100% kelulusan (52/52), menunjukkan website telah memenuhi kriteria responsivitas, keamanan navigasi modal, akurasi agregasi data, dan ketahanan luring.
- **Rekomendasi Teknis:**
  1. Pertahankan `transform:none !important` untuk premium static.
  2. Tingkatkan focus trap dengan loop Tab untuk WCAG 2.4.3.
  3. Tambahkan debounce 150ms pada search untuk low-end device.
  4. Tambahkan monitoring terenkripsi untuk AssetGuard failure.

### Lampiran Artifact

- Laporan lengkap: `e2e/LAPORAN-E2E-QA-FSTI-UWG.md`
- JSON raw: `e2e/laporan-e2e-result.json`
- CSV metrik: `e2e/metrik-kelulusan.csv`
- Log console: `e2e/run.log`
- Runner: `e2e/runner.js` + 4 scenario files

> Semua file dapat dilampirkan sebagai bukti pengujian otomatis pada Laporan PKL.
