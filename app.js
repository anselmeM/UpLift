// app.js - Attempting full implementation of user's original menu logic

function initializeAnimations() {
    console.log("Initializing animations AFTER preloader...");

    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger not loaded!");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    console.log("GSAP & ScrollTrigger registered.");

    // --- Default Animation Settings ---
    const defaultEase = 'expo.out';
    const defaultDuration = 0.9;

    // --- Hero Section Animation ---
    try {
        const heroWords = gsap.utils.toArray('.hero-word');
        const heroImages = gsap.utils.toArray('.hero-headline .img-placeholder');
        const heroSubtext = document.getElementById('hero-subtext');
        const heroButton = document.getElementById('hero-button');
        const heroTl = gsap.timeline({ defaults: { ease: defaultEase, duration: defaultDuration } });
        if (heroWords.length > 0) {
            heroTl.to(heroWords, { y: 0, opacity: 1, stagger: 0.1, duration: 1.2 });
        } else {
            heroTl.to('#hero-headline', { opacity: 1, y: 0, duration: 1 });
        }
        if(heroImages.length > 0) {
            heroTl.to(heroImages, { opacity: 1, scale: 1, stagger: 0.15, duration: 0.7 }, "-=0.8");
        }
        if (heroSubtext) {
            heroTl.to(heroSubtext, { opacity: 1, y: 0 }, "-=0.6");
        }
        if (heroButton) {
            heroTl.to(heroButton, { opacity: 1, y: 0 }, "-=0.7");
        }
    } catch (error) {
        console.error("Error creating hero timeline:", error);
    }

     // --- Header Fade-in ---
     try {
         gsap.to('header', { opacity: 1, duration: 1, delay: 0.3 });
     } catch (error) {
         console.error("Error creating header animation:", error);
     }

    // --- Parallax Effect ---
    try {
        const parallaxSections = gsap.utils.toArray('.parallax-section');
        parallaxSections.forEach(section => {
            gsap.to(section, {
                yPercent: -15,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    scrub: 0.5,
                    start: "top bottom",
                    end: "bottom top"
                }
            });
        });
    } catch (error) {
        console.error("Error applying parallax effect:", error);
    }

    // --- Scroll-Linked Horizontal Movement (Subtle) ---
    try {
        const scrubXElements = gsap.utils.toArray('.scrub-x-element:not(.animate-stagger-item)');
        scrubXElements.forEach(el => {
            gsap.to(el, {
                xPercent: gsap.utils.random(-10, 10),
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    scrub: 1,
                    start: "top bottom",
                    end: "bottom top"
                }
            });
        });
    } catch (error) {
        console.error("Error applying scroll-linked horizontal movement:", error);
    }


    // --- Horizontal Scroll Logic & Inner Slide Animations ---
    try {
        const scrollContainer = document.getElementById('horizontal-scroll-container');
        const scrollTrack = document.getElementById('horizontal-scroll-track');

        if (scrollContainer && scrollTrack) {
            let scrollTween = gsap.to(scrollTrack, {
                x: () => -(scrollTrack.scrollWidth - scrollContainer.offsetWidth) + "px",
                ease: "none",
                scrollTrigger: {
                    trigger: scrollContainer,
                    pin: true,
                    scrub: 0.5,
                    start: "top top",
                    end: () => "+=" + (scrollTrack.scrollWidth - scrollContainer.offsetWidth),
                    invalidateOnRefresh: true
                }
            });

            const slides = gsap.utils.toArray('.slide');
            slides.forEach((slide, index) => {
                const heading = slide.querySelector('.slide__heading');
                const description = slide.querySelector('.slide__description');
                const imgCont = slide.querySelector('.slide__img-cont');

                if (heading) {
                    gsap.from(heading, {
                        opacity: 0, y: 50, duration: 0.8, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: slide, containerAnimation: scrollTween,
                            start: "left center+=100", toggleActions: "play none none reverse"
                        }
                    });
                }
                 if (description) {
                    gsap.from(description, {
                        opacity: 0, y: 40, duration: 0.8, ease: 'power2.out', delay: 0.1,
                        scrollTrigger: {
                            trigger: slide, containerAnimation: scrollTween,
                            start: "left center+=50", toggleActions: "play none none reverse"
                        }
                    });
                }
                 if (imgCont) {
                     gsap.from(imgCont, {
                         opacity: 0, scale: 0.9, duration: 1.0, ease: 'power3.out', delay: 0.2,
                         scrollTrigger: {
                             trigger: slide, containerAnimation: scrollTween,
                             start: "left center", toggleActions: "play none none reverse"
                         }
                     });
                     const image = imgCont.querySelector('.slide__img');
                     if (image) {
                         gsap.to(image, {
                             xPercent: -8, ease: "none",
                             scrollTrigger: {
                                 trigger: slide, containerAnimation: scrollTween,
                                 scrub: true, start: "left right", end: "right left"
                             }
                         });
                     }
                 }
            });

        } else {
            console.warn("Horizontal scroll container or track not found.");
        }
    } catch (error) {
        console.error("Error setting up horizontal scroll or inner slide animations:", error);
    }
    // --- End Horizontal Scroll Logic ---


    // --- Standard Scroll-Triggered Entrance Animations (Sections NOT in horizontal scroll) ---
    try {
        const sections = gsap.utils.toArray('.animate-section:not(.horizontal-scroll-section)');

        sections.forEach((section, index) => {
            const leftElements = section.querySelectorAll('.animate-left');
            const rightElements = section.querySelectorAll('.animate-right');
            const staggerItems = section.querySelectorAll('.animate-stagger-item');
            const fadeElements = section.querySelectorAll('.animate-fade');
            const defaultElements = section.querySelectorAll('.animate-element:not(.animate-left):not(.animate-right):not(.animate-stagger-item):not(.animate-fade)');
            const revealImages = section.querySelectorAll('.reveal-image');
            const squiggle = section.querySelector('.squiggle #squiggle-path');

            if (leftElements.length || rightElements.length || staggerItems.length || defaultElements.length || fadeElements.length || revealImages.length || squiggle) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    defaults: { ease: defaultEase, duration: defaultDuration }
                });

                let position = "<";
                if (leftElements.length > 0) { tl.to(leftElements, { opacity: 1, x: 0, stagger: 0.15 }, position); position = "<0.1"; }
                if (rightElements.length > 0) { tl.to(rightElements, { opacity: 1, x: 0, stagger: 0.15 }, position); position = "<0.1"; }
                if (fadeElements.length > 0) { tl.to(fadeElements, { opacity: 1, stagger: 0.15 }, position); position = "<0.1"; }
                if (defaultElements.length > 0) { tl.to(defaultElements, { opacity: 1, y: 0, stagger: 0.1 }, position); position = "<0.1"; }
                if (staggerItems.length > 0) { tl.to(staggerItems, { opacity: 1, y: 0, stagger: 0.1 }, position); position = "<0.1"; }
                if (revealImages.length > 0) { tl.to(revealImages, { clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.2, duration: 1.2, ease: 'power3.out' }, "<"); }
                if (squiggle) { tl.to(squiggle, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, "-=0.5"); }
            }
        });
     } catch (error) {
         console.error("Error setting up standard ScrollTrigger entrance animations:", error);
     }

    // --- Testimonial Slider Logic ---
    try {
        const sliderWrapper = document.getElementById('testimonial-wrapper');
        const prevButton = document.getElementById('prev-testimonial');
        const nextButton = document.getElementById('next-testimonial');
        const slides = gsap.utils.toArray('#testimonial-wrapper .testimonial-card');

        if (sliderWrapper && prevButton && nextButton && slides.length > 0) {
            let currentIndex = 0;
            const totalSlides = slides.length;
            function goToSlide(index) {
                if (index < 0) { index = totalSlides - 1; }
                else if (index >= totalSlides) { index = 0; }
                gsap.to(sliderWrapper, { xPercent: -100 * index, duration: 0.5, ease: 'power3.inOut' });
                currentIndex = index;
                updateSlides(currentIndex);
            }
            const updateSlides = (newIndex) => {
                slides.forEach((slide, i) => {
                    const isActive = i === newIndex;
                    slide.setAttribute('aria-hidden', !isActive);
                    slide.setAttribute('aria-label', `Slide ${i + 1} of ${totalSlides}`);
                });
            };
            updateSlides(currentIndex);
            prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
            nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));
        } else {
            console.warn("Testimonial slider elements not found.");
        }
    } catch(error) {
        console.error("Error setting up testimonial slider:", error);
    }


    // --- Functional FAQ Accordion Logic ---
    try {
        const faqItems = document.querySelectorAll('.faq-item-js');
        if (faqItems.length > 0) {
            const closeAllFaqs = (currentItem) => {
                faqItems.forEach(item => {
                    if (item !== currentItem && item.classList.contains('active')) {
                        const answer = item.querySelector('.faq-answer');
                        const icon = item.querySelector('.faq-icon');
                        const button = item.querySelector('.faq-question');
                        gsap.to(answer, { maxHeight: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: 0.4, ease: 'power1.inOut' });
                        item.classList.remove('active');
                        if (button) button.setAttribute('aria-expanded', 'false');
                        if (icon) icon.textContent = '+';
                    }
                });
            };
            faqItems.forEach((item, index) => {
                const questionButton = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                const icon = item.querySelector('.faq-icon');
                const questionId = `faq-question-${index + 1}`;
                const answerId = `faq-answer-${index + 1}`;
                if (questionButton && !questionButton.id) questionButton.id = questionId;
                if (answer && !answer.id) answer.id = answerId;
                if (questionButton && answer) {
                    questionButton.setAttribute('aria-controls', answerId);
                    answer.setAttribute('aria-labelledby', questionId);
                }
                if (questionButton && answer) {
                    questionButton.addEventListener('click', () => {
                        const isActive = item.classList.contains('active');
                        closeAllFaqs(item);
                        if (!isActive) {
                            item.classList.add('active');
                            questionButton.setAttribute('aria-expanded', 'true');
                            if (icon) icon.textContent = '−';
                            gsap.to(answer, {
                                maxHeight: answer.scrollHeight, opacity: 1,
                                paddingTop: '0.5rem', paddingBottom: '1rem',
                                duration: 0.5, ease: 'power1.inOut'
                             });
                        }
                    });
                }
            });
        } else {
            // console.log("No custom FAQ items found.");
        }
    } catch (error) {
        console.error("Error setting up custom FAQ accordion:", error);
    }


    // --- NEW Overlay Menu Logic (Full Implementation Attempt) ---
    try {
        const menuToggle = document.querySelector('.menu-toggle');
        const overlay = document.querySelector('.nsd-menu-overlay');
        const overlayLeft = document.querySelector('.nsd-menu-overlay__content_part__left');
        const overlayRight = document.querySelector('.nsd-menu-overlay__content_part__right');
        const overlayItems = gsap.utils.toArray('.nsd-menu-overlay__content_part__left ul.nsd-menu-fullscreen .fullscreen-single__item');

        // Check if all essential elements exist
        if (menuToggle && overlay && overlayLeft && overlayRight && overlayItems.length > 0) {
            console.log("Setting up FULL overlay menu animation.");

            // Set initial states using GSAP (autoAlpha handles visibility+opacity)
            gsap.set(overlay, { yPercent: -100, autoAlpha: 0 });
            gsap.set(overlayLeft, { yPercent: 100 }); // Start left part below
            gsap.set(overlayItems, { rotate: 5, y: 250, skewY: 10, autoAlpha: 0 }); // Items transformed and hidden
            gsap.set(overlayRight, { y: 50, autoAlpha: 0 }); // Right part slightly down and hidden

            // Create the GSAP 3 timeline, initially paused and reversed (closed state)
            const headerOverlayTimeline = gsap.timeline({ paused: true, reversed: true });

            // Define the animation sequence based on original logic
            headerOverlayTimeline
                .to(overlay, { duration: 1, yPercent: 0, autoAlpha: 1, ease: 'power2.out' }) // Animate overlay in (duration 1)
                .to(overlayLeft, { duration: 1, yPercent: 0, ease: 'power2.out' }, "-=1") // Animate left part in (duration 1, start same time as overlay)
                .to(overlayItems, { // Animate menu items in
                    duration: 0.8, // Duration from original logic? (was implicit) - using 0.8
                    autoAlpha: 1,
                    rotate: 0,
                    y: 0,
                    skewY: 0,
                    stagger: 0.2, // Stagger from original logic
                    ease: 'power3.out' // Example ease
                }, "-=0.5") // Start 0.5s before the end of the previous tweens
                .to(overlayRight, { // Animate right part in
                    duration: 0.5, // Duration from original logic
                    y: 0,
                    autoAlpha: 1,
                    ease: 'power2.out'
                }, "-=0.5"); // Start 0.5s before the end of the item animation

            // Click handler for the toggle button
            const toggleOverlay = () => {
                menuToggle.classList.toggle('active'); // Toggle class for hamburger/cross CSS animation
                headerOverlayTimeline.reversed(!headerOverlayTimeline.reversed()); // Toggle GSAP timeline

                // Optional: Toggle body scroll lock
                // document.body.classList.toggle('overlay-active', !headerOverlayTimeline.reversed());
            };

            menuToggle.addEventListener('click', toggleOverlay);
            console.log("Full overlay menu listener added.");

            // --- Submenu Logic (Vanilla JS - Basic Toggle) ---
            // Based on original logic, using display block/none
            const menuItemsWithSub = document.querySelectorAll('.nsd-menu-fullscreen .has-sub > a');
            menuItemsWithSub.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const parentLi = item.parentElement;
                    // Use :scope selector to find direct child submenu only
                    const submenu = parentLi.querySelector(':scope > .sub-menu');
                    if (!submenu) return; // Exit if no submenu found

                    if (parentLi.classList.contains('open_sub')) {
                        // Close current submenu
                        submenu.style.display = 'none';
                        parentLi.classList.remove('open_sub');
                    } else {
                        // Close siblings' submenus first
                        parentLi.parentElement.querySelectorAll('.has-sub.open_sub').forEach(openItem => {
                            if (openItem !== parentLi) {
                                openItem.classList.remove('open_sub');
                                const openSubmenu = openItem.querySelector(':scope > .sub-menu');
                                if(openSubmenu) openSubmenu.style.display = 'none';
                            }
                        });
                        // Open current submenu
                        submenu.style.display = 'block'; // Simple show/hide
                        parentLi.classList.add('open_sub');
                    }
                });
            });
             console.log("Submenu listeners added (basic toggle).");


        } else {
            // Log which element(s) might be missing
            console.warn("Could not find all elements required for the new overlay menu.", {
                menuToggle: !!menuToggle,
                overlay: !!overlay,
                overlayLeft: !!overlayLeft,
                overlayRight: !!overlayRight,
                overlayItemsCount: overlayItems.length
            });
        }

    } catch(error) {
        // Catch errors during setup
        console.error("Error setting up new overlay menu:", error);
    }


    console.log("Uplift Concept Initialized.");
} // End of initializeAnimations function

// --- Preloader Logic ---
function handlePreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderLogo = document.getElementById('preloader-logo');
    if (!preloader || !preloaderLogo) {
        console.warn("Preloader elements not found. Skipping preloader.");
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initializeAnimations);
        } else {
            initializeAnimations();
        }
        return;
    }
    gsap.to(preloaderLogo, {
        scale: 1.1, duration: 0.6, repeat: -1, yoyo: true, ease: "power1.inOut"
    });
    window.addEventListener('load', () => {
        console.log("Window loaded. Hiding preloader...");
        gsap.timeline()
            .to(preloaderLogo, {
                opacity: 0, scale: 0.8, duration: 0.3, ease: "power1.in"
            })
            .to(preloader, {
                opacity: 0, duration: 0.5, ease: "power1.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    console.log("Preloader hidden. Initializing main animations...");
                    initializeAnimations(); // Initialize animations AFTER preloader is gone
                }
            }, "-=0.1");
    });
}

// Run preloader logic immediately
handlePreloader();
