// app.js - Updated with mobile menu improvements

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
        // console.log("Hero animation timeline created."); // Keep console less cluttered
    } catch (error) {
        console.error("Error creating hero timeline:", error);
    }

     // --- Header Fade-in ---
     try {
         gsap.to('header', { opacity: 1, duration: 1, delay: 0.3 });
         // console.log("Header animation created.");
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
        // console.log(`Parallax effect applied to ${parallaxSections.length} sections.`);
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
         // console.log(`Scroll-linked horizontal movement applied to ${scrubXElements.length} elements (excluding conflicting items).`);
    } catch (error) {
        console.error("Error applying scroll-linked horizontal movement:", error);
    }


    // --- Horizontal Scroll Logic & Inner Slide Animations ---
    try {
        const scrollContainer = document.getElementById('horizontal-scroll-container');
        const scrollTrack = document.getElementById('horizontal-scroll-track');

        if (scrollContainer && scrollTrack) {
            // Check if mobile view
            const isMobile = window.innerWidth < 768;
            
            if (!isMobile) {
                // Only apply horizontal scroll on desktop/tablet
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
                // Mobile optimization - convert to vertical scroll
                scrollTrack.style.width = '100%';
                scrollTrack.style.flexDirection = 'column';
                
                const slides = gsap.utils.toArray('.slide');
                slides.forEach(slide => {
                    slide.style.width = '100%';
                    slide.style.height = 'auto';
                    slide.style.minHeight = '85vh';
                    
                    const heading = slide.querySelector('.slide__heading');
                    const description = slide.querySelector('.slide__description');
                    const imgCont = slide.querySelector('.slide__img-cont');
                    
                    // Apply standard entrance animations
                    if (heading) {
                        gsap.from(heading, {
                            opacity: 0, y: 30, duration: 0.8,
                            scrollTrigger: {
                                trigger: heading,
                                start: "top 85%",
                                toggleActions: "play none none none"
                            }
                        });
                    }
                    
                    if (description) {
                        gsap.from(description, {
                            opacity: 0, y: 30, duration: 0.8, delay: 0.1,
                            scrollTrigger: {
                                trigger: description,
                                start: "top 85%",
                                toggleActions: "play none none none"
                            }
                        });
                    }
                    
                    if (imgCont) {
                        gsap.from(imgCont, {
                            opacity: 0, y: 30, duration: 0.8, delay: 0.2,
                            scrollTrigger: {
                                trigger: imgCont,
                                start: "top 85%",
                                toggleActions: "play none none none"
                            }
                        });
                    }
                });
            }
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
        // console.log(`Found ${sections.length} sections for standard entrance animations.`);

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
         // console.log("Standard ScrollTrigger entrance animations set up.");
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
            // console.log(`Testimonial slider initialized with ${totalSlides} slides.`);
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
                
                // Initialize attributes
                if (questionButton) {
                    questionButton.setAttribute('id', questionId);
                    questionButton.setAttribute('aria-expanded', 'false');
                    questionButton.setAttribute('aria-controls', answerId);
                }
                if (answer) answer.setAttribute('id', answerId);
                
                // Toggle logic
                if (questionButton) {
                    questionButton.addEventListener('click', () => {
                        const isActive = item.classList.contains('active');
                        closeAllFaqs(item);
                        if (!isActive) {
                            item.classList.add('active');
                            gsap.set(answer, { height: 'auto' });
                            gsap.from(answer, { height: 0 });
                            gsap.to(answer, { maxHeight: 1000, opacity: 1, paddingTop: '0.5rem', paddingBottom: '1rem', duration: 0.4, ease: 'power2.inOut' });
                            questionButton.setAttribute('aria-expanded', 'true');
                            if (icon) icon.textContent = '×';
                        }
                    });
                }
            });
            // console.log(`FAQ accordion initialized with ${faqItems.length} items.`);
        } else {
            console.warn("FAQ items not found.");
        }
    } catch (error) {
        console.error("Error setting up FAQ accordion:", error);
    }
}

// Mobile Menu Function
function initializeMobileMenu() {
    console.log("Initializing mobile menu functionality...");
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (!mobileMenuButton || !mobileMenu) {
        console.warn("Mobile menu elements not found");
        return;
    }
    
    mobileMenuButton.addEventListener('click', function() {
        console.log("Mobile menu button clicked");
        
        // Toggle aria-expanded attribute
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle menu visibility
        mobileMenu.classList.toggle('active');
        
        // Toggle icons if they exist
        if (menuIcon && closeIcon) {
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target) && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            
            if (menuIcon && closeIcon) {
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        }
    });
    
    console.log("Mobile menu initialization complete");
}

// Preloader Animation & Removal
window.onload = function() {
    // Get the preloader element
    const preloader = document.getElementById('preloader');
    const preloaderLogo = document.getElementById('preloader-logo');
    
    if (!preloader || !preloaderLogo) {
        console.error("Preloader elements not found!");
        return;
    }
    
    // Create preloader pulse animation
    if (typeof gsap !== 'undefined') {
        gsap.to(preloaderLogo, {
            scale: 1.2,
            duration: 0.8,
            repeat: 1,
            yoyo: true,
            ease: "power1.inOut",
            onComplete: () => {
                // After pulse animation, hide preloader
                preloader.classList.add('hidden');
                
                // Wait for preloader to fade out before initializing other animations
                setTimeout(() => {
                    initializeAnimations();
                    initializeMobileMenu();
                }, 500); // This matches the preloader fade-out duration
            }
        });
    } else {
        console.warn("GSAP not found for preloader animation, using fallback...");
        // Fallback if GSAP is not available
        setTimeout(() => {
            preloader.classList.add('hidden');
            
            // Wait for preloader to fade out before initializing other animations
            setTimeout(() => {
                initializeAnimations();
                initializeMobileMenu();
            }, 500);
        }, 1000);
    }
};

// Handle window resize for responsive animations
window.addEventListener('resize', function() {
    // Refresh ScrollTrigger on window resize
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});