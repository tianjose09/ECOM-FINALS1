let cart = [];
let subtotal = 0;
let deliveryFee = 0;
let deliveryMethod = 'pickup';
let selectedPaymentMethod = null;
let selectedPaymentUrl = null;

const paymentUrls = {
    'GCash': 'https://www.gcash.com',
    'Mastercard': 'https://www.mastercard.com',
    'Visa': 'https://www.visa.com',
    'COD': null
};

function loadCart() {
    try {
        let savedCart = sessionStorage.getItem('checkoutCart');

        if (!savedCart) {
            savedCart = localStorage.getItem('brewhaCart');
        }

        if (savedCart) {
            cart = JSON.parse(savedCart);
        } else {
            cart = [];
        }
    } catch (e) {
        console.error("Error loading cart:", e);
        cart = [];
    }

    displayCart();
}

function displayCart() {
    let orderItems = document.getElementById("orderItems");
    orderItems.innerHTML = "";
    subtotal = 0;

    if (cart.length === 0) {
        orderItems.innerHTML = '<div class="item"><span>No items in cart</span><span>₱ 0</span></div>';
    } else {
        cart.forEach(item => {
            let itemDetails = '';

            if (item.size && item.size !== 'Regular') {
                itemDetails += `<div class="item-details">Size: ${item.size}</div>`;
            }

            if (item.pieces && item.pieces > 1) {
                itemDetails += `<div class="item-details">Quantity: ${item.pieces} pcs</div>`;
            }

            if (item.notes) {
                itemDetails += `<div class="item-details">Note: ${item.notes}</div>`;
            }

            orderItems.innerHTML += `
            <div class="item">
                <div>
                    <span>${item.name} ${item.qty > 1 ? ' x' + item.qty : ''}</span>
                    ${itemDetails}
                </div>
                <span>₱ ${item.price * (item.qty || 1)}</span>
            </div>
            `;
            subtotal += item.price * (item.qty || 1);
        });
    }

    document.getElementById("subtotal").innerText = subtotal;
    updateTotal();
}

function updateTotal() {
    const total = subtotal + deliveryFee;
    document.getElementById("total").innerText = total;
}

function selectDeliveryMethod(method) {
    deliveryMethod = method;

    document.getElementById('pickupOption').classList.remove('selected');
    document.getElementById('deliveryOption').classList.remove('selected');

    if (method === 'pickup') {
        document.getElementById('pickupOption').classList.add('selected');
        document.getElementById('deliveryFields').classList.remove('show');
        document.getElementById('deliveryFeeInfo').style.display = 'none';
        deliveryFee = 0;
        document.getElementById('deliveryFee').innerText = '0';
        updateTotal();
    } else {
        document.getElementById('deliveryOption').classList.add('selected');
        document.getElementById('deliveryFields').classList.add('show');
        document.getElementById('deliveryFeeInfo').style.display = 'block';
        deliveryFee = 40;
        document.getElementById('deliveryFee').innerText = deliveryFee;
        document.getElementById('deliveryFeeText').innerText = 'Standard delivery fee: ₱40';
        updateTotal();
    }
}

function selectPayment(method, url, element) {
    selectedPaymentMethod = method;
    selectedPaymentUrl = url;

    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    element.classList.add('selected');

    const radio = element.querySelector('input[type="radio"]');
    if (radio) {
        radio.checked = true;
    }
}

