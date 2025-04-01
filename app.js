// app.js - Full Concept

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing Uplift Concept...");

    // --- Safety Check for GSAP ---
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger not loaded! Check script tags in HTML.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    console.log("GSAP & ScrollTrigger registered.");

    // --- Hero Section Animation ---
    try {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
        heroTl.to('#hero-headline', { opacity: 1, y: 0, duration: 1 })
              .to('#hero-subtext', { opacity: 1, y: 0 }, '-=0.6')
              .to('#hero-button', { opacity: 1, y: 0 }, '-=0.6')
              .to('.hero-headline .img-placeholder', { opacity: 1, scale: 1, stagger: 0.2, duration: 0.6 }, '-=0.5');
        console.log("Hero timeline created.");
    } catch (error) { console.error("Error creating hero timeline:", error); }

     // --- Header Fade-in ---
     try {
         gsap.to('header', { opacity: 1, duration: 1, delay: 0.2 });
         console.log("Header animation created.");
     } catch (error) { console.error("Error creating header animation:", error); }

    // --- Parallax Effect for Green Sections ---
    try {
        const parallaxSections = gsap.utils.toArray('.parallax-section');
        parallaxSections.forEach(section => {
            gsap.to(section, {
                yPercent: -15, // Move up slightly on scroll
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    scrub: 0.5, // Smooth effect
                    start: "top bottom",
                    end: "bottom top"
                }
            });
        });
        console.log(`Parallax effect applied to ${parallaxSections.length} sections.`);
    } catch (error) { console.error("Error applying parallax effect:", error); }


    // --- Scroll-Triggered Entrance Animations ---
    try {
        const sections = gsap.utils.toArray('.animate-section');
        console.log(`Found ${sections.length} sections for entrance animations.`);

        sections.forEach((section, index) => {
            // Find elements within this section
            const leftElements = section.querySelectorAll('.animate-left');
            const rightElements = section.querySelectorAll('.animate-right');
            const staggerItems = section.querySelectorAll('.animate-stagger-item');
            const fadeElements = section.querySelectorAll('.animate-fade');
            const defaultElements = section.querySelectorAll('.animate-element:not(.animate-left):not(.animate-right):not(.animate-stagger-item):not(.animate-fade)');
            const squiggle = section.querySelector('.squiggle #squiggle-path');

            // Create timeline only if elements exist
            if (leftElements.length || rightElements.length || staggerItems.length || defaultElements.length || fadeElements.length || squiggle) {

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section, start: 'top 85%', end: 'bottom 20%',
                        // markers: true, // Uncomment to debug
                        toggleActions: 'play none none none',
                    },
                    defaults: { ease: 'power3.out', duration: 0.7 }
                });

                console.log(`Section ${index + 1}: Setting up entrance timeline...`);
                let position = "<"; // Start animations together

                // Add animations based on classes found
                if (leftElements.length > 0) { tl.to(leftElements, { opacity: 1, x: 0, stagger: 0.15 }, position); position = "<0.2"; }
                if (rightElements.length > 0) { tl.to(rightElements, { opacity: 1, x: 0, stagger: 0.15 }, position); position = "<0.2"; }
                if (fadeElements.length > 0) { tl.to(fadeElements, { opacity: 1, stagger: 0.15 }, position); position = "<0.1"; } // Fade slightly faster
                if (defaultElements.length > 0) { tl.to(defaultElements, { opacity: 1, y: 0, stagger: 0.1 }, position); position = "<0.2"; }
                if (staggerItems.length > 0) { tl.to(staggerItems, { opacity: 1, y: 0, stagger: 0.1 }, position); } // Stagger items last or adjust position

                // Squiggle animation
                if (squiggle) { tl.to(squiggle, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, "-=0.5"); }
            }
        });
         console.log("ScrollTrigger entrance animations set up.");
     } catch (error) {
         console.error("Error setting up ScrollTrigger entrance animations:", error);
     }

    // --- Testimonial Slider Logic ---
    try {
        const sliderWrapper = document.getElementById('testimonial-wrapper');
        const prevButton = document.getElementById('prev-testimonial');
        const nextButton = document.getElementById('next-testimonial');
        const slides = gsap.utils.toArray('#testimonial-wrapper .testimonial-card');

        if (sliderWrapper && prevButton && nextButton && slides.length > 0) {
            let currentIndex = 0; const totalSlides = slides.length;
            console.log(`Testimonial slider initialized with ${totalSlides} slides.`);

            function goToSlide(index) {
                 if (index < 0) { index = totalSlides - 1; } else if (index >= totalSlides) { index = 0; }
                gsap.to(sliderWrapper, { xPercent: -100 * index, duration: 0.5, ease: 'power3.inOut' });
                currentIndex = index;
            }
            prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
            nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));
        } else { console.warn("Testimonial slider elements not found."); }
    } catch(error) { console.error("Error setting up testimonial slider:", error); }

    // --- Functional FAQ Accordion Logic ---
    try {
        const faqItems = document.querySelectorAll('.faq-item-js');
        if (faqItems.length > 0) {
            console.log(`Initializing custom FAQ accordion for ${faqItems.length} items.`);

            const closeAllFaqs = (currentItem) => {
                faqItems.forEach(item => {
                    if (item !== currentItem && item.classList.contains('active')) {
                        const answer = item.querySelector('.faq-answer');
                        const icon = item.querySelector('.faq-icon');
                        gsap.to(answer, { maxHeight: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: 0.4, ease: 'power1.inOut' });
                        item.classList.remove('active');
                        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        if (icon) icon.textContent = '+';
                    }
                });
            };

            faqItems.forEach(item => {
                const questionButton = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                const icon = item.querySelector('.faq-icon');

                if (questionButton && answer) {
                    questionButton.addEventListener('click', () => {
                        const isActive = item.classList.contains('active');
                        closeAllFaqs(item); // Close others first

                        if (!isActive) { // Open this one
                            item.classList.add('active');
                            questionButton.setAttribute('aria-expanded', 'true');
                            if (icon) icon.textContent = '−'; // Use minus symbol for open state
                            gsap.to(answer, { maxHeight: answer.scrollHeight, opacity: 1, paddingTop: '0.5rem', paddingBottom: '1rem', duration: 0.5, ease: 'power1.inOut' });
                        }
                        // If it was active, closeAllFaqs already handled it
                    });
                }
            });
        } else { console.log("No custom FAQ items found."); }
    } catch (error) { console.error("Error setting up custom FAQ accordion:", error); }

    // --- Mobile Menu Toggle Script ---
    try {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
            console.log("Mobile menu toggle attached.");
        } else { console.warn("Mobile menu button or panel not found."); }
    } catch (error) { console.error("Error attaching mobile menu toggle:", error); }

    console.log("Uplift Concept Initialized.");
}); // End of DOMContentLoaded listener
