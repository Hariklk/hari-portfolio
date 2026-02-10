document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Continuous Animation Loop (Scroll + Mouse)
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - window.innerWidth / 2) * 0.1;
        targetMouseY = (e.clientY - window.innerHeight / 2) * 0.1;
    });

    const parallaxElements = document.querySelectorAll('.parallax');
    const blobs = document.querySelectorAll('.blob');
    const nav = document.getElementById('navbar');

    function update() {
        const scrolled = window.scrollY;

        // Smooth mouse movement interpolation
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;

        // Navbar state
        if (scrolled > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');

        // Main Parallax Logic
        parallaxElements.forEach((el, index) => {
            const speedY = parseFloat(el.getAttribute('data-speed')) || 0;
            const speedX = parseFloat(el.getAttribute('data-translate-x')) || 0;
            const targetScale = parseFloat(el.getAttribute('data-scale')) || 1;

            const rect = el.getBoundingClientRect();
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const factor = (progress - 0.5);

                // Base Scroll Parallax
                let xOffset = factor * (speedX * 1000);
                let yOffset = factor * (speedY * 1000);
                let scale = 1 + (factor * (targetScale - 1) * 2);

                // Add Mouse Tracking to Background Elements
                if (el.classList.contains('floating-shape') || el.classList.contains('stars')) {
                    const mFactor = (index + 1) * 0.3;
                    xOffset += mouseX * mFactor;
                    yOffset += mouseY * mFactor;
                }

                const rotation = factor * 360;
                const hasIcon = el.classList.contains('floating-shape');

                el.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(${scale}) ${hasIcon ? `rotate(${rotation}deg)` : ''}`;
            }
        });

        // Background Blobs Mouse Tracking
        blobs.forEach((blob, index) => {
            const mFactor = (index + 1) * 0.5;
            const x = mouseX * mFactor;
            const y = mouseY * (mFactor * 0.5) + (scrolled * 0.1);
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });

        requestAnimationFrame(update);
    }
    update();


    // 4. Mobile Menu
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Add styles for mobile menu active state in next CSS update if needed
            // For now, simple toggle
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(0,0,0,0.9)';
                navLinks.style.padding = '2rem';
                navLinks.style.backdropFilter = 'blur(10px)';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }

    // 5. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Navbar height offset
                    behavior: 'smooth'
                });
            }
        });
    });
});
