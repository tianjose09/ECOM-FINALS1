function scrollCarousel(direction) {
    const container = document.getElementById('whatsNewCarousel');
    const scrollAmount = 270;

    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

async function getSessionUser() {
    try {
        const response = await fetch('./api/auth/me.php', {
            credentials: 'same-origin'
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to get session:', error);
        return { success: false, loggedIn: false };
    }
}

function renderAccountMenu(sessionData) {
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (!dropdownMenu) return;

    if (sessionData.loggedIn) {
        dropdownMenu.innerHTML = `
            <a href="#">${sessionData.user.name}</a>
            <a href="#" id="logoutLink">Logout</a>
        `;

        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', async function (e) {
                e.preventDefault();

                try {
                    const response = await fetch('./api/auth/logout.php', {
                        method: 'POST',
                        credentials: 'same-origin'
                    });
                    const data = await response.json();

                    if (data.success) {
                        alert('Logged out successfully.');
                        window.location.href = './index.html';
                    } else {
                        alert(data.message || 'Logout failed.');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Logout failed.');
                }
            });
        }
    } else {
        dropdownMenu.innerHTML = `
            <a href="./pages/Login Page/index.html">Login</a>
            <a href="./pages/Register Page/index.html">Register</a>
        `;
    }
}

async function loadRandomProducts() {
    const container = document.getElementById('whatsNewCarousel');

    try {
        const response = await fetch('./api/products/random_home.php', {
            credentials: 'same-origin'
        });
        const data = await response.json();

        if (!data.success || !Array.isArray(data.products)) {
            container.innerHTML = '<p style="padding:20px;">Unable to load products.</p>';
            return;
        }

        container.innerHTML = data.products.map(product => `
            <div class="product-card">
                <img src="./assets/img/${product.image_path || 'your-product.png'}" alt="${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <p>${product.description ? product.description : 'No description available.'}</p>
                <div class="card-bottom">
                    <span class="price">₱${parseFloat(product.price).toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="padding:20px;">Error loading products.</p>';
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const acc = document.getElementById('accountDropdown');
    const drop = document.getElementById('dropdownMenu');
    const orderLink = document.getElementById('orderLink');

    const sessionData = await getSessionUser();
    renderAccountMenu(sessionData);

    acc?.addEventListener('click', function (e) {
        e.stopPropagation();
        drop.classList.toggle('show');
    });

    document.addEventListener('click', function (e) {
        if (!acc?.contains(e.target)) {
            drop.classList.remove('show');
        }
    });

    drop?.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    if (orderLink) {
        orderLink.addEventListener('click', function (e) {
            if (!sessionData.loggedIn) {
                e.preventDefault();
                alert('Please login first before ordering.');
                window.location.href = './pages/Login Page/index.html';
            }
        });
    }

    loadRandomProducts();
});