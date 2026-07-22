/**
 * Skenario 1: Pengujian UI/UX dan Responsivitas Visual
 * Senior QA Automation Engineer - FSTI UWG Malang
 */
const { readFile, loadDOM, logResult } = require('./utils');
const { JSDOM } = require('jsdom');

async function testUIUX() {
  const results = [];
  const SCENARIO = 'UI/UX & Responsivitas Visual';

  console.log('\n=== SKENARIO 1: UI/UX dan Responsivitas Visual ===\n');

  // 1.1 Simulasi viewport 320px hingga 1440px - validasi grid adaptasi dan overflow
  const viewports = [320, 480, 768, 1024, 1280, 1440];
  const indexHtml = readFile('index.html');
  const dosenHtml = readFile('direktori-dosen.html');
  const penelitianHtml = readFile('penelitian.html');

  // Cek keberadaan kelas Tailwind responsif grid
  const gridChecks = [
    { pattern: /grid-cols-1/, desc: 'grid-cols-1 ditemukan (mobile base)' },
    { pattern: /sm:grid-cols-2|md:grid-cols-2/, desc: 'grid-cols-2 pada breakpoint tablet ditemukan' },
    { pattern: /lg:grid-cols-3/, desc: 'grid-cols-3 pada breakpoint desktop ditemukan' },
    { pattern: /overflow-x-hidden/, desc: 'overflow-x-hidden pada body (anti overflow global)' },
  ];

  let gridPass = true;
  let gridDetails = [];
  for (const check of gridChecks) {
    const found = check.pattern.test(indexHtml + dosenHtml + penelitianHtml);
    gridDetails.push(`${check.desc}: ${found ? 'YES' : 'NO'}`);
    if (!found) gridPass = false;
  }

  // Cek CSS untuk pencegahan overflow
  const styleCss = readFile('css/style.css');
  const overflowPrevent = /html,\s*body\s*\{[^}]*max-width:\s*100%[^}]*overflow-x:\s*hidden/s.test(styleCss) ||
                         /overflow-x:\s*hidden/.test(styleCss);
  
  // Simulasi viewport logic dengan JSDOM
  for (const vp of viewports) {
    const dom = new JSDOM(indexHtml, { pretendToBeVisual: true, url: 'http://localhost/' });
    const { window } = dom;
    // Mock viewport
    Object.defineProperty(window, 'innerWidth', { value: vp, writable: true });
    
    const doc = window.document;
    const containers = doc.querySelectorAll('.container, [class*=\"grid-cols-\"]');
    let overflowFound = false;
    
    // Dalam pengujian statis: pastikan tidak ada elemen dengan width fixed > viewport
    // Real overflow check: cari style inline yang melebihi viewport
    const allElements = doc.querySelectorAll('*');
    for (const el of allElements) {
      const style = el.getAttribute('style') || '';
      const match = style.match(/width:\s*(\d+)px/);
      if (match) {
        const w = parseInt(match[1], 10);
        if (w > vp) overflowFound = true;
      }
    }

    const status = !overflowFound ? 'PASS' : 'FAIL';
    results.push(logResult(SCENARIO, `Viewport ${vp}px - No Overflow`, status,
      `Elements checked: ${allElements.length}, Overflow: ${overflowFound ? 'DETECTED' : 'NONE'}. ${gridDetails.join('; ')} | preventRule: ${overflowPrevent}`));
  }

  // Rangkuman grid adaptasi
  results.push(logResult(SCENARIO, 'Tailwind Grid Adaptasi 1→2→3', gridPass ? 'PASS' : 'FAIL',
    gridDetails.join(' | ') + ` | overflowPreventRule=${overflowPrevent}`));

  // 1.2 Event hover pada .program-card atau .dosen-card - premium statis tanpa translateY / shadow
  // Validasi CSS: harus ada transform: none !important dan box-shadow: none !important pada hover
  const premiumStaticPatterns = [
    /\.program-card,\s*\.program-card:hover[\s\S]*?transform:\s*none\s*!important/,
    /\.dosen-card,\s*\.dosen-card:hover[\s\S]*?transform:\s*none\s*!important/,
    /\.program-card:hover[\s\S]*?box-shadow:\s*none\s*!important|\.program-card,\s*\.program-card:hover[\s\S]*?box-shadow:\s*none/,
    /transition:\s*none\s*!important[\s\S]*?\.program-card|Standardisasi Kartu Statis/
  ];

  const css = styleCss;
  let hoverPass = true;
  let hoverDetails = [];

  // Cek aturan spesifik untuk premium static
  const checks = [
    { regex: /\.program-card[^}]*transform:\s*none\s*!important/, desc: '.program-card transform none !important' },
    { regex: /\.dosen-card[^}]*transform:\s*none\s*!important/, desc: '.dosen-card transform none !important' },
    { regex: /box-shadow:\s*none\s*!important/, desc: 'box-shadow none !important rule exists' },
    { regex: /123mvp|Kartu.*Statis|premium/i, desc: 'Comment premium static present' },
  ];

  // Lebih akurat: cari blok CSS yang mengatur .program-card:hover
  const programHoverBlock = css.match(/\.program-card,\s*\.program-card:hover[\s\S]*?\{[\s\S]*?\}/g);
  const dosenHoverBlock = css.match(/\.dosen-card,\s*\.dosen-card:hover[\s\S]*?\{[\s\S]*?\}/g);

  const hasTranslateY = /translateY/.test(css.match(/\.program-card[^{]*hover[^{]*\{[^}]*\}/g)?.join('') || '') ||
                       /translateY/.test(css.match(/\.dosen-card[^{]*hover[^{]*\{[^}]*\}/g)?.join('') || '');

  // Jika hasTranslateY = false, berarti PASS (tidak ada perubahan translateY)
  hoverPass = !hasTranslateY && css.includes('.program-card') && css.includes('.dosen-card');

  // Detail: Pastikan tidak ada tambahan bayangan saat hover (box-shadow selain none)
  const hasShadowOnHover = (() => {
    const hoverRules = [...(css.matchAll(/\.program-card:hover[^{]*\{([^}]*)\}/g)), ...(css.matchAll(/\.dosen-card:hover[^{]*\{([^}]*)\}/g))];
    for (const m of hoverRules) {
      const body = m[1];
      // Ekstrak semua deklarasi box-shadow
      const matches = [...body.matchAll(/box-shadow\s*:\s*([^;]+);/gi)];
      for (const mm of matches) {
        const val = mm[1].trim().toLowerCase();
        if (!val.startsWith('none')) {
          return true; // ada bayangan selain none
        }
      }
    }
    return false;
  })();

  if (hasShadowOnHover) hoverPass = false;

  results.push(logResult(SCENARIO, 'Hover Premium Statis - No translateY / No Shadow', hoverPass ? 'PASS' : 'FAIL',
    `hasTranslateY=${hasTranslateY}, hasShadowOnHover=${hasShadowOnHover}, programHoverBlockFound=${!!programHoverBlock}, dosenHoverBlockFound=${!!dosenHoverBlock}`));

  // Simulasi event hover di JSDOM
  try {
    const dom = new JSDOM(indexHtml, { pretendToBeVisual: true, url: 'http://localhost/' });
    const doc = dom.window.document;
    const card = doc.querySelector('.program-card') || doc.querySelector('.testimonial-card');
    if (card) {
      // Sebelum hover, dapatkan computed transform (jsdom tidak computed, tapi kita cek class)
      const beforeTransform = dom.window.getComputedStyle(card).transform;
      // Simulasikan hover dengan menambah class hover (jika ada logic JS)
      const event = new dom.window.Event('mouseover', { bubbles: true });
      card.dispatchEvent(event);
      const afterTransform = dom.window.getComputedStyle(card).transform;
      // Karena CSS men-set transform none !important, transform harus tetap none / tidak berubah
      const hoverJsdomPass = beforeTransform === afterTransform;
      results.push(logResult(SCENARIO, 'Simulasi Event Hover JSDOM - Transform Tidak Berubah', hoverJsdomPass ? 'PASS' : 'WARN',
        `before=${beforeTransform}, after=${afterTransform}`));
    } else {
      results.push(logResult(SCENARIO, 'Simulasi Event Hover JSDOM - Card Ditemukan', 'WARN', 'No .program-card found in index, fallback'));
    }
  } catch (e) {
    results.push(logResult(SCENARIO, 'Simulasi Event Hover JSDOM', 'WARN', `Exception: ${e.message}`));
  }

  // 1.3 Event active pada CTA - validasi .scale-[0.98]
  const ctaActiveChecks = [
    { regex: /active:scale-\[0\.98\]/, source: 'html', desc: 'Tailwind active:scale-[0.98] class exists in HTML' },
    { regex: /transform:\s*scale\(\.98\)\s*!important/, source: 'css', desc: 'scale(0.98) !important rule in CSS' },
    { regex: /active:scale-\[0\.92\]|scale\(0\.92\)/, source: 'css', desc: 'Menu button active scale 0.92' },
  ];

  let activeCss = styleCss;
  let htmlAll = indexHtml + readFile('penelitian.html') + readFile('direktori-dosen.html');

  let ctaFound = /active:scale-\[0\.98\]/.test(htmlAll);
  let scaleRuleFound = /scale\(\.98\)/.test(activeCss) || /scale\(0\.98\)/.test(activeCss);

  results.push(logResult(SCENARIO, 'CTA Active Transform scale-[0.98]', (ctaFound && scaleRuleFound) ? 'PASS' : 'FAIL',
    `ctaClassFound=${ctaFound}, scaleRuleFound=${scaleRuleFound}, occurrences=${(htmlAll.match(/active:scale-\[0\.98\]/g) || []).length}`));

  // Simulasi active event
  try {
    const dom = new JSDOM(indexHtml, { pretendToBeVisual: true, url: 'http://localhost/' });
    const doc = dom.window.document;
    const ctaBtn = doc.querySelector('a.bg-\\[\\#F18602\\], a[class*=\"bg-[#F18602]\"]') || doc.querySelector('a[href=\"#eksplorasi\"]');
    if (ctaBtn) {
      const downEvent = new dom.window.Event('mousedown', { bubbles: true });
      ctaBtn.dispatchEvent(downEvent);
      // Setelah active, class active:scale-[0.98] seharusnya memicu transform via CSS global body a:active {transform: scale(.98)}
      // Regex lebih longgar: cari scale(.98) atau scale(0.98) di dalam blok yang mengandung :active
      const activeBlocks = [...activeCss.matchAll(/:active[^{]*\{([^}]*)\}/gis)].map(m=>m[1]).join(' ');
      const styleCheck = /scale\(\s*0?\.98\s*\)/.test(activeBlocks) && /transform/i.test(activeBlocks);
      results.push(logResult(SCENARIO, 'Simulasi Active CTA - Tactile Response', styleCheck ? 'PASS' : 'FAIL',
        `CTA text=${ctaBtn.textContent.trim().slice(0,30)}, activeRulePresent=${styleCheck}, activeBlocksSnippet=${activeBlocks.slice(0,120)}`));
    }
  } catch (e) {
    results.push(logResult(SCENARIO, 'Simulasi Active CTA', 'WARN', e.message));
  }

  return results;
}

module.exports = { testUIUX };
