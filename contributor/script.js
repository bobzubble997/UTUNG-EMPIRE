document.addEventListener('DOMContentLoaded', () => {
    // --- Reveal on Scroll Animation for Contributor Cards ---
    // Pastikan ini hanya menargetkan kartu di halaman kontributor
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.contributor-card.reveal-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // --- Profile Details Toggle Logic ---
    document.querySelectorAll('.profile-toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.contributor-card');
            const details = card.querySelector('.profile-details');
            
            if (details) {
                // Perbaiki logika toggle:
                if (details.classList.contains('expanded')) {
                    details.classList.remove('expanded');
                    button.querySelector('span').textContent = 'Lihat Profil';
                } else {
                    details.classList.add('expanded');
                    button.querySelector('span').textContent = 'Sembunyikan';
                }
            }
        });
    });

    // --- Auto-fill "Not Found" for empty social links/contact info ---
    // Logika ini akan berjalan hanya di halaman kontributor
    document.querySelectorAll('.profile-details .contact-info p, .profile-details .social-links p').forEach(pTag => {
        const strongTag = pTag.querySelector('strong');
        const aTag = pTag.querySelector('a');

        if (aTag) { // Jika ada link (WA/Email)
            const href = aTag.getAttribute('href');
            // Cek jika href masih mengandung placeholder atau kosong/invalid
            if (href.includes('[NOMOR_WA_') || href.includes('[EMAIL_') || href === 'https://wa.me/[]' || href === 'mailto:[]' || href === 'https://wa.me/' || href === 'mailto:') {
                aTag.textContent = 'Not Found';
                aTag.classList.add('not-found-text');
                aTag.removeAttribute('href'); // Hapus link agar tidak bisa diklik ke placeholder
            } else if (aTag.textContent.trim() === '' || aTag.textContent.trim().startsWith('[')) { // Jika teks di dalam <a> masih placeholder
                 aTag.textContent = 'Not Found';
                 aTag.classList.add('not-found-text');
                 aTag.removeAttribute('href');
            }
        } else if (strongTag) { // Jika hanya teks biasa (Social Media Username)
            const originalText = strongTag.textContent.trim();
            // Cek jika teks masih placeholder atau kosong
            if (originalText.startsWith('[Username') || originalText === '') {
                strongTag.textContent = 'Not Found';
                strongTag.classList.add('not-found-text');
            }
        }
    });
});
