// PowerPoint-Style Navigation (Step-by-Step Reveal)
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    initPresentation();
});

const initPresentation = () => {
    const container = document.querySelector('.presentation-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    let currentSlideIndex = 0;

    // Map to store current step index for each slide
    // Key: Slide Index, Value: Current Step Index (-1 means no steps revealed yet)
    let slideSteps = new Array(slides.length).fill(-1);

    // Initial Setup
    const setupSlides = () => {
        slides.forEach((slide, index) => {
            const steps = slide.querySelectorAll('.steppable');
            // Hide all steps initially via JS to ensure logic matches visual state
            steps.forEach(step => {
                step.classList.remove('visible');
                gsap.set(step, { opacity: 0, y: 20 });
            });
        });
        updateUI(0);
    };

    const updateUI = (index) => {
        if (!dots[index]) return;

        // Update Dots
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');

        // Scroll to Slide
        slides[index].scrollIntoView({ behavior: 'smooth' });

        // Animate Title & Static Content (Non-steppable stuff)
        const title = slides[index].querySelector('h1, h2');
        const subtitle = slides[index].querySelector('.subtitle');
        const staticContent = slides[index].querySelectorAll('p:not(.steppable, .hidden-details p)');

        gsap.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
        if (subtitle) gsap.fromTo(subtitle, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.3 });
        if (staticContent.length) gsap.fromTo(staticContent, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.5 });
    };

    // --- NAVIGATION LOGIC ---
    const nextStep = () => {
        const currentSlide = slides[currentSlideIndex];
        const steps = currentSlide.querySelectorAll('.steppable');
        const currentStepIndex = slideSteps[currentSlideIndex];

        // If there are hidden steps in the current slide, reveal the next one
        if (currentStepIndex < steps.length - 1) {
            const nextStepIndex = currentStepIndex + 1;
            const stepToReveal = steps[nextStepIndex];

            // Reveal Logic
            stepToReveal.classList.add('visible');
            gsap.to(stepToReveal, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });

            slideSteps[currentSlideIndex] = nextStepIndex;
        }
        // If all steps revealed (or no steps), go to NEXT SLIDE
        else if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            updateUI(currentSlideIndex);
        }
    };

    const prevStep = () => {
        const currentSlide = slides[currentSlideIndex];
        const steps = currentSlide.querySelectorAll('.steppable');
        const currentStepIndex = slideSteps[currentSlideIndex];

        // If we are deep into steps, hide the last revealed one
        if (currentStepIndex >= 0) {
            const stepToHide = steps[currentStepIndex];

            // Hide Logic
            stepToHide.classList.remove('visible');
            gsap.to(stepToHide, { opacity: 0, y: 20, duration: 0.3 });

            slideSteps[currentSlideIndex] = currentStepIndex - 1;
        }
        // If no steps revealed, go to PREV SLIDE
        else if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateUI(currentSlideIndex);
        }
    };

    // Keyboard Listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            nextStep();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prevStep();
        }
    });

    // Dot Nav (Reserts steps for simplicity when jumping)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlideIndex = index;
            updateUI(currentSlideIndex);
        });
    });

    // Click to Reveal Details Logic (Preserved)
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
                    const fullHeight = details.scrollHeight + "px"; // Better calc
                    gsap.fromTo(details, { height: 0, opacity: 0 }, { height: fullHeight, opacity: 1, duration: 0.5 });
                    this.classList.add('expanded');
                }
            }
        });
    });

    // Initialize
    setupSlides();
};
