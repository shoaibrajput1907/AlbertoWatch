// Animations Module

window.Animations = {
    init() {
        this.setupIntersectionObserver();
        this.setupParallax();
        this.setupCounters();
    },

    setupIntersectionObserver() {
        const elements = $$('.animate-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            elements.forEach(el => observer.observe(el));
        } else {
            // Fallback
            elements.forEach(el => el.classList.add('visible'));
        }
    },

    setupParallax() {
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        if (!isDesktop) return;

        const parallaxElements = $$('.featured__image');
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                parallaxElements.forEach(el => {
                    // Simple parallax effect
                    const speed = 0.3;
                    const offset = scrollY * speed;
                    el.style.transform = `translateY(${onset}px)`;
                });
            });
        });
    },

    setupCounters() {
        const counters = $$('[data-count-to]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            counters.forEach(counter => observer.observe(counter));
        } else {
            counters.forEach(counter => this.animateCounter(counter));
        }
    },

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count-to'), 10);
        const duration = 2000;
        const start = performance.now();

        const easeOutQuad = t => t * (2 - t);

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentCount = Math.floor(easeOutQuad(progress) * target);
            element.textContent = currentCount.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(animate);
    }
};