function validateAndShowPayment() {
    if (deliveryMethod === 'delivery') {
        let houseNumber = document.getElementById("houseNumber").value.trim();
        let street = document.getElementById("street").value.trim();
        let barangay = document.getElementById("barangay").value.trim();
        let city = document.getElementById("city").value.trim();
        let province = document.getElementById("province").value.trim();
        let zipCode = document.getElementById("zipCode").value.trim();

        if (houseNumber === "" || street === "" || barangay === "" || city === "" || province === "" || zipCode === "") {
            alert("Please fill in all delivery address fields");
            return;
        }
    }

    if (!selectedPaymentMethod) {
        alert("Please select payment method");
        return;
    }

    let agree = document.getElementById("agree").checked;
    if (!agree) {
        alert("You must agree to the terms");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalAmount = subtotal + deliveryFee;

    if (selectedPaymentMethod === 'COD') {
        placeOrder();
        return;
    }

    const modal = document.getElementById('paymentModal');
    const message = document.getElementById('paymentModalMessage');
    const amountDisplay = document.getElementById('paymentAmount');

    message.innerHTML = `You will be redirected to <strong>${selectedPaymentMethod}</strong> to complete your payment.`;
    amountDisplay.innerHTML = `₱${totalAmount.toFixed(2)}`;

    modal.style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function proceedToPayment() {
    const totalAmount = subtotal + deliveryFee;

    if (selectedPaymentUrl) {
        window.open(selectedPaymentUrl, '_blank');
    }

    closePaymentModal();

    const order = {
        orderNumber: 'ORD-' + Date.now(),
        items: cart,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: totalAmount,
        paymentMethod: selectedPaymentMethod,
        deliveryMethod: deliveryMethod,
        address: deliveryMethod === 'delivery' ? getFullAddress() : 'Pickup at store',
        orderDate: new Date().toISOString(),
        status: 'Payment Pending'
    };

    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    localStorage.removeItem('brewhaCart');
    sessionStorage.removeItem('checkoutCart');
    sessionStorage.removeItem('checkoutTotal');

    showSimplifiedConfirmation(order);
}

function getFullAddress() {
    let houseNumber = document.getElementById("houseNumber").value.trim();
    let street = document.getElementById("street").value.trim();
    let barangay = document.getElementById("barangay").value.trim();
    let city = document.getElementById("city").value.trim();
    let province = document.getElementById("province").value.trim();
    let zipCode = document.getElementById("zipCode").value.trim();

    return `${houseNumber} ${street}, ${barangay}, ${city}, ${province} ${zipCode}`;
}

function placeOrder() {
    const totalAmount = subtotal + deliveryFee;

    const order = {
        orderNumber: 'ORD-' + Date.now(),
        items: cart,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: totalAmount,
        paymentMethod: selectedPaymentMethod,
        deliveryMethod: deliveryMethod,
        address: deliveryMethod === 'delivery' ? getFullAddress() : 'Pickup at store',
        orderDate: new Date().toISOString(),
        status: 'Confirmed'
    };

    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    localStorage.removeItem('brewhaCart');
    sessionStorage.removeItem('checkoutCart');
    sessionStorage.removeItem('checkoutTotal');

    showSimplifiedConfirmation(order);
}

function showSimplifiedConfirmation(order) {
    const locationDiv = document.getElementById('confirmationLocation');

    if (order.deliveryMethod === 'delivery') {
        locationDiv.innerHTML = `
            <h3><i class="fas fa-map-marker-alt"></i> Delivery Address</h3>
            <p>${order.address}</p>
            <p><small>Payment: ${order.paymentMethod}</small></p>
        `;
    } else {
        locationDiv.innerHTML = `
            <h3><i class="fas fa-store"></i> Pickup Location</h3>
            <p>Brew-HA Kitchen, P. Paredes St., Sampaloc, Manila</p>
            <p><small>Payment: ${order.paymentMethod}</small></p>
        `;
    }

    document.getElementById('confirmationModal').style.display = 'flex';
}

function closeConfirmationModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

function continueShopping() {
    window.location.href = 'PRODUCT_CATALOG.html';
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    const resultsDiv = document.querySelector('.search-results');

    if (query === '') {
        resultsDiv.classList.remove('has-results');
        resultsContainer.innerHTML = '<p style="text-align: center; color: #666;">Please enter a search term.</p>';
        return;
    }

    const products = [
        { name: "Latte", price: 135, category: "drink", img: "latte.webp" },
        { name: "Americano", price: 120, category: "drink", img: "americano.webp" },
        { name: "Mocha", price: 140, category: "drink", img: "mocha.webp" },
        { name: "Cappuccino", price: 125, category: "drink", img: "cappuccino.webp" },
        { name: "Blueberry Juice", price: 140, category: "drink", img: "blueberry.png" },
        { name: "Strawberry Smoothie", price: 150, category: "drink", img: "strawberry.png" },
        { name: "Croissant", price: 110, category: "pastry", img: "croissant.png" },
        { name: "Donut", price: 65, category: "pastry", img: "donut.png" },
        { name: "Danish", price: 120, category: "pastry", img: "danish.png" },
        { name: "Muffin", price: 70, category: "pastry", img: "muffin.png" },
        { name: "Carbonara", price: 220, category: "pasta", img: "carbonara.png" },
        { name: "Bolognese", price: 235, category: "pasta", img: "bolognese.png" },
        { name: "Alfredo", price: 215, category: "pasta", img: "alfredo.png" },
        { name: "Pesto", price: 255, category: "pasta", img: "pesto.png" }
    ];

    const results = products.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No products found matching "' + query + '"</div>';
        resultsDiv.classList.add('has-results');
    } else {
        resultsContainer.innerHTML = results.map(item => {
            let section = 'drinks';
            if (item.category === 'pastry') section = 'pastry';
            else if (item.category === 'pasta') section = 'pasta';

            return `
            <div class="search-result-item" onclick="window.location.href='PRODUCT_CATALOG.html?section=${section}&product=${encodeURIComponent(item.name)}'">
                <div class="result-info">
                    <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50x50?text=${item.name.charAt(0)}'">
                    <div class="result-details">
                        <h4>${item.name}</h4>
                        <p>₱${item.price} | ${item.category}</p>
                    </div>
                </div>
                <i class="fas fa-arrow-right" style="color: #6f7551;"></i>
            </div>
        `;
        }).join('');
        resultsDiv.classList.add('has-results');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    selectDeliveryMethod('pickup');

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
});