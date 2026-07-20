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

    // Testimonial Carousel Logic - WCAG 2.1 AA Accessible & Mobile/Desktop Optimized
    const track = document.getElementById('testimonial-track');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    if (track && btnPrev && btnNext) {
        let currentIndex = 0;
        let autoPlayTimer;
        let startX = 0;
        let isSwiping = false;
        let isTransitioning = false;
        
        // Store original items
        const originalItems = Array.from(track.children);
        const totalOriginal = originalItems.length;
        
        // Clone all items and append to end (sembunyikan dari screen reader & keyboard tabbing)
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('cloned');
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button, input, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
            track.appendChild(clone);
        });
        
        // Clone all items and prepend to beginning
        [...originalItems].reverse().forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('cloned');
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button, input, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
            track.insertBefore(clone, track.firstChild);
        });
        
        // Start at the first real item (after prepended clones)
        currentIndex = totalOriginal;
        
        const getMetrics = () => {
            const totalItems = track.children.length;
            let itemsPerView = 1;
            if (window.innerWidth >= 1024) itemsPerView = 3;
            else if (window.innerWidth >= 768) itemsPerView = 2;
            const itemWidth = 100 / itemsPerView;
            return { totalItems, itemsPerView, itemWidth };
        };

        const updateCarousel = (animate = true) => {
            const { itemWidth, itemsPerView } = getMetrics();
            const indicator = document.getElementById('testimonial-indicator');
            const activeIndex = ((currentIndex - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;
            
            if (indicator && totalOriginal) {
                indicator.textContent = `${activeIndex + 1} / ${totalOriginal}`;
            }
            
            if (animate) {
                track.style.transition = 'transform 500ms ease-in-out';
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(-${currentIndex * itemWidth}%)`;

            // ✅ OPTIMASI AKSESIBILITAS (a11y Viewport Visibility & Focus Trap Prevention):
            // Atur aria-hidden & tabindex hanya untuk item asli yang sedang terlihat di layar
            originalItems.forEach((item, idx) => {
                const isVisible = (idx >= activeIndex && idx < activeIndex + itemsPerView) || 
                                  (activeIndex + itemsPerView > totalOriginal && idx < (activeIndex + itemsPerView) % totalOriginal);
                
                if (isVisible) {
                    item.setAttribute('aria-hidden', 'false');
                    item.querySelectorAll('a, button, input').forEach(el => el.removeAttribute('tabindex'));
                } else {
                    item.setAttribute('aria-hidden', 'true');
                    item.querySelectorAll('a, button, input').forEach(el => el.setAttribute('tabindex', '-1'));
                }
            });
        };

        // Handle seamless infinite loop
        track.addEventListener('transitionend', () => {
            isTransitioning = false;
            
            if (currentIndex >= totalOriginal * 2) {
                currentIndex = totalOriginal;
                updateCarousel(false);
            } else if (currentIndex < totalOriginal) {
                currentIndex = totalOriginal * 2 - 1;
                updateCarousel(false);
            }
        });

        btnNext.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            track.setAttribute('aria-live', 'polite');
            currentIndex++;
            updateCarousel();
        });

        btnPrev.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            track.setAttribute('aria-live', 'polite');
            currentIndex--;
            updateCarousel();
        });

        // Touch swipe support with real-time tracking
        let currentTranslateX = 0;
        let startTranslateX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            const { itemWidth } = getMetrics();
            startTranslateX = -(currentIndex * itemWidth);
            track.style.transition = 'none';
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const { itemWidth } = getMetrics();
            const trackWidth = track.offsetWidth;
            const pixelDiff = (diff / trackWidth) * 100;
            currentTranslateX = startTranslateX + pixelDiff;
            track.style.transform = `translateX(${currentTranslateX}%)`;
            if (Math.abs(diff) > 10 && e.cancelable) {
                e.preventDefault();
            }
        }, { passive: false });

        track.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (isTransitioning) return;
                isTransitioning = true;
                track.setAttribute('aria-live', 'polite');
                if (diff > 0) currentIndex++;
                else currentIndex--;
            }
            updateCarousel();
            isSwiping = false;
        });

        // Mouse drag support with real-time tracking
        let mouseDown = false;
        let mouseStartX = 0;
        let mouseStartTranslateX = 0;
        
        track.addEventListener('mousedown', (e) => { 
            mouseDown = true; 
            mouseStartX = e.clientX;
            const { itemWidth } = getMetrics();
            mouseStartTranslateX = -(currentIndex * itemWidth);
            track.style.transition = 'none';
            track.style.cursor = 'grabbing';
            if (e.cancelable) e.preventDefault();
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            const currentX = e.clientX;
            const diff = currentX - mouseStartX;
            const trackWidth = track.offsetWidth;
            const pixelDiff = (diff / trackWidth) * 100;
            currentTranslateX = mouseStartTranslateX + pixelDiff;
            track.style.transform = `translateX(${currentTranslateX}%)`;
        });
        
        track.addEventListener('mouseup', (e) => {
            if (!mouseDown) return;
            const diff = mouseStartX - e.clientX;
            
            if (Math.abs(diff) > 50) {
                if (isTransitioning) return;
                isTransitioning = true;
                track.setAttribute('aria-live', 'polite');
                if (diff > 0) currentIndex++;
                else currentIndex--;
            }
            updateCarousel();
            mouseDown = false;
            track.style.cursor = 'grab';
        });
        
        track.addEventListener('mouseleave', () => { 
            if (mouseDown) {
                updateCarousel();
                mouseDown = false;
            }
            track.style.cursor = 'grab'; 
        });
        track.style.cursor = 'grab';

        // Resize handler
        window.addEventListener('resize', () => updateCarousel(false));
        updateCarousel(false);

        // Autoplay logic & Accessibility Focus Management
        const startAutoPlay = () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex++;
                updateCarousel();
            }, 6000);
        };
        const stopAutoPlay = () => clearInterval(autoPlayTimer);
        startAutoPlay();

        const carouselContainer = document.getElementById('testimonial-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                stopAutoPlay();
                track.setAttribute('aria-live', 'polite');
            });
            carouselContainer.addEventListener('mouseleave', () => {
                if (!carouselContainer.contains(document.activeElement)) {
                    startAutoPlay();
                    track.setAttribute('aria-live', 'off');
                }
            });
            carouselContainer.addEventListener('focusin', () => {
                stopAutoPlay();
                track.setAttribute('aria-live', 'polite');
            });
            carouselContainer.addEventListener('focusout', (e) => {
                if (!carouselContainer.contains(e.relatedTarget)) {
                    startAutoPlay();
                    track.setAttribute('aria-live', 'off');
                }
            });
            carouselContainer.addEventListener('touchstart', () => {
                stopAutoPlay();
                track.setAttribute('aria-live', 'polite');
            }, { passive: true });
            carouselContainer.addEventListener('touchend', () => {
                setTimeout(() => {
                    if (!carouselContainer.contains(document.activeElement)) {
                        startAutoPlay();
                        track.setAttribute('aria-live', 'off');
                    }
                }, 4000);
            });

            // ✅ AKSESIBILITAS KEYBOARD (Navigasi Tombol Panah Kiri/Kanan):
            carouselContainer.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    stopAutoPlay();
                    btnNext.click();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    stopAutoPlay();
                    btnPrev.click();
                }
            });
        }
    }

    // Accordion Peminatan/Konsentrasi (tertutup default, keyboard accessible)
    const concHeaders = document.querySelectorAll('.conc-header');
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
        const modalPrev = document.getElementById('modal-prev');
        const modalNext = document.getElementById('modal-next');
        const modalCounter = document.getElementById('modal-counter');
        const modalNav = document.getElementById('modal-nav');

        let currentGroup = '';
        let currentIndex = 0;
        let currentGroupImages = [];

        // Helper label kategori badge
        const getGroupLabel = (group) => {
            const map = {
                'fasilitas': 'Fasilitas Fakultas',
                'kegiatan': 'Galeri Kegiatan',
                'prestasi': 'Prestasi Mahasiswa',
                'dosen': 'Profil Pengajar',
                'alumni': 'Tracer Alumni',
                'prodi': 'Program Studi',
                'testimoni': 'Testimoni Alumni',
                'organisasi': 'Struktur Organisasi'
            };
            return map[group.toLowerCase()] || 'Dokumentasi FSTI';
        };

        // Helper update konten modal
        const updateModalContent = (imgElement) => {
            const fullSrc = imgElement.getAttribute('data-modal-image') || imgElement.src;
            const caption = imgElement.getAttribute('data-modal-caption') || imgElement.alt || 'Dokumentasi FSTI UWG';
            const desc = imgElement.getAttribute('data-modal-desc') || '';
            const group = imgElement.getAttribute('data-group') || 'lainnya';

            if (modalImage) {
                modalImage.style.opacity = '0';
                modalImage.src = fullSrc;
                modalImage.onload = () => { modalImage.style.opacity = '1'; };
            }
            if (modalCaption) modalCaption.textContent = caption;
            if (modalCategory) modalCategory.textContent = getGroupLabel(group);
            
            if (modalDesc) {
                modalDesc.textContent = desc;
                if (modalDescArea) {
                    modalDescArea.style.display = desc.trim() ? 'block' : 'none';
                }
            }
        };

        // Fungsi untuk membuka modal
        const openImageModal = (imgElement) => {
            updateModalContent(imgElement);

            const group = imgElement.getAttribute('data-group') || 'lainnya';
            currentGroup = group;
            currentGroupImages = Array.from(
                document.querySelectorAll(`img[data-modal="true"][data-group="${group}"]`)
            );

            currentIndex = currentGroupImages.indexOf(imgElement);

            const showNav = currentGroupImages.length > 1;
            if (modalNav) modalNav.style.display = showNav ? 'flex' : 'none';
            if (modalCounter) modalCounter.textContent = showNav ? `Foto ${currentIndex + 1} dari ${currentGroupImages.length}` : '';

            imageModal.classList.remove('hidden');
            imageModal.classList.add('flex');
            imageModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            if (window.lucide) {
                try { lucide.createIcons(); } catch (err) {}
            }

            requestAnimationFrame(() => {
                if (modalPanel) {
                    modalPanel.classList.remove('scale-95', 'opacity-0');
                    modalPanel.classList.add('scale-100', 'opacity-100');
                }
            });
        };

        // Fungsi menutup modal
        const closeImageModal = () => {
            if (modalPanel) {
                modalPanel.classList.remove('scale-100', 'opacity-100');
                modalPanel.classList.add('scale-95', 'opacity-0');
            }
            imageModal.setAttribute('aria-hidden', 'true');

            setTimeout(() => {
                imageModal.classList.remove('flex');
                imageModal.classList.add('hidden');
                document.body.style.overflow = '';
                if (modalImage) modalImage.src = '';
            }, 250);
        };

        // Navigasi Prev
        const goToPrev = () => {
            if (!currentGroupImages.length) return;
            currentIndex = (currentIndex - 1 + currentGroupImages.length) % currentGroupImages.length;
            const prevImg = currentGroupImages[currentIndex];
            updateModalContent(prevImg);
            if (modalCounter) modalCounter.textContent = `Foto ${currentIndex + 1} dari ${currentGroupImages.length}`;
        };

        // Navigasi Next
        const goToNext = () => {
            if (!currentGroupImages.length) return;
            currentIndex = (currentIndex + 1) % currentGroupImages.length;
            const nextImg = currentGroupImages[currentIndex];
            updateModalContent(nextImg);
            if (modalCounter) modalCounter.textContent = `Foto ${currentIndex + 1} dari ${currentGroupImages.length}`;
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
            modalClose.addEventListener('click', closeImageModal);
        }

        // Klik di luar modal panel untuk close
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.id === 'image-modal-backdrop') {
                closeImageModal();
            }
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!imageModal.classList.contains('flex')) return;

            if (e.key === 'Escape') {
                closeImageModal();
            } else if (e.key === 'ArrowLeft' && modalPrev) {
                goToPrev();
            } else if (e.key === 'ArrowRight' && modalNext) {
                goToNext();
            }
        });

        // Tombol Prev & Next
        if (modalPrev) modalPrev.addEventListener('click', goToPrev);
        if (modalNext) modalNext.addEventListener('click', goToNext);
    }

});
