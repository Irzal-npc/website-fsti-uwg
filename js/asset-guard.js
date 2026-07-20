/**
 * FSTI UWG Malang - Strict Asset Integrity Guard & Preloader (AssetGuard)
 * Memastikan seluruh aset kritis (CSS, JS, Logo, Data) tersedia sebelum halaman ditampilkan.
 * Jika aset rusak/hilang total, menampilkan layar error putih bersih tanpa keterangan teknis/path.
 */
(function() {
    let checkAttempts = 0;
    const maxAttempts = 30; // Coba setiap 100ms hingga maksimal 3 detik

    function showSystemError() {
        const guard = document.getElementById('fsti-asset-guard');
        const loader = document.getElementById('fsti-guard-loader');
        const errorBox = document.getElementById('fsti-guard-error');
        if (guard && loader && errorBox) {
            loader.style.display = 'none';
            errorBox.classList.remove('hidden');
            guard.style.opacity = '1';
            guard.style.display = 'flex';
        }
    }

    function revealPage() {
        const guard = document.getElementById('fsti-asset-guard');
        if (guard && !guard.classList.contains('guard-failed')) {
            guard.style.opacity = '0';
            setTimeout(() => {
                guard.style.display = 'none';
            }, 300);
        }
    }

    function verifyAllAssets() {
        try {
            checkAttempts++;

            // 1. Cek keberadaan objek utama dari skrip eksternal (Lucide & Script Utama)
            if (typeof window.lucide === 'undefined' || !window.FSTIScriptLoaded) {
                if (checkAttempts < maxAttempts) {
                    return setTimeout(verifyAllAssets, 100);
                }
                // Jika setelah 3 detik skrip utama gagal muat (404 / syntax error total), baru tampilkan error
                return showSystemError();
            }

            // 2. Cek apakah stylesheet utama (style.css) berhasil dimuat
            const cssLoaded = Array.from(document.styleSheets).some(s => {
                try {
                    return s.href && s.href.includes('style.css');
                } catch(e) { return true; }
            }) || (getComputedStyle(document.body).color !== '');

            if (!cssLoaded && checkAttempts < maxAttempts) {
                return setTimeout(verifyAllAssets, 100);
            } else if (!cssLoaded) {
                return showSystemError();
            }

            // 3. Cek data cadangan jika berada di halaman khusus (Alumni / Direktori Dosen)
            const path = window.location.pathname || '';
            if (path.includes('alumni.html') && typeof window.FSTI_ALUMNI === 'undefined' && typeof window.alumniData === 'undefined') {
                if (checkAttempts < maxAttempts) {
                    return setTimeout(verifyAllAssets, 100);
                }
                return showSystemError();
            }
            if (path.includes('direktori-dosen.html') && typeof window.FSTI_DOSEN === 'undefined' && typeof window.dosenData === 'undefined') {
                if (checkAttempts < maxAttempts) {
                    return setTimeout(verifyAllAssets, 100);
                }
                return showSystemError();
            }

            // 4. Cek khusus Logo Header (abaikan gambar loading="lazy" agar tidak memicu false alarm saat lazy-loading)
            const headerLogo = document.querySelector('header img');
            if (headerLogo && (!headerLogo.complete || headerLogo.naturalWidth === 0)) {
                if (checkAttempts < maxAttempts) {
                    return setTimeout(verifyAllAssets, 100);
                }
                // Jika logo header rusak total, tetap buka halaman agar pengguna tidak terkunci
                revealPage();
                return;
            }

            // Jika seluruh verifikasi kritis lulus, langsung buka halaman!
            revealPage();

        } catch (err) {
            if (checkAttempts < maxAttempts) {
                setTimeout(verifyAllAssets, 100);
            } else {
                revealPage(); // Safety fallback: jangan kunci layar jika ada exception ringan browser
            }
        }
    }

    // Jalankan verifikasi saat window load (atau segera jika DOM sudah ready)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        verifyAllAssets();
    } else {
        window.addEventListener('load', verifyAllAssets);
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(verifyAllAssets, 150);
        });
    }
})();
