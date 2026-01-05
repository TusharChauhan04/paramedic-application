// ============================================
// MAIN APPLICATION LOGIC
// Global app initialization and common functionality
// ============================================

const App = {
    /**
     * Initialize application
     */
    init() {
        // Initialize auth
        Auth.init();

        // Set active nav link
        this.setActiveNav();

        // Initialize dropdowns
        this.initDropdowns();

        // Initialize mobile menu
        this.initMobileMenu();

        // Initialize modals
        Utils.initModals();

        // Add logout listener
        const logoutBtns = document.querySelectorAll('[data-logout]');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.logout();
            });
        });
    },

    /**
     * Set active navigation link based on current page
     */
    setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.sidebar-link, .admin-sidebar-link');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    /**
     * Initialize dropdown menus
     */
    initDropdowns() {
        const userBtn = document.getElementById('user-dropdown-btn');
        const dropdown = document.getElementById('user-dropdown-menu');

        if (userBtn && dropdown) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('show');
            });
        }
    },

    /**
     * Initialize mobile menu toggle
     */
    initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.querySelector('.sidebar');

        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth < 1024) {
                    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                        sidebar.classList.remove('mobile-open');
                    }
                }
            });
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
window.App = App;
