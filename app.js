/**
 * UpLift Founders - app.js
 * Redesigned for premium Awwwards-style UI, smooth scroll, and micro-interactions.
 */

// Global instances
let lenis;
let customCursor;

// Check prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Initialize Lenis Smooth Scroll ---
function initLenis() {
    if (prefersReducedMotion) return;
    
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// --- Initialize Custom Cursor ---
function initCustomCursor() {
    // Only initialize on desktop / pointer-capable devices
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorRing = document.querySelector('.custom-cursor-ring');

    if (!cursorDot || !cursorRing) return;

    // Set centered transform origin using xPercent/yPercent
    gsap.set([cursorDot, cursorRing], { xPercent: -50, yPercent: -50 });

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    let isSnapped = false;
    let snapTarget = null;

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the dot
        gsap.set(cursorDot, { x: mouseX, y: mouseY });
    });

    // Lerp translation for the ring (smooth trailing effect)
    function animateRing() {
        let targetX = mouseX;
        let targetY = mouseY;

        if (isSnapped && snapTarget) {
            const rect = snapTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Dampened pull: 85% button center, 15% cursor position
            targetX = centerX + (mouseX - centerX) * 0.15;
            targetY = centerY + (mouseY - centerY) * 0.15;
        }

        const lerpFactor = 0.18;
        ringX += (targetX - ringX) * lerpFactor;
        ringY += (targetY - ringY) * lerpFactor;

        gsap.set(cursorRing, { x: ringX, y: ringY });
        requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // --- Cursor State Transitions ---

    // 1. Magnetic Buttons / Primary Buttons (Outline Snap)
    const snapButtons = document.querySelectorAll('.btn, .magnetic-btn');
    snapButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            isSnapped = true;
            snapTarget = btn;

            const rect = btn.getBoundingClientRect();
            const style = window.getComputedStyle(btn);
            const borderRadius = style.borderRadius;

            gsap.to(cursorRing, {
                width: rect.width + 12,
                height: rect.height + 12,
                borderRadius: borderRadius || '9999px',
                backgroundColor: 'transparent',
                borderColor: '#5D5FEF',
                borderWidth: '2px',
                duration: 0.3,
                ease: 'power3.out'
            });

            gsap.to(cursorDot, {
                scale: 0,
                opacity: 0,
                duration: 0.2
            });
        });

        btn.addEventListener('mouseleave', () => {
            isSnapped = false;
            snapTarget = null;

            gsap.to(cursorRing, {
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'transparent',
                borderColor: 'rgba(93, 95, 239, 0.4)',
                borderWidth: '1.5px',
                duration: 0.35,
                ease: 'power3.out'
            });

            gsap.to(cursorDot, {
                scale: 1,
                opacity: 1,
                duration: 0.3
            });
        });
    });

    // 2. Standard Links (Expand ring, fade dot)
    const standardLinks = document.querySelectorAll(
        'a:not(.btn):not(.magnetic-btn), button:not(.btn):not(.magnetic-btn):not(#mobile-menu-button), .faq-question, .testimonial-arrow:not(.magnetic-btn), .faq-item-js, .reveal-image'
    );
    standardLinks.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (isSnapped) return;
            gsap.to(cursorRing, {
                width: 56,
                height: 56,
                backgroundColor: 'rgba(93, 95, 239, 0.12)',
                borderColor: '#5D5FEF',
                duration: 0.3,
                ease: 'power3.out'
            });
            gsap.to(cursorDot, {
                scale: 0,
                opacity: 0,
                duration: 0.2
            });
        });

        el.addEventListener('mouseleave', () => {
            if (isSnapped) return;
            gsap.to(cursorRing, {
                width: 36,
                height: 36,
                backgroundColor: 'transparent',
                borderColor: 'rgba(93, 95, 239, 0.4)',
                duration: 0.35,
                ease: 'power3.out'
            });
            gsap.to(cursorDot, {
                scale: 1,
                opacity: 1,
                duration: 0.3
            });
        });
    });

    // 3. Drag Zones (Testimonials Slider, Horizontal Stages)
    const dragZones = document.querySelectorAll('#testimonial-slider, #horizontal-scroll-container');
    dragZones.forEach(zone => {
        zone.addEventListener('mouseenter', () => {
            if (isSnapped) return;
            cursorRing.innerHTML = '<span>DRAG</span>';
            gsap.to(cursorRing, {
                width: 80,
                height: 80,
                backgroundColor: '#111111',
                borderColor: '#111111',
                duration: 0.3,
                ease: 'power3.out'
            });
            gsap.to(cursorDot, {
                scale: 0,
                opacity: 0,
                duration: 0.2
            });
        });

        zone.addEventListener('mouseleave', () => {
            cursorRing.innerHTML = '';
            if (isSnapped) return;
            gsap.to(cursorRing, {
                width: 36,
                height: 36,
                backgroundColor: 'transparent',
                borderColor: 'rgba(93, 95, 239, 0.4)',
                duration: 0.35,
                ease: 'power3.out'
            });
            gsap.to(cursorDot, {
                scale: 1,
                opacity: 1,
                duration: 0.3
            });
        });
    });
}

