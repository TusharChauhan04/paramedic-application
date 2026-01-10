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

        // PHASE 2: Inject admin links if user is admin (fixes security vulnerability)
        this.injectAdminLinks();

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
    },

    /**
     * PHASE 2: Inject admin navigation links dynamically for admin users only
     * This fixes the security vulnerability where admin links were in DOM but hidden
     */
    injectAdminLinks() {
        const user = Auth.getCurrentUser();
        if (!user || user.userType !== 'admin') {
            return; // Not an admin, don't inject links
        }

        const sidebar = document.querySelector('.sidebar-nav');
        if (!sidebar) {
            return; // Sidebar not found
        }

        const dashboardLink = sidebar.querySelector('a[href="dashboard.html"]');
        if (!dashboardLink) {
            return; // Dashboard link not found
        }

        // Create admin links HTML
        const adminLinksHTML = `
            <a href="admin-users.html" class="sidebar-link">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                User Management
            </a>
            <a href="admin-cases.html" class="sidebar-link">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                All Cases
            </a>
        `;

        // Insert admin links after the dashboard link
        dashboardLink.insertAdjacentHTML('afterend', adminLinksHTML);

        // Hide the regular "Cases & Forms" link for admins
        const userCasesLink = document.getElementById('user-cases-link');
        if (userCasesLink) {
            userCasesLink.style.display = 'none';
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
window.App = App;
