// Sample search database
const searchDatabase = [
  { title: "Coffee Latte", category: "Menu Item", icon: "local_cafe", description: "Rich espresso with steamed milk" },
  { title: "Americano", category: "Menu Item", icon: "local_cafe", description: "Espresso with hot water" },
  { title: "Cappuccino", category: "Menu Item", icon: "local_cafe", description: "Espresso with frothed milk" },
  { title: "Mocha", category: "Menu Item", icon: "local_cafe", description: "Chocolate flavored coffee" },
  { title: "Croissant", category: "Pastry", icon: "bakery_dining", description: "Buttery flaky pastry" },
  { title: "Danish", category: "Pastry", icon: "bakery_dining", description: "Sweet filled pastry" },
  { title: "Muffin", category: "Pastry", icon: "bakery_dining", description: "Individual quick bread" },
  { title: "Carbonara", category: "Pasta", icon: "ramen_dining", description: "Creamy bacon pasta" },
  { title: "Pesto Pasta", category: "Pasta", icon: "ramen_dining", description: "Basil and garlic pasta" },
  { title: "Bolognese", category: "Pasta", icon: "ramen_dining", description: "Meat-based pasta sauce" },
  { title: "Manila", category: "Location", icon: "location_on", description: "Our main branch location" },
  { title: "FEU Tech", category: "Location", icon: "school", description: "Near FEU Institute of Technology" },
  { title: "Contact Us", category: "Page", icon: "contact_page", description: "Get in touch with us" },
  { title: "Order", category: "Page", icon: "shopping_bag", description: "Place your order" },
  { title: "Menu", category: "Page", icon: "restaurant_menu", description: "View our full menu" },
  { title: "Phone", category: "Contact", icon: "phone", description: "+63 926 005 2555" },
  { title: "Email", category: "Contact", icon: "email", description: "brewha@gmail.com" },
  { title: "Delivery", category: "Service", icon: "delivery_dining", description: "We deliver to your location" }
];

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    const resultsDiv = document.querySelector('.search-results');

    if (query === '') {
        resultsDiv.classList.remove('has-results');
        resultsContainer.innerHTML = '<div class="no-results"><i class="fas fa-search"></i>Please enter a search term.</div>';
        resultsDiv.classList.add('has-results');
        return;
    }

    const results = searchDatabase.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results"><i class="fas fa-box-open"></i>No results found for "' + query + '"</div>';
        resultsDiv.classList.add('has-results');
    } else {
        resultsContainer.innerHTML = results.map(item => `
            <div class="search-result-item" onclick="handleSearchResult('${item.title}', '${item.category}')">
                <div class="result-icon">
                    <span class="material-icons">${item.icon}</span>
                </div>
                <div class="result-content">
                    <h4>${item.title}</h4>
                    <p>${item.category} • ${item.description}</p>
                </div>
                <i class="fas fa-arrow-right" style="color: #6f7551;"></i>
            </div>
        `).join('');
        resultsDiv.classList.add('has-results');
    }
}

function handleSearchResult(title, category) {
    alert(`You selected: ${title} (${category})\nThis would navigate to the relevant page.`);
    document.getElementById('searchOverlay').style.display = 'none';
    document.querySelector('.search-results').classList.remove('has-results');
    document.getElementById('searchInput').value = '';
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
});

function sendMessage() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let topic = document.getElementById("topic").value.trim();
    let message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || topic === "" || message === "") {
        alert("Please complete all fields");
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert("Please enter a valid email address");
        return;
    }

    alert("Thank you for reaching out to us! We will get back to you immediately.");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("topic").value = "";
    document.getElementById("message").value = "";
}