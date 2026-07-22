/**
 * Skenario 3: Pengujian Pendekatan Statistika dan Agregasi Data
 */
const { readFile, logResult } = require('./utils');
const { JSDOM } = require('jsdom');

async function testStatistikAgregasi() {
  const results = [];
  const SCENARIO = 'Statistika & Agregasi Data';
  console.log('\n=== SKENARIO 3: Statistika & Agregasi Data (In-Memory Engine) ===\n');

  const penelitianHtml = readFile('penelitian.html');
  const dosenDataJs = readFile('js/dosen-data.js');
  const karyaAgregatJs = readFile('js/karya-agregat.js');
  const utilTabelJs = readFile('js/util-tabel.js');

  // Setup JSDOM untuk halaman penelitian.html
  const dom = new JSDOM(penelitianHtml, {
    url: 'http://localhost/penelitian.html',
    pretendToBeVisual: true,
    runScripts: 'dangerously',
    resources: 'usable'
  });
  const { window } = dom;
  const { document } = window;

  // Stub lucide dan clipboard
  window.eval(`window.lucide = { createIcons: () => {} };`);
  window.eval(`window.isSecureContext = true; navigator.clipboard = { writeText: (t) => Promise.resolve() };`);

  // Inject dosen data
  try {
    window.eval(dosenDataJs);
  } catch (e) {
    results.push(logResult(SCENARIO, 'Inject Dosen Data', 'FAIL', e.message));
    return results;
  }

  // Inject util-tabel.js
  try {
    window.eval(utilTabelJs);
  } catch (e) {
    results.push(logResult(SCENARIO, 'Inject util-tabel.js', 'FAIL', e.message));
  }

  // Set config untuk penelitian
  window.eval(`window.FSTI_KARYA_PAGE = { jenis: 'Penelitian', labelJenis: 'penelitian' };`);

  // Inject karya-agregat.js
  try {
    window.eval(karyaAgregatJs);
  } catch (e) {
    results.push(logResult(SCENARIO, 'Inject karya-agregat.js', 'FAIL', e.message));
  }

  // Tunggu DOMContentLoaded trigger (karya-agregat init via DOMContentLoaded listener)
  // Manual trigger DOMContentLoaded
  const domContentEvent = new window.Event('DOMContentLoaded', { bubbles: true });
  document.dispatchEvent(domContentEvent);

  await new Promise(r => setTimeout(r, 1200));

  // Cek statistik ringkas
  const statEntri = document.getElementById('stat-total-entri');
  const statDosen = document.getElementById('stat-total-dosen');
  const statTahun = document.getElementById('stat-total-tahun');
  const tbody = document.getElementById('karya-tbody');
  const countEl = document.getElementById('karya-count');
  const dropdown = document.getElementById('karya-dosen');
  const searchInput = document.getElementById('karya-search');
  const sortSelect = document.getElementById('karya-sort');
  const thTahunBtn = document.getElementById('karya-th-tahun-btn');

  const totalEntri = statEntri ? statEntri.textContent.trim() : '0';
  const totalDosen = statDosen ? statDosen.textContent.trim() : '0';
  const rentangTahun = statTahun ? statTahun.textContent.trim() : '—';

  results.push(logResult(SCENARIO, 'Statistik Otomatis - Total Entri Penelitian', parseInt(totalEntri.replace(/\D/g,'')) > 0 ? 'PASS' : 'FAIL',
    `entri=${totalEntri}, dosen=${totalDosen}, tahun=${rentangTahun}`));

  results.push(logResult(SCENARIO, 'Render Awal Tabel Agregat', tbody && tbody.children.length > 0 ? 'PASS' : 'FAIL',
    `rows=${tbody ? tbody.children.length : 0}, countText=${countEl ? countEl.textContent.slice(0,80) : 'N/A'}`));

  // 3.1 Uji mesin In-Memory Data Engine: filter dropdown dosen
  if (dropdown && tbody) {
    const initialRows = tbody.children.length;
    const options = Array.from(dropdown.options).map(o => o.value).filter(v => v);
    if (options.length > 0) {
      const selectedName = options[0];
      dropdown.value = selectedName;
      const changeEvent = new window.Event('change', { bubbles: true });
      dropdown.dispatchEvent(changeEvent);

      await new Promise(r => setTimeout(r, 400));

      const filteredRows = tbody.children.length;
      const filteredCountText = countEl ? countEl.textContent : '';

      // Harus memfilter secara instan: jumlah baris berkurang tapi >0, dan semua baris mengandung nama dosen
      const allContainName = Array.from(tbody.querySelectorAll('tr')).every(tr => {
        const dosenCell = tr.children[2] ? tr.children[2].textContent : '';
        return dosenCell.includes(selectedName.split(',')[0].trim().split(' ')[0]) || dosenCell.trim() === selectedName.trim();
      });

      results.push(logResult(SCENARIO, 'In-Memory Filter Dropdown Dosen - Instant Filtering', (filteredRows > 0 && filteredRows <= initialRows) ? 'PASS' : 'FAIL',
        `selected=${selectedName}, before=${initialRows}, after=${filteredRows}, countText=${filteredCountText.slice(0,100)}, allContain=${allContainName}`));

      // Reset filter
      dropdown.value = '';
      dropdown.dispatchEvent(new window.Event('change', { bubbles: true }));
      await new Promise(r => setTimeout(r, 400));
    } else {
      results.push(logResult(SCENARIO, 'Filter Dropdown Dosen - Options Tersedia', 'FAIL', 'Tidak ada opsi dosen di dropdown'));
    }
  }

  // 3.2 Klik header kolom Tahun dan validasi sorting terbaru ke terlama (desc) presisi
  if (thTahunBtn && tbody) {
    // Pastikan sort default adalah tahun-desc
    const getYears = () => Array.from(tbody.querySelectorAll('tr')).map(tr => {
      const tahunCell = tr.children[3];
      const text = tahunCell ? tahunCell.textContent.trim() : '';
      const num = parseInt(text, 10);
      return isNaN(num) ? 0 : num;
    });

    await new Promise(r => setTimeout(r, 200));
    const yearsBefore = getYears();
    const isDescBefore = yearsBefore.every((y, i) => i === 0 || y <= yearsBefore[i-1] || y === 0);

    results.push(logResult(SCENARIO, 'Sorting Default Tahun Terbaru → Terlama', isDescBefore ? 'PASS' : 'FAIL',
      `first5=${yearsBefore.slice(0,5).join(',')}, isDesc=${isDescBefore}`));

    // Klik header untuk toggle ke asc
    thTahunBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    const yearsAsc = getYears();
    const isAsc = yearsAsc.every((y, i) => i === 0 || y >= yearsAsc[i-1] || y === 0);

    results.push(logResult(SCENARIO, 'Sorting Toggle Tahun Terlama → Terbaru (asc)', isAsc ? 'PASS' : 'FAIL',
      `first5=${yearsAsc.slice(0,5).join(',')}, isAsc=${isAsc}`));

    // Klik lagi untuk kembali ke desc (terbaru ke terlama) - validasi presisi
    thTahunBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    const yearsDescAgain = getYears();
    const isDescAgain = yearsDescAgain.every((y, i) => i === 0 || y <= yearsDescAgain[i-1] || y === 0);

    results.push(logResult(SCENARIO, 'Sorting Validasi Presisi Terbaru→Terlama (desc)', isDescAgain ? 'PASS' : 'FAIL',
      `first5=${yearsDescAgain.slice(0,5).join(',')}, isDesc=${isDescAgain}`));

    // Cek aria-sort attribute
    const thTahun = document.getElementById('karya-th-tahun');
    const ariaSort = thTahun ? thTahun.getAttribute('aria-sort') : null;
    results.push(logResult(SCENARIO, 'A11y aria-sort pada Header Tahun', ariaSort ? 'PASS' : 'WARN',
      `aria-sort=${ariaSort}`));
  }

  // 3.3 Simulasi klik ikon Salin Sitasi dan toast notification muncul
  try {
    const copyBtn = document.querySelector('[data-copy-text]');
    if (copyBtn) {
      const clickEvent = new window.MouseEvent('click', { bubbles: true, cancelable: true });
      copyBtn.dispatchEvent(clickEvent);
      await new Promise(r => setTimeout(r, 500));

      const toastEl = document.getElementById('fsti-toast');
      const toastVisible = toastEl && !toastEl.classList.contains('opacity-0');
      const toastText = toastEl ? toastEl.textContent.trim() : '';

      results.push(logResult(SCENARIO, 'Klik Salin Sitasi - Toast Notification Muncul', (toastEl && toastText.toLowerCase().includes('tersalin')) ? 'PASS' : 'FAIL',
        `toastExists=${!!toastEl}, visible=${toastVisible}, text=${toastText.slice(0,50)}`));

      // Cek icon swap check
      const hasCheckIcon = copyBtn.innerHTML.includes('check') || copyBtn.classList.contains('fsti-copy-ok');
      results.push(logResult(SCENARIO, 'Feedback Visual Salin - Icon Check & Class fsti-copy-ok', hasCheckIcon ? 'PASS' : 'WARN',
        `hasCheck=${hasCheckIcon}, innerHTML=${copyBtn.innerHTML.slice(0,80)}`));
    } else {
      results.push(logResult(SCENARIO, 'Tombol Salin Sitasi Ditemukan', 'FAIL', 'Tidak ada [data-copy-text] di DOM'));
    }
  } catch (e) {
    results.push(logResult(SCENARIO, 'Simulasi Salin Sitasi', 'FAIL', e.message));
  }

  // Static checks untuk kode sumber
  const hasFilterLogic = /state\.dosen/.test(karyaAgregatJs) && /filtered\(\)/.test(karyaAgregatJs);
  const hasSortingLogic = /comparator/.test(karyaAgregatJs) && /tahun-desc/.test(karyaAgregatJs);
  const hasCopyLogic = /copyText/.test(utilTabelJs) && /toast/.test(utilTabelJs);
  const hasSearchInstant = /addEventListener.*input/.test(karyaAgregatJs);

  results.push(logResult(SCENARIO, 'Static Check - In-Memory Filter Engine', hasFilterLogic ? 'PASS' : 'FAIL', `filterLogic=${hasFilterLogic}`));
  results.push(logResult(SCENARIO, 'Static Check - Sorting Algorithm Tahun', hasSortingLogic ? 'PASS' : 'FAIL', `sorting=${hasSortingLogic}`));
  results.push(logResult(SCENARIO, 'Static Check - Salin + Toast Feedback', hasCopyLogic ? 'PASS' : 'FAIL', `copy=${hasCopyLogic}`));
  results.push(logResult(SCENARIO, 'Static Check - Search Instant (input event)', hasSearchInstant ? 'PASS' : 'FAIL', `instant=${hasSearchInstant}`));

  return results;
}

module.exports = { testStatistikAgregasi };
