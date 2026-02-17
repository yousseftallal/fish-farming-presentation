// Slide Navigation & Animations
const initSlides = () => {
    const container = document.querySelector('.presentation-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    // GSAP Defaults
    gsap.registerPlugin(ScrollTrigger);

    const updateUI = (index) => {
        if (!dots[index]) return; // Safety check

        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');

        // Trigger Animations
        animateSlideContent(slides[index]);
    };

    // Scroll Spy
    let isScrolling = false;
    container.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollPos = container.scrollTop + (window.innerHeight / 2); // Center trigger
                const windowHeight = window.innerHeight;
                const index = Math.floor(scrollPos / windowHeight);

                if (index !== currentSlide && index >= 0 && index < slides.length) {
                    currentSlide = index;
                    updateUI(currentSlide);
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Keyboard Navigation
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

    // Dot Navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Initial Trigger
    setTimeout(() => updateUI(0), 100);
};

// Slide Content Animations (GSAP)
const animateSlideContent = (slide) => {
    if (!slide) return;

    // Select elements
    const title = slide.querySelector('h1, h2');
    const text = slide.querySelector('p, .text-content');
    const visual = slide.querySelector('.visual-content, .team-grid, .toc-list, .business-grid');
    const cards = slide.querySelectorAll('.m-card, .b-item, .team-member');

    // Reset and Animate
    if (title) {
        gsap.fromTo(title,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', clearProps: 'all' }
        );
    }

    if (text) {
        gsap.fromTo(text,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out', clearProps: 'all' }
        );
    }

    if (visual) {
        gsap.fromTo(visual,
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, delay: 0.4, ease: 'power3.out', clearProps: 'all' }
        );
    }

    if (cards.length > 0) {
        gsap.fromTo(cards,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'back.out(1.2)', clearProps: 'all' }
        );
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initSlides();
});
