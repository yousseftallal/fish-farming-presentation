// Strict PowerPoint-Style Navigation & Hybrid Scroll
document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP is loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initPresentation();
    } else {
        console.error("GSAP or ScrollTrigger not loaded.");
    }
});

const initPresentation = () => {
    const container = document.querySelector('.presentation-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Initial Setup
    const setupSlides = () => {
        slides.forEach((slide) => {
            const steps = slide.querySelectorAll('.steppable');
            steps.forEach(step => {
                step.classList.remove('visible');
                // Use autoAlpha for better performance (sets opacity + visibility)
                gsap.set(step, { autoAlpha: 0, y: 30 });
            });
        });

        // Scroll Spy
        slides.forEach((slide, index) => {
            ScrollTrigger.create({
                trigger: slide,
                scroller: '.presentation-container',
                start: "top center",
                end: "bottom center",
                onEnter: () => activateSlide(index),
                onEnterBack: () => activateSlide(index)
            });
        });
    };

    const activateSlide = (index) => {
        // Update Dots
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');

        // Animate Entry Content (Titles, etc.) that are NOT steppable
        const slide = slides[index];
        if (!slide) return;

        const title = slide.querySelector('h1, h2');
        const subtitle = slide.querySelector('.subtitle');
        // Get static p tags that are NOT children of hidden details (prevents double selection)
        const staticContent = slide.querySelectorAll('p:not(.steppable):not(.hidden-details p)');

        // Safely collect animation targets that actually exist
        const targetsToAnimate = [];
        if (title) targetsToAnimate.push(title);
        if (subtitle) targetsToAnimate.push(subtitle);
        if (staticContent.length > 0) targetsToAnimate.push(...staticContent);

        if (targetsToAnimate.length > 0) {
            gsap.to(targetsToAnimate, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, overwrite: 'auto' });
        }
    };

    // --- HYBRID NAVIGATION LOGIC ---
    // Right Arrow: Reveal Next Item -> IF ALL REVEALED -> Scroll to Next Slide

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {

            // Find currently visible slide
            const slideHeight = window.innerHeight;
            // Use 10px buffer
            const currentScroll = container.scrollTop;
            const currentSlideIndex = Math.round(currentScroll / slideHeight);

            if (currentSlideIndex >= 0 && currentSlideIndex < slides.length) {
                const currentSlide = slides[currentSlideIndex];
                const steps = currentSlide.querySelectorAll('.steppable');

                // Find first non-visible step
                let nextStepToReveal = null;
                for (let i = 0; i < steps.length; i++) {
                    // Check specific visibility class or style
                    if (!steps[i].classList.contains('visible') || getComputedStyle(steps[i]).visibility === 'hidden') {
                        nextStepToReveal = steps[i];
                        break;
                    }
                }

                if (nextStepToReveal) {
                    e.preventDefault(); // Stop scrolling
                    // Reveal it!
                    nextStepToReveal.classList.add('visible');
                    gsap.to(nextStepToReveal, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' });

                    // Small auto-scroll only if element is off-screen
                    const rect = nextStepToReveal.getBoundingClientRect();
                    if (rect.bottom > window.innerHeight) {
                        nextStepToReveal.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                } else {
                    // All revealed? Go to NEXT SLIDE
                    if (currentSlideIndex < slides.length - 1) {
                        e.preventDefault();
                        slides[currentSlideIndex + 1].scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            // Optional: Go back to previous slide if desired
            // Not implementing "Un-reveal" for simplicity, just slide navigation
            const slideHeight = window.innerHeight;
            const currentScroll = container.scrollTop;
            const currentSlideIndex = Math.round(currentScroll / slideHeight);
            if (currentSlideIndex > 0) {
                e.preventDefault();
                slides[currentSlideIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // --- TEAM ACCORDION INTERACTION ---
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', (e) => {
            e.stopPropagation();

            // Toggle
            const isActive = member.classList.contains('expanded-card');

            // Collapse all
            teamMembers.forEach(m => m.classList.remove('expanded-card'));

            if (!isActive) {
                // Expand clicked
                member.classList.add('expanded-card');
            }
        });
    });

    // --- GENERIC CLICK TO REVEAL ---
    document.querySelectorAll('.expandable:not(.team-member)').forEach(item => {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            const details = this.querySelector('.hidden-details');
            if (details) {
                const isVisible = details.style.display === 'block';
                if (isVisible) {
                    gsap.to(details, {
                        height: 0, autoAlpha: 0, duration: 0.3,
                        onComplete: () => { details.style.display = 'none'; this.classList.remove('expanded'); }
                    });
                } else {
                    details.style.display = 'block';
                    const fullHeight = details.scrollHeight;
                    gsap.fromTo(details, { height: 0, autoAlpha: 0 }, { height: fullHeight, autoAlpha: 1, duration: 0.5 });
                    this.classList.add('expanded');
                }
            }
        });
    });

    // Dot Nav
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    setupSlides();
};
