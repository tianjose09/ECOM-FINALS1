/**
 * Main Script
 * ===========
 * Initializes the profile page
 */

(function() {
    // Initialize the profile UI when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        ProfileUI.init();
        
        // Setup dropdown menu
        setupDropdown();
    });

    /**
     * Setup dropdown menu functionality
     */
    function setupDropdown() {
        const acc = document.getElementById('accountDropdown');
        const drop = document.getElementById('dropdownMenu');
        
        if (acc) {
            acc.addEventListener('click', function(e) {
                e.stopPropagation();
                drop.classList.toggle('show');
            });
            
            document.addEventListener('click', function(e) {
                if (!acc.contains(e.target)) {
                    drop.classList.remove('show');
                }
            });
            
            if (drop) {
                drop.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        }
    }
})();