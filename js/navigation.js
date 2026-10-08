// Navigation Module

window.Navigation = {
    init() {
        this.navbar = $('.navbar');
        this.mobileMenu = $('#mobileMenu');
        this.hamburger = $('.navbar__hamburger');
        this.searchBtn = $('.navbar__search-btn');
        this.searchOverlay = $('#searchOverlay');
        this.searchInput = $('#searchInput');
        this.searchClose = $('.search-overlay__close');
        
        this.visitorNumber = $('.navbar__visitor-number');
        this.backToTopBtn = $('#backToTop');

        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', throttle(this.handleScroll, 50));
        
        this.setupSmoothScroll();
        this.setupMobileMenu();
        this.setupSearch();
        this.updateVisitorCount();
        this.setupBackToTop();
        this.setupCollectionLinks();
    },

    handleScroll() {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            // Navbar background
            if (this.navbar) {
                if (scrollY > 80) {
                    this.navbar.classList.add('navbar--scrolled');
                } else {
                    this.navbar.classList.remove('navbar--scrolled');
                }
            }

            // Back to top visibility
            if (this.backToTopBtn) {
                if (scrollY > 500) {
                    this.backToTopBtn.classList.add('visible');
                } else {
                    this.backToTopBtn.classList.remove('visible');
                }
            }

            // Update active link
            const sections = $$('section[id]');
            let currentId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (scrollY >= sectionTop) {
                    currentId = section.getAttribute('id');
                }
            });

            $$('.navbar__link').forEach(link => {
                link.classList.remove('navbar__link--active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('navbar__link--active');
                }
            });
        });
    },

    setupSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetEl = $(targetId);
                if (targetEl) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (this.mobileMenu && this.mobileMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }

                    const headerOffset = this.navbar ? this.navbar.offsetHeight : 80;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    setupMobileMenu() {
        if (!this.hamburger || !this.mobileMenu) return;

        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close on overlay click
        this.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.mobileMenu) {
                this.toggleMobileMenu();
            }
        });

        // Close mobile links
        $$('.navbar__mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                if (this.mobileMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    },

    setupSearch() {
        if (!this.searchBtn || !this.searchOverlay || !this.searchInput) return;

        this.searchBtn.addEventListener('click', () => {
            this.searchOverlay.classList.toggle('active');
            if (this.searchOverlay.classList.contains('active')) {
                setTimeout(() => this.searchInput.focus(), 100);
            }
        });

        if (this.searchClose) {
            this.searchClose.addEventListener('click', () => {
                this.searchOverlay.classList.remove('active');
            });
        }

        this.searchInput.addEventListener('input', debounce(e => {
            const term = e.target.value.trim();
            if (window.Products) {
                // Scroll to products if needed
                const productsSection = $('#products');
                if (productsSection && term.length > 0) {
                    window.scrollTo({
                        top: productsSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
                Products.searchProducts(term);
            }
        }, 300));

        this.searchInput.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                this.searchOverlay.classList.remove('active');
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.searchOverlay.classList.contains('active')) {
                this.searchOverlay.classList.remove('active');
            }
        });
    },

    updateVisitorCount() {
        if (!this.visitorNumber) return;
        let count = parseInt(localStorage.getItem('alberto_visitors')) || 12847;
        count += 1;
        localStorage.setItem('alberto_visitors', count);
        this.visitorNumber.textContent = count.toLocaleString();
    },

    setupBackToTop() {
        if (!this.backToTopBtn) return;
        this.backToTopBtn.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    setupCollectionLinks() {
        // Collection cards filter products
        $$('.collection-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                if (category && window.Products) {
                    // Scroll to products section
                    const productsSection = $('#products');
                    if (productsSection) {
                        const headerOffset = this.navbar ? this.navbar.offsetHeight : 80;
                        window.scrollTo({
                            top: productsSection.offsetTop - headerOffset,
                            behavior: 'smooth'
                        });
                    }
                    // Update filter buttons
                    $$('.filter-btn').forEach(btn => {
                        btn.classList.remove('filter-btn--active');
                        if (btn.dataset.filter === category) {
                            btn.classList.add('filter-btn--active');
                        }
                    });
                    Products.filterProducts(category);
                }
            });
        });
    }
};
