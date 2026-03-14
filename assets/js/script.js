 // Carousel logic
    function scrollCarousel(direction) {
        const container = document.getElementById('whatsNewCarousel');
        const scrollAmount = 270; // Card width + gap
        
        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    // Dropdown logic from contact page
    document.addEventListener('DOMContentLoaded', function() {
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