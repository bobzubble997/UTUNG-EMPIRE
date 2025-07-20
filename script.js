document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Main Content Fade-in Animation ---
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('animate-in');
    }

    // --- 2. Typewriter Effect for Tagline (on index.html only) ---
    const taglineElement = document.getElementById('tagline');
    const taglineText = "Gerbang Informasi Intergalaksi Hubungan Hewan Peliharaan Anda.";
    let charIndex = 0;
    let typingSpeed = 70; // milliseconds per character

    function typeWriter() {
        if (taglineElement && charIndex < taglineText.length) {
            taglineElement.textContent += taglineText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    // Only run typewriter on the dashboard page
    // Check for both root path and explicit index.html
    if (taglineElement && (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html'))) {
        setTimeout(typeWriter, 500); // Start typing after a short delay
    }

    // --- 3. Reveal on Scroll Animation (Intersection Observer) ---
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

    // --- 4. Hamburger Menu Toggle (for mobile responsiveness) ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open'); // Optional: Animate hamburger icon
        });

        // Close menu when a link is clicked (on mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('open');
                }
            });
        });
    }

    // --- 5. Optional: Smooth Scroll for Anchor Links (if you add any) ---
    // Example usage: <a href="#section-id">Go to Section</a>
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
    const navItems = document.querySelectorAll('nav ul li a');

    navItems.forEach(item => {
        // Remove 'active' class from all first
        item.classList.remove('active');

        // Normalize paths for comparison (remove leading '../' if any)
        const linkPath = item.getAttribute('href');
        const normalizedLinkPath = linkPath.replace('../', '');
        let normalizedCurrentPath = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath; // Remove leading slash

        // If currentPath ends with a slash (e.g., '/pages/'), append 'index.html' for comparison with nav links
        if (normalizedCurrentPath.endsWith('/') && linkPath.includes('index.html')) {
            normalizedCurrentPath += 'index.html';
        }

        // Check for exact match or if current path contains the link path
        if (normalizedCurrentPath === normalizedLinkPath) {
            item.classList.add('active');
        } else if (normalizedCurrentPath.includes(normalizedLinkPath) && normalizedLinkPath !== '') {
            // Special handling for nested pages like /pages/leader-utung.html matching /pages/
            // Ensure it doesn't activate parent link if specific sub-page is active
            const currentSegments = normalizedCurrentPath.split('/').filter(Boolean);
            const linkSegments = normalizedLinkPath.split('/').filter(Boolean);

            if (currentSegments.length > linkSegments.length && linkSegments.length > 0) {
                 // Check if the link is a parent category (e.g., 'pages/family.html' for '/pages/family-member-1.html')
                 // Only activate if the exact link path is part of the current path and not just a prefix for a different page
                if (normalizedCurrentPath.startsWith(normalizedLinkPath) && linkPath.endsWith('.html')) {
                    item.classList.add('active');
                }
            } else if (currentSegments.length === linkSegments.length && linkPath.endsWith('.html')) {
                // Exact match for HTML files
                if (normalizedCurrentPath === normalizedLinkPath) {
                     item.classList.add('active');
                }
            }
        }

        // Special handling for dashboard link if it's the root or index.html
        if ((currentPath === '/' || currentPath.endsWith('index.html')) && linkPath.endsWith('index.html')) {
             item.classList.add('active');
        }
    });


    // --- 7. Optional: Parallax Effect for Background (simplified) ---
    // This is a basic example. For a more sophisticated parallax, you might need a dedicated library.
    const bodyElement = document.body;
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Move the background slightly against scroll direction
        bodyElement.style.backgroundPositionY = -(scrolled * 0.1) + 'px';
        bodyElement.style.backgroundPositionX = -(scrolled * 0.05) + 'px';
    });

    // --- 8. Optional: Audio for Button Clicks (if desired, subtle sound) ---
    // If you want a subtle click sound on *every* button, uncomment this.
    // Ensure you have a 'subtle-click.mp3' in your root directory.
    /*
    const subtleClickSound = new Audio('subtle-click.mp3'); 

    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', () => {
            if (subtleClickSound) {
                subtleClickSound.currentTime = 0;
                subtleClickSound.play().catch(e => console.error("Error playing click sound:", e));
            }
        });
    });
    */
});
