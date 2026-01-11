/**
 * ADIT Joint - Dropdown Menu JavaScript
 * Author: ADIT Joint
 * Version: 1.0
 */

// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown functionality
    initDropdowns();

    // Handle dropdown touch events for mobile devices
    initTouchDropdowns();
});

/**
 * Initialize the dropdown menu functionality
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (dropdowns.length > 0) {
        // For desktop: Handle mouse interactions
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!toggle || !menu) return;
            
            // Show dropdown on mouseenter
            dropdown.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 992) {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                    
                    // Rotate the dropdown icon
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                }
            });
            
            // Hide dropdown on mouseleave
            dropdown.addEventListener('mouseleave', function() {
                if (window.innerWidth >= 992) {
                    menu.style.opacity = '';
                    menu.style.visibility = '';
                    menu.style.transform = '';
                    
                    // Reset the dropdown icon
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.style.transform = '';
                    }
                }
            });
            
            // Toggle dropdown on click (for mobile)
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    
                    if (dropdown.classList.contains('active')) {
                        menu.style.display = 'block';
                        
                        // Rotate the dropdown icon
                        const icon = toggle.querySelector('i');
                        if (icon) {
                            icon.style.transform = 'rotate(180deg)';
                        }
                    } else {
                        menu.style.display = '';
                        
                        // Reset the dropdown icon
                        const icon = toggle.querySelector('i');
                        if (icon) {
                            icon.style.transform = '';
                        }
                    }
                }
            });
        });
        
        // Close all dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                const isDropdownToggle = e.target.classList.contains('dropdown-toggle') || 
                                        e.target.closest('.dropdown-toggle');
                
                if (!isDropdownToggle) {
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                        const menu = dropdown.querySelector('.dropdown-menu');
                        if (menu) {
                            menu.style.display = '';
                        }
                        
                        // Reset the dropdown icon
                        const icon = dropdown.querySelector('.dropdown-toggle i');
                        if (icon) {
                            icon.style.transform = '';
                        }
                    });
                }
            }
        });
    }
}

/**
 * Initialize touch events for dropdown menus on mobile devices
 */
function initTouchDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (dropdownToggles.length > 0) {
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('touchstart', function(e) {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    const dropdown = this.closest('.dropdown');
                    dropdown.classList.toggle('active');
                    
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (dropdown.classList.contains('active')) {
                        menu.style.display = 'block';
                        
                        // Rotate the dropdown icon
                        const icon = this.querySelector('i');
                        if (icon) {
                            icon.style.transform = 'rotate(180deg)';
                        }
                    } else {
                        menu.style.display = '';
                        
                        // Reset the dropdown icon
                        const icon = this.querySelector('i');
                        if (icon) {
                            icon.style.transform = '';
                        }
                    }
                }
            }, { passive: false });
        });
    }
}

/**
 * Handle window resize events to reset dropdown styles
 */
window.addEventListener('resize', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (window.innerWidth >= 992) {
        // Reset mobile styles when going to desktop
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = '';
                menu.style.opacity = '';
                menu.style.visibility = '';
                menu.style.transform = '';
            }
            
            // Reset the dropdown icon
            const icon = dropdown.querySelector('.dropdown-toggle i');
            if (icon) {
                icon.style.transform = '';
            }
        });
    } else {
        // Reset desktop hover styles when going to mobile
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '';
                menu.style.visibility = '';
                menu.style.transform = '';
            }
        });
    }
});

/**
 * Apply active states for current section in navigation
 */
(function setActiveDropdowns() {
    const currentPath = window.location.pathname;
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    
    dropdownMenus.forEach(menu => {
        const links = menu.querySelectorAll('a');
        
        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            if (currentPath.includes(linkPath) && linkPath !== '#') {
                link.classList.add('active');
                
                // Add active class to parent dropdown toggle
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    if (toggle) {
                        toggle.classList.add('active');
                    }
                }
            }
        });
    });
})();
