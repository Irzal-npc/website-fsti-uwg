/**
 * Konfigurasi Tailwind CSS — Website FSTI UWG Malang
 * ------------------------------------------------------------------
 * Build CSS lokal (self-hosted) pengganti Tailwind Play CDN.
 *
 * PENTING: `content` WAJIB memuat seluruh file HTML DAN file JS yang
 * merakit markup secara dinamis (karya-agregat.js, util-tabel.js, dsb.),
 * agar seluruh kelas — termasuk arbitrary value seperti text-[#F18602]
 * dan kelas hasil rakitan JavaScript — ikut ter-generate.
 *
 * Perintah build:  npm run build:css
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './prodi/*.html',
    './js/*.js'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
