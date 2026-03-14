/**
 * Profile UI Component
 * ====================
 * Handles all UI rendering and interactions for the profile page.
 */

const ProfileUI = {
    // DOM element references
    elements: {
        usernameDisplay: document.getElementById('usernameDisplay'),
        purchasesCarousel: document.getElementById('purchasesCarousel'),
        purchasesPagination: document.getElementById('purchasesPagination'),
        likesCarousel: document.getElementById('likesCarousel'),
        filterChips: document.querySelectorAll('.filter-chip')
    },

    // Current state
    state: {
        currentUser: null,
        purchases: [],
        likes: [],
        currentFilter: 'all'
    },

    /**
     * Initialize the profile UI
     */
    async init() {
        await this.loadUserData();
        await this.loadPurchases();
        await this.loadLikes();
        this.attachEventListeners();
    },

    /**
     * Load user data and update UI
     */
    async loadUserData() {
        try {
            const user = await API.getUserProfile();
            this.state.currentUser = user;
            
            // Display username (firstName or username)
            const displayName = user.firstName || user.username || 'Coffee Lover';
            this.elements.usernameDisplay.textContent = displayName;
        } catch (error) {
            console.error('Failed to load user data:', error);
            this.elements.usernameDisplay.textContent = 'Guest';
        }
    },

    /**
     * Load purchase history and render carousel
     */
    async loadPurchases() {
        try {
            const purchases = await API.getPurchaseHistory();
            this.state.purchases = purchases;
            this.renderPurchases();
            this.renderPaginationDots();
        } catch (error) {
            console.error('Failed to load purchases:', error);
            this.showError(this.elements.purchasesCarousel, 'Failed to load purchases');
        }
    },

    /**
     * Load likes and render carousel
     */
    async loadLikes(category = 'all') {
        try {
            const likes = await API.getUserLikes(category);
            this.state.likes = likes;
            this.renderLikes();
        } catch (error) {
            console.error('Failed to load likes:', error);
            this.showError(this.elements.likesCarousel, 'Failed to load likes');
        }
    },

    /**
     * Render purchase cards in carousel
     */
    renderPurchases() {
        const container = this.elements.purchasesCarousel;
        
        if (!this.state.purchases || this.state.purchases.length === 0) {
            container.innerHTML = '<div class="empty-message">No purchases yet</div>';
            return;
        }

        container.innerHTML = this.state.purchases.map(purchase => this.createPurchaseCard(purchase)).join('');
        
        // Attach event listeners to buttons
        this.state.purchases.forEach(purchase => {
            const card = document.querySelector(`[data-purchase-id="${purchase.id}"]`);
            if (card) {
                const rateBtn = card.querySelector('.rate-btn');
                const buyAgainBtn = card.querySelector('.buyagain-btn');
                
                rateBtn?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleRateClick(purchase.id, rateBtn);
                });
                
                buyAgainBtn?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleBuyAgain(purchase.id);
                });
            }
        });
    },

    /**
     * Create HTML for a purchase card
     */
    createPurchaseCard(purchase) {
        const statusBadge = purchase.status === 'completed' 
            ? '<div class="completed-badge">Completed</div>' 
            : '';
        
        const rateButtonText = purchase.rating ? 'Rated' : 'Rate';
        const ratedStyle = purchase.rating ? 'style="background: #6f7750; color: white;"' : '';

        return `
            <div class="purchase-card" data-purchase-id="${purchase.id}">
                ${statusBadge}
                <div class="coffee-name">${purchase.coffeeName}</div>
                <div class="purchase-detail">${purchase.size} | ${purchase.quantity}</div>
                <div class="total-amount">$${purchase.totalAmount.toFixed(2)}</div>
                <div class="purchase-actions">
                    <span class="rate-btn" ${ratedStyle}>${rateButtonText}</span>
                    <span class="buyagain-btn">Buy Again</span>
                </div>
            </div>
        `;
    },

    /**
     * Render like cards in carousel
     */
    renderLikes() {
        const container = this.elements.likesCarousel;
        
        if (!this.state.likes || this.state.likes.length === 0) {
            container.innerHTML = '<div class="empty-message">No items in this category</div>';
            return;
        }

        container.innerHTML = this.state.likes.map(like => this.createLikeCard(like)).join('');
    },

    /**
     * Create HTML for a like card
     */
    createLikeCard(like) {
        // Use placeholder image if imageUrl is not available
        const imageUrl = like.imageUrl || `https://via.placeholder.com/80x80/6f7750/ffffff?text=${encodeURIComponent(like.name.charAt(0))}`;

        return `
            <div class="like-card" data-category="${like.category}" data-like-id="${like.id}">
                <img src="${imageUrl}" alt="${like.name}" class="like-img">
                <h4>${like.name}</h4>
                <span class="like-price">$${like.price.toFixed(2)}</span>
            </div>
        `;
    },

    /**
     * Render pagination dots for purchases
     */
    renderPaginationDots() {
        const container = this.elements.purchasesPagination;
        const itemCount = this.state.purchases.length;
        const dotCount = Math.min(4, Math.ceil(itemCount / 2));
        
        let dots = '';
        for (let i = 0; i < dotCount; i++) {
            dots += `<span class="dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`;
        }
        
        container.innerHTML = dots;
        
        // Add click handlers
        container.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                this.scrollToPurchasePage(index);
            });
        });
    },

    /**
     * Scroll purchases carousel to specific page
     */
    scrollToPurchasePage(index) {
        const container = this.elements.purchasesCarousel;
        const scrollAmount = container.clientWidth * index;
        container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        
        // Update active dot
        this.elements.purchasesPagination.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        this.elements.purchasesPagination.querySelector(`[data-index="${index}"]`).classList.add('active');
    },

    /**
     * Handle rating button click
     */
    async handleRateClick(purchaseId, buttonElement) {
        const rating = prompt('Rate this product (1-5 stars):', '5');
        
        if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
            try {
                await API.addPurchaseRating(purchaseId, parseInt(rating));
                
                // Update UI
                buttonElement.textContent = 'Rated';
                buttonElement.style.background = '#6f7750';
                buttonElement.style.color = 'white';
                
                alert('Thank you for rating!');
            } catch (error) {
                console.error('Failed to add rating:', error);
                alert('Failed to submit rating. Please try again.');
            }
        } else if (rating !== null) {
            alert('Please enter a valid rating between 1 and 5');
        }
    },

    /**
     * Handle buy again button click
     */
    async handleBuyAgain(purchaseId) {
        try {
            await API.reorderPurchase(purchaseId);
            alert('Item added to cart!');
            // TODO: Redirect to cart or update cart count
        } catch (error) {
            console.error('Failed to reorder:', error);
            alert('Failed to add item to cart. Please try again.');
        }
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Filter chips
        this.elements.filterChips.forEach(chip => {
            chip.addEventListener('click', async (e) => {
                // Update active chip
                this.elements.filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                // Load filtered likes
                const filterValue = chip.dataset.filter;
                await this.loadLikes(filterValue);
            });
        });

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', async () => {
            if (confirm('Log out from Brew-Ha?')) {
                try {
                    await API.logout();
                    localStorage.removeItem('authToken');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Logout failed:', error);
                    // Still redirect even if API fails
                    window.location.href = 'index.html';
                }
            }
        });

        // Update pagination on scroll
        this.elements.purchasesCarousel?.addEventListener('scroll', () => {
            const scrollPosition = this.elements.purchasesCarousel.scrollLeft;
            const containerWidth = this.elements.purchasesCarousel.clientWidth;
            const activeIndex = Math.round(scrollPosition / containerWidth);
            
            this.elements.purchasesPagination.querySelectorAll('.dot').forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    },

    /**
     * Show error message in container
     */
    showError(container, message) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    },

    /**
     * Carousel scroll methods
     */
    scrollPurchases(direction) {
        const container = this.elements.purchasesCarousel;
        if (!container) return;
        
        const scrollAmount = 290; // Card width + gap
        container.scrollBy({ 
            left: direction === 'left' ? -scrollAmount : scrollAmount, 
            behavior: 'smooth' 
        });
    },

    scrollLikes(direction) {
        const container = this.elements.likesCarousel;
        if (!container) return;
        
        const scrollAmount = 240; // Like card width + gap
        container.scrollBy({ 
            left: direction === 'left' ? -scrollAmount : scrollAmount, 
            behavior: 'smooth' 
        });
    }
};

// Make methods available globally for onclick handlers
window.ProfileUI = ProfileUI;