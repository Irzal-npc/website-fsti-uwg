/**
 * FSTI UWG Malang - Util Tabel Agregat (v1)
 * Helper bersama untuk halaman Penelitian, Pengabdian, Kerjasama, dan Prestasi:
 * 1. esc()          - Escape entitas HTML agar data aman dirender.
 * 2. toast()        - Notifikasi mini melayang (status/aria-live) saat aksi berhasil/gagal.
 * 3. copyText()     - Salin teks ke clipboard (Clipboard API + fallback execCommand).
 * 4. Delegasi klik global untuk seluruh tombol [data-copy-text]:
 *    otomatis menyalin isi atribut, menukar ikon copy -> check, dan menampilkan toast.
 * Terpapar sebagai window.FSTITabel.
 */
(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* ---------- Toast ---------- */
    var toastTimer = null;
    function toast(message, ok) {
        var el = document.getElementById('fsti-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'fsti-toast';
            el.setAttribute('role', 'status');
            el.setAttribute('aria-live', 'polite');
            el.className = 'fixed left-1/2 bottom-6 -translate-x-1/2 z-[99998] px-5 py-3 rounded-xl bg-[#1A1026] text-white text-sm font-semibold shadow-2xl border border-white/10 flex items-center gap-2.5 transition-all duration-300 opacity-0 translate-y-4 pointer-events-none max-w-[90vw]';
            document.body.appendChild(el);
        }
        if (ok === false) {
            el.innerHTML = '<i data-lucide="info" class="w-4 h-4 flex-shrink-0 text-[#FCA5A5]"></i><span></span>';
        } else {
            el.innerHTML = '<i data-lucide="circle-check-big" class="w-4 h-4 flex-shrink-0 text-[#4ADE80]"></i><span></span>';
        }
        el.querySelector('span').textContent = message;
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        requestAnimationFrame(function () {
            el.classList.remove('opacity-0', 'translate-y-4');
        });
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            el.classList.add('opacity-0', 'translate-y-4');
        }, 2200);
    }

    /* ---------- Clipboard ---------- */
    function fallbackCopy(text) {
        try {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            ta.style.top = '0';
            document.body.appendChild(ta);
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            var ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch (e) {
            return false;
        }
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).then(function () {
                return true;
            }).catch(function () {
                return fallbackCopy(text);
            });
        }
        return Promise.resolve(fallbackCopy(text));
    }

    /* ---------- Delegasi tombol salin ---------- */
    function swapIcon(btn) {
        if (btn.dataset.swapLock) return;
        btn.dataset.swapLock = '1';
        var original = btn.innerHTML;
        btn.classList.add('fsti-copy-ok');
        btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        setTimeout(function () {
            btn.innerHTML = original;
            btn.classList.remove('fsti-copy-ok');
            delete btn.dataset.swapLock;
            if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        }, 1600);
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('[data-copy-text]') : null;
        if (!btn) return;
        e.preventDefault();
        var text = btn.getAttribute('data-copy-text') || '';
        if (!text.trim()) return;
        copyText(text).then(function (ok) {
            toast(ok ? 'Tersalin ke clipboard' : 'Gagal menyalin teks', ok);
            if (ok) swapIcon(btn);
        });
    });

    window.FSTITabel = { esc: esc, toast: toast, copyText: copyText };
})();
