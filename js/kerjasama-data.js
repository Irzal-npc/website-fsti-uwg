/**
 * FSTI UWG Malang - Pangkalan Data Kerjasama Fakultas (v1)
 * Dirender oleh halaman kerjasama.html (Grid Kartu Mitra).
 *
 * CARA PEMBARUAN (oleh pengelola fakultas):
 * 1. Tambahkan/edit objek di dalam array di bawah ini.
 * 2. Kolom "periode" & "bentuk" sebaiknya diisi sesuai dokumen resmi MoU/MoA/IA.
 * 3. Simpan berkas; halaman kerjasama.html otomatis menampilkan data terbaru.
 *
 * Kolom:
 *   id      : nomor unik (urut)
 *   mitra   : nama lembaga mitra
 *   jenis   : 'Perguruan Tinggi (Luar Negeri)' | 'Industri' | 'Lembaga Pendidikan' | 'Pemerintahan' | dst.
 *   negara  : negara mitra ('Indonesia' untuk mitra dalam negeri)
 *   bentuk  : bentuk kerja sama (cth: 'MoU', 'MoA', 'Implementation Agreement (IA)')
 *   bidang  : ruang lingkup/bidang kerja sama
 *   periode : periode berlaku dokumen (cth: '2023 - 2028'); kosongkan bila belum terverifikasi
 *   status  : 'Aktif' | 'Berakhir'
 *   logo    : path logo mitra (.webp) di assets/images/mitra/ — kosongkan ('') bila tidak ada
 *   link    : URL situs resmi mitra (opsional, kosongkan bila tidak ada)
 *
 * CATATAN: daftar awal diselaraskan dengan seksi "Mitra Kerja Sama"
 * di halaman Beranda. (Riwayat: file logo `ukm.webp` sempat salah bernama `utm-malaysia.webp`
 * sehingga UTM tampak ganda; telah diidentifikasi sebagai lambang Universiti Kebangsaan
 * Malaysia per lambang resmi di ukm.my.)
 * Rincian nomor dokumen, tanggal penandatanganan, dan periode wajib dilengkapi oleh fakultas
 * sesuai arsip dokumen kerja sama resmi.
 */
