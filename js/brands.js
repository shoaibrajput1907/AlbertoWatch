// Brands Marquee Module

window.Brands = {
    init() {
        const track = $('.brands__track');
        if (!track) return;

        // Clone children for seamless scroll
        const items = Array.from(track.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        // The actual animation is handled in CSS (.brands__track animation)
        // Here we just add pause on hover
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    }
};
