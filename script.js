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
        const taglineText = "Gerbang Informasi UTUNG EMPIRE ."; // Menggunakan teks lengkap yang konsisten
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

    // --- 4. Hamburger Menu Toggle (for mobile responsiveness) ---
    // Selector diperbarui agar sesuai dengan struktur HTML
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links'); // Pastikan ID ini ada di <ul class="nav-links">

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active'); // Gunakan kelas 'active' untuk menampilkan/menyembunyikan nav
            hamburger.classList.toggle('open'); // Opsional: Animate hamburger icon
        });

        // Tutup menu saat link diklik (untuk mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('open');
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
    const navItems = document.querySelectorAll('nav ul li a'); // Menggunakan selektor yang sudah ada

    navItems.forEach(item => {
        // Hapus 'active' class dari semua link terlebih dahulu
        item.classList.remove('active');

        let linkPath = item.getAttribute('href');
        
        // Normalisasi linkPath untuk perbandingan
        // Pastikan linkPath selalu dimulai dari root untuk perbandingan konsisten
        if (linkPath === './index.html' || linkPath === 'index.html' || linkPath === '../index.html') {
            linkPath = '/index.html'; // Semua link ke root/dashboard akan jadi '/index.html'
        } else if (linkPath.startsWith('./')) {
            // Jika link di dalam folder yang sama (misal pages/family.html dari pages/leader-utung.html)
            // Ambil direktori saat ini dan gabungkan
            const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            linkPath = new URL(linkPath, window.location.href).pathname; // Menggunakan URL API untuk normalisasi path relatif
        } else if (linkPath.startsWith('../')) {
            // Jika link keluar folder (misal ../contributor/index.html dari pages/family.html)
            linkPath = new URL(linkPath, window.location.href).pathname;
        }

        // Normalisasi currentPath untuk perbandingan (menghilangkan trailing slash jika ada, dan memastikan dimulai dengan /)
        let normalizedCurrentPath = currentPath;
        if (normalizedCurrentPath.endsWith('/')) {
            normalizedCurrentPath = normalizedCurrentPath.slice(0, -1);
        }
        if (!normalizedCurrentPath.startsWith('/')) {
            normalizedCurrentPath = '/' + normalizedCurrentPath;
        }

        // Membandingkan path
        if (normalizedCurrentPath === linkPath) {
            item.classList.add('active');
        } else if (linkPath === '/index.html' && (normalizedCurrentPath === '/' || normalizedCurrentPath === '/index.html')) {
            // Kasus khusus untuk halaman dashboard utama jika URL-nya hanya '/'
            item.classList.add('active');
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
    // Ini akan menargetkan tombol di halaman kontributor
    document.querySelectorAll('.profile-toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.contributor-card'); // Temukan kartu kontributor terdekat
            const details = card.querySelector('.profile-details'); // Temukan detail profil di dalam kartu
            
            if (details) {
                details.classList.toggle('expanded'); // Toggle kelas 'expanded'
                if (details.classList.contains('expanded')) {
                    button.querySelector('span').textContent = 'Sembunyikan'; // Ubah teks tombol
                } else {
                    button.querySelector('span').textContent = 'Lihat Profil'; // Ubah teks tombol
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
              
