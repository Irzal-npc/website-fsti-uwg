/**
 * FSTI UWG Malang - Pangkalan Data Prestasi Fakultas (v1)
 * Dirender oleh halaman prestasi.html (Grid Kartu Prestasi Akademik & Non-Akademik).
 *
 * CARA PEMBARUAN (oleh pengelola fakultas):
 * 1. Tambahkan/edit objek di dalam array di bawah ini.
 * 2. Simpan berkas; halaman prestasi.html otomatis menampilkan data terbaru.
 *
 * Kolom:
 *   id            : nomor unik (urut)
 *   tahun         : tahun perolehan (4 digit, cth: '2025')
 *   nama          : nama/judul prestasi
 *   kategori      : 'Akademik' | 'Non-Akademik'
 *   tingkat       : 'Lokal (Kota/Kabupaten)' | 'Provinsi' | 'Nasional' | 'Internasional'
 *   peraih        : nama peraih prestasi (mahasiswa/tim/dosen/prodi)
 *   asal          : asal peraih (cth: 'Mahasiswa S1 Informatika / Pengurus HMIF')
 *   penyelenggara : pihak penyelenggara ajang/kejuaraan
 *   foto          : path foto dokumentasi (.webp) — kosongkan ('') bila tidak ada
 *   keterangan    : narasi singkat tambahan (opsional; tampil pada kartu & deskripsi lightbox)
 *   sumber        : URL tautan sumber berita resmi (opsional; kosongkan bila belum ada)
 *   sumberLabel   : label tautan sumber (cth: 'Berita Resmi UWG (17 Des 2024)')
 *
 * CATATAN: dua entri pertama diselaraskan dengan seksi "Sorotan Prestasi" di halaman Beranda.
 */
window.FSTI_PRESTASI = [
 {
  "id": 1,
  "tahun": "2025",
  "nama": "Juara 3 Lomba Inovasi Teknologi (INOTEK) Kota Malang 2025",
  "kategori": "Akademik",
  "tingkat": "Lokal (Kota)",
  "peraih": "Naufal Ibra Prasetyo, Fhadillah Ain Marpaung, & Maria Rosalina Trisna Yangaluy",
  "asal": "Mahasiswa S1 Informatika / Pengurus HMIF",
  "penyelenggara": "Lomba Inovasi Teknologi (INOTEK) Kota Malang 2025",
  "foto": "assets/images/kegiatan/prestasi-inotek.webp",
  "keterangan": "Melalui karya TAHES (Talk and Heal Every Student) — aplikasi pemantauan kesehatan mental siswa berbasis analisis stres dan dukungan sosial — tim mahasiswa Informatika semester V yang juga pengurus HMIF ini meraih Juara 3 pada ajang INOTEK Kota Malang 2025.",
  "sumber": "https://widyagama.ac.id/tahes-uwg-raih-juara-iii-inotek-kota-malang-2025-inovasi-pemantauan-kesehatan-mental-siswa-berbasis-teknologi/",
  "sumberLabel": "Berita Resmi UWG (12 Nov 2025)"
 },
 {
  "id": 2,
  "tahun": "2024",
  "nama": "1st Best Presentation, 1st Best Video Innovation, & 2nd Best Project Innovation - International Youth Innovation Summit (IYIS) #6",
  "kategori": "Akademik",
  "tingkat": "Internasional",
  "peraih": "Irsyad Maulana Wijaya",
  "asal": "Mahasiswa S1 Bisnis Digital",
  "penyelenggara": "International Youth Innovation Summit #6, Kuala Lumpur, Malaysia, 10-13 Desember 2024",
  "foto": "assets/images/kegiatan/prestasi-irsyad.webp",
  "keterangan": "Berangkat sebagai satu-satunya perwakilan UWG Malang di Kuala Lumpur, Irsyad memaparkan inovasi strategi komunitas digital bagi pelaku UMKM di hadapan juri internasional dan memborong tiga penghargaan sekaligus.",
  "sumber": "https://widyagama.ac.id/irsyad-mahasiswa-bisdig-uwg-malang-raih-tiga-penghargaan-di-ajang-internasional-di-malaysia/",
  "sumberLabel": "Berita Resmi UWG (17 Des 2024)"
 },
 {
  "id": 3,
  "tahun": "2025",
  "nama": "Juara 1 Taekwondo Kyorugi Senior Putri Kelas 48 KG - Jatim Cup 3 (Piala Kapolda Jawa Timur) 2025",
  "kategori": "Non-Akademik",
  "tingkat": "Provinsi",
  "peraih": "Wa Ode Anisa Febrianti",
  "asal": "Mahasiswa S1 Informatika",
  "penyelenggara": "Kejuaraan Taekwondo Grade C KBPP Polri - Jatim Cup 3, Piala Kapolda Jawa Timur 2025 — ITS Robotics Center Surabaya, 6-7 Desember 2025",
  "foto": "assets/images/kegiatan/prestasi-nasional.webp",
  "keterangan": "Anisa meraih Juara 1 (medali emas) nomor Kyorugi Senior Putri kelas 48 kg — bagian dari raihan membanggakan UKM Taekwondo UWG yang memborong 4 medali emas dan 1 medali perak dari 5 kategori, dengan seluruh atletnya naik podium.",
  "sumber": "https://widyagama.ac.id/bikin-bangga-uwg-ukm-taekwondo-borong-medali-di-ajang-bergengsi-kapolda-jatim/",
  "sumberLabel": "Berita Resmi UWG (30 Des 2025)"
 }
];
