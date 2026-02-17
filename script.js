// Hybrid Navigation & Team Interaction
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    initPresentation();
});

const initPresentation = () => {
    const container = document.querySelector('.presentation-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Initial Setup
    const setupSlides = () => {
        // Reset steppables
        slides.forEach((slide) => {
            const steps = slide.querySelectorAll('.steppable');
            steps.forEach(step => {
                step.classList.remove('visible');
                gsap.set(step, { opacity: 0, y: 30 });
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
        const title = slide.querySelector('h1, h2');
        const subtitle = slide.querySelector('.subtitle');
        const staticContent = slide.querySelectorAll('p:not(.steppable, .hidden-details p)');

        gsap.to([title, subtitle, staticContent], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 });
    };

    // --- HYBRID NAVIGATION LOGIC ---
    // Right Arrow: Reveal Next Item -> IF ALL REVEALED -> Scroll to Next Slide

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();

            // Find currently visible slide
            const slideHeight = window.innerHeight;
            const currentScroll = container.scrollTop;
            const currentSlideIndex = Math.round(currentScroll / slideHeight);

            if (currentSlideIndex >= 0 && currentSlideIndex < slides.length) {
                const currentSlide = slides[currentSlideIndex];
                const steps = currentSlide.querySelectorAll('.steppable');
                // Find first non-visible step
                let nextStepToReveal = null;
                for (let step of steps) {
                    if (!step.classList.contains('visible')) {
                        nextStepToReveal = step;
                        break;
                    }
                }

                if (nextStepToReveal) {
                    // Reveal it!
                    nextStepToReveal.classList.add('visible');
                    gsap.to(nextStepToReveal, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' });
                    // Scroll to ensure it's in view if needed
                    nextStepToReveal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    // All revealed? Go to NEXT SLIDE
                    if (currentSlideIndex < slides.length - 1) {
                        slides[currentSlideIndex + 1].scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        }
    });

    // --- TEAM ACCORDION INTERACTION ---
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling issues

            // Check if already active
            const isActive = member.classList.contains('expanded-card');

            // Reset all
            teamMembers.forEach(m => m.classList.remove('expanded-card'));

            if (!isActive) {
                member.classList.add('expanded-card');
            }
        });
    });

    // --- GENERIC CLICK TO REVEAL (Motivation, etc.) ---
    document.querySelectorAll('.expandable:not(.team-member)').forEach(item => {
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

    // Dot Nav
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    setupSlides();
};
