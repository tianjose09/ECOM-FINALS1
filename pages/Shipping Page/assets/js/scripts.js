/*
  BACKEND-READY SHIPPING PAGE
  ---------------------------------
  This script is prepared so you can later replace the sampleData
  with API data from PHP, Node, Laravel, or any backend.

  Example future backend flow:
  1. fetch('/api/order/current')
  2. receive JSON
  3. call renderShippingPage(data)
*/

const sampleShippingData = {
  orderId: "ORD-10025",
  merchant: {
    name: "BREW-HA",
    logo: "", // put image path here later if available
    pickupPlaceLabel: "Brew-Ha Kitchen, P. Paredes St., Sampaloc, Manila"
  },
  rider: {
    name: "Juan Dela Cruz",
    phone: "09123456789"
  },
  shipping: {
    estimatedTimeText: "18 - 25 mins",
    currentStage: 2,
    statusMessage: "Preparing your food. Your rider will pick it up once it’s ready",
    deliveryModeLabel: "(Brew-Ha Kitchen)"
  },
  pricing: {
    subtotal: 395,
    deliveryFee: 49,
    total: 444
  },
  items: [
    {
      name: "Iced Caramel Macchiato",
      quantity: 1,
      price: 150,
      meta: "Grande"
    },
    {
      name: "Croissant",
      quantity: 1,
      price: 110,
      meta: "Butter"
    },
    {
      name: "Carbonara",
      quantity: 1,
      price: 135,
      meta: "Regular"
    }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  initializeDropdown();
  initializeHelpModal();
  initializeButtons();

  renderShippingPage(sampleShippingData);
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

function initializeHelpModal() {
  const helpBtn = document.getElementById("helpBtn");
  const helpModal = document.getElementById("helpModal");
  const closeHelpModal = document.getElementById("closeHelpModal");

  if (helpBtn && helpModal) {
    helpBtn.addEventListener("click", () => {
      helpModal.classList.add("show");
    });
  }

  if (closeHelpModal && helpModal) {
    closeHelpModal.addEventListener("click", () => {
      helpModal.classList.remove("show");
    });
  }

  if (helpModal) {
    helpModal.addEventListener("click", (event) => {
      if (event.target === helpModal) {
        helpModal.classList.remove("show");
      }
    });
  }
}

function initializeButtons() {
  const contactRiderBtn = document.getElementById("contactRiderBtn");
  const modalRiderBtn = document.getElementById("modalRiderBtn");
  const supportBtn = document.getElementById("supportBtn");

  if (contactRiderBtn) {
    contactRiderBtn.addEventListener("click", () => {
      alert("Rider contact feature will be connected to backend or chat service.");
    });
  }

  if (modalRiderBtn) {
    modalRiderBtn.addEventListener("click", () => {
      alert("Opening rider contact soon.");
    });
  }

  if (supportBtn) {
    supportBtn.addEventListener("click", () => {
      alert("Support feature will be connected to backend.");
    });
  }
}

function renderShippingPage(data) {
  renderMerchantLogo(data.merchant);
  renderShippingStatus(data.shipping);
  renderOrderItems(data.items);
  renderPricing(data.pricing);
}

function renderMerchantLogo(merchant) {
  const merchantLogo = document.getElementById("merchantLogo");
  const merchantLogoFallback = document.getElementById("merchantLogoFallback");

  if (!merchantLogo || !merchantLogoFallback) return;

  if (merchant.logo && merchant.logo.trim() !== "") {
    merchantLogo.src = merchant.logo;
    merchantLogo.hidden = false;
    merchantLogoFallback.hidden = true;
  } else {
    merchantLogo.hidden = true;
    merchantLogoFallback.hidden = false;
    merchantLogoFallback.textContent = "LOGO";
  }
}

function renderShippingStatus(shipping) {
  const estimatedTime = document.getElementById("estimatedTime");
  const shippingStatusText = document.getElementById("shippingStatusText");
  const deliveryModeText = document.getElementById("deliveryModeText");
  const steps = document.querySelectorAll(".progress-step");

  if (estimatedTime) {
    estimatedTime.textContent = shipping.estimatedTimeText || "Time";
  }

  if (shippingStatusText) {
    shippingStatusText.textContent = shipping.statusMessage || "";
  }

  if (deliveryModeText) {
    deliveryModeText.textContent = shipping.deliveryModeLabel || "(Delivery location)";
  }

  steps.forEach((step, index) => {
    if (index < (shipping.currentStage || 0)) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}

function renderOrderItems(items) {
  const orderItems = document.getElementById("orderItems");
  if (!orderItems) return;

  if (!Array.isArray(items) || items.length === 0) {
    orderItems.innerHTML = `
      <div class="order-item">
        <div class="order-item-left">
          <div class="order-item-name">No items yet</div>
          <div class="order-item-meta">Waiting for backend data</div>
        </div>
        <div class="order-item-price">₱0</div>
      </div>
    `;
    return;
  }

  orderItems.innerHTML = items.map(item => {
    const qty = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    const lineTotal = qty * price;

    return `
      <div class="order-item">
        <div class="order-item-left">
          <div class="order-item-name">${escapeHtml(item.name)}${qty > 1 ? ` x${qty}` : ""}</div>
          <div class="order-item-meta">${escapeHtml(item.meta || "")}</div>
        </div>
        <div class="order-item-price">${formatPeso(lineTotal)}</div>
      </div>
    `;
  }).join("");
}

function renderPricing(pricing) {
  const subtotalAmount = document.getElementById("subtotalAmount");
  const deliveryFeeAmount = document.getElementById("deliveryFeeAmount");
  const totalAmount = document.getElementById("totalAmount");

  if (subtotalAmount) subtotalAmount.textContent = formatPeso(pricing.subtotal || 0);
  if (deliveryFeeAmount) deliveryFeeAmount.textContent = formatPeso(pricing.deliveryFee || 0);
  if (totalAmount) totalAmount.textContent = formatPeso(pricing.total || 0);
}

function formatPeso(value) {
  return `₱${Number(value).toLocaleString("en-PH")}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/*
  FOR BACKEND INTEGRATION LATER:

  Example:
  async function loadShippingFromBackend() {
    try {
      const response = await fetch('/api/shipping/current');
      const data = await response.json();
      renderShippingPage(data);
    } catch (error) {
      console.error('Failed to load shipping data:', error);
    }
  }

  Then replace:
  renderShippingPage(sampleShippingData);

  with:
  loadShippingFromBackend();
*/