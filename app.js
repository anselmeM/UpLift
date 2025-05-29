/**
 * app.js - Cleaned and Refactored Script for UpLift Website
 * Focus: Ensuring horizontal scroll works on all devices as requested.
 * Version: 3.0
 */

// --- Core Initializer ---
document.addEventListener('DOMContentLoaded', () => {
    // This runs as soon as the HTML is loaded and parsed.
    console.log("DOM Loaded. Checking for GSAP...");

    // Check for GSAP and ScrollTrigger
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("CRITICAL: GSAP or ScrollTrigger is not loaded. Animations will not work.");
        alert("Animation libraries failed to load. Please check your internet connection or script tags.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    console.log("GSAP & ScrollTrigger registered.");

    // Handle the preloader, and then run main initializations
    handlePreloader(() => {
        console.log("Preloader finished. Initializing components...");
        initializeMobileMenu();
        initializeFAQ();
        initializeAnimations(); // This sets up all GSAP/ScrollTrigger based animations
        console.log("All initializations called.");
    });
});

// --- Preloader Handler ---
function handlePreloader(callback) {
    const preloader = document.getElementById('preloader');
    const preloaderLogo = document.getElementById('preloader-logo');

    if (!preloader || !preloaderLogo) {
        console.warn("Preloader elements not found. Running callback immediately.");
        callback();
        return;
    }

    console.log("Starting preloader animation...");
    gsap.to(preloaderLogo, {
        scale: 1.2, duration: 0.8, repeat: 1, yoyo: true, ease: "power1.inOut",
        onComplete: () => {
             gsap.to(preloader, {
                opacity: 0, duration: 0.5,
                onComplete: () => {
                    preloader.style.display = 'none';
                    callback(); // Run the main init functions
                }
            });
        }
    });
}

// --- Mobile Menu Handler ---
function initializeMobileMenu() {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    if (!button || !menu) {
        console.warn("Mobile menu elements not found.");
        return;
    }

    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from bubbling up to document
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
    });

    menu.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                button.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
        if (menu.classList.contains('active') && !button.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
        }
    });
    console.log("Mobile menu initialized.");
}

// --- FAQ Accordion Handler ---
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item-js');
    if (!faqItems.length) { console.warn("FAQ items not found."); return; }

    const closeAllFaqs = (currentItem) => {
        faqItems.forEach(item => {
            if (item !== currentItem && item.classList.contains('active')) {
                const answer = item.querySelector('.faq-answer');
                const icon = item.querySelector('.faq-icon');
                const btn = item.querySelector('.faq-question');
                gsap.to(answer, { maxHeight: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: 0.3, ease: 'power1.inOut' });
                item.classList.remove('active');
                btn?.setAttribute('aria-expanded', 'false');
                if (icon) icon.textContent = '+';
            }
        });
    };

    faqItems.forEach((item) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (button && answer) {
            button.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                closeAllFaqs(item);
                if (!isActive) {
                    item.classList.add('active');
                    button.setAttribute('aria-expanded', 'true');
                    if (icon) icon.textContent = '×';
                    gsap.set(answer, { height: 'auto', opacity: 1, paddingTop: '0.5rem', paddingBottom: '1rem' });
                    gsap.from(answer, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: 0.4, ease: 'power2.out' });
                }
            });
        }
    });
    console.log("FAQ accordion initialized.");
}

// --- Main Animation Controller ---
function initializeAnimations() {
    console.log("Starting animation setups...");
    setupHeroAnimation();
    setupGenericScrollAnimations();
    setupTestimonialSlider();
    setupHorizontalScroll(); // The crucial one
    setupResizeListener();
    console.log("Animation setups should be complete.");
}

// --- Specific Animation Setups ---
function setupHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.9 } });
    tl.to('.hero-word', { y: 0, opacity: 1, stagger: 0.1, duration: 1.2 }, 0)
      .to('.hero-headline .img-placeholder', { opacity: 1, scale: 1, stagger: 0.15, duration: 0.7 }, "-=0.8")
      .to('#hero-subtext', { opacity: 1, y: 0 }, "-=0.6")
      .to('#hero-button', { opacity: 1, y: 0 }, "-=0.7")
      .to('header', { opacity: 1, duration: 1 }, 0.3);
    console.log("Hero animation setup.");
}

