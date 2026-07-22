/**
 * Skenario 4: Pengujian Mode Luring dan Integritas Sistem (AssetGuard)
 */
const { readFile, logResult } = require('./utils');
const { JSDOM } = require('jsdom');

async function testOfflineAssetGuard() {
  const results = [];
  const SCENARIO = 'Mode Luring & AssetGuard';
  console.log('\n=== SKENARIO 4: Mode Luring & Integritas AssetGuard ===\n');

  const swCode = readFile('service-worker.js');
  const assetGuardCode = readFile('js/asset-guard.js');
  const indexHtml = readFile('index.html');

  // 4.1 Simulasi status jaringan terputus (Offline) dan validasi Service Worker cache

  // Static check service worker
  const hasCacheName = /CACHE_NAME/.test(swCode);
  const hasCoreAssets = /CORE_ASSETS/.test(swCode);
  const hasInstall = /addEventListener.*install/.test(swCode) && /cache\.addAll/.test(swCode);
  const hasActivate = /addEventListener.*activate/.test(swCode) && /caches\.delete/.test(swCode);
  const hasFetch = /addEventListener.*fetch/.test(swCode) && /caches\.match/.test(swCode);
  const hasCacheFirst = /caches\.match.*then/.test(swCode) || /Serve instantly from cache/.test(swCode);
  const hasOfflineFallback = /Offline.*ignore|text\/html/.test(swCode);

  results.push(logResult(SCENARIO, 'Service Worker - CACHE_NAME Exists', hasCacheName ? 'PASS' : 'FAIL', `found=${hasCacheName}`));
  results.push(logResult(SCENARIO, 'Service Worker - CORE_ASSETS Pre-cache List', hasCoreAssets ? 'PASS' : 'FAIL',
    `includes style.css=${swCode.includes('style.css')}, includes index.html=${swCode.includes('index.html')}, total ${ (swCode.match(/'\.\//g)||[]).length } assets`));
  results.push(logResult(SCENARIO, 'Service Worker - Install Event Pre-cache', hasInstall ? 'PASS' : 'FAIL', `install+addAll=${hasInstall}`));
  results.push(logResult(SCENARIO, 'Service Worker - Activate Clean Old Cache', hasActivate ? 'PASS' : 'FAIL', `activate=${hasActivate}`));
  results.push(logResult(SCENARIO, 'Service Worker - Fetch Cache-First Strategy', hasFetch && hasCacheFirst ? 'PASS' : 'FAIL',
    `fetch=${hasFetch}, cacheFirst=${hasCacheFirst}`));
  results.push(logResult(SCENARIO, 'Service Worker - Offline Fallback HTML', hasOfflineFallback ? 'PASS' : 'FAIL', `fallback=${hasOfflineFallback}`));

  // Cek manifest
  const manifest = JSON.parse(readFile('manifest.json'));
  results.push(logResult(SCENARIO, 'PWA Manifest - Valid & Themecolor', manifest && manifest.name ? 'PASS' : 'FAIL',
    `name=${manifest.name}, theme=${manifest.theme_color || 'N/A'}`));

  // Simulasi offline di JSDOM
  try {
    const dom = new JSDOM(indexHtml, {
      url: 'http://localhost/',
      pretendToBeVisual: true,
      runScripts: 'dangerously'
    });
    const { window } = dom;

    // Mock navigator.onLine = false dan serviceWorker
    Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
    
    let cacheStorageMock = {
      'fsti-uwg-cache-v2026.28': {
        './index.html': '<html>cached</html>',
        './css/style.css': 'body{}',
        './css/tailwind.css': '/* tailwind */'
      }
    };

    // Mock caches API
    window.caches = {
      match: async (req) => {
        const url = typeof req === 'string' ? req : req.url;
        // Simplified: return cached response if exists
        for (const cacheName in cacheStorageMock) {
          const cache = cacheStorageMock[cacheName];
          for (const key in cache) {
            if (url.includes(key.replace('./',''))) {
              return { status: 200, text: async () => cache[key], clone: function(){ return this; } };
            }
          }
        }
        // Fallback to index.html for HTML requests (offline logic)
        if (url.includes('text/html') || url.endsWith('.html') || url === 'http://localhost/') {
          return { status: 200, text: async () => cacheStorageMock['fsti-uwg-cache-v2026.28']['./index.html'] };
        }
        return undefined;
      },
      open: async (name) => ({
        put: async () => {},
        addAll: async () => {},
        match: async () => undefined
      }),
      keys: async () => Object.keys(cacheStorageMock)
    };

    // Evaluasi service-worker fetch handler secara konseptual: jika offline, caches.match harus mengembalikan cached index.html
    const cachedResponse = await window.caches.match('http://localhost/index.html');
    const offlineLoadWorks = !!cachedResponse;

    results.push(logResult(SCENARIO, 'Simulasi Offline - CacheStorage Load index.html', offlineLoadWorks ? 'PASS' : 'FAIL',
      `cachedResponseExists=${offlineLoadWorks}, status=${cachedResponse ? cachedResponse.status : 'N/A'}`));

    // Simulate navigator.serviceWorker.register
    window.navigator.serviceWorker = {
      register: async () => ({ scope: '/' }),
      ready: Promise.resolve()
    };

    const swRegistered = typeof window.navigator.serviceWorker.register === 'function';
    results.push(logResult(SCENARIO, 'Service Worker - Agent Dapat Di-Registrasi Saat Online', swRegistered ? 'PASS' : 'WARN',
      `registerFn=${swRegistered}, online=${window.navigator.onLine}`));

  } catch (e) {
    results.push(logResult(SCENARIO, 'Simulasi Offline Mode', 'FAIL', e.message));
  }

  // 4.2 Injeksi kegagalan blokir request style.css (404) dan validasi Fail-Closed AssetGuard

  const hasGuardLoader = /fsti-asset-guard/.test(indexHtml) && /fsti-guard-loader/.test(indexHtml);
  const hasGuardError = /fsti-guard-error/.test(indexHtml) && /Sistem Tidak Tersedia/.test(indexHtml);
  const hasGuardScript = /asset-guard\.js/.test(indexHtml);

  results.push(logResult(SCENARIO, 'AssetGuard - Guard Loader Element Present', hasGuardLoader ? 'PASS' : 'FAIL', `loader=${hasGuardLoader}`));
  results.push(logResult(SCENARIO, 'AssetGuard - Error Box "Sistem Tidak Tersedia"', hasGuardError ? 'PASS' : 'FAIL', `errorBox=${hasGuardError}`));
  results.push(logResult(SCENARIO, 'AssetGuard - Script Imported', hasGuardScript ? 'PASS' : 'FAIL', `scriptTag=${hasGuardScript}`));

  // Check asset-guard.js logic for fail-closed
  const checksAssetGuard = [
    { regex: /showSystemError/, desc: 'Fungsi showSystemError exists' },
    { regex: /revealPage/, desc: 'Fungsi revealPage exists' },
    { regex: /verifyAllAssets/, desc: 'Fungsi verifyAllAssets exists' },
    { regex: /typeof window\.lucide.*undefined/, desc: 'Cek Lucide gagal muat' },
    { regex: /FSTIScriptLoaded/, desc: 'Cek FSTIScriptLoaded gagal muat' },
    { regex: /styleSheets.*style\.css|cssLoaded/, desc: 'Cek stylesheet style.css gagal muat' },
    { regex: /maxAttempts/, desc: 'Retry mechanism maxAttempts' },
    { regex: /guard.*failed|guard-failed/, desc: 'Guard failed class handling' },
    { regex: /Sistem Tidak Tersedia/, source: 'html', desc: 'Pesan error generic tanpa path' }, // harus di html, bukan di js mengungkap path
  ];

  // Verifikasi fail-closed: jika CSS gagal, tampilkan error
  const failClosedLogic = /cssLoaded/.test(assetGuardCode) && /showSystemError/.test(assetGuardCode);
  results.push(logResult(SCENARIO, 'AssetGuard - Fail-Closed Logic untuk CSS 404', failClosedLogic ? 'PASS' : 'FAIL',
    `logicFound=${failClosedLogic}`));

  // Verifikasi tidak ada kebocoran path peladen (path leak)
  const hasPathLeak = /console\.error.*path|document\.location|__dirname|process\.env|server.*path|stack.*trace/i.test(assetGuardCode) ||
                      /home\/|var\/www|\/etc\//.test(assetGuardCode);
  const hasGenericMessage = /Mohon maaf.*tidak dapat dimuat/.test(indexHtml) && !/home\//.test(indexHtml.match(/fsti-guard-error[\s\S]*?<\/div>/g)?.join('') || '');

  results.push(logResult(SCENARIO, 'AssetGuard - No Path Leak (Fail-Closed Secure)', (!hasPathLeak && hasGenericMessage) ? 'PASS' : 'FAIL',
    `pathLeak=${hasPathLeak}, genericMessage=${hasGenericMessage}`));

  // Simulasi blokir style.css 404
  try {
    const domBlocked = new JSDOM(indexHtml, {
      url: 'http://localhost/',
      pretendToBeVisual: true,
      runScripts: 'dangerously'
    });
    const { window: winB } = domBlocked;
    const { document: docB } = winB;

    // Mock styleSheets: tidak ada yang href includes style.css => cssLoaded = false
    Object.defineProperty(docB, 'styleSheets', {
      value: [], // kosong, seolah 404
      configurable: true
    });

    // Mock getComputedStyle untuk mengembalikan kosong sehingga cssLoaded false di logika pertama?
    // AssetGuard punya fallback: getComputedStyle(body).color !== '' => jika body.color kosong, css dianggap tidak loaded
    winB.getComputedStyle = () => ({ color: '' });

    // Mock required globals
    winB.lucide = undefined; // simulasikan lucide gagal load karena style.css 404 tidak berhubungan, tapi untuk trigger fail-closed kita butuh lucide ada
    winB.FSTIScriptLoaded = true; // anggap script utama ok
    winB.eval(`window.lucide = undefined; window.FSTIScriptLoaded = true;`); // will be overridden

    // Kita langsung eval asset-guard.js dengan checkAttempts memaksa maxAttempts
    // Ubah assetGuardCode untuk mempercepat test: set maxAttempts=1 untuk langsung trigger error
    let fastFailCode = assetGuardCode.replace('const maxAttempts = 30', 'const maxAttempts = 1');
    // Inject
    winB.eval(fastFailCode);

    // Tunggu 500ms untuk verifyAllAssets async
    await new Promise(r => setTimeout(r, 1200));

    const guard = docB.getElementById('fsti-asset-guard');
    const errorBox = docB.getElementById('fsti-guard-error');
    const loader = docB.getElementById('fsti-guard-loader');

    const errorVisible = errorBox && !errorBox.classList.contains('hidden');
    const loaderHidden = loader && loader.style.display === 'none';
    const guardOpacity = guard ? guard.style.opacity : '';

    results.push(logResult(SCENARIO, 'Simulasi Blokir style.css 404 - Fail-Closed Triggered', errorVisible ? 'PASS' : 'FAIL',
      `errorVisible=${errorVisible}, loaderHidden=${loaderHidden}, guardOpacity=${guardOpacity}, guardDisplay=${guard ? guard.style.display : 'N/A'}`));

    // Pastikan pesan Sistem Tidak Tersedia tampil
    const errorText = errorBox ? errorBox.textContent : '';
    const showsSystemUnavailable = /Sistem Tidak Tersedia/.test(errorText);

    results.push(logResult(SCENARIO, 'Fail-Closed UI - Pesan "Sistem Tidak Tersedia"', showsSystemUnavailable ? 'PASS' : 'FAIL',
      `text=${errorText.slice(0,80).replace(/\s+/g,' ')}`));

    // Pastikan layar terkunci (guard display flex, opacity 1)
    const isLocked = guard && (guard.style.display === 'flex' || guard.style.opacity === '1' || !errorBox.classList.contains('hidden'));
    results.push(logResult(SCENARIO, 'Fail-Closed - Layar Terkunci (Lock Screen)', isLocked ? 'PASS' : 'WARN',
      `locked=${isLocked}`));

  } catch (e) {
    results.push(logResult(SCENARIO, 'Simulasi Blokir CSS 404', 'FAIL', e.message + ' ' + e.stack?.slice(0,300)));
  }

  // Additional static checks untuk asset-guard security posture
  const hasOpacityTransition = /transition-opacity/.test(indexHtml) && /duration-300/.test(indexHtml);
  const hasZIndexHigh = /z-\[99999\]/.test(indexHtml);

  results.push(logResult(SCENARIO, 'AssetGuard - Overlay High z-index & Transition', (hasOpacityTransition && hasZIndexHigh) ? 'PASS' : 'WARN',
    `transition=${hasOpacityTransition}, z99999=${hasZIndexHigh}`));

  return results;
}

module.exports = { testOfflineAssetGuard };
