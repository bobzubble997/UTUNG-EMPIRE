document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const messageElement = document.getElementById('message');
    
    // Bagian password terenkripsi (simulasi, sebenarnya terlihat di kode sumber)
    // Password asli: "123@#$_321"
    const correctPasswordParts = {
        part1: '123',
        part2: '@#$',
        part3: '_321'
    };

    // Fungsi untuk memutar suara (dikosongkan agar tidak ada suara pada login ini)
    function playSound(audioElement) {
        // Tidak melakukan apa-apa agar tidak ada suara
    }

    window.checkPassword = function() {
        const enteredPassword = passwordInput.value;
        messageElement.classList.remove('error-message', 'success-message'); // Hapus kelas sebelumnya
        messageElement.textContent = ''; // Kosongkan pesan sebelumnya

        // Gabungkan bagian password untuk verifikasi
        const combinedCorrectPassword = correctPasswordParts.part1 + correctPasswordParts.part2 + correctPasswordParts.part3;

        if (enteredPassword === combinedCorrectPassword) {
            // playSound(successSound); // Tidak pakai sound
            messageElement.textContent = "Akses Diberikan! Mengarahkan...";
            messageElement.classList.add('success-message');
            // Arahkan ke dashboard kontributor setelah delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // playSound(failSound); // Tidak pakai sound
            messageElement.textContent = "Password Salah! Coba lagi.";
            messageElement.classList.add('error-message');
            passwordInput.value = ''; // Kosongkan input
        }
    };

    // Izinkan menekan Enter untuk submit password
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                window.checkPassword();
            }
        });
    }

    // --- Untuk halaman dashboard.html (jika diperlukan animasi) ---
    // Pastikan main-content di dashboard juga animate-in
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('animate-in');
    }

    // Reveal on Scroll Animation for Contributor Cards
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

    document.querySelectorAll('.contributor-card.reveal-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Menangani tombol logout (opsional, karena hanya mengarahkan kembali ke halaman login)
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            // Bisa tambahkan logika lain jika ada session di masa depan
            console.log('Logging out...');
            // Redirect manual untuk memastikan kembali ke halaman login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        });
    }
});
