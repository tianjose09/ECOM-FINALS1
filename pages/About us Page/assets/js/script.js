// === JS code (separated) ===
(function() {
    // get the carousel elements
    const grid = document.getElementById('teamGrid');
    const leftBtn = document.getElementById('scrollLeft');
    const rightBtn = document.getElementById('scrollRight');
    const cards = Array.from(document.querySelectorAll('.team-card'));
    
    if (!grid || !leftBtn || !rightBtn || cards.length === 0) return;

    let currentIndex = 0;
    const visibleCount = 3; // Show 3 cards at a time
    const totalCards = cards.length;

    // Function to update which cards are visible
    function updateVisibleCards() {
        // Hide all cards first by moving them out of view
        cards.forEach((card, index) => {
            // Calculate position in circular manner
            let position = (index - currentIndex + totalCards) % totalCards;
            
            if (position < visibleCount) {
                // Show this card
                card.style.display = 'block';
                card.style.order = position;
                // Add active class to the middle card (position 1 when showing 3 cards)
                if (position === 1) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            } else {
                // Hide this card
                card.style.display = 'none';
                card.classList.remove('active');
            }
        });
        
        // Update button states (always enabled for circular navigation)
        leftBtn.style.opacity = '1';
        leftBtn.style.cursor = 'pointer';
        rightBtn.style.opacity = '1';
        rightBtn.style.cursor = 'pointer';
    }

    // Move to previous cards (circular)
    function moveLeft() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateVisibleCards();
    }

    // Move to next cards (circular)
    function moveRight() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateVisibleCards();
    }

    // Add event listeners to buttons
    leftBtn.addEventListener('click', moveLeft);
    rightBtn.addEventListener('click', moveRight);

    // Initialize display
    updateVisibleCards();

    // Account dropdown functionality
    const accountDropdown = document.getElementById('accountDropdown');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (accountDropdown && dropdownMenu) {
        accountDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            accountDropdown.setAttribute('aria-expanded', dropdownMenu.classList.contains('show'));
        });

        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
            accountDropdown.setAttribute('aria-expanded', 'false');
        });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        updateVisibleCards();
    });
})();