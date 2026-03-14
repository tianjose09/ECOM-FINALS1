/*
  BACKEND-READY ADMIN DASHBOARD
  --------------------------------
  Replace sampleDashboardData with API data later.

  Example:
  fetch('/api/admin/dashboard')
    .then(response => response.json())
    .then(data => renderDashboard(data));
*/

const sampleDashboardData = {
  selectedCategory: "drink",
  products: {
    drink: [
      { id: 1, name: "Iced Americano", price: 120, status: "Available", totalOrder: 18, colorClass: "dot-drink" },
      { id: 2, name: "Caramel Latte", price: 145, status: "Not Available", totalOrder: 11, colorClass: "dot-pastry" },
      { id: 3, name: "Mocha", price: 135, status: "Available", totalOrder: 16, colorClass: "dot-pasta" }
    ],
    pastry: [
      { id: 4, name: "Croissant", price: 110, status: "Available", totalOrder: 21, colorClass: "dot-drink" },
      { id: 5, name: "Danish", price: 125, status: "Not Available", totalOrder: 8, colorClass: "dot-pastry" },
      { id: 6, name: "Muffin", price: 95, status: "Available", totalOrder: 14, colorClass: "dot-pasta" }
    ],
    pasta: [
      { id: 7, name: "Carbonara", price: 220, status: "Available", totalOrder: 13, colorClass: "dot-drink" },
      { id: 8, name: "Bolognese", price: 235, status: "Available", totalOrder: 10, colorClass: "dot-pastry" },
      { id: 9, name: "Pesto Pasta", price: 210, status: "Not Available", totalOrder: 7, colorClass: "dot-pasta" }
    ]
  },
  users: [
    {
      id: 101,
      name: "User Name Here",
      orders: [
        { productName: "Drink Name Here", qtySize: "## | Size", orderNo: "####" },
        { productName: "Lorem", qtySize: "Lorem", orderNo: "Lorem" },
        { productName: "Lorem", qtySize: "Lorem", orderNo: "Lorem" },
        { productName: "Lorem", qtySize: "Lorem", orderNo: "Lorem" },
        { productName: "Lorem", qtySize: "Lorem", orderNo: "Lorem" },
        { productName: "Lorem", qtySize: "## Size", orderNo: "Lorem" },
        { productName: "Pastry Name Here", qtySize: "## Size", orderNo: "Lorem" }
      ]
    },
    {
      id: 102,
      name: "User Name Here 2",
      orders: [
        { productName: "Iced Latte", qtySize: "2 | Grande", orderNo: "1002" },
        { productName: "Croissant", qtySize: "1 | Regular", orderNo: "1002" }
      ]
    },
    {
      id: 103,
      name: "User Name Here 3",
      orders: [
        { productName: "Pasta Alfredo", qtySize: "1 | Solo", orderNo: "1003" },
        { productName: "Mocha", qtySize: "1 | Tall", orderNo: "1003" }
      ]
    }
  ]
};

let dashboardState = JSON.parse(JSON.stringify(sampleDashboardData));
let activeCategory = dashboardState.selectedCategory || "drink";
let selectedUserId = dashboardState.users.length ? dashboardState.users[0].id : null;

document.addEventListener("DOMContentLoaded", () => {
  initializeDropdown();
  initializeCategoryButtons();
  initializeProductModal();
  initializeRefreshButton();
  renderDashboard();
});

function initializeDropdown() {
  const accountDropdown = document.getElementById("accountDropdown");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (!accountDropdown || !dropdownMenu) return;

  accountDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");

    const expanded = accountDropdown.getAttribute("aria-expanded") === "true";
    accountDropdown.setAttribute("aria-expanded", String(!expanded));
  });

  document.addEventListener("click", (event) => {
    if (!accountDropdown.contains(event.target)) {
      dropdownMenu.classList.remove("show");
      accountDropdown.setAttribute("aria-expanded", "false");
    }
  });
}

function initializeCategoryButtons() {
  const buttons = document.querySelectorAll(".category-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      updateCategoryActiveState();
      renderProducts();
    });
  });
}

function initializeRefreshButton() {
  const refreshBtn = document.getElementById("refreshDashboardBtn");
  if (!refreshBtn) return;

  refreshBtn.addEventListener("click", (event) => {
    event.preventDefault();
    renderDashboard();
  });
}

function initializeProductModal() {
  const productModal = document.getElementById("productModal");
  const closeProductModal = document.getElementById("closeProductModal");
  const cancelProductEdit = document.getElementById("cancelProductEdit");
  const productForm = document.getElementById("productForm");

  if (closeProductModal) {
    closeProductModal.addEventListener("click", closeEditModal);
  }

  if (cancelProductEdit) {
    cancelProductEdit.addEventListener("click", closeEditModal);
  }

  if (productModal) {
    productModal.addEventListener("click", (event) => {
      if (event.target === productModal) {
        closeEditModal();
      }
    });
  }

  if (productForm) {
    productForm.addEventListener("submit", handleProductFormSubmit);
  }
}

function renderDashboard() {
  updateCategoryActiveState();
  renderProducts();
  renderUsers();
  renderSelectedUserOrders();
}

