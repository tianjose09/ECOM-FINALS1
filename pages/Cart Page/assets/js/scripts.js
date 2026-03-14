// Cart data - starts empty, loads from localStorage
let cart = [];
let currentFilter = 'all';

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('brewhaCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  } else {
    cart = [];
  }
  renderCart();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('brewhaCart', JSON.stringify(cart));
}

// Filter function
function filterCategory(category) {
  currentFilter = category;
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));

  const buttons = document.querySelectorAll('.cat-btn');
  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase() === category || (category === 'all' && btn.textContent === 'All')) {
      btn.classList.add('active');
    }
  });

  renderCart();
}

function renderCart() {
  let cartContainer = document.getElementById("cartItems");
  let summaryContainer = document.getElementById("summaryItems");
  let summarySection = document.getElementById("summarySection");
  let cartFooter = document.getElementById("cartFooterSection");

  cartContainer.innerHTML = "";
  summaryContainer.innerHTML = "";

  let filteredCart = cart;
  if (currentFilter !== 'all') {
    filteredCart = cart.filter(item => item.category === currentFilter);
  }

  let total = 0;

  filteredCart.forEach((item) => {
    const originalIndex = cart.findIndex(cartItem =>
      cartItem.name === item.name &&
      cartItem.size === item.size &&
      cartItem.notes === item.notes
    );

    let addonsHTML = "";
    if (item.addons && item.addons.length > 0) {
      addonsHTML = item.addons.map(a => `<div>• ${a}</div>`).join("");
    }

    let imgTag = `<img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70x70?text=${item.name.charAt(0)}'">`;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <div class="product">
          ${imgTag}
          <div>
            ${item.name}
            ${item.size ? `<br><small style="color: #666;">Size: ${item.size}</small>` : ''}
            ${item.notes ? `<br><small style="color: #666;">Note: ${item.notes}</small>` : ''}
          </div>
        </div>
        <div class="addons">
          ${addonsHTML}
        </div>
        <div class="price">₱ ${item.price}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="decrease(${originalIndex})">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="increase(${originalIndex})">+</button>
        </div>
        <div class="delete" onclick="removeItem(${originalIndex})">
          <span class="material-icons">delete</span>
        </div>
      </div>
    `;

    summaryContainer.innerHTML += `
      <div class="summary-row">
        <div>✔ ${item.name} ${item.size ? `(${item.size})` : ''}</div>
        <div>₱ ${item.price}</div>
        <div>${item.qty}</div>
      </div>
    `;

    total += item.price * item.qty;
  });

  if (filteredCart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <p>No items in this category</p>
      </div>
    `;
  }

  if (filteredCart.length > 0) {
    summarySection.style.display = 'block';
    cartFooter.style.display = 'block';
  } else {
    summarySection.style.display = 'none';
    cartFooter.style.display = 'none';
  }

  document.getElementById("totalPrice").innerText = total;
}

function increase(i) {
  cart[i].qty++;
  saveCart();
  renderCart();
}

function decrease(i) {
  if (cart[i].qty > 1) {
    cart[i].qty--;
    saveCart();
    renderCart();
  }
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
}

function goToCheckoutPage() {
  if (cart.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-state';
    emptyMessage.innerHTML = '<i class="fas fa-shopping-cart"></i><p>Your cart is empty!</p>';
    document.querySelector('.cart-container').prepend(emptyMessage);
    setTimeout(() => emptyMessage.remove(), 3000);
    return;
  }

  sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
  sessionStorage.setItem('checkoutTotal', document.getElementById("totalPrice").innerText);
  window.location.href = 'checkout.html';
}

// Search functionality
function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const resultsContainer = document.getElementById('searchResults');
  const resultsDiv = document.querySelector('.search-results');

  if (query === '') {
    resultsDiv.classList.remove('has-results');
    resultsContainer.innerHTML = '';
    return;
  }

  const results = cart.filter(item =>
    item.name.toLowerCase().includes(query) ||
    (item.addons && item.addons.some(addon => addon.toLowerCase().includes(query)))
  );

  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="no-results">No items found in your cart.</div>';
    resultsDiv.classList.add('has-results');
  } else {
    resultsContainer.innerHTML = results.map(item => `
      <div class="search-result-item" onclick="jumpToItem('${item.name}')">
        <div class="result-info">
          <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50x50?text=${item.name.charAt(0)}'">
          <div class="result-details">
            <h4>${item.name} ${item.size ? `(${item.size})` : ''}</h4>
            <p>₱${item.price} | Qty: ${item.qty}</p>
          </div>
        </div>
        <i class="fas fa-arrow-right" style="color: #6f7551;"></i>
      </div>
    `).join('');
    resultsDiv.classList.add('has-results');
  }
}

function jumpToItem(itemName) {
  document.getElementById('searchOverlay').style.display = 'none';
  document.querySelector('.search-results').classList.remove('has-results');

  const item = cart.find(i => i.name === itemName);
  if (item) {
    filterCategory(item.category);

    setTimeout(() => {
      const items = document.querySelectorAll('.cart-item');
      for (let i = 0; i < items.length; i++) {
        if (items[i].textContent.includes(itemName)) {
          items[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
          items[i].style.transition = 'background 0.5s';
          items[i].style.background = '#fff3cd';
          setTimeout(() => {
            items[i].style.background = '';
          }, 2000);
          break;
        }
      }
    }, 100);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const searchIcon = document.getElementById('searchIcon');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.querySelector('.search-results');

  searchIcon.addEventListener('click', function(e) {
    e.preventDefault();
    searchOverlay.style.display = 'flex';
    searchInput.focus();
    searchResults.classList.remove('has-results');
    document.getElementById('searchResults').innerHTML = '';
    searchInput.value = '';
  });

  closeSearch.addEventListener('click', function() {
    searchOverlay.style.display = 'none';
    searchResults.classList.remove('has-results');
    document.getElementById('searchResults').innerHTML = '';
    searchInput.value = '';
  });

  searchButton.addEventListener('click', performSearch);

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  searchOverlay.addEventListener('click', function(e) {
    if (e.target === searchOverlay) {
      searchOverlay.style.display = 'none';
      searchResults.classList.remove('has-results');
      document.getElementById('searchResults').innerHTML = '';
      searchInput.value = '';
    }
  });

  const acc = document.getElementById('accountDropdown');
  const drop = document.getElementById('dropdownMenu');

  acc?.addEventListener('click', function(e) {
    e.stopPropagation();
    drop.classList.toggle('show');
  });

  document.addEventListener('click', function(e) {
    if (!acc?.contains(e.target)) {
      drop.classList.remove('show');
    }
  });

  drop?.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  loadCart();
});