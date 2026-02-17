// Simplified Slide Navigation
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

    // Initial Trigger
    setTimeout(() => updateUI(0), 100);
};

const animateSlideContent = (slide) => {
    if (!slide) return;

    // Elements
    const title = slide.querySelector('h1, h2');
    const subtitle = slide.querySelector('.subtitle');
    const text = slide.querySelectorAll('p, li');
    const visual = slide.querySelector('.visual-content, .team-grid, .business-grid');

    // Reset
    gsap.set([title, subtitle, text, visual], { clearProps: 'all' });

    // Animate
    if (title) {
        gsap.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
    }
    if (visual) {
        gsap.fromTo(visual, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: 'back.out(1.2)' });
    }
};
