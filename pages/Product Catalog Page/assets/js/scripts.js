const menuData = {
  drinks: [
    { name: 'Latte', img: 'latte.webp', price: 135, category: 'Coffee', description: 'Rich and creamy espresso with steamed milk and a light layer of foam.' },
    { name: 'Americano', img: 'americano.webp', price: 120, category: 'Coffee', description: 'Bold espresso shots diluted with hot water for a smooth finish.' },
    { name: 'Mocha', img: 'mocha.webp', price: 140, category: 'Coffee', description: 'Espresso with chocolate syrup and steamed milk, topped with whipped cream.' },
    { name: 'Cappuccino', img: 'cappuccino.webp', price: 125, category: 'Coffee', description: 'Espresso with steamed milk and a thick layer of frothed milk.' },
    { name: 'Blueberry Juice', img: 'blueberry.png', price: 140, category: 'Cold Drink', description: 'Freshly squeezed blueberry juice, sweet and antioxidant-rich. Served chilled.' },
    { name: 'Strawberry Smoothie', img: 'strawberry.png', price: 150, category: 'Smoothie', description: 'Blended fresh strawberries with yogurt and honey. Creamy and refreshing.' },
    { name: 'Mango Shake', img: 'mango.png', price: 115, category: 'Smoothie', description: 'Sweet ripe mangoes blended with milk and ice. Tropical paradise in a cup.' },
    { name: 'Watermelon Cooler', img: 'watermelon.png', price: 165, category: 'Cold Drink', description: 'Fresh watermelon juice with a hint of mint. Perfect for hot days.' },
    { name: 'Iced Lemon Tea', img: 'icelemontea.png', price: 85, category: 'Iced Tea', description: 'Freshly brewed black tea with lemon and just the right amount of sweetness.' },
    { name: 'Pineapple Juice', img: 'pineapple.png', price: 100, category: 'Cold Drink', description: '100% fresh pineapple juice, naturally sweet and tangy.' },
    { name: 'Green Smoothie', img: 'green.png', price: 125, category: 'Smoothie', description: 'Kale, spinach, apple and banana blended to perfection. Healthy and delicious.' },
    { name: 'Iced Caramel Macchiato', img: 'macchiato.png', price: 150, category: 'Iced Coffee', description: 'Espresso poured over milk and ice with caramel drizzle.' },
    { name: 'Cold Brew', img: 'coldbrew.png', price: 110, category: 'Iced Coffee', description: 'Smooth cold brew coffee steeped for 12 hours. Less acidic, more flavor.' }
  ],
  pastry: [
    { name: 'Croissant', img: 'croissant.png', price: 110, category: 'Pastry', description: 'Flaky, buttery, and golden-brown. A classic French pastry.' },
    { name: 'Donut', img: 'donut.png', price: 65, category: 'Pastry', description: 'Soft, fried dough ring glazed with sweet icing.' },
    { name: 'Danish', img: 'danish.png', price: 120, category: 'Pastry', description: 'Layered pastry with a sweet filling, often fruit or cheese.' },
    { name: 'Scone', img: 'scone.png', price: 175, category: 'Pastry', description: 'Slightly sweet, crumbly baked good, often with berries.' },
    { name: 'Muffin', img: 'muffin.png', price: 70, category: 'Pastry', description: 'Moist, individually-sized quick bread, available in blueberry.' },
    { name: 'Brownie', img: 'brownie.png', price: 115, category: 'Dessert', description: 'Dense, fudgy chocolate square, often with nuts.' },
    { name: 'Biscotti', img: 'biscotti.png', price: 130, category: 'Cookie', description: 'Twice-baked Italian almond cookie, crunchy and perfect for dipping.' },
    { name: 'Cinnamon Roll', img: 'cinnamonroll.png', price: 110, category: 'Pastry', description: 'Soft, swirled dough with cinnamon sugar and cream cheese icing.' },
    { name: 'Eclair', img: 'eclair.png', price: 165, category: 'Pastry', description: 'Long, thin pastry filled with cream and topped with chocolate icing.' },
    { name: 'Macaron', img: 'macaroon.png', price: 200, category: 'Cookie', description: 'Delicate French almond meringue sandwich cookie.' },
    { name: 'Palmier', img: 'palmeir.png', price: 90, category: 'Pastry', description: 'Crispy, caramelized puff pastry shaped like a palm leaf.' },
    { name: 'Cannoli', img: 'cannoli.png', price: 100, category: 'Dessert', description: 'Sicilian pastry tube filled with sweet, creamy ricotta.' }
  ],
  pasta: [
    { name: 'Carbonara', img: 'carbonara.png', price: 220, category: 'Pasta', description: 'Classic Roman pasta with eggs, cheese, pancetta, and black pepper.' },
    { name: 'Bolognese', img: 'bolognese.png', price: 235, category: 'Pasta', description: 'Slow-cooked meat-based sauce served over tagliatelle.' },
    { name: 'Alfredo', img: 'alfredo.png', price: 215, category: 'Pasta', description: 'Fettuccine in a creamy butter and Parmesan cheese sauce.' },
    { name: 'Pesto', img: 'pesto.png', price: 255, category: 'Pasta', description: 'Pasta with fresh basil pesto, garlic, pine nuts, and Parmesan.' },
    { name: 'Amatriciana', img: 'amatriciana.png', price: 240, category: 'Pasta', description: 'Tomato-based sauce with guanciale and Pecorino cheese.' },
    { name: 'Arrabbiata', img: 'arrabbiata.png', price: 399, category: 'Pasta', description: 'Spicy tomato sauce with garlic and red chili peppers.' },
    { name: 'Primavera', img: 'primavera.png', price: 230, category: 'Pasta', description: 'Pasta with fresh, lightly sautéed spring vegetables.' },
    { name: 'Cacio e Pepe', img: 'cacioepepe.png', price: 250, category: 'Pasta', description: 'Simple Roman pasta with Pecorino cheese and black pepper.' },
    { name: 'Vongole', img: 'vongole.png', price: 265, category: 'Pasta', description: 'Spaghetti with fresh clams, garlic, white wine, and parsley.' },
    { name: 'Ragu', img: 'ragu.png', price: 245, category: 'Pasta', description: 'Hearty meat-based sauce, slow-cooked with tomatoes and herbs.' },
    { name: 'Truffle', img: 'truffle.png', price: 290, category: 'Pasta', description: 'Luxurious pasta with black truffle oil. Earthy and aromatic.' },
    { name: 'Seafood', img: 'seafood.png', price: 280, category: 'Pasta', description: 'Mixed seafood in a light tomato or white wine sauce.' }
  ]
};

