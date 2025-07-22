document.addEventListener('DOMContentLoaded', () => {
    // --- Main Content Fade-in Animation ---
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('animate-in');
    }

    // --- Typewriter Effect for Tagline (on index.html only) ---
    const taglineElement = document.getElementById('tagline');
    // Hanya tambahkan efek typewriter jika elemen tagline ada dan ini adalah halaman utama
    if (taglineElement && (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html'))) {
        const taglineText = "Gerbang Informasi Intergalaksi Hubungan Hewan Peliharaan Anda.";
        let charIndex = 0;
        let typingSpeed = 70; // milliseconds per character

        function typeWriter() {
            if (charIndex < taglineText.length) {
                taglineElement.textContent += taglineText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        setTimeout(typeWriter, 500); // Start typing after a short delay
    }


    // --- Reveal on Scroll Animation ---
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // --- Navigasi Toggle (Hamburger Menu) ---
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            navToggle.classList.toggle('open');
        });

        // Close nav when a link is clicked (for mobile)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    navToggle.classList.remove('open');
                }
            });
        });
    }

    // --- Active Nav Link Highlighting ---
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#main-nav ul li a');

    navLinks.forEach(link => {
        // Hapus kelas 'active' dari semua link terlebih dahulu
        link.classList.remove('active');

        let linkPath = link.getAttribute('href');
        
        // Normalisasi linkPath untuk perbandingan
        if (linkPath === '../index.html' || linkPath === './index.html' || linkPath === 'index.html') {
            linkPath = '/index.html'; // Treat root index as /index.html
        } else if (linkPath.startsWith('../')) {
            linkPath = '/' + linkPath.substring(3); // Remove ../ and add /
        } else if (linkPath.startsWith('./')) {
            const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            linkPath = currentDir + linkPath.substring(2);
        }

        // Normalisasi currentPath untuk perbandingan
        let normalizedCurrentPath = currentPath;
        if (normalizedCurrentPath.endsWith('/')) {
            normalizedCurrentPath = normalizedCurrentPath.slice(0, -1);
        }
        if (!normalizedCurrentPath.startsWith('/')) {
            normalizedCurrentPath = '/' + normalizedCurrentPath;
        }

        // Periksa apakah linkPath cocok dengan normalizedCurrentPath
        if (normalizedCurrentPath === linkPath) {
            link.classList.add('active');
        }
        // Tambahan untuk mencocokkan path direktori (misal /pages/family.html aktifkan link family)
        else if (linkPath.endsWith('/') && normalizedCurrentPath.startsWith(linkPath)) {
            // Jika link adalah direktori (misal /pages/) dan currentPath ada di dalamnya
            link.classList.add('active');
        }
    });

    // --- Profile Details Toggle Logic (for contributor/index.html) ---
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
                // Tambahkan kelas untuk styling "Not Found"
                strongTag.classList.add('not-found-text');
            }
        }
    });

});
              
