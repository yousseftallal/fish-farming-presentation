// Mixed Navigation: Normal Scroll + Arrow Key Reveal
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    initPresentation();
});

const initPresentation = () => {
    const container = document.querySelector('.presentation-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Track revealed steps per slide
    let slideSteps = new Array(slides.length).fill(-1);

    // Initial Setup
    const setupSlides = () => {
        slides.forEach((slide) => {
            const steps = slide.querySelectorAll('.steppable');
            steps.forEach(step => {
                step.classList.remove('visible');
                gsap.set(step, { opacity: 0, y: 30 });
            });
        });

        // Setup Scroll Spy to update active Dot and trigger Slide Entrance animations
        slides.forEach((slide, index) => {
            ScrollTrigger.create({
                trigger: slide,
                scroller: '.presentation-container',
                start: "top center",
                end: "bottom center",
                onEnter: () => updateActiveSlide(index),
                onEnterBack: () => updateActiveSlide(index)
            });
        });
    };

    const updateActiveSlide = (index) => {
        // Update Dots
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');

        // Animate Entry Content (Titles, etc.) that are NOT steppable
        const slide = slides[index];
        const title = slide.querySelector('h1, h2');
        const subtitle = slide.querySelector('.subtitle');
        const staticContent = slide.querySelectorAll('p:not(.steppable, .hidden-details p)');

        gsap.to([title, subtitle, staticContent], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 });
    };

    // --- KEYBOARD REVEAL LOGIC ONLY ---
    // Does NOT control scroll. User scrolls normally.
    // Arrow Right: Reveal next item in CURRENTLY VISIBLE slide.

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            // Find currently visible slide based on scroll position
            const slideHeight = window.innerHeight;
            const currentScroll = container.scrollTop;
            const currentSlideIndex = Math.round(currentScroll / slideHeight);

            if (currentSlideIndex >= 0 && currentSlideIndex < slides.length) {
                const currentSlide = slides[currentSlideIndex];
                const steps = currentSlide.querySelectorAll('.steppable');
                const currentStepIndex = slideSteps[currentSlideIndex];

                if (currentStepIndex < steps.length - 1) {
                    // We have more steps to reveal in this slide
                    e.preventDefault(); // Stop page from scrolling down/right

                    const nextStepIndex = currentStepIndex + 1;
                    const stepToReveal = steps[nextStepIndex];

                    stepToReveal.classList.add('visible');
                    gsap.to(stepToReveal, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' });

                    slideSteps[currentSlideIndex] = nextStepIndex;
                }
                // If all steps revealed, do nothing. Let user scroll normally.
            }
        }
    });

    // Dot Nav (Scrolls to slide)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Expandable Details Logic
    document.querySelectorAll('.expandable').forEach(item => {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            const details = this.querySelector('.hidden-details');
            if (details) {
                const isVisible = details.style.display === 'block';
                if (isVisible) {
                    gsap.to(details, {
                        height: 0, opacity: 0, duration: 0.3,
                        onComplete: () => { details.style.display = 'none'; this.classList.remove('expanded'); }
                    });
                } else {
                    details.style.display = 'block';
                    const fullHeight = details.scrollHeight;
                    gsap.fromTo(details, { height: 0, opacity: 0 }, { height: fullHeight, opacity: 1, duration: 0.5 });
                    this.classList.add('expanded');
                }
            }
        });
    });

    setupSlides();
};