const originalData = {
  drinks: [...menuData.drinks],
  pastry: [...menuData.pastry],
  pasta: [...menuData.pasta]
};

let currentSort = 'default';
let currentPieces = 1;
let currentBasePrice = 0;

function getCart() {
  return JSON.parse(localStorage.getItem('brewhaCart')) || [];
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
  localStorage.removeItem('brewhaCart');
  saveCart([]);
  updateCartBadge();
  console.log('Cart has been cleared - starting fresh');
}

function renderSection(sectionId, dataArray) {
  const container = document.getElementById(sectionId);
  if (!container) return;

  let sortedData = [...dataArray];
  if (currentSort === 'low') sortedData.sort((a, b) => a.price - b.price);
  else if (currentSort === 'high') sortedData.sort((a, b) => b.price - a.price);

  container.innerHTML = sortedData.map(item => `
    <div class="card" onclick="openModal('${sectionId}', '${item.name}')">
      <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/140x140?text=Image'">
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

function sortAllSections(order) {
  currentSort = order;
  renderAll();
  document.getElementById('sortBtn').textContent = order === 'low' ? 'Price: Low to High ▼' : 'Price: High to Low ▼';
}

function resetToOriginal() {
  menuData.drinks = [...originalData.drinks];
  menuData.pastry = [...originalData.pastry];
  menuData.pasta = [...originalData.pasta];
  currentSort = 'default';
  renderAll();
  document.getElementById('sortBtn').textContent = 'Sort by Price ▼';
}

function filterMenu(sectionId) {
  document.querySelectorAll(".menu-section").forEach(s => s.style.display = "none");
  document.getElementById(sectionId).style.display = "block";
  window.scrollTo({top: 120, behavior: "smooth"});
}

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
      <div class="pieces-control" style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 10px;">
        <button class="qty-btn" onclick="changePieces(-1, ${product.price})" style="background:#6f7551; border:none; color:white; width:40px; height:40px; cursor:pointer; border-radius:50%; font-size:24px; display:flex; align-items:center; justify-content:center; font-weight:bold;">−</button>
        <span id="piecesCount" style="font-size: 24px; font-weight: bold; color: #4b3428; min-width: 50px; text-align: center;">1</span>
        <button class="qty-btn" onclick="changePieces(1, ${product.price})" style="background:#6f7551; border:none; color:white; width:40px; height:40px; cursor:pointer; border-radius:50%; font-size:24px; display:flex; align-items:center; justify-content:center; font-weight:bold;">+</button>
      </div>
      <div style="text-align: center; margin-top: 10px; color: #4b3428; font-weight: 600; font-size: 18px;" id="piecesTotal">Total: ₱${product.price}</div>
    </div>
  ` : '';

  const modalHtml = `
    <div class="modal-content">
      <div class="modal-left">
        <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280?text=Image'">
      </div>
      <div class="modal-right">
        <div class="modal-badge">BREW-HA</div>
        <div class="available"><i class="fas fa-circle" style="color: #2a7a2a; font-size: 0.6rem;"></i> Available</div>
        <div class="category">${product.category || 'Beverage'}</div>
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

        <div class="action-buttons" style="display: flex; gap: 10px;">
          <button class="add-to-cart-btn" style="flex: 1;" onclick="addToCart('${product.name}', ${product.price}, '${sectionId}', '${product.img}', '${product.category}')">Add to Cart</button>
          <button class="add-to-cart-btn" style="flex: 1; background: #4a4f35;" onclick="orderNow('${product.name}', ${product.price}, '${sectionId}', '${product.img}', '${product.category}')">Order Now</button>
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
    alert(`${productName} added to your favorites!`);
  } else {
    alert(`${productName} removed from favorites.`);
  }
}

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
  window.location.href = 'checkout.html';
}

function closeSuccessModal() {
  document.getElementById('successModal').style.display = 'none';
}

window.onclick = function(e) {
  const modal = document.getElementById('productModal');
  if (e.target === modal) closeModal();

  const successModal = document.getElementById('successModal');
  if (e.target === successModal) closeSuccessModal();
};

function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (query === '') {
    document.getElementById('searchResults').innerHTML = '<p style="color:white;">Please enter a search term.</p>';
    return;
  }

  let results = [];

  if (query === 'drinks' || query === 'drink' || query === 'beverage') {
    results = menuData.drinks;
  } else if (query === 'pastry' || query === 'pastries' || query === 'baked goods') {
    results = menuData.pastry;
  } else if (query === 'pasta' || query === 'pastas' || query === 'noodles') {
    results = menuData.pasta;
  } else {
    const allItems = [...menuData.drinks, ...menuData.pastry, ...menuData.pasta];
    results = allItems.filter(item => item.name.toLowerCase().includes(query));
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
      <div class="result-item" onclick="openModal('${section}', '${item.name}')">
        <div class="result-info">
          <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=Image'">
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

function goToCart() {
  window.location.href = 'cart.html';
}

document.addEventListener('DOMContentLoaded', function() {
  initializeEmptyCart();

  const acc = document.getElementById('accountDropdown');
  const drop = document.getElementById('dropdownMenu');

  acc?.addEventListener('click', function(e) {
    e.stopPropagation();
    drop.classList.toggle('show');
    acc.classList.toggle('show-logout');
  });

  document.addEventListener('click', function(e) {
    if (!acc?.contains(e.target)) {
      drop?.classList.remove('show');
      acc?.classList.remove('show-logout');
    }
  });

  document.getElementById('searchIcon').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('searchOverlay').style.display = 'flex';
    document.getElementById('searchInput').focus();
  });

  document.getElementById('closeSearch').addEventListener('click', function() {
    document.getElementById('searchOverlay').style.display = 'none';
    document.getElementById('searchResults').innerHTML = '';
  });

  document.getElementById('searchButton').addEventListener('click', performSearch);

  document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') performSearch();
  });

  renderAll();
  updateCartBadge();

  document.querySelectorAll('.products').forEach(c => {
    c.addEventListener('scroll', function() {
      clearTimeout(window.dotUpdateTimer);
      window.dotUpdateTimer = setTimeout(() => updateActiveDot(this), 100);
    });
  });

  document.getElementById('cartLink').addEventListener('click', function(e) {
    e.preventDefault();
    const cart = getCart();
    sessionStorage.setItem('brewhaCart', JSON.stringify(cart));
    window.location.href = 'cart.html';
  });
});