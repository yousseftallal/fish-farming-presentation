// GSAP ScrollTrigger Animation (Auto-Scroll with Stagger)
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    initPresentation();
});

const initPresentation = () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Animate each slide when it enters the viewport
    slides.forEach((slide, index) => {
        // Elements to animate: title group, supervisors, rows, other content
        // We select generic classes we added or existing structure
        const elementsToAnimate = slide.querySelectorAll('.animate-item, h1, h2, .subtitle, p:not(.hidden-details p), .team-member, .toc-list li, .image-frame, .video-wrapper, .m-card, .b-item, .ai-point, .yolo-showcase, .feature-list li');

        // Initial state determination based on class
        elementsToAnimate.forEach(el => {
            // Reset transforms first
            gsap.set(el, { clearProps: "all" });

            if (el.classList.contains('anim-left')) {
                gsap.set(el, { x: -100, autoAlpha: 0 });
            } else if (el.classList.contains('anim-right')) {
                gsap.set(el, { x: 100, autoAlpha: 0 });
            } else if (el.classList.contains('anim-zoom')) {
                gsap.set(el, { scale: 0.5, autoAlpha: 0 });
            } else if (el.classList.contains('anim-blur')) {
                gsap.set(el, { filter: 'blur(10px)', autoAlpha: 0 });
            } else {
                // Default Fade Up
                gsap.set(el, { y: 50, autoAlpha: 0 });
            }
        });

        ScrollTrigger.create({
            trigger: slide,
            scroller: '.presentation-container',
            start: "top 60%",
            end: "bottom center",
            onEnter: () => {
                // Activate Dot
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');

                // Animate elements to neutral state
                gsap.to(elementsToAnimate, {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: "power3.out",
                    stagger: 0.15,
                    overwrite: 'auto'
                });
            },
            onEnterBack: () => {
                // Activate Dot (Reverse scroll)
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');

                // Re-play animation? Or just ensure visible?
                // User asked for "hiding and reappearing" behavior essentially by asking for "like before"
                // So we re-trigger the staggering entry
                gsap.to(elementsToAnimate, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.1,
                    overwrite: 'auto'
                });
            },
            onLeave: () => {
                // Optional: Fade out when leaving to reset? 
                // "Reset like before" implies they animate IN again next time.
                gsap.to(elementsToAnimate, {
                    autoAlpha: 0,
                    y: -30,
                    duration: 0.5,
                    overwrite: 'auto'
                });
            },
            onLeaveBack: () => {
                gsap.to(elementsToAnimate, {
                    autoAlpha: 0,
                    y: 30,
                    duration: 0.5,
                    overwrite: 'auto'
                });
            }
        });
    });

    // --- TEAM ACCORDION INTERACTION ---
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', (e) => {
            e.stopPropagation();
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
};
