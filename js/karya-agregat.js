/**
 * FSTI UWG Malang - Mesin Tabel Agregat Karya Dosen (v1)
 * Merender agregasi SELURUH karya dosen (jenis: "Penelitian" / "Pengabdian Masyarakat")
 * dari pangkalan data window.FSTI_DOSEN ke dalam satu halaman tampilan tabel.
 *
 * Konfigurasi per halaman (didefinisikan inline SEBELUM skrip ini dimuat):
 *   window.FSTI_KARYA_PAGE = { jenis: 'Penelitian', labelJenis: 'penelitian' }
 *
 * Fitur:
 * - Filter berdasarkan nama dosen (dropdown berisi seluruh dosen FSTI yang punya karya).
 * - Pencarian bebas (judul / nama dosen / prodi / tahun).
 * - Sorting berdasarkan tahun (klik kepala kolom "Tahun" atau pilihan sortir), plus Judul & Dosen A-Z.
 * - Muat bertahap (60 baris sekali tampil) + tombol "Muat Lebih Banyak" / "Tampilkan Semua".
 * - Tombol ikon salin di setiap baris (format sitasi siap tempel) via js/util-tabel.js.
 */
(function () {
    'use strict';

    function initKaryaAgregat() {
        var cfg = window.FSTI_KARYA_PAGE || {};
        var dosen = window.FSTI_DOSEN;
        var U = window.FSTITabel;
        if (!cfg.jenis || !Array.isArray(dosen) || !U) return;

        var $ = function (id) { return document.getElementById(id); };
        var els = {
            search: $('karya-search'),
            dosen: $('karya-dosen'),
            sort: $('karya-sort'),
            reset: $('karya-reset'),
            tbody: $('karya-tbody'),
            count: $('karya-count'),
            empty: $('karya-empty'),
            cardWrap: $('karya-card-wrap'),
            moreWrap: $('karya-more-wrap'),
            moreBtn: $('karya-more'),
            allBtn: $('karya-all'),
            statEntri: $('stat-total-entri'),
            statDosen: $('stat-total-dosen'),
            statTahun: $('stat-total-tahun'),
            thTahun: $('karya-th-tahun'),
            thTahunBtn: $('karya-th-tahun-btn')
        };
        if (!els.tbody) return;

        var PAGE_SIZE = 60;

        /* ---------- 1. Ratakan (flatten) karya seluruh dosen jadi baris agregat ---------- */
        var rows = [];
        dosen.forEach(function (d) {
            (Array.isArray(d.karya) ? d.karya : []).forEach(function (k) {
                if (k.jenis !== cfg.jenis) return;
                var judul = String(k.judul || '').trim();
                if (!judul) return;
                var tahunRaw = String(k.tahun || '').trim();
                var tahun = /^\d{4}$/.test(tahunRaw) ? parseInt(tahunRaw, 10) : null;
                rows.push({
                    judul: judul,
                    tahun: tahun,
                    tahunRaw: tahunRaw,
                    dosen: String(d.name || ''),
                    prodi: String(d.prodiLabel || ''),
                    db: String(k.db || '').trim(),
                    link: String(k.link || '').trim()
                });
            });
        });

        /* ---------- 2. Statistik ringkas (dihitung dari data agar selalu sinkron) ---------- */
        var dosenSet = {};
        rows.forEach(function (r) { dosenSet[r.dosen] = true; });
        var tahunVals = rows.map(function (r) { return r.tahun; }).filter(function (t) { return t != null; });
        if (els.statEntri) els.statEntri.textContent = rows.length.toLocaleString('id-ID');
        if (els.statDosen) els.statDosen.textContent = Object.keys(dosenSet).length.toLocaleString('id-ID');
        if (els.statTahun) {
            els.statTahun.textContent = tahunVals.length
                ? Math.min.apply(null, tahunVals) + ' – ' + Math.max.apply(null, tahunVals)
                : '—';
        }

        /* ---------- 3. Isi dropdown filter nama dosen (A-Z + jumlah karya) ---------- */
        if (els.dosen) {
            var counts = {};
            rows.forEach(function (r) { counts[r.dosen] = (counts[r.dosen] || 0) + 1; });
            var names = Object.keys(counts).sort(function (a, b) { return a.localeCompare(b, 'id'); });
            var opts = ['<option value="">Semua Dosen (' + names.length + ')</option>'];
            names.forEach(function (n) {
                opts.push('<option value="' + U.esc(n) + '">' + U.esc(n) + ' (' + counts[n] + ')</option>');
            });
            els.dosen.innerHTML = opts.join('');
        }

        /* ---------- 4. State & sortir ---------- */
        var state = { q: '', dosen: '', sort: 'tahun-desc', shown: PAGE_SIZE };
        var collator = new Intl.Collator('id', { sensitivity: 'base' });

        function comparator(a, b) {
            switch (state.sort) {
                case 'tahun-asc':
                    return ((a.tahun == null ? Infinity : a.tahun) - (b.tahun == null ? Infinity : b.tahun))
                        || collator.compare(a.judul, b.judul);
                case 'judul-asc':
                    return collator.compare(a.judul, b.judul);
                case 'dosen-asc':
                    return collator.compare(a.dosen, b.dosen) || ((b.tahun || 0) - (a.tahun || 0));
                case 'tahun-desc':
                default:
                    return ((b.tahun == null ? -Infinity : b.tahun) - (a.tahun == null ? -Infinity : a.tahun))
                        || collator.compare(a.judul, b.judul);
            }
        }

        function filtered() {
            var q = state.q.trim().toLowerCase();
            return rows.filter(function (r) {
                if (state.dosen && r.dosen !== state.dosen) return false;
                if (!q) return true;
                return (r.judul + ' ' + r.dosen + ' ' + r.prodi + ' ' + r.tahunRaw + ' ' + r.db).toLowerCase().indexOf(q) !== -1;
            }).sort(comparator);
        }

        /* ---------- 5. Render baris ---------- */
        function sitasi(r) {
            var parts = r.judul + '. ' + r.dosen + (r.tahunRaw ? ' (' + r.tahunRaw + ').' : '.');
            if (r.db) parts += ' Terindeks: ' + r.db + '.';
            if (r.link) parts += ' ' + r.link;
            return parts;
        }

        function dbChips(db) {
            if (!db) return '<span class="text-gray-400 text-xs">—</span>';
            return db.split(',').map(function (s) { return s.trim(); }).filter(Boolean).map(function (s) {
                return '<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-semibold text-[#5B2A7E] whitespace-nowrap">' + U.esc(s) + '</span>';
            }).join(' ');
        }

        function rowHtml(r, idx) {
            var linkCell = r.link
                ? '<a href="' + U.esc(r.link) + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-9 h-9 rounded-xl border-2 border-gray-200 text-[#5B2A7E] hover:border-[#F18602] hover:text-[#D97200] hover:bg-[#FFF9F2] transition-colors" aria-label="Buka tautan sumber: ' + U.esc(r.judul) + '" title="Buka tautan sumber"><i data-lucide="external-link" class="w-4 h-4"></i></a>'
                : '<span class="text-gray-400 text-xs">—</span>';
            var copyCell = '<button type="button" data-copy-text="' + U.esc(sitasi(r)) + '" class="inline-flex items-center justify-center w-9 h-9 rounded-xl border-2 border-gray-200 text-[#5B2A7E] hover:border-[#F18602] hover:text-[#D97200] hover:bg-[#FFF9F2] transition-colors cursor-pointer" aria-label="Salin sitasi: ' + U.esc(r.judul) + '" title="Salin sitasi"><i data-lucide="copy" class="w-4 h-4"></i></button>';
            return '<tr class="border-b border-gray-100 last:border-0 hover:bg-[#FFF9F2]/60 transition-colors">'
                + '<td class="py-3.5 px-4 text-xs text-gray-400 font-semibold align-top whitespace-nowrap">' + (idx + 1) + '</td>'
                + '<td class="py-3.5 px-4 align-top min-w-[280px]"><span class="font-semibold text-[#1A1026] leading-snug text-sm">' + U.esc(r.judul) + '</span></td>'
                + '<td class="py-3.5 px-4 align-top min-w-[190px]"><span class="text-sm text-[#1A1026] font-medium leading-snug">' + U.esc(r.dosen) + '</span><span class="block mt-1.5"><span class="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-[#5B2A7E] border border-purple-200 text-[10px] font-bold whitespace-nowrap">' + U.esc(r.prodi) + '</span></span></td>'
                + '<td class="py-3.5 px-4 align-top whitespace-nowrap"><span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FFF9F2] border border-[#F18602]/30 text-xs font-extrabold text-[#C2410C]">' + (r.tahun != null ? r.tahun : (r.tahunRaw ? U.esc(r.tahunRaw) : '—')) + '</span></td>'
                + '<td class="py-3.5 px-4 align-top min-w-[150px]"><div class="flex flex-wrap gap-1">' + dbChips(r.db) + '</div></td>'
                + '<td class="py-3.5 px-4 align-top text-center">' + linkCell + '</td>'
                + '<td class="py-3.5 px-4 align-top text-center">' + copyCell + '</td>'
                + '</tr>';
        }

        function refreshIcons() {
            if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        }

        function updateTahunHeader() {
            var sorted = state.sort === 'tahun-desc' || state.sort === 'tahun-asc';
            if (els.thTahun) els.thTahun.setAttribute('aria-sort', sorted ? (state.sort === 'tahun-desc' ? 'descending' : 'ascending') : 'none');
            if (els.thTahunBtn) {
                var icon = state.sort === 'tahun-asc' ? 'chevron-up' : (state.sort === 'tahun-desc' ? 'chevron-down' : 'chevrons-up-down');
                var lbl = state.sort === 'tahun-desc' ? 'terbaru ke terlama' : (state.sort === 'tahun-asc' ? 'terlama ke terbaru' : 'tidak diurutkan');
                els.thTahunBtn.innerHTML = 'Tahun <i data-lucide="' + icon + '" class="w-3.5 h-3.5"></i>';
                els.thTahunBtn.setAttribute('aria-label', 'Urutkan berdasarkan tahun (saat ini: ' + lbl + '). Klik untuk mengubah arah urutan.');
            }
        }

        function render() {
            var list = filtered();
            var visible = list.slice(0, state.shown);
            var html = '';
            visible.forEach(function (r, i) { html += rowHtml(r, i); });
            els.tbody.innerHTML = html;

            if (els.count) {
                els.count.innerHTML = list.length === 0
                    ? 'Tidak ada entri yang cocok.'
                    : 'Menampilkan <strong class="text-[#1A1026]">' + visible.length.toLocaleString('id-ID') + '</strong> dari <strong class="text-[#1A1026]">' + list.length.toLocaleString('id-ID') + '</strong> entri ' + U.esc(cfg.labelJenis || cfg.jenis) + (state.dosen ? ' oleh <strong class="text-[#1A1026]">' + U.esc(state.dosen) + '</strong>' : ' dari seluruh dosen FSTI') + '.';
            }

            var isEmpty = list.length === 0;
            if (els.empty) els.empty.classList.toggle('hidden', !isEmpty);
            if (els.cardWrap) els.cardWrap.classList.toggle('hidden', isEmpty);
            if (els.moreWrap) els.moreWrap.classList.toggle('hidden', isEmpty || visible.length >= list.length);

            updateTahunHeader();
            refreshIcons();
        }

        /* ---------- 6. Interaksi ---------- */
        if (els.search) {
            els.search.addEventListener('input', function () {
                state.q = this.value;
                state.shown = PAGE_SIZE;
                render();
            });
        }
        if (els.dosen) {
            els.dosen.addEventListener('change', function () {
                state.dosen = this.value;
                state.shown = PAGE_SIZE;
                render();
            });
        }
        if (els.sort) {
            els.sort.addEventListener('change', function () {
                state.sort = this.value;
                state.shown = PAGE_SIZE;
                render();
            });
        }
        if (els.thTahunBtn) {
            els.thTahunBtn.addEventListener('click', function () {
                state.sort = (state.sort === 'tahun-desc') ? 'tahun-asc' : 'tahun-desc';
                if (els.sort) els.sort.value = state.sort;
                render();
            });
        }
        if (els.reset) {
            els.reset.addEventListener('click', function () {
                state.q = ''; state.dosen = ''; state.sort = 'tahun-desc'; state.shown = PAGE_SIZE;
                if (els.search) els.search.value = '';
                if (els.dosen) els.dosen.value = '';
                if (els.sort) els.sort.value = 'tahun-desc';
                render();
            });
        }
        if (els.moreBtn) {
            els.moreBtn.addEventListener('click', function () {
                state.shown += PAGE_SIZE;
                render();
            });
        }
        if (els.allBtn) {
            els.allBtn.addEventListener('click', function () {
                state.shown = Infinity;
                render();
            });
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKaryaAgregat);
    } else {
        initKaryaAgregat();
    }
})();
