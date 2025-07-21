document.addEventListener('DOMContentLoaded', () => {
    // --- Login Logic (for contributor/index.html) ---
    const passwordInput = document.getElementById('passwordInput');
    const messageElement = document.getElementById('message');
    
    // Password asli: "123@#$_321" - Dipecah untuk ilusi "enkripsi terbagi"
    const correctPasswordParts = {
        part1: '123',
        part2: '@#$',
        part3: '_321'
    };

    // Fungsi checkPassword hanya ada jika elemen passwordInput ada (di halaman login)
    if (passwordInput && messageElement) {
        window.checkPassword = function() {
            const enteredPassword = passwordInput.value;
            messageElement.classList.remove('error-message', 'success-message');
            messageElement.textContent = '';

            const combinedCorrectPassword = correctPasswordParts.part1 + correctPasswordParts.part2 + correctPasswordParts.part3;

            if (enteredPassword === combinedCorrectPassword) {
                messageElement.textContent = "Akses Diberikan! Mengarahkan...";
                messageElement.classList.add('success-message');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                messageElement.textContent = "Password Salah! Coba lagi.";
                messageElement.classList.add('error-message');
                passwordInput.value = '';
            }
        };

        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                window.checkPassword();
            }
        });
    }

    // --- Common Animations for Dashboard (contributor/dashboard.html) ---
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('animate-in');
    }

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

    // --- Profile Details Toggle Logic (for contributor/dashboard.html) ---
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
    // Logika ini akan berjalan saat halaman dashboard kontributor dimuat
    if (window.location.pathname.endsWith('/contributor/dashboard.html') || window.location.pathname.endsWith('/contributor/dashboard.html/')) {
        document.querySelectorAll('.profile-details .contact-info p, .profile-details .social-links p').forEach(pTag => {
            const strongTag = pTag.querySelector('strong');
            const aTag = pTag.querySelector('a');

            if (aTag) { // Jika ada link (WA/Email)
                // Cek href nya. Jika masih ada placeholder [NOMOR_WA_X] atau [EMAIL_X], maka Not Found
                const href = aTag.getAttribute('href');
                if (href.includes('[NOMOR_WA_') || href.includes('[EMAIL_')) {
                    aTag.textContent = 'Not Found';
                    aTag.classList.add('not-found-text');
                    aTag.removeAttribute('href'); // Hapus link agar tidak bisa diklik ke placeholder
                }
            } else if (strongTag) { // Jika hanya teks biasa (Social Media Username)
                const originalText = strongTag.textContent.trim();
                if (originalText.startsWith('[Username')) { // Cek jika masih placeholder
                    strongTag.textContent = 'Not Found';
                    // Tambahkan span placeholder agar CSS .not-found-text bisa bekerja pada strong
                    let spanPlaceholder = pTag.querySelector('.not-found-text-placeholder');
                    if (!spanPlaceholder) {
                        spanPlaceholder = document.createElement('span');
                        spanPlaceholder.classList.add('not-found-text-placeholder');
                        strongTag.appendChild(spanPlaceholder);
                    }
                    spanPlaceholder.classList.add('not-found-text');
                }
            }
        });
    }

    // --- Menangani tombol logout ---
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            console.log('Logging out...');
            setTimeout(() => {
                window.location.href = 'index.html'; // Kembali ke halaman login kontributor
            }, 300);
        });
    }
});