// --- Initialize Magnetic Buttons ---
function initMagnetics() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const magneticElements = document.querySelectorAll('.magnetic-btn');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate center position of the button
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            // Distance from cursor to center
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Pull element slightly (max 15px)
            gsap.to(el, {
                x: deltaX * 0.35,
                y: deltaY * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // If the element contains a label, we can slide it even more
            const label = el.querySelector('span');
            if (label) {
                gsap.to(label, {
                    x: deltaX * 0.15,
                    y: deltaY * 0.15,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
            const label = el.querySelector('span');
            if (label) {
                gsap.to(label, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
            }
        });
    });
}

// --- Initialize 3D Card Tilt ---
function init3DTilt() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate local cursor position from -0.5 to 0.5
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const maxTilt = 8; // Max tilt rotation degrees

            gsap.to(card, {
                rotateY: x * maxTilt,
                rotateX: -y * maxTilt,
                scale: 1.02,
                transformPerspective: 1000,
                ease: 'power2.out',
                duration: 0.35
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                ease: 'power3.out',
                duration: 0.7
            });
        });
    });
}

// --- Split Text Reveal Helper (Preserves nested tags/styling like italic span) ---
function splitTextIntoWords(element) {
    if (!element) return;
    
    const nodes = Array.from(element.childNodes);
    element.innerHTML = ''; // Clear container to rebuild it
    
    nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text.trim()) {
                // If it's just whitespace, preserve it directly
                element.appendChild(document.createTextNode(text));
                return;
            }
            
            // Split by space boundaries while keeping the space sequences
            const words = text.split(/(\s+)/);
            words.forEach(word => {
                if (word.trim()) {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'word-wrapper';
                    
                    const inner = document.createElement('span');
                    inner.className = 'word-inner transform translate-y-full';
                    inner.innerHTML = word;
                    
                    wrapper.appendChild(inner);
                    element.appendChild(wrapper);
                } else {
                    // Append spaces as plain text nodes to let native CSS wrapping handle them
                    element.appendChild(document.createTextNode(word));
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Recurse into nested tags (e.g. <span> or <strong>) to split their text
            const clone = node.cloneNode(false); // Clone element without children
            splitTextIntoWords(node); // Recurse on original element
            
            // Move newly wrapped words from the original to the clone
            while (node.firstChild) {
                clone.appendChild(node.firstChild);
            }
            element.appendChild(clone);
        }
    });
}