function setupGenericScrollAnimations() {
    // Parallax
    gsap.utils.toArray('.parallax-section').forEach(section => {
        gsap.to(section, {
            yPercent: -15, ease: "none",
            scrollTrigger: { trigger: section, scrub: 0.5, start: "top bottom", end: "bottom top" }
        });
    });

    // General Entrance Animations
    gsap.utils.toArray('.animate-section:not(.horizontal-scroll-section)').forEach(section => {
        const elements = section.querySelectorAll('.animate-element, .animate-left, .animate-right, .animate-stagger-item');
        gsap.from(elements, {
            opacity: 0,
            y: 30,
            x: (el) => el.classList.contains('animate-left') ? -50 : (el.classList.contains('animate-right') ? 50 : 0),
            stagger: 0.1,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    console.log("Generic scroll animations setup.");
}

function setupTestimonialSlider() {
    const wrapper = document.getElementById('testimonial-wrapper');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const slides = gsap.utils.toArray('#testimonial-wrapper .testimonial-card');

    if (!wrapper || !prevBtn || !nextBtn || !slides.length) { console.warn("Testimonial slider elements missing."); return; }

    let currentIndex = 0;
    const totalSlides = slides.length;
    gsap.set(wrapper, { willChange: 'transform' });

    const goToSlide = (index) => {
        currentIndex = (index + totalSlides) % totalSlides;
        gsap.to(wrapper, { xPercent: -100 * currentIndex, duration: 0.6, ease: 'power2.inOut' });
        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', String(i !== currentIndex));
            slide.tabIndex = (i === currentIndex) ? 0 : -1;
        });
    };

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    let touchstartX = 0;
    wrapper.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
        const deltaX = e.changedTouches[0].screenX - touchstartX;
        if (Math.abs(deltaX) > 50) { goToSlide(deltaX > 0 ? currentIndex - 1 : currentIndex + 1); }
    }, { passive: true });

    goToSlide(0);
    console.log("Testimonial slider setup.");
}

function setupHorizontalScroll() {
    const container = document.getElementById('horizontal-scroll-container');
    const track = document.getElementById('horizontal-scroll-track');
    const slides = gsap.utils.toArray('#horizontal-scroll-track .slide');

    if (!container || !track || !slides.length) {
        console.error("Horizontal scroll elements missing. Cannot setup.");
        return;
    }

    console.log("Setting up horizontal scroll for ALL devices.");

    // IMPORTANT: Ensure container allows scroll, and track is wide enough.
    // CSS should handle most of this, but we force row direction.
    gsap.set(track, { flexDirection: 'row', width: () => `${slides.length * 100}vw` }); // Explicitly set width based on slide count * 100vw

    // Give the browser a tick to calculate widths before setting up ScrollTrigger
    gsap.delayedCall(0.1, () => {
        const scrollDistance = track.scrollWidth - container.offsetWidth;

        if (scrollDistance <= 0) {
            console.warn("Horizontal track not wider than container. Pinning/scroll might not occur.");
        }

        let scrollTween = gsap.to(track, {
            x: () => -scrollDistance + "px",
            ease: "none", // Linear scroll
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 0.5, // How quickly it follows scroll
                start: "top top",
                end: () => "+=" + scrollDistance,
                invalidateOnRefresh: true, // Recalculate on resize
                // markers: true, // *** UNCOMMENT FOR DEBUGGING SCROLLTRIGGER ***
                onUpdate: self => console.log(`Horizontal Scroll Progress: ${self.progress.toFixed(3)}`), // Log progress
            }
        });

        // Optional: Animate elements within each slide
        slides.forEach(slide => {
             gsap.from(slide.querySelectorAll('.slide__heading, .slide__description, .slide__img-cont'), {
                 opacity: 0,
                 y: 50,
                 stagger: 0.1,
                 scrollTrigger: {
                    trigger: slide,
                    containerAnimation: scrollTween,
                    start: "left 80%", // Trigger slightly before center
                    toggleActions: "play none none reverse",
                    // markers: true, // *** UNCOMMENT FOR DEBUGGING SCROLLTRIGGER ***
                 }
             });
        });
        console.log(`Horizontal scroll ScrollTrigger setup. Distance: ${scrollDistance}`);
    });
}

// --- Resize Listener ---
function setupResizeListener() {
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log("Resizing - Refreshing ScrollTrigger...");
            ScrollTrigger.refresh();
        }, 250); // Debounce to avoid too many refreshes
    });
    console.log("Resize listener setup.");
}