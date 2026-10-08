// Modal Module - Uses existing HTML modal in index.html

window.Modal = {
    currentProductId: null,

    init() {
        this.overlay = $('#productModal');
        if (!this.overlay) return;

        this.modalImage = $('#modalImage');
        this.modalBrand = $('#modalBrand');
        this.modalName = $('#modalName');
        this.modalPrice = $('#modalPrice');
        this.modalDesc = $('#modalDesc');
        this.specMovement = $('#specMovement');
        this.specCase = $('#specCase');
        this.specStrap = $('#specStrap');
        this.specDial = $('#specDial');
        this.specWater = $('#specWater');
        this.addCartBtn = $('#modalAddCart');

        this.close = this.close.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);

        // Close button (the X icon)
        const closeBtn = this.overlay.querySelector('.modal__close');
        if (closeBtn) closeBtn.addEventListener('click', this.close);

        // Close outline button
        const closeBtnOutline = this.overlay.querySelector('.modal__close-btn');
        if (closeBtnOutline) closeBtnOutline.addEventListener('click', this.close);

        // Click outside to close
        this.overlay.addEventListener('click', e => {
            if (e.target === this.overlay) this.close();
        });

        // Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });

        // Add to cart
        if (this.addCartBtn) {
            this.addCartBtn.addEventListener('click', this.handleAddToCart);
        }
    },

    open(product) {
        if (!this.overlay) return;
        
        this.currentProductId = product.id;
        
        // Populate modal
        if (this.modalImage) {
            this.modalImage.src = product.image || 'assets/images/hero-watch.jpg';
            this.modalImage.alt = product.model || product.name || 'Watch';
        }
        if (this.modalBrand) this.modalBrand.textContent = product.brand || 'Alberto';
        if (this.modalName) this.modalName.textContent = product.model || product.name || 'Luxury Timepiece';
        if (this.modalPrice) this.modalPrice.textContent = formatPrice(product.price || 0);
        if (this.modalDesc) this.modalDesc.textContent = product.description || 'An exceptional timepiece crafted with precision and artistry.';
        
        // Specs
        if (product.specs) {
            if (this.specMovement) this.specMovement.textContent = product.specs.movement || '—';
            if (this.specCase) this.specCase.textContent = product.specs.caseMaterial || '—';
            if (this.specStrap) this.specStrap.textContent = product.specs.strapMaterial || '—';
            if (this.specDial) this.specDial.textContent = product.specs.dial || '—';
            if (this.specWater) this.specWater.textContent = product.specs.waterResistance || '—';
        }

        // Reset add to cart button
        if (this.addCartBtn) {
            this.addCartBtn.textContent = 'Add to Collection';
            this.addCartBtn.classList.remove('added');
        }
        
        // Show modal
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        if (!this.overlay) return;
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleAddToCart() {
        if (this.currentProductId && window.Products) {
            Products.addToCart(this.currentProductId);
            
            if (this.addCartBtn) {
                this.addCartBtn.textContent = 'Added ✓';
                this.addCartBtn.classList.add('added');
                
                setTimeout(() => {
                    if (this.overlay.classList.contains('active')) {
                        this.addCartBtn.textContent = 'Add to Collection';
                        this.addCartBtn.classList.remove('added');
                    }
                }, 2000);
            }
        }
    }
};
