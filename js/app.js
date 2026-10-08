// Main Application Controller

window.App = {
    async init() {
        try {
            if (window.Navigation) Navigation.init();
            if (window.Hero) Hero.init();
            if (window.Brands) Brands.init();
            if (window.Products) await Products.init();
            if (window.Modal) Modal.init();
            if (window.Gallery) Gallery.init();
            if (window.Animations) Animations.init();

            this.setupContactForm();
            this.setupStoreLocator();
            this.setupPriceList();
            this.setupNewsletter();

            console.log('Alberto Watch Company — Initialized');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    },

    setupContactForm() {
        const form = $('#contactForm');
        if (!form) return;

        form.addEventListener('submit', e => {
            e.preventDefault();
            let isValid = true;
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const group = field.closest('.form-group');
                if (!field.value.trim()) {
                    isValid = false;
                    if (group) group.classList.add('error');
                } else {
                    if (group) group.classList.remove('error');
                }
            });
            
            // Validate email format
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    const group = emailField.closest('.form-group');
                    if (group) group.classList.add('error');
                }
            }

            if (isValid) {
                // Show success message
                const formSuccess = $('#formSuccess');
                const submitText = form.querySelector('.contact__submit-text');
                const submitLoading = form.querySelector('.contact__submit-loading');
                const submitBtn = form.querySelector('button[type="submit"]');
                
                // Show loading briefly
                if (submitText) submitText.style.display = 'none';
                if (submitLoading) submitLoading.style.display = 'inline';
                if (submitBtn) submitBtn.disabled = true;

                setTimeout(() => {
                    if (formSuccess) formSuccess.style.display = 'flex';
                    if (submitText) submitText.style.display = 'inline';
                    if (submitLoading) submitLoading.style.display = 'none';
                    
                    setTimeout(() => {
                        form.reset();
                        if (formSuccess) formSuccess.style.display = 'none';
                        if (submitBtn) submitBtn.disabled = false;
                    }, 4000);
                }, 1000);
            }
        });

        // Remove error on input
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                const group = field.closest('.form-group');
                if (group) group.classList.remove('error');
            });
        });
    },

    setupStoreLocator() {
        const searchInput = $('#storeSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', debounce(e => {
            const term = e.target.value.toLowerCase();
            const storeCards = $$('.store-card');
            
            storeCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(term) || term === '') {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }, 300));
    },

    setupPriceList() {
        const toggleBtn = $('#pricelistToggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            if (window.Products) {
                Products.togglePriceList();
            }
        });
    },

    setupNewsletter() {
        const form = $('#newsletterForm');
        if (!form) return;

        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = form.querySelector('input');
            if (input && input.value) {
                const btn = form.querySelector('button');
                if (btn) {
                    btn.innerHTML = '✓';
                    input.value = '';
                    input.placeholder = 'Subscribed!';
                    setTimeout(() => {
                        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
                        input.placeholder = 'Your email address';
                    }, 3000);
                }
            }
        });
    }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => App.init());
