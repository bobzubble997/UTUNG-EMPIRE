document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Main Content Fade-in Animation ---
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('animate-in');
    }

    // --- 2. Typewriter Effect for Tagline (on index.html only) ---
    const taglineElement = document.getElementById('tagline');
    // Hanya jalankan typewriter jika elemen tagline ada dan ini adalah halaman utama
    if (taglineElement && (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html'))) {
        const taglineText = "Gerbang Informasi Intergalaksi Hubungan Hewan Peliharaan Anda."; // Menggunakan teks lengkap yang konsisten
        let charIndex = 0;
        let typingSpeed = 70; // milliseconds per character

        function typeWriter() {
            if (charIndex < taglineText.length) {
                taglineElement.textContent += taglineText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        setTimeout(typeWriter, 500); // Mulai mengetik setelah delay singkat
    }

    // --- 3. Reveal on Scroll Animation (Intersection Observer) ---
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% dari elemen terlihat
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Hentikan pengamatan setelah animasi
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // --- 4. Navigasi Toggle (Hamburger Menu) ---
    // Menggunakan ID yang konsisten dengan HTML Header baru
    const navToggle = document.getElementById('nav-toggle');
    const mainNavUl = document.querySelector('nav ul'); // Target UL di dalam NAV

    if (navToggle && mainNavUl) {
        navToggle.addEventListener('click', () => {
            mainNavUl.classList.toggle('open'); // Toggle kelas 'open' pada UL
            navToggle.classList.toggle('open'); // Toggle kelas 'open' pada tombol hamburger
        });

        // Tutup navigasi saat link diklik (untuk mobile)
        mainNavUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavUl.classList.contains('open')) {
                    mainNavUl.classList.remove('open');
                    navToggle.classList.remove('open');
                }
            });
        });
    }

    // --- 5. Smooth Scroll for Anchor Links (jika ada) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- 6. Active Nav Link Highlighting ---
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a'); // Menggunakan selektor yang lebih spesifik

    navLinks.forEach(link => {
        link.classList.remove('active'); // Hapus kelas 'active' dari semua link

        let linkHref = link.getAttribute('href');
        
        // Normalisasi linkHref untuk perbandingan
        if (linkHref === './index.html' || linkHref === 'index.html' || linkHref === '../index.html') {
            linkHref = '/index.html'; // Semua link ke root/dashboard akan jadi '/index.html'
        } else if (linkHref.startsWith('./')) {
            linkHref = '/pages/' + linkHref.substring(2); // Contoh: ./family.html -> /pages/family.html
        } else if (linkHref.startsWith('../')) {
            // Ini akan mencakup ../contributor/index.html dan ../style.css
            // Kita hanya peduli dengan HTML, jadi kita bisa filter
            if (linkHref.includes('/contributor/index.html')) {
                linkHref = '/contributor/index.html';
            } else {
                // Untuk link yang keluar folder dan bukan kontributor, misal '../images/favicon.png' atau '../style.css'
                // Kita tidak ingin mengaktifkan navigasi untuk link-link non-HTML ini
                return; 
            }
        }

        // Normalisasi currentPath untuk perbandingan
        let normalizedCurrentPath = currentPath;
        if (normalizedCurrentPath.endsWith('/')) {
            normalizedCurrentPath = normalizedCurrentPath.slice(0, -1);
        }
        if (!normalizedCurrentPath.startsWith('/')) {
            normalizedCurrentPath = '/' + normalizedCurrentPath;
        }

        // Jika currentPath adalah root (/) tapi link adalah index.html
        if (normalizedCurrentPath === '/' && linkHref === '/index.html') {
            link.classList.add('active');
        } 
        // Jika currentPath cocok persis dengan link
        else if (normalizedCurrentPath === linkHref) {
            link.classList.add('active');
        }
        // Khusus untuk halaman yang berada di subfolder seperti /pages/ atau /contributor/
        // Jika linknya mengarah ke folder index, dan kita berada di halaman di dalam folder itu
        else if (linkHref.endsWith('/index.html') && normalizedCurrentPath.startsWith(linkHref.replace('index.html', ''))) {
            // Misal: linkHref='/contributor/index.html', normalizedCurrentPath='/contributor/dashboard.html' (jika ada)
            // Atau linkHref='/pages/family.html' dan normalizedCurrentPath='/pages/family.html' (ini sudah dicover di atas)
            // Logika ini untuk memastikan link kategori utama aktif jika di dalam sub-halaman
            if (normalizedCurrentPath.includes(linkHref.replace('/index.html', '/'))) { // Untuk folder seperti /contributor/
                link.classList.add('active');
            }
        }
    });

    // --- 7. Optional: Parallax Effect for Background (simplified) ---
    const bodyElement = document.body;
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        bodyElement.style.backgroundPositionY = -(scrolled * 0.1) + 'px';
        bodyElement.style.backgroundPositionX = -(scrolled * 0.05) + 'px';
    });

    // --- Profile Details Toggle Logic (for contributor/index.html) ---
    // Pastikan ini hanya berjalan jika ada tombol toggle di halaman
    document.querySelectorAll('.profile-toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.contributor-card');
            const details = card.querySelector('.profile-details');
            
            if (details) {
                details.classList.toggle('expanded');
                if (details.classList.contains('expanded')) {
                    button.querySelector('span').textContent = 'Sembunyikan';
                } else {
                    button.querySelector('span').textContent = 'Lihat Profil';
                }
            }
        });
    });

    // --- Auto-fill "Not Found" for empty social links/contact info ---
    // Logika ini akan berjalan di halaman mana pun yang memiliki struktur .profile-details
    document.querySelectorAll('.profile-details .contact-info p, .profile-details .social-links p').forEach(pTag => {
        const strongTag = pTag.querySelector('strong'); // Untuk username media sosial
        const aTag = pTag.querySelector('a'); // Untuk link WA/Email

        if (aTag) { // Jika ada link (WA/Email)
            const href = aTag.getAttribute('href');
            // Cek jika href masih mengandung placeholder (misal: "https://wa.me/[NOMOR_WA_1]")
            if (href.includes('[NOMOR_WA_') || href.includes('[EMAIL_')) {
                aTag.textContent = 'Not Found';
                aTag.classList.add('not-found-text');
                aTag.removeAttribute('href'); // Hapus link agar tidak bisa diklik ke placeholder
            }
        } else if (strongTag) { // Jika hanya teks biasa (Social Media Username)
            const originalText = strongTag.textContent.trim();
            // Cek jika teks masih placeholder (misal: "[Username TikTok 1]")
            if (originalText.startsWith('[Username')) {
                strongTag.textContent = 'Not Found';
                strongTag.classList.add('not-found-text');
            }
        }
    });
});
