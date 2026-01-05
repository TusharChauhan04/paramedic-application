// ============================================
// AUTHENTICATION MODULE
// Handles user login, logout, and session management
// ============================================

const Auth = {
  // Demo user accounts - DO NOT CHANGE
  DEMO_ACCOUNTS: {
    user: {
      email: 'user@demo.com',
      password: 'user123',
      data: {
        id: '1',
        name: 'John Doe',
        email: 'user@demo.com',
        role: 'Paramedic Staff',
        employeeId: 'PM2024001',
        userType: 'user'
      }
    },
    admin: {
      email: 'admin@demo.com',
      password: 'admin123',
      data: {
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@demo.com',
        role: 'Administrator',
        employeeId: 'ADM2024001',
        userType: 'admin'
      }
    }
  },

  /**
   * Authenticate user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Object|null} User data if successful, null otherwise
   */
  login(email, password) {
    const demoUser = this.DEMO_ACCOUNTS.user;
    const demoAdmin = this.DEMO_ACCOUNTS.admin;

    if (email === demoUser.email && password === demoUser.password) {
      localStorage.setItem('user', JSON.stringify(demoUser.data));
      return demoUser.data;
    } else if (email === demoAdmin.email && password === demoAdmin.password) {
      localStorage.setItem('user', JSON.stringify(demoAdmin.data));
      return demoAdmin.data;
    }

    return null;
  },

  /**
   * Logout current user
   */
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('clockInStatus');
    window.location.href = 'index.html';
  },

  /**
   * Get current logged in user
   * @returns {Object|null} User data or null
   */
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Check if current user is admin
   * @returns {boolean}
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.userType === 'admin';
  },

  /**
   * Require authentication - redirect to login if not authenticated
   * @param {boolean} requireAdmin - If true, require admin role
   */
  requireAuth(requireAdmin = false) {
    if (!this.isAuthenticated()) {
      window.location.href = 'index.html';
      return false;
    }

    if (requireAdmin && !this.isAdmin()) {
      window.location.href = 'dashboard.html';
      return false;
    }

    return true;
  },

  /**
   * Initialize user session on page load
   */
  init() {
    const user = this.getCurrentUser();
    if (user) {
      // Update header with user info
      this.updateHeaderUI(user);
    }
  },

  /**
   * Update header UI with user information
   * @param {Object} user 
   */
  updateHeaderUI(user) {
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userDisplayEl = document.getElementById('user-display-name');
    const userAvatarEl = document.getElementById('user-avatar');

    if (userNameEl) userNameEl.textContent = user.name;
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (userDisplayEl) userDisplayEl.textContent = user.name;
    if (userAvatarEl) {
      // Show initials instead of icon
      const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
      userAvatarEl.textContent = initials;
    }
  }
};

// Export for use in other modules
window.Auth = Auth;
