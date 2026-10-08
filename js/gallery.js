// Gallery Module - Uses existing HTML lightbox in index.html

window.Gallery = {
    images: [
        { src: 'assets/images/hero-watch.jpg', category: 'Luxury' },
        { src: 'assets/images/luxury-collection.jpg', category: 'Luxury' },
        { src: 'assets/images/vintage-collection.jpg', category: 'Vintage' },
        { src: 'assets/images/smart-collection.jpg', category: 'Smart' },
        { src: 'assets/images/featured-watch.jpg', category: 'Featured' },
        { src: 'assets/images/gallery-1.jpg', category: 'Movement' },
        { src: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a??w=600&h=800&fit=crop', category: 'Luxury' },
        { src: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=400&fit=crop', category: 'Classic' },
        { src: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&h=600&fit=crop', category: 'Detail' },
        { src: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=700&fit=crop', category: 'Vintage' },
        { src: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop', category: 'Luxury' },
        { src: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=500&fit=crop', category: 'Detail' }
    ],
    currentIndex: 0,

    init() {
        const grid = $('#galleryGrid');
        if (!grid) return;

        grid.innerHTML = '';
        this.images.forEach((img, index) => {
            const item = createElement('div', 'gallery__item animate-on-scroll');
            item.innerHTML = `
                <img src="${img.src}" loading="lazy" alt="Gallery — ${img.category}">
                <div class="gallery__item__overlay">
                    <span>${img.category}</span>
                </div>
            `;
            item.addEventListener('click', () => this.openLightbox(index));
            grid.appendChild(item);
        });

        this.setupLightbox();
    },

    setupLightbox() {
        // Use the existing lightbox HTML in index.html
        this.lightbox = $('#lightbox');
        if (!this.lightbox) return;

        this.lightboxImg = $('#lightboxImage');
        
        const closeBtn = this.lightbox.querySelector('.lightbox__close');
        const prevBtn = this.lightbox.querySelector('.lightbox__nav--prev');
        const nextBtn = this.lightbox.querySelector('.lightbox__nav--next');

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.navigate(-1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.navigate(1); });
        
        this.lightbox.addEventListener('click', e => {
            if (e.target === this.lightbox) this.closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (!this.lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });
    },

    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightboxImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    },

    navigate(direction) {
        this.currentIndex += direction;
        if (this.currentIndex < 0) this.currentIndex = this.images.length - 1;
        if (this.currentIndex >= this.images.length) this.currentIndex = 0;
        
        if (this.lightboxImg) {
            this.lightboxImg.style.opacity = '0';
            setTimeout(() => {
                this.updateLightboxImage();
                this.lightboxImg.style.opacity = '1';
            }, 200);
        }
    },
    
    updateLightboxImage() {
        if (this.lightboxImg) {
            this.lightboxImg.src = this.images[this.currentIndex].src;
            this.lightboxImg.alt = `Gallery — ${this.images[this.currentIndex].category}`;
        }
    }
};
