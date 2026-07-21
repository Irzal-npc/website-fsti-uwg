/**
 * FSTI UWG Malang - Pangkalan Data Prestasi Fakultas (v1)
 * Dirender oleh halaman prestasi.html (Tabel Agregat Prestasi Akademik & Non-Akademik).
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
  "foto": "assets/images/kegiatan/prestasi-inotek.webp"
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
  "foto": "assets/images/kegiatan/prestasi-irsyad.webp"
 },
 {
  "id": 3,
  "tahun": "2025",
  "nama": "Juara 1 Taekwondo Kyorugi Senior Putri Kelas 48 KG - Jatim Cup 3 (Piala Kapolda Jawa Timur) 2025",
  "kategori": "Non-Akademik",
  "tingkat": "Provinsi",
  "peraih": "Waode Anisa F",
  "asal": "Mahasiswa S1 Informatika",
  "penyelenggara": "Kejuaraan Taekwondo Grade C KBPP Polri - Jatim Cup 3, Piala Kapolda Jawa Timur 2025",
  "foto": "assets/images/kegiatan/prestasi-nasional.webp"
 }
];