window.FSTI_KERJASAMA = [
 {
  "id": 1,
  "mitra": "Universiti Teknologi Malaysia (UTM)",
  "jenis": "Perguruan Tinggi (Luar Negeri)",
  "negara": "Malaysia",
  "bentuk": "MoU",
  "bidang": "Pendidikan, penelitian, dan pertukaran akademik",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/utm.webp",
  "link": "https://www.utm.my"
 },
 {
  "id": 2,
  "mitra": "Universiti Tun Hussein Onn Malaysia (UTHM)",
  "jenis": "Perguruan Tinggi (Luar Negeri)",
  "negara": "Malaysia",
  "bentuk": "MoU",
  "bidang": "Pendidikan, penelitian, dan pertukaran akademik",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/uthm.webp",
  "link": "https://www.uthm.edu.my"
 },
 {
  "id": 3,
  "mitra": "Universiti Teknikal Malaysia Melaka (UTeM)",
  "jenis": "Perguruan Tinggi (Luar Negeri)",
  "negara": "Malaysia",
  "bentuk": "MoU",
  "bidang": "Pendidikan, penelitian, dan pengabdian kepada masyarakat",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/utem.webp",
  "link": "https://www.utem.edu.my"
 },
 {
  "id": 4,
  "mitra": "UCSI University",
  "jenis": "Perguruan Tinggi (Luar Negeri)",
  "negara": "Malaysia",
  "bentuk": "MoU",
  "bidang": "Pendidikan, penelitian, dan pertukaran akademik",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/ucsi-university.webp",
  "link": "https://www.ucsiuniversity.edu.my"
 },
 {
  "id": 5,
  "mitra": "TATI University College",
  "jenis": "Perguruan Tinggi (Luar Negeri)",
  "negara": "Malaysia",
  "bentuk": "MoU",
  "bidang": "Pendidikan, penelitian, dan pengabdian kepada masyarakat",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/tati-university-college.webp",
  "link": "https://www.tatiuc.edu.my"
 },
 {
  "id": 6,
  "mitra": "Universiti Kebangsaan Malaysia (UKM)",
  "jenis": "Perguruan Tinggi (Luar Negeri)",
  "negara": "Malaysia",
  "bentuk": "MoU",
  "bidang": "Pendidikan, penelitian, dan pengabdian kepada masyarakat",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/ukm.webp",
  "link": "https://www.ukm.my"
 },
 {
  "id": 7,
  "mitra": "NVIDIA Deep Learning Institute (DLI)",
  "jenis": "Industri",
  "negara": "Amerika Serikat (Program Global)",
  "bentuk": "Kemitraan Program",
  "bidang": "Pelatihan dan sertifikasi deep learning/AI bagi dosen dan mahasiswa",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/nvidia-deep-learning.webp",
  "link": "https://www.nvidia.com/en-us/training/"
 },
 {
  "id": 8,
  "mitra": "Naratel",
  "jenis": "Industri",
  "negara": "Indonesia",
  "bentuk": "MoU",
  "bidang": "Pembelajaran, magang, dan praktisi industri",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/naratel.webp",
  "link": "https://kaptennaratel.com/"
 },
 {
  "id": 9,
  "mitra": "PT Zadabana",
  "jenis": "Industri",
  "negara": "Indonesia",
  "bentuk": "MoU",
  "bidang": "Pembelajaran, magang, dan praktisi industri",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/pt-zadabana.webp",
  "link": "https://id.linkedin.com/company/zaadacorp"
 },
 {
  "id": 10,
  "mitra": "Pondok Pesantren Al Firdaus",
  "jenis": "Lembaga Pendidikan",
  "negara": "Indonesia",
  "bentuk": "MoU",
  "bidang": "Pengabdian kepada masyarakat dan pembinaan",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/ponpes-al-firdaus.webp",
  "link": "https://babussalamalfirdaus.ponpes.id/"
 },
 {
  "id": 11,
  "mitra": "Fakultas Teknologi Informasi - Universitas Merdeka Malang",
  "jenis": "Perguruan Tinggi (Dalam Negeri)",
  "negara": "Indonesia",
  "bentuk": "",
  "bidang": "Pendidikan, penelitian, pengabdian kepada masyarakat, dan pengembangan kompetensi",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/fti-unmer-malang.webp",
  "link": "https://fti.unmer.ac.id"
 },
 {
  "id": 12,
  "mitra": "Fakultas Teknologi Informasi - ITB Yadika Pasuruan",
  "jenis": "Perguruan Tinggi (Dalam Negeri)",
  "negara": "Indonesia",
  "bentuk": "",
  "bidang": "Pendidikan, penelitian, pengabdian kepada masyarakat, dan pengembangan kompetensi",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/itb-yadika.webp",
  "link": "https://itbyadika.ac.id/profil-fakultas-teknologi-dan-informatika-fti/"
 },
 {
  "id": 13,
  "mitra": "Universitas Merdeka Pasuruan",
  "jenis": "Perguruan Tinggi (Dalam Negeri)",
  "negara": "Indonesia",
  "bentuk": "",
  "bidang": "Pendidikan, penelitian, pengabdian kepada masyarakat, dan pengembangan kompetensi",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/unmerpas.webp",
  "link": "https://unmerpas.ac.id/"
 },
 {
  "id": 14,
  "mitra": "STMIK PPKIA Pradnya Paramita Malang",
  "jenis": "Perguruan Tinggi (Dalam Negeri)",
  "negara": "Indonesia",
  "bentuk": "",
  "bidang": "Pendidikan, penelitian, pengabdian kepada masyarakat, dan pengembangan kompetensi",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/stimata.webp",
  "link": "https://stimata.ac.id/id/"
 },
 {
  "id": 15,
  "mitra": "Sentosa Foundation",
  "jenis": "Lembaga Sosial/Yayasan",
  "negara": "Indonesia",
  "bentuk": "",
  "bidang": "Pengabdian kepada masyarakat, pemberdayaan komunitas, dan kegiatan sosial",
  "periode": "",
  "status": "Aktif",
  "logo": "assets/images/mitra/sentosa-foundation.webp",
  "link": "https://www.instagram.com/sentosafoundation"
 }
];
