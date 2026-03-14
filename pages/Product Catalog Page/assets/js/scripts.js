// Global variables
let menuData = {
    drinks: [],
    pastry: [],
    pasta: []
};

let originalData = {
    drinks: [],
    pastry: [],
    pasta: []
};

let currentSort = 'default';
let currentPieces = 1;
let currentBasePrice = 0;

// Fallback data in case database connection fails


// Fetch products from database
async function fetchProductsFromDB() {
    try {
        console.log('Fetching products from database...');
        
        // Try multiple possible paths
        const possiblePaths = [
            '/api/get_products.php',
            '../api/get_products.php',
            '../../api/get_products.php',
            'api/get_products.php'
        ];
        
        let response = null;
        let lastError = null;
        
        for (const path of possiblePaths) {
            try {
                console.log('Trying path:', path);
                response = await fetch(path);
                if (response.ok) {
                    console.log('Success with path:', path);
                    break;
                }
            } catch (e) {
                lastError = e;
                console.log('Failed with path:', path);
            }
        }
        
        if (!response || !response.ok) {
            throw new Error('Could not connect to API. Using fallback data. Error: ' + (lastError ? lastError.message : 'Unknown error'));
        }
        
        const result = await response.json();
        console.log('Database response:', result);
        
        if (result.success && result.data) {
            // Check if we have data in the expected format
            if (result.data.drinks && result.data.drinks.length > 0) {
                menuData = result.data;
            } else {
                // If data is empty but success is true, use fallback
                console.log('Database returned empty data, using fallback');
                menuData = JSON.parse(JSON.stringify(FALLBACK_DATA));
            }
        } else {
            console.error('Failed to fetch products:', result.error);
            menuData = JSON.parse(JSON.stringify(FALLBACK_DATA));
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        menuData = JSON.parse(JSON.stringify(FALLBACK_DATA));
    }
    
    // Create deep copy for original data
    originalData = {
        drinks: menuData.drinks.map(item => ({...item})),
        pastry: menuData.pastry.map(item => ({...item})),
        pasta: menuData.pasta.map(item => ({...item}))
    };
    
    // Render all sections
    renderAll();
    updateCartBadge();
    
    console.log('Products loaded successfully:', menuData);
}

// Cart functions
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('brewhaCart')) || [];
    } catch (e) {
        console.error('Error parsing cart:', e);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('brewhaCart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function initializeEmptyCart() {
    if (!localStorage.getItem('brewhaCart')) {
        saveCart([]);
    }
    updateCartBadge();
}

// Rendering functions
function renderSection(sectionId, dataArray) {
    const container = document.getElementById(sectionId);
    if (!container) return;

    let sortedData = [...dataArray];
    if (currentSort === 'low') sortedData.sort((a, b) => a.price - b.price);
    else if (currentSort === 'high') sortedData.sort((a, b) => b.price - a.price);

    if (sortedData.length === 0) {
        container.innerHTML = '<div style="color: white; padding: 20px;">No products available in this category.</div>';
        return;
    }

    container.innerHTML = sortedData.map(item => `
        <div class="card" onclick="openModal('${sectionId}', '${item.name.replace(/'/g, "\\'")}')">
            <img src="assets/img/${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/140x140?text=${item.name}'">
            <span>${item.name}</span>
            <div class="price">₱${item.price}</div>
        </div>
    `).join('');

    container.scrollLeft = 0;
    setTimeout(() => updateActiveDot(container), 50);
}

function renderAll() {
    renderSection('drinks', menuData.drinks);
    renderSection('pastry', menuData.pastry);
    renderSection('pasta', menuData.pasta);
}

// Sort functions
function sortAllSections(order) {
    currentSort = order;
    renderAll();
    document.getElementById('sortBtn').textContent = order === 'low' ? 'Price: Low to High ▼' : 'Price: High to Low ▼';
}

function resetToOriginal() {
    menuData = {
        drinks: originalData.drinks.map(item => ({...item})),
        pastry: originalData.pastry.map(item => ({...item})),
        pasta: originalData.pasta.map(item => ({...item}))
    };
    currentSort = 'default';
    renderAll();
    document.getElementById('sortBtn').textContent = 'Sort by Price ▼';
}

// Filter functions
function filterMenu(sectionId) {
    document.querySelectorAll(".menu-section").forEach(s => s.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
    window.scrollTo({top: 120, behavior: "smooth"});
}

// Carousel functions
function scrollCarousel(id, step) {
    const container = document.getElementById(id);
    if (!container) return;
    const visibleSetWidth = 705;
    let newScrollLeft = container.scrollLeft + (step > 0 ? visibleSetWidth : -visibleSetWidth);
    const maxScroll = container.scrollWidth - container.clientWidth;
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    setTimeout(() => updateActiveDot(container), 200);
}

function updateActiveDot(container) {
    const section = container.closest('.menu-section');
    if (!section) return;
    const dots = section.querySelectorAll('.dot');
    if (dots.length === 0) return;
    const pageWidth = 705;
    const pageIndex = Math.round(container.scrollLeft / pageWidth);
    const safeIndex = Math.min(pageIndex, dots.length - 1);
    dots.forEach((dot, idx) => {
        if (idx === safeIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

// Modal functions
function openModal(sectionId, productName) {
    let product;
    if (sectionId === 'drinks') product = menuData.drinks.find(p => p.name === productName);
    else if (sectionId === 'pastry') product = menuData.pastry.find(p => p.name === productName);
    else if (sectionId === 'pasta') product = menuData.pasta.find(p => p.name === productName);

    if (!product) return;

    const isDrink = sectionId === 'drinks';
    const hasPieces = sectionId === 'pastry' || sectionId === 'pasta';

    const sizeSectionHTML = isDrink ? `
        <div class="size-section">
            <div class="size-title">Select Size</div>
            <div class="size-options">
                <button class="size-btn" data-size="Tall" data-price-multiplier="0" onclick="selectSize(this, ${product.price})">TALL</button>
                <button class="size-btn selected" data-size="Grande" data-price-multiplier="10" onclick="selectSize(this, ${product.price})">GRANDE (+₱10)</button>
                <button class="size-btn" data-size="Venti" data-price-multiplier="25" onclick="selectSize(this, ${product.price})">VENTI (+₱25)</button>
            </div>
        </div>
    ` : '';

    const piecesSectionHTML = hasPieces ? `
        <div class="size-section">
            <div class="size-title">Select Quantity</div>
            <div class="pieces-control">
                <button class="qty-btn" onclick="changePieces(-1, ${product.price})">−</button>
                <span id="piecesCount">1</span>
                <button class="qty-btn" onclick="changePieces(1, ${product.price})">+</button>
            </div>
            <div id="piecesTotal">Total: ₱${product.price}</div>
        </div>
    ` : '';

    const modalHtml = `
        <div class="modal-content">
            <div class="modal-left">
                <img src="assets/img/${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280?text=${product.name}'">
            </div>
            <div class="modal-right">
                <div class="modal-badge">BREW-HA</div>
                <div class="available"><i class="fas fa-circle" style="color: #2a7a2a; font-size: 0.6rem;"></i> ${product.availability || 'Available'}</div>
                <div class="category">${product.category || sectionId}</div>
                <div class="name-price">
                    <span class="product-name">${product.name}</span>
                    <span class="product-price" id="modalPrice">₱${product.price}</span>
                </div>
                <div class="description">${product.description || 'A delicious product from our menu.'}</div>

                ${sizeSectionHTML}
                ${piecesSectionHTML}

                <div class="add-notes">
                    <input type="text" placeholder="Add Notes..." id="notesInput">
                </div>

                <div class="action-buttons">
                    <button class="add-to-cart-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price}, '${sectionId}', '${product.img}', '${product.category}')">Add to Cart</button>
                    <button class="add-to-cart-btn" style="background: #4a4f35;" onclick="orderNow('${product.name.replace(/'/g, "\\'")}', ${product.price}, '${sectionId}', '${product.img}', '${product.category}')">Order Now</button>
                    <button class="heart-btn" onclick="toggleLike(this)" title="Add to favorites"><i class="fas fa-heart"></i></button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalDynamicContent').innerHTML = modalHtml;
    document.getElementById('productModal').style.display = 'flex';

    currentPieces = 1;
    currentBasePrice = product.price;

    setTimeout(() => {
        if (isDrink) {
            const grandeBtn = document.querySelector('.size-btn[data-size="Grande"]');
            if (grandeBtn) {
                selectSize(grandeBtn, product.price);
            }
        }
    }, 100);
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function selectSize(btn, basePrice) {
    const parent = btn.parentNode;
    const allBtns = parent.querySelectorAll('.size-btn');
    allBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const multiplier = parseInt(btn.getAttribute('data-price-multiplier') || '0');
    const newPrice = basePrice + multiplier;

    const priceElement = document.getElementById('modalPrice');
    if (priceElement) {
        priceElement.textContent = `₱${newPrice}`;
    }
}

function changePieces(delta, basePrice) {
    currentBasePrice = basePrice;
    currentPieces = currentPieces + delta;

    if (currentPieces < 1) {
        currentPieces = 1;
    }

    const piecesElement = document.getElementById('piecesCount');
    if (piecesElement) {
        piecesElement.textContent = currentPieces;
    }

    const totalPrice = basePrice * currentPieces;
    const totalElement = document.getElementById('piecesTotal');
    if (totalElement) {
        totalElement.textContent = `Total: ₱${totalPrice}`;
    }

    const priceElement = document.getElementById('modalPrice');
    if (priceElement) {
        priceElement.textContent = `₱${totalPrice}`;
    }
}

function toggleLike(btn) {
    btn.classList.toggle('liked');
    const productName = document.querySelector('.product-name')?.textContent;
    if (btn.classList.contains('liked')) {
        showTemporaryMessage(`${productName} added to your favorites!`);
    } else {
        showTemporaryMessage(`${productName} removed from favorites.`);
    }
}

function showTemporaryMessage(message) {
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #652e1e;
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: 600;
        z-index: 3000;
        animation: slideUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translate(-50%, 100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideDown {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, 100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Cart functions
function addToCart(name, basePrice, sectionId, img, category) {
    const isDrink = sectionId === 'drinks';
    const hasPieces = sectionId === 'pastry' || sectionId === 'pasta';

    let size = 'Regular';
    let pieces = 1;
    let finalPrice = basePrice;
    let priceMultiplier = 0;

    if (isDrink) {
        const sizeElem = document.querySelector('.size-btn.selected');
        size = sizeElem ? sizeElem.getAttribute('data-size') : 'Grande';
        priceMultiplier = sizeElem ? parseInt(sizeElem.getAttribute('data-price-multiplier') || '0') : 10;
        finalPrice = basePrice + priceMultiplier;
    } else if (hasPieces) {
        const piecesElement = document.getElementById('piecesCount');
        pieces = piecesElement ? parseInt(piecesElement.textContent) : 1;
        finalPrice = basePrice * pieces;
    }

    const notes = document.getElementById('notesInput')?.value || '';
    const productName = document.querySelector('.product-name')?.textContent || name;

    const cartItem = {
        name: productName,
        basePrice: basePrice,
        price: finalPrice,
        qty: 1,
        addons: notes ? [notes] : [],
        img: img || 'latte.webp',
        category: sectionId || 'drink',
        size: isDrink ? size : undefined,
        pieces: hasPieces ? pieces : undefined,
        sizeMultiplier: isDrink ? priceMultiplier : undefined,
        notes: notes,
        timestamp: new Date().getTime()
    };

    let cart = getCart();
    let existingItemIndex = -1;

    if (isDrink) {
        existingItemIndex = cart.findIndex(item =>
            item.name === cartItem.name &&
            item.size === cartItem.size &&
            item.notes === cartItem.notes
        );
    } else if (hasPieces) {
        existingItemIndex = cart.findIndex(item =>
            item.name === cartItem.name &&
            item.pieces === cartItem.pieces &&
            item.notes === cartItem.notes
        );
    } else {
        existingItemIndex = cart.findIndex(item =>
            item.name === cartItem.name &&
            item.notes === cartItem.notes
        );
    }

    if (existingItemIndex > -1) {
        cart[existingItemIndex].qty += 1;
    } else {
        cart.push(cartItem);
    }

    saveCart(cart);

    let selectionText = '';
    if (isDrink) {
        selectionText = ` (${size})`;
    } else if (hasPieces && pieces > 1) {
        selectionText = ` (${pieces} pcs)`;
    }

    document.getElementById('successMessage').innerHTML = `${productName}${selectionText}<br>has been added to your cart!<br>Price: ₱${finalPrice}`;
    document.getElementById('successModal').style.display = 'flex';

    currentPieces = 1;
    closeModal();
    updateCartBadge();

    console.log('Current cart:', cart);

    return cartItem;
}

function orderNow(name, basePrice, sectionId, img, category) {
    addToCart(name, basePrice, sectionId, img, category);
    const cart = getCart();
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    sessionStorage.setItem('checkoutTotal', total.toString());
    window.location.href = '../Checkout Page/index.html';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Search functions
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (query === '') {
        document.getElementById('searchResults').innerHTML = '<p style="color:white;">Please enter a search term.</p>';
        return;
    }

    let results = [];

    // Check for category searches
    if (query === 'drinks' || query === 'drink' || query === 'beverage' || query === 'beverages') {
        results = menuData.drinks;
    } else if (query === 'pastry' || query === 'pastries' || query === 'baked goods' || query === 'baked') {
        results = menuData.pastry;
    } else if (query === 'pasta' || query === 'pastas' || query === 'noodles' || query === 'noodle') {
        results = menuData.pasta;
    } else {
        // Search in all items
        const allItems = [...menuData.drinks, ...menuData.pastry, ...menuData.pasta];
        results = allItems.filter(item => 
            item.name.toLowerCase().includes(query) || 
            (item.description && item.description.toLowerCase().includes(query))
        );
    }

    const resultsContainer = document.getElementById('searchResults');
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="color:white;">No items found.</p>';
    } else {
        resultsContainer.innerHTML = results.map(item => {
            let section = 'drinks';
            if (menuData.pastry.includes(item)) section = 'pastry';
            else if (menuData.pasta.includes(item)) section = 'pasta';

            return `
                <div class="result-item" onclick="openModal('${section}', '${item.name.replace(/'/g, "\\'")}')">
                    <div class="result-info">
                        <img src="assets/img/${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${item.name}'">
                        <span>${item.name}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span class="result-price">₱${item.price}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initializeEmptyCart();

    // Account dropdown functionality
    const acc = document.getElementById('accountDropdown');
    const drop = document.getElementById('dropdownMenu');

    if (acc) {
        acc.addEventListener('click', function(e) {
            e.stopPropagation();
            drop.classList.toggle('show');
            acc.classList.toggle('show-logout');
        });
    }

    document.addEventListener('click', function(e) {
        if (!acc?.contains(e.target)) {
            drop?.classList.remove('show');
            acc?.classList.remove('show-logout');
        }
    });

    // Search functionality
    const searchIcon = document.getElementById('searchIcon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('searchOverlay').style.display = 'flex';
            document.getElementById('searchInput').focus();
        });
    }

    document.getElementById('closeSearch').addEventListener('click', function() {
        document.getElementById('searchOverlay').style.display = 'none';
        document.getElementById('searchResults').innerHTML = '';
    });

    document.getElementById('searchButton').addEventListener('click', performSearch);

    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });

    // Cart link
    const cartLink = document.getElementById('cartLink');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            const cart = getCart();
            sessionStorage.setItem('brewhaCart', JSON.stringify(cart));
            window.location.href = '../Cart Page/index.html';
        });
    }

    // Fetch products from database
    fetchProductsFromDB();

    // Add scroll event listeners for carousels
    document.querySelectorAll('.products').forEach(c => {
        c.addEventListener('scroll', function() {
            clearTimeout(window.dotUpdateTimer);
            window.dotUpdateTimer = setTimeout(() => updateActiveDot(this), 100);
        });
    });

    // Close modals when clicking outside
    window.onclick = function(e) {
        const modal = document.getElementById('productModal');
        if (e.target === modal) closeModal();

        const successModal = document.getElementById('successModal');
        if (e.target === successModal) closeSuccessModal();
    };
});