// --- Initialize Text & Image Animations ---
function initPageAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- Header Entrance ---
    gsap.to('header', { 
        opacity: 1, 
        y: 0,
        duration: 1.2, 
        ease: 'power3.out' 
    });

    // --- Split Typography Reveals for Headings ---
    const revealHeadings = document.querySelectorAll(
        '.trust-headline, .we-will-headline, .value-prop-headline, .team-headline, .faq-headline, .final-cta-headline'
    );
    
    if (!prefersReducedMotion) {
        // Split texts
        revealHeadings.forEach(splitTextIntoWords);

        // Animate reveals on scroll
        revealHeadings.forEach(heading => {
            const inners = heading.querySelectorAll('.word-inner');
            if (inners.length > 0) {
                gsap.fromTo(inners, {
                    y: '100%',
                    rotate: 4,
                    skewY: 6
                }, {
                    y: '0%',
                    rotate: 0,
                    skewY: 0,
                    duration: 1.2,
                    stagger: 0.035,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            }
        });

        // --- Hero Text Split Reveal ---
        // For hero, we want a punchy initial entrance.
        const heroHeadline = document.getElementById('hero-headline');
        if (heroHeadline) {
            // Hero words are pre-wrapped as .hero-word in HTML
            const heroWords = gsap.utils.toArray('.hero-word');
            const heroImages = gsap.utils.toArray('.hero-headline .img-placeholder');
            const heroSubtext = document.getElementById('hero-subtext');
            const heroButton = document.getElementById('hero-button');

            // Initialize image centers using xPercent/yPercent so GSAP scale transforms don't displace them
            // Also set inline transition to none to prevent conflict with GSAP updates
            gsap.set(heroImages, { xPercent: -50, yPercent: -50, scale: 0.7, transition: 'none' });

            const heroTl = gsap.timeline({ 
                defaults: { ease: 'power4.out', duration: 1.2 },
                onComplete: () => {
                    // Clear scale/transform inline styles so the stylesheet hover rule works
                    gsap.set(heroImages, { clearProps: 'transform,scale,transition' });
                }
            });

            if (heroWords.length > 0) {
                heroTl.fromTo(heroWords, {
                    y: '110%',
                    rotate: 5,
                    skewY: 7,
                    opacity: 0
                }, {
                    y: 0,
                    rotate: 0,
                    skewY: 0,
                    opacity: 1,
                    stagger: 0.08
                });
            }
            if (heroImages.length > 0) {
                heroTl.to(heroImages, { 
                    opacity: 1, 
                    scale: 1, 
                    stagger: 0.12, 
                    duration: 0.8,
                    ease: 'back.out(1.5)'
                }, '-=0.8');
            }
            if (heroSubtext) {
                heroTl.to(heroSubtext, { opacity: 1, y: 0 }, '-=0.9');
            }
            if (heroButton) {
                heroTl.to(heroButton, { opacity: 1, y: 0 }, '-=0.9');
            }
        }
    } else {
        // Simple instant/reduced motion fallback
        gsap.set('.hero-word, .hero-headline .img-placeholder, #hero-subtext, #hero-button', {
            opacity: 1,
            y: 0,
            scale: 1
        });
        gsap.set(revealHeadings, { opacity: 1 });
    }

    // --- Standard Fade/Slide elements ---
    const fadeElements = document.querySelectorAll('.animate-fade');
    fadeElements.forEach(el => {
        gsap.to(el, {
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: el,
                start: 'top 90%'
            }
        });
    });

    const defaultElements = document.querySelectorAll('.animate-element:not(.animate-left):not(.animate-right)');
    defaultElements.forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%'
            }
        });
    });

    // --- Image Clip-Path Reveals (Cinematic counter-scale mask reveal) ---
    const revealImages = document.querySelectorAll('.reveal-image');
    revealImages.forEach(img => {
        const wrapper = img.closest('.image-reveal-wrapper');
        if (!wrapper) return;

        if (!prefersReducedMotion) {
            // Mask the wrapper using clipPath, scale down the inner image in counter-motion
            // Disable native transitions inline during active GSAP updates
            gsap.set(wrapper, { clipPath: 'inset(100% 0% 0% 0%)' });
            gsap.set(img, { scale: 1.25, transition: 'none' });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });

            tl.to(wrapper, {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.5,
                ease: 'power3.inOut'
            })
            .to(img, {
                scale: 1,
                duration: 1.5,
                ease: 'power3.out',
                onComplete: () => {
                    // Remove inline transforms/transitions to let CSS hover effects take over smoothly
                    gsap.set(img, { clearProps: 'transform,scale,transition' });
                }
            }, '-=1.5');
        } else {
            gsap.set(wrapper, { clipPath: 'inset(0% 0% 0% 0%)' });
            gsap.set(img, { scale: 1 });
        }
    });

    // --- Parallax Section Backgrounds ---
    if (!prefersReducedMotion) {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        parallaxSections.forEach(section => {
            gsap.to(section, {
                yPercent: -10,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Scrub X Elements
        const scrubXElements = document.querySelectorAll('.scrub-x-element');
        scrubXElements.forEach(el => {
            gsap.to(el, {
                xPercent: gsap.utils.random(-4, 4),
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }

    // Squiggle line drawing
    const squiggle = document.querySelector('.squiggle #squiggle-path');
    if (squiggle) {
        if (!prefersReducedMotion) {
            gsap.to(squiggle, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: squiggle,
                    start: 'top 80%'
                }
            });
        } else {
            gsap.set(squiggle, { strokeDashoffset: 0 });
        }
    }
}

// --- Horizontal Scroll Logic ---
function initHorizontalScroll() {
    const scrollContainer = document.getElementById('horizontal-scroll-container');
    const scrollTrack = document.getElementById('horizontal-scroll-track');

    if (!scrollContainer || !scrollTrack) return;

    if (!prefersReducedMotion) {
        // Set layout properties
        scrollTrack.style.width = 'max-content';
        scrollTrack.style.flexDirection = 'row';

        const slides = gsap.utils.toArray('.slide');
        
        let scrollTween = gsap.to(scrollTrack, {
            x: () => -(scrollTrack.scrollWidth - scrollContainer.offsetWidth) + 'px',
            ease: 'none',
            scrollTrigger: {
                trigger: scrollContainer,
                pin: true,
                scrub: 0.5,
                start: 'top top',
                end: () => '+=' + (scrollTrack.scrollWidth - scrollContainer.offsetWidth),
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const velocity = self.getVelocity();
                    // Map scroll velocity to horizontal skew and scale warp
                    let skew = (velocity / 2500) * 8; // Max 8 degrees skew
                    skew = Math.max(-8, Math.min(8, skew));
                    
                    let scale = 1 - Math.min(0.04, Math.abs(velocity) / 40000);
                    
                    const cards = scrollTrack.querySelectorAll('.slide__content');
                    gsap.to(cards, {
                        skewX: skew,
                        scale: scale,
                        overwrite: 'auto',
                        duration: 0.25,
                        ease: 'power2.out'
                    });
                    
                    // Ensure elements return to resting state when scrolling halts
                    clearTimeout(scrollTrack.scrollTimeout);
                    scrollTrack.scrollTimeout = setTimeout(() => {
                        gsap.to(cards, {
                            skewX: 0,
                            scale: 1,
                            overwrite: 'auto',
                            duration: 0.65,
                            ease: 'power3.out'
                        });
                    }, 50);
                }
            }
        });

        // Update progress bar
        const progressBar = document.querySelector('.horiz-progress-bar-fill');
        if (progressBar) {
            gsap.to(progressBar, {
                width: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: scrollContainer,
                    start: 'top top',
                    end: () => '+=' + (scrollTrack.scrollWidth - scrollContainer.offsetWidth),
                    scrub: 0.3
                }
            });
        }

        // Slide number updates and text animation
        slides.forEach((slide, index) => {
            const heading = slide.querySelector('.slide__heading');
            const description = slide.querySelector('.slide__description');
            const imgCont = slide.querySelector('.slide__img-cont');
            const slideIndicator = document.querySelector(`.slide-step-num[data-step="${index}"]`);

            if (slideIndicator) {
                ScrollTrigger.create({
                    trigger: slide,
                    containerAnimation: scrollTween,
                    start: 'left center',
                    end: 'right center',
                    onToggle: self => {
                        if (self.isActive) {
                            document.querySelectorAll('.slide-step-num').forEach(num => num.classList.remove('active'));
                            slideIndicator.classList.add('active');
                        }
                    }
                });
            }

            if (heading) {
                gsap.fromTo(heading, 
                    { opacity: 0, y: 40 },
                    { 
                        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: slide,
                            containerAnimation: scrollTween,
                            start: 'left center+=150',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
            if (description) {
                gsap.fromTo(description,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1,
                        scrollTrigger: {
                            trigger: slide,
                            containerAnimation: scrollTween,
                            start: 'left center+=100',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
            if (imgCont) {
                gsap.fromTo(imgCont,
                    { opacity: 0, scale: 0.95 },
                    {
                        opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2,
                        scrollTrigger: {
                            trigger: slide,
                            containerAnimation: scrollTween,
                            start: 'left center',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
                
                const image = imgCont.querySelector('.slide__img');
                if (image) {
                    gsap.to(image, {
                        xPercent: -10,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: slide,
                            containerAnimation: scrollTween,
                            scrub: true,
                            start: 'left right',
                            end: 'right left'
                        }
                    });
                }
            }
        });
    } else {
        // Fallback layout for mobile/reduced-motion
        scrollTrack.style.width = '100%';
        scrollTrack.style.flexDirection = 'column';
    }
}

// --- Testimonial Slider (Carousel) ---
function initTestimonialSlider() {
    const sliderWrapper = document.getElementById('testimonial-wrapper');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    const slides = gsap.utils.toArray('#testimonial-wrapper .testimonial-card');

    if (!sliderWrapper || !prevButton || !nextButton || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    gsap.set(sliderWrapper, { willChange: 'transform' });

    function goToSlide(index) {
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }
        
        const duration = prefersReducedMotion ? 0.01 : 0.6;
        gsap.to(sliderWrapper, { 
            xPercent: -100 * index, 
            duration: duration, 
            ease: 'power3.inOut' 
        });
        
        currentIndex = index;
        updateSlides(currentIndex);
    }

    function updateSlides(newIndex) {
        slides.forEach((slide, i) => {
            const isActive = i === newIndex;
            slide.setAttribute('aria-hidden', !isActive);
            slide.setAttribute('aria-label', `Slide ${i + 1} of ${totalSlides}`);
            slide.tabIndex = isActive ? 0 : -1;
            
            // Add subtle active class styling
            if (isActive) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    updateSlides(currentIndex);
    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch Swipe Logic
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50;

    sliderWrapper.addEventListener('touchstart', (e) => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', (e) => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchendX < touchstartX - swipeThreshold) {
            goToSlide(currentIndex + 1);
        }
        if (touchendX > touchstartX + swipeThreshold) {
            goToSlide(currentIndex - 1);
        }
    }
}

// --- FAQ Accordion ---
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item-js');
    if (faqItems.length === 0) return;

    faqItems.forEach((item, index) => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        const questionId = `faq-question-${index + 1}`;
        const answerId = `faq-answer-${index + 1}`;

        if (questionButton) {
            questionButton.setAttribute('id', questionId);
            questionButton.setAttribute('aria-expanded', 'false');
            questionButton.setAttribute('aria-controls', answerId);
        }
        if (answer) {
            answer.setAttribute('id', answerId);
        }

        questionButton.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            const duration = prefersReducedMotion ? 0.01 : 0.45;

            // Collapse all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    const otherBtn = otherItem.querySelector('.faq-question');

                    gsap.to(otherAnswer, { 
                        height: 0, 
                        opacity: 0, 
                        paddingTop: 0, 
                        paddingBottom: 0, 
                        duration: duration, 
                        ease: 'power2.inOut' 
                    });
                    otherItem.classList.remove('active');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherIcon) otherIcon.textContent = '+';
                }
            });

            // Toggle current FAQ item
            if (!isActive) {
                item.classList.add('active');
                gsap.set(answer, { height: 'auto', opacity: 1 });
                gsap.from(answer, {
                    height: 0,
                    opacity: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    duration: duration,
                    ease: 'power3.out',
                    onComplete: () => gsap.set(answer, { maxHeight: 'none' })
                });
                questionButton.setAttribute('aria-expanded', 'true');
                if (icon) icon.textContent = '×';
            } else {
                gsap.to(answer, {
                    height: 0,
                    opacity: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    duration: duration,
                    ease: 'power3.inOut'
                });
                item.classList.remove('active');
                questionButton.setAttribute('aria-expanded', 'false');
                if (icon) icon.textContent = '+';
            }
        });
    });
}

// --- Smart Header Show/Hide on Scroll ---
function initSmartHeader() {
    if (prefersReducedMotion) return;

    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = 0;
    let isHeaderHidden = false;

    // Listen to scroll events on Lenis
    if (lenis) {
        lenis.on('scroll', (e) => {
            const currentScrollY = e.scroll;

            // Only hide header after scrolling past 150px
            if (currentScrollY > 150) {
                if (currentScrollY > lastScrollY && !isHeaderHidden) {
                    // Scroll down - hide header
                    gsap.to(header, { yPercent: -110, duration: 0.4, ease: 'power2.out' });
                    isHeaderHidden = true;
                } else if (currentScrollY < lastScrollY && isHeaderHidden) {
                    // Scroll up - show header
                    gsap.to(header, { yPercent: 0, duration: 0.4, ease: 'power2.out' });
                    isHeaderHidden = false;
                }
            } else {
                // Near the top - always show header
                gsap.to(header, { yPercent: 0, duration: 0.4, ease: 'power2.out' });
                isHeaderHidden = false;
            }

            lastScrollY = currentScrollY;
        });
    }
}

// --- Mobile Navigation Menu Overlay ---
let mobileMenuTimeline;
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const header = document.querySelector('header');
    
    if (!mobileMenuButton || !mobileMenuOverlay || !header) return;

    // Create the overlay open/close timeline
    mobileMenuTimeline = gsap.timeline({ paused: true });

    // Transition overlay position and opacity
    mobileMenuTimeline.to(mobileMenuOverlay, {
        yPercent: 0, // moves from translateY(100%) to translateY(0) because we set yPercent: 100 on init
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: 'power4.inOut'
    });

    const overlayLinks = mobileMenuOverlay.querySelectorAll('.mobile-overlay-link');
    mobileMenuTimeline.to(overlayLinks, {
        y: '0%',
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out'
    }, '-=0.3');

    // Ensure links are pre-translated down initially
    gsap.set(mobileMenuOverlay, { yPercent: 100, opacity: 0 });
    gsap.set(overlayLinks, { y: '100%' });

    let isMenuOpen = false;

    mobileMenuButton.addEventListener('click', () => {
        if (!isMenuOpen) {
            // Open Menu
            header.classList.add('menu-active');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            if (lenis) lenis.stop();
            mobileMenuTimeline.play();
            isMenuOpen = true;
        } else {
            // Close Menu
            header.classList.remove('menu-active');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenuTimeline.reverse();
            setTimeout(() => {
                if (lenis) lenis.start();
            }, 600);
            isMenuOpen = false;
        }
    });

    // Close when clicking mobile overlay links
    const mobileLinks = mobileMenuOverlay.querySelectorAll('.mobile-overlay-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                mobileMenuButton.click();
            }
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            mobileMenuButton.click();
        }
    });

    // Close on window resize if open and transitioning to desktop width
    window.addEventListener('resize', () => {
        if (isMenuOpen && window.innerWidth >= 768) {
            mobileMenuButton.click();
        }
    });
}

// --- Initialize Page Layout & Animations ---
function initializePage() {
    console.log("Initializing Uplift Founders Engine...");
    
    // Core Layout Engines
    initLenis();
    initSmartHeader();
    initCustomCursor();
    initMagnetics();
    init3DTilt();
    
    // UI Page Components
    initPageAnimations();
    initHorizontalScroll();
    initTestimonialSlider();
    initFAQAccordion();
    initMobileMenu();
}

// --- Preloader Orchestration ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const preloaderLogo = document.getElementById('preloader-logo');

    if (!preloader) {
        initializePage();
        return;
    }

    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        const preloaderTl = gsap.timeline({
            onComplete: () => {
                preloader.style.display = 'none';
                initializePage();
            }
        });

        preloaderTl
            .to(preloaderLogo, {
                scale: 1.4,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.inOut'
            })
            .to(preloader, {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');
    } else {
        // Fallback for missing GSAP or reduced motion
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            initializePage();
        }, 500);
    }
});

// Refresh triggers on window resize
window.addEventListener('resize', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});
