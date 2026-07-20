window.FSTIScriptLoaded = true;
document.addEventListener('DOMContentLoaded', () => {
    // ✅ PWA SERVICE WORKER REGISTRATION (Offline Cache API):
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swPath = window.location.pathname.includes('prodi/') ? '../service-worker.js' : 'service-worker.js';
            navigator.serviceWorker.register(swPath).catch(() => {});
        });
    }

    // ✅ OPTIMASI BACK-FORWARD CACHE (bfcache) & HASH CHANGE:
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            // Jika halaman dipulihkan dari memori cache browser saat tombol Back/Forward ditekan
            const guard = document.getElementById('fsti-asset-guard');
            if (guard && !guard.classList.contains('guard-failed')) {
                guard.style.display = 'none';
                guard.style.opacity = '0';
            }
            // Bersihkan sisa overflow-hidden jika pengguna menekan Back saat modal/mobile menu terbuka
            document.body.classList.remove('overflow-hidden');
            document.body.style.overflow = '';
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('menu-btn');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                if (menuBtn) {
                    menuBtn.setAttribute('aria-expanded', 'false');
                    menuBtn.innerHTML = '<i data-lucide="menu" class="w-8 h-8"></i>';
                    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
                }
            }
        }
    });

    window.addEventListener('popstate', () => {
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target && typeof smoothScrollTo === 'function') {
                smoothScrollTo(target);
            }
        }
    });

    // Inisialisasi Ikon Lokal Lucide
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const open = mobileMenu.classList.toggle('hidden') === false;
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuBtn.innerHTML = open ? '<i data-lucide="x" class="w-8 h-8"></i>' : '<i data-lucide="menu" class="w-8 h-8"></i>';
            if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        });
    }

    // Mobile accordion submenus
    document.querySelectorAll('.mobile-acc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-acc');
            const panel = id ? document.getElementById(id) : null;
            if (!panel) return;
            const isHidden = panel.classList.contains('hidden');
            // close other panels
            document.querySelectorAll('[id^="m-"]').forEach(p => p.classList.add('hidden'));
            document.querySelectorAll('.mobile-acc-btn svg').forEach(svg => svg.classList.remove('rotate-180'));
            if (isHidden) {
                panel.classList.remove('hidden');
                const svg = btn.querySelector('svg');
                if (svg) svg.classList.add('rotate-180');
            }
        });
    });

    // Navigasi dropdown: klik, keyboard, dan klik di luar
    document.querySelectorAll('header .group').forEach(group => {
        const btn = group.querySelector('button');
        const panel = group.querySelector('.absolute');
        if (!btn || !panel) return;

        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');

        const setOpen = (open) => {
            group.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            setOpen(!group.classList.contains('open'));
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstLink = panel.querySelector('a');
                if (firstLink) firstLink.focus();
            } else if (e.key === 'Escape') {
                setOpen(false);
                btn.focus();
            }
        });

        group.addEventListener('focusout', (e) => {
            if (!group.contains(e.relatedTarget)) setOpen(false);
        });
    });

    document.addEventListener('click', (e) => {
        document.querySelectorAll('header .group.open').forEach(group => {
            if (!group.contains(e.target)) {
                group.classList.remove('open');
                const b = group.querySelector('button');
                if (b) b.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Enhanced Smooth Scroll for in-page anchors with custom easing animation
    const smoothScrollTo = (targetElement) => {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000; // 1 second animation
        let start = null;
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function (easeInOutCubic)
            const easeInOutCubic = percentage < 0.5
                ? 4 * percentage * percentage * percentage
                : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // ✅ AKSESIBILITAS: Skip-to-Content — pindahkan fokus langsung ke konten utama
                // tanpa animasi scroll panjang agar pengguna keyboard/screen reader efisien
                if (this.classList.contains('skip-link')) {
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                    const hdrH = document.querySelector('header')?.offsetHeight || 80;
                    window.scrollTo(0, target.getBoundingClientRect().top + window.pageYOffset - hdrH + 8);
                    return;
                }

                // ✅ OPTIMASI RIWAYAT BROWSER (Back/Forward History Sync):
                // Catat perubahan hash di dalam window.history agar tombol Back/Forward browser bekerja presisi
                if (window.location.hash !== href) {
                    try { history.pushState(null, '', href); } catch(err){}
                }
                
                smoothScrollTo(target);
                
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.innerHTML = '<i data-lucide="menu" class="w-8 h-8"></i>'; if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons(); }
                }
            }
        });
    });

    // Counter Animation for Statistics
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'), 10);
                const suffix = counter.getAttribute('data-suffix') || '';
                
                if (isNaN(target)) return;
                
                const duration = 2000; // 2 seconds
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out cubic for smooth deceleration
                    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(easeOutCubic * target);
                    
                    counter.textContent = current.toLocaleString() + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.textContent = target.toLocaleString() + suffix;
                    }
                };
                
                requestAnimationFrame(animate);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    // Simple and reliable reveal animation
    const revealElements = document.querySelectorAll('.reveal, .reveal-fade-up');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.01,
            rootMargin: '0px 0px -10px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for old browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // Testimonial Carousel — CSS Scroll Snap + Minimal JS
    const track = document.getElementById('testimonial-track');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const pagination = document.getElementById('testimonial-pagination');

    if (track && btnPrev && btnNext && pagination) {
        const slides = Array.from(track.querySelectorAll('[role="group"][aria-roledescription="slide"]'));
        const totalSlides = slides.length;
        let currentIndex = 0;

        // Create pagination dots
        slides.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-label', `Testimoni ${i + 1} dari ${totalSlides}`);
            btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            btn.addEventListener('click', () => goToSlide(i));
            pagination.appendChild(btn);
        });

        const dots = Array.from(pagination.querySelectorAll('button'));

        function updateDots(index) {
            dots.forEach((dot, i) => {
                dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
            });
        }

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            const slide = slides[index];
            if (slide) {
                const slideRect = slide.getBoundingClientRect();
                const trackRect = track.getBoundingClientRect();
                const slideCenter = slideRect.left + slideRect.width / 2;
                const trackCenter = trackRect.left + trackRect.width / 2;
                const offset = slideCenter - trackCenter;
                const targetScrollLeft = track.scrollLeft + offset;
                
                track.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
            }
            updateDots(index);
        }

        // Navigation buttons
        btnNext.addEventListener('click', () => goToSlide(currentIndex + 1));
        btnPrev.addEventListener('click', () => goToSlide(currentIndex - 1));

        // Keyboard navigation
        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToSlide(currentIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToSlide(currentIndex - 1);
            }
        });

        // Sync dots on manual scroll / swipe or smooth scroll using requestAnimationFrame for accuracy & performance
        function syncDots() {
            const trackRect = track.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;
            let closestIndex = currentIndex;
            let minDistance = Infinity;

            slides.forEach((slide, index) => {
                const slideRect = slide.getBoundingClientRect();
                const slideCenter = slideRect.left + slideRect.width / 2;
                const distance = Math.abs(slideCenter - trackCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            if (currentIndex !== closestIndex) {
                currentIndex = closestIndex;
                updateDots(currentIndex);
            }
        }

        let isScrolling = false;
        track.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    syncDots();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }
    // Accordion Peminatan/Konsentrasi (tertutup default, keyboard accessible)
    const concHeaders = document.querySelectorAll('.concentration-card .conc-header');
    if (concHeaders.length) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const openConc = (card, header) => {
            const body = card.querySelector('.concentration-body-card');
            card.classList.add('open'); header.setAttribute('aria-expanded', 'true');
            if (!body) return;
            clearTimeout(card._concTimer);
            if (reduceMotion) { body.style.maxHeight = ''; return; }
            body.style.maxHeight = ''; const full = body.offsetHeight;
            body.style.maxHeight = '0px'; void body.offsetHeight; body.style.maxHeight = full + 'px';
            card._concTimer = setTimeout(() => { if (card.classList.contains('open')) body.style.maxHeight = ''; }, 450);
        };
        const closeConc = (card, header) => {
            const body = card.querySelector('.concentration-body-card');
            header.setAttribute('aria-expanded', 'false'); clearTimeout(card._concTimer);
            if (!body || reduceMotion) { card.classList.remove('open'); if (body) body.style.maxHeight = ''; return; }
            body.style.maxHeight = body.offsetHeight + 'px'; void body.offsetHeight;
            card.classList.remove('open'); body.style.maxHeight = '0px';
        };
        concHeaders.forEach((header, idx) => {
            const card = header.closest('.concentration-card'); if (!card) return;
            const body = card.querySelector('.concentration-body-card');
            const bodyId = body ? (body.id || `conc-body-${idx}`) : null;
            if (body && !body.id) body.id = bodyId;
            header.setAttribute('role', 'button'); header.setAttribute('tabindex', '0');
            header.setAttribute('aria-expanded', card.classList.contains('open') ? 'true' : 'false');
            if (bodyId) header.setAttribute('aria-controls', bodyId);
            const toggle = () => {
                document.querySelectorAll('.concentration-card.open').forEach(c => { if (c !== card) { const h = c.querySelector('.conc-header'); if (h) closeConc(c, h); } });
                if (card.classList.contains('open')) closeConc(card, header); else openConc(card, header);
            };
            header.addEventListener('click', toggle);
            header.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
        });
    }

    // console.log('FSTI UWG Website Loaded Successfully');

    // =====================================================
    // IMAGE MODAL UNIVERSAL (Semua Foto dengan Caption)
    // =====================================================
    // IMAGE MODAL UNIVERSAL — Option B: Clean FSTI White Card
    // =====================================================
    const imageModal = document.getElementById('image-modal');
    
    if (imageModal) {
        const modalPanel = document.getElementById('image-modal-panel') || imageModal.querySelector('.modal-content');
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const modalCategory = document.getElementById('modal-category');
        const modalDesc = document.getElementById('modal-desc');
        const modalDescArea = document.getElementById('modal-desc-area');
        const modalClose = document.getElementById('modal-close');
        // Helper label kategori badge + konteks lokasi halaman/seksi
        const getGroupLabel = (group, imgElement) => {
            const baseMap = {
                'fasilitas': 'Fasilitas Fakultas',
                'kegiatan': 'Galeri Kegiatan',
                'prestasi': 'Prestasi Mahasiswa',
                'dosen': 'Profil Pengajar',
                'alumni': 'Tracer Alumni',
                'prodi': 'Program Studi',
                'testimoni': 'Testimoni Alumni',
                'organisasi': 'Struktur Organisasi'
            };
            const baseLabel = baseMap[group.toLowerCase()] || 'Dokumentasi FSTI';

            // Deteksi konteks halaman dari URL
            const path = window.location.pathname;
            let pageContext = '';
            if (path.includes('/alumni.html') || path.endsWith('/alumni')) pageContext = 'Halaman Alumni';
            else if (path.includes('/direktori-dosen.html') || path.endsWith('/direktori-dosen')) pageContext = 'Direktori Dosen';
            else if (path.includes('/tentang.html') || path.endsWith('/tentang')) pageContext = 'Tentang Fakultas';
            else if (path.includes('/prodi/')) pageContext = 'Halaman Program Studi';
            else if (path.includes('/index.html') || path === '/' || path.endsWith('/')) pageContext = 'Beranda';
            else if (path.includes('/pmb.html')) pageContext = 'PMB';
            else if (path.includes('/pusat-unduhan.html')) pageContext = 'Pusat Unduhan';

            // Deteksi seksi terdekat (heading terdekat di atas gambar)
            let sectionContext = '';
            if (imgElement) {
                const sectionHeading = imgElement.closest('section, main, article, div[class*="reveal"], div[id]');
                if (sectionHeading) {
                    const heading = sectionHeading.querySelector('h2, h3, h4, [class*="section-title"] h2, [class*="section-title"] h3');
                    if (heading) {
                        const text = heading.textContent.trim();
                        if (text && text.length < 60) sectionContext = text;
                    }
                }
            }

            // Gabungkan: prioritas data-section (explicit) > sectionContext > pageContext
            const explicitSection = imgElement?.getAttribute('data-section');
            const contextParts = [];
            if (explicitSection) contextParts.push(explicitSection);
            else if (sectionContext) contextParts.push(sectionContext);
            else if (pageContext) contextParts.push(pageContext);

            return contextParts.length > 0
                ? `${baseLabel} — ${contextParts.join(' › ')}`
                : baseLabel;
        };

        // Helper update konten modal
        const updateModalContent = (imgElement) => {
            const fullSrc = imgElement.getAttribute('data-modal-image') || imgElement.src;
            const caption = imgElement.getAttribute('data-modal-caption') || imgElement.alt || 'Dokumentasi FSTI UWG';
            const desc = imgElement.getAttribute('data-modal-desc') || '';
            const group = imgElement.getAttribute('data-group') || 'lainnya';
            const explicitSection = imgElement.getAttribute('data-section') || '';

            if (modalPanel) {
                modalPanel.style.maxWidth = '880px'; // Reset ke max-width wide default saat mengganti gambar
            }

            if (modalImage) {
                modalImage.style.opacity = '0';
                modalImage.src = fullSrc;
                // Set alt dinamis untuk aksesibilitas
                modalImage.alt = caption;
                modalImage.onload = () => {
                    modalImage.style.opacity = '1';
                    
                    // Hitung aspect ratio gambar secara dinamis
                    const width = modalImage.naturalWidth || 1;
                    const height = modalImage.naturalHeight || 1;
                    const aspectRatio = width / height;

                    if (modalPanel) {
                        // Ambil tinggi layar saat ini
                        const viewportHeight = window.innerHeight;
                        // Gambar dibatasi max-height 58vh di CSS (0.58 * viewportHeight)
                        const maxImgHeightPx = viewportHeight * 0.58;
                        
                        // Hitung lebar ideal agar modal pas membungkus lebar gambar yang proporsional secara presisi tanpa sisa kiri/kanan
                        let idealWidth = maxImgHeightPx * aspectRatio;
                        
                        // Batasi lebar ideal di rentang yang estetis (min 340px agar header & nav tidak terpotong, max 880px untuk desktop)
                        let finalWidth = Math.max(340, Math.min(880, idealWidth));
                        
                        modalPanel.style.maxWidth = `${finalWidth}px`;
                    }
                };
                // Fallback jika gambar sudah tersimpan dalam cache browser
                if (modalImage.complete && modalImage.naturalWidth) {
                    modalImage.onload();
                }
            }
            if (modalCaption) modalCaption.textContent = caption;
            if (modalCategory) modalCategory.textContent = getGroupLabel(group, imgElement);
            
            if (modalDesc) {
                // Gunakan deskripsi asli tanpa tambahan "Lokasi" (badge sudah menampilkan konteks)
                modalDesc.textContent = desc;
                if (modalDescArea) {
                    modalDescArea.style.display = desc.trim() ? 'block' : 'none';
                }
            }
        };

        // Fungsi untuk membuka modal
        const openImageModal = (imgElement) => {
            // Simpan tombol pemicu untuk pemulihan fokus a11y
            window._lastImageModalTriggerBtn = document.activeElement;

            updateModalContent(imgElement);


            imageModal.classList.remove('hidden');
            imageModal.classList.add('flex');
            imageModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Pindahkan fokus ke tombol close demi aksesibilitas keyboard (a11y)
            if (modalClose) {
                modalClose.focus();
            }

            if (window.lucide) {
                try { lucide.createIcons(); } catch (err) {}
            }

            // Integrasi pushState untuk tombol Back fisik browser di HP
            window.history.pushState({ imageModalOpen: true }, '');
            window._imageModalHistoryPushed = true;

            requestAnimationFrame(() => {
                if (modalPanel) {
                    modalPanel.classList.remove('scale-95', 'opacity-0');
                    modalPanel.classList.add('scale-100', 'opacity-100');
                }
            });
        };

        // Fungsi menutup modal
        const closeImageModal = (byPopState = false) => {
            if (modalPanel) {
                modalPanel.classList.remove('scale-100', 'opacity-100');
                modalPanel.classList.add('scale-95', 'opacity-0');
            }

            // Lepaskan fokus dari tombol di dalam modal sebelum aria-hidden diaktifkan (menghindari peringatan a11y)
            if (document.activeElement && imageModal.contains(document.activeElement)) {
                document.activeElement.blur();
            }

            imageModal.setAttribute('aria-hidden', 'true');

            setTimeout(() => {
                imageModal.classList.remove('flex');
                imageModal.classList.add('hidden');
                document.body.style.overflow = '';
                if (modalImage) modalImage.src = '';
            }, 250);

            // Kembalikan fokus ke tombol pemicu awal jika ada
            if (window._lastImageModalTriggerBtn) {
                window._lastImageModalTriggerBtn.focus();
                window._lastImageModalTriggerBtn = null;
            }

            // Kembalikan status history jika ditutup manual (bukan via tombol Back)
            if (!byPopState && window._imageModalHistoryPushed) {
                window.history.back();
                window._imageModalHistoryPushed = false;
            }
        };

        // Event Delegation untuk semua gambar dengan data-modal="true"
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'IMG' && target.hasAttribute('data-modal') && target.getAttribute('data-modal') === 'true') {
                e.preventDefault();
                openImageModal(target);
            }
        });

        // Tombol Close
        if (modalClose) {
            modalClose.addEventListener('click', () => closeImageModal(false));
        }

        // Klik di luar modal panel untuk close
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.id === 'image-modal-backdrop') {
                closeImageModal(false);
            }
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!imageModal.classList.contains('flex')) return;

            if (e.key === 'Escape') {
                closeImageModal(false);
            }
        });


        // Handler untuk event popstate (tombol Back fisik browser)
        window.addEventListener('popstate', () => {
            if (window._imageModalHistoryPushed || !imageModal.classList.contains('hidden')) {
                closeImageModal(true);
                window._imageModalHistoryPushed = false;
            }
        });
    }

});
