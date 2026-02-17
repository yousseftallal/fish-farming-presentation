// Enhanced Slide Navigation with Staggered Animations & Interactions
document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    initSlides();

});

const initSlides = () => {
    const container = document.querySelector('.presentation-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    const updateUI = (index) => {
        if (!dots[index]) return;

        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');

        // Trigger animations for the new slide
        animateSlideContent(slides[index]);
    };

    // Scroll Spy
    let isScrolling = false;
    container.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollPos = container.scrollTop + (window.innerHeight / 2);
                const windowHeight = window.innerHeight;
                const index = Math.floor(scrollPos / windowHeight);

                if (index >= 0 && index < slides.length && index !== currentSlide) {
                    currentSlide = index;
                    updateUI(currentSlide);
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Keyboard Nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            if (currentSlide < slides.length - 1) {
                slides[currentSlide + 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            if (currentSlide > 0) {
                slides[currentSlide - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Dot Nav
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Click to Reveal Details Logic
    document.querySelectorAll('.expandable').forEach(item => {
        item.addEventListener('click', function (e) {
            // Prevent triggering if clicked logic bubbles up weirdly, but usually fine
            e.stopPropagation();

            const details = this.querySelector('.hidden-details');
            if (details) {
                const isVisible = details.style.display === 'block';

                if (isVisible) {
                    // Close
                    gsap.to(details, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            details.style.display = 'none';
                            this.classList.remove('expanded');
                        }
                    });
                } else {
                    // Open
                    details.style.display = 'block';
                    details.style.height = 'auto'; // Get full height
                    const fullHeight = details.offsetHeight;
                    details.style.height = '0px'; // Reset for animation

                    gsap.to(details, {
                        height: fullHeight,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                    this.classList.add('expanded');
                }
            }
        });
    });

    // Initial Trigger
    setTimeout(() => updateUI(0), 100);
};

const animateSlideContent = (slide) => {
    if (!slide) return;

    // Elements to animate
    const title = slide.querySelector('h1, h2');
    const subtitle = slide.querySelector('.subtitle');
    // Select text that isn't hidden details
    const textGroup = slide.querySelectorAll('p:not(.hidden-details p), ul.feature-list li, .toc-list li');
    // Select cards
    const cards = slide.querySelectorAll('.team-member, .m-card, .b-item, .ai-point, .result-badge');
    const visual = slide.querySelector('.visual-content');

    // Reset state before animating (important for re-triggering)
    gsap.set([title, subtitle, textGroup, cards, visual], { clearProps: 'all' });

    // Create Timeline for Staggered Effect
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Title
    if (title) {
        tl.fromTo(title, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
    }

    // 2. Subtitle
    if (subtitle) {
        tl.fromTo(subtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6");
    }

    // 3. Text & List Items (Staggered)
    if (textGroup.length > 0) {
        tl.fromTo(textGroup,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
            "-=0.5"
        );
    }

    // 4. Cards/Grid Items (Staggered)
    if (cards.length > 0) {
        tl.fromTo(cards,
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 },
            "-=0.5"
        );
    }

    // 5. Visuals (Images/Videos)
    if (visual) {
        tl.fromTo(visual,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1 },
            "-=0.8"
        );
    }
};