function updateCategoryActiveState() {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === activeCategory);
  });
}

function renderProducts() {
  const productTableBody = document.getElementById("productTableBody");
  if (!productTableBody) return;

  const products = dashboardState.products[activeCategory] || [];

  if (!products.length) {
    productTableBody.innerHTML = `
      <div class="product-row">
        <div class="product-name-cell">No products found</div>
        <div class="price-cell">-</div>
        <div class="status-cell">-</div>
        <div class="orders-cell">-</div>
        <div class="actions-cell">-</div>
      </div>
    `;
    return;
  }

  productTableBody.innerHTML = products.map((product) => `
    <div class="product-row">
      <div class="product-name-cell">
        <span class="product-dot ${product.colorClass || 'dot-drink'}"></span>
        <span>${escapeHtml(product.name)}</span>
      </div>
      <div class="price-cell">PHP. ${formatNumber(product.price)}</div>
      <div class="status-cell ${product.status === 'Available' ? 'status-available' : 'status-unavailable'}">
        ${escapeHtml(product.status)}
      </div>
      <div class="orders-cell">#${formatNumber(product.totalOrder)}</div>
      <div class="actions-cell">
        <button class="action-btn add-btn" type="button" title="Add Order" onclick="handleAddOrder(${product.id})">
          <i class="fas fa-plus"></i>
        </button>
        <button class="action-btn edit-btn" type="button" title="Edit Product" onclick="openEditModal(${product.id})">
          <i class="fas fa-pen-to-square"></i>
        </button>
        <button class="action-btn delete-btn" type="button" title="Delete Product" onclick="deleteProduct(${product.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join("");
}

function renderUsers() {
  const usersList = document.getElementById("usersList");
  if (!usersList) return;

  if (!dashboardState.users.length) {
    usersList.innerHTML = `<div class="user-item">No users found</div>`;
    return;
  }

  usersList.innerHTML = dashboardState.users.map((user) => `
    <div class="user-item ${user.id === selectedUserId ? 'active' : ''}" onclick="selectUser(${user.id})">
      <i class="far fa-circle-user"></i>
      <span>${escapeHtml(user.name)}</span>
    </div>
  `).join("");
}

function renderSelectedUserOrders() {
  const selectedUserName = document.getElementById("selectedUserName");
  const selectedUserOrders = document.getElementById("selectedUserOrders");

  if (!selectedUserName || !selectedUserOrders) return;

  const user = dashboardState.users.find((item) => item.id === selectedUserId);

  if (!user) {
    selectedUserName.textContent = "Selected User Name Here";
    selectedUserOrders.innerHTML = `<div class="order-line"><div>-</div><div>-</div><div>-</div></div>`;
    return;
  }

  selectedUserName.textContent = user.name;

  if (!user.orders || !user.orders.length) {
    selectedUserOrders.innerHTML = `<div class="order-line"><div>No orders</div><div>-</div><div>-</div></div>`;
    return;
  }

  selectedUserOrders.innerHTML = user.orders.map((order) => `
    <div class="order-line">
      <div>${escapeHtml(order.productName)}</div>
      <div>${escapeHtml(order.qtySize)}</div>
      <div>${escapeHtml(order.orderNo)}</div>
    </div>
  `).join("");
}

function selectUser(userId) {
  selectedUserId = userId;
  renderUsers();
  renderSelectedUserOrders();
}

function handleAddOrder(productId) {
  const product = findProductById(productId);
  if (!product) return;

  alert(`Backend-ready action: add new order for ${product.name}`);
}

function openEditModal(productId) {
  const product = findProductById(productId);
  if (!product) return;

  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productStatus").value = product.status;

  document.getElementById("productModal").classList.add("show");
}

function closeEditModal() {
  document.getElementById("productModal").classList.remove("show");
}

function handleProductFormSubmit(event) {
  event.preventDefault();

  const productId = Number(document.getElementById("productId").value);
  const updatedName = document.getElementById("productName").value.trim();
  const updatedPrice = Number(document.getElementById("productPrice").value);
  const updatedStatus = document.getElementById("productStatus").value;

  const product = findProductById(productId);
  if (!product) return;

  product.name = updatedName;
  product.price = updatedPrice;
  product.status = updatedStatus;

  renderProducts();
  closeEditModal();

  /*
    BACKEND READY:
    Replace local update with API request later.

    Example:
    fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updatedName,
        price: updatedPrice,
        status: updatedStatus
      })
    })
  */
}

function deleteProduct(productId) {
  const product = findProductById(productId);
  if (!product) return;

  const confirmed = confirm(`Delete ${product.name}?`);
  if (!confirmed) return;

  dashboardState.products[activeCategory] = dashboardState.products[activeCategory].filter(
    (item) => item.id !== productId
  );

  renderProducts();

  /*
    BACKEND READY:
    Replace with DELETE API later.

    Example:
    fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE'
    })
  */
}

function findProductById(productId) {
  const products = dashboardState.products[activeCategory] || [];
  return products.find((product) => product.id === productId);
}

function formatNumber(value) {
  return Number(value).toLocaleString("en-PH");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}