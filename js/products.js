// Products Module

window.Products = {
    products: [],
    currentCategory: 'all',
    currentSort: 'featured',
    searchTerm: '',
    cart: [],

    async init() {
        try {
            const response = await fetch('data/products.json');
            if (response.ok) {
                const data = await response.json();
                this.products = Array.isArray(data) ? data : (data.products || []);
            } else {
                console.warn('Could not fetch products.json, using fallback data.');
                this.products = this.getFallbackData();
            }
        } catch (e) {
            console.error('Error fetching products:', e);
            this.products = this.getFallbackData();
        }

        this.setupEventListeners();
        
        // Load cart from localStorage
        const savedCart = localStorage.getItem('alberto_cart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (e) {
                this.cart = [];
            }
        }
        
        this.updateCartBadge();
        this.renderProducts();
        this.renderPriceList();
    },

    setupEventListeners() {
        // Filter buttons
        const filterBtns = $$('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
                e.target.classList.add('filter-btn--active');
                this.filterProducts(e.target.dataset.filter || 'all');
            });
        });

        // Sort select
        const sortSelect = $('#productSort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // Featured watch button
        const featuredBtn = $('.featured__btn');
        if (featuredBtn) {
            featuredBtn.addEventListener('click', () => {
                const productId = featuredBtn.dataset.productId;
                const product = this.products.find(p => p.id == productId);
                if (product && window.Modal) {
                    Modal.open(product);
                }
            });
        }
    },

    filterProducts(category) {
        this.currentCategory = category;
        this.renderProducts();
    },

    sortProducts(sortBy) {
        this.currentSort = sortBy;
        this.renderProducts();
    },

    searchProducts(term) {
        this.searchTerm = term.toLowerCase();
        this.renderProducts();
    },

    getFilteredProducts() {
        let filtered = [...this.products];

        // Category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.currentCategory);
        }

        // Search filter
        if (this.searchTerm) {
            filtered = filtered.filter(p => {
                const searchStr = `${p.name || ''} ${p.brand || ''} ${p.model || ''}`.toLowerCase();
                return searchStr.includes(this.searchTerm);
            });
        }

        // Sort
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'price-low': return (a.price || 0) - (b.price || 0);
                case 'price-high': return (b.price || 0) - (a.price || 0);
                case 'name': return (a.model || a.name || '').localeCompare(b.model || b.name || '');
                case 'featured':
                default:
                    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.id || 0) - (b.id || 0);
            }
        });

        return filtered;
    },

    renderProducts() {
        const grid = $('#productsGrid');
        if (!grid) return;

        grid.innerHTML = '';
        const items = this.getFilteredProducts();

        if (items.length === 0) {
            grid.innerHTML = '<p class="products__empty">No products found matching your criteria.</p>';
            return;
        }

        items.forEach((product, index) => {
            const card = createElement('div', 'product-card animate-on-scroll');
            card.dataset.id = product.id;
            card.style.animationDelay = `${index * 0.05}s`;

            card.innerHTML = `
                <div class="product-card__image">
                    <img src="${product.image || 'assets/images/hero-watch.jpg'}" alt="${product.model || product.name || 'Watch'}" loading="lazy">
                </div>
                <div class="product-card__info">
                    <span class="product-card__brand">${product.brand || 'Alberto'}</span>
                    <h3 class="product-card__name">${product.model || product.name || 'Luxury Watch'}</h3>
                    <p class="product-card__price">${formatPrice(product.price || 0)}</p>
                    <p class="product-card__specs">${product.specs ? `${product.specs.movement || ''} · ${product.specs.caseMaterial || ''}` : 'Premium Watch'}</p>
                    <button class="product-card__btn">View Details</button>
                </div>
            `;

            // Click listener for modal
            card.addEventListener('click', () => {
                if (window.Modal) {
                    Modal.open(product);
                }
            });

            grid.appendChild(card);
        });

        // Re-observe new elements for scroll animation
        if (window.Animations) {
            const newElements = grid.querySelectorAll('.animate-on-scroll');
            newElements.forEach(el => el.classList.add('visible')); // Show immediately since user scrolled here
        }
    },

    addToCart(productId) {
        const product = this.products.find(p => p.id == productId);
        if (product) {
            this.cart.push(product);
            localStorage.setItem('alberto_cart', JSON.stringify(this.cart));
            this.updateCartBadge();
            
            // Show toast
            this.showToast(`${product.brand || 'Alberto'} ${product.model || ''} added to collection`);
        }
    },

    showToast(message) {
        const toast = $('#toast');
        const toastMsg = $('#toastMessage');
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
    },

    updateCartBadge() {
        const badge = $('.navbar__cart-badge');
        if (badge) {
            badge.textContent = this.cart.length;
            badge.style.display = this.cart.length > 0 ? 'flex' : 'none';
        }
    },

    renderPriceList() {
        const tableBody = $('#pricelistBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        const showAll = this._showAllPrices || false;
        const items = showAll ? this.products : this.products.slice(0, 10);
        
        items.forEach(product => {
            const tr = createElement('tr');
            const categoryLabel = (product.category || 'luxury').charAt(0).toUpperCase() + (product.category || 'luxury').slice(1);
            tr.innerHTML = `
                <td>${product.model || product.name}</td>
                <td>${product.brand || 'Alberto'}</td>
                <td>${categoryLabel}</td>
                <td>${formatPrice(product.price || 0)}</td>
            `;
            tableBody.appendChild(tr);
        });
    },

    togglePriceList() {
        this._showAllPrices = !this._showAllPrices;
        this.renderPriceList();
        const toggleBtn = $('#pricelistToggle');
        if (toggleBtn) {
            toggleBtn.textContent = this._showAllPrices ? 'Show Less' : 'View Full Price List';
        }
    },

    getFallbackData() {
        return [
            { id: 1, brand: 'Alberto', model: 'Sovereign Chronograph', name: 'Alberto Sovereign Chronograph', category: 'luxury', price: 12500, featured: true, image: 'assets/images/featured-watch.jpg', specs: { movement: 'Swiss Automatic', caseMaterial: '18K Rose Gold', strapMaterial: 'Italian Leather', dial: 'Midnight Blue Sunburst', waterResistance: '100m' }, description: 'The pinnacle of Alberto watchmaking artistry.' },
            { id: 2, brand: 'Alberto', model: 'Heritage Classic', name: 'Alberto Heritage Classic', category: 'vintage', price: 4500, featured: false, image: 'assets/images/vintage-collection.jpg', specs: { movement: 'Manual Wind', caseMaterial: 'Stainless Steel', strapMaterial: 'Brown Leather', dial: 'Cream', waterResistance: '30m' }, description: 'A timeless tribute to horological tradition.' },
            { id: 3, brand: 'Alberto', model: 'Pulse Pro', name: 'Alberto Pulse Pro', category: 'smart', price: 599, featured: false, image: 'assets/images/smart-collection.jpg', specs: { movement: 'Digital', caseMaterial: 'Titanium', strapMaterial: 'Silicone', dial: 'AMOLED', waterResistance: '50m' }, description: 'Where tradition meets innovation.' }
        ];
    }
};
