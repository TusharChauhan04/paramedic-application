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
    },
    marketing: {
      email: 'marketing@demo.com',
      password: 'marketing123',
      data: {
        id: '2',
        name: 'Marketing Manager',
        email: 'marketing@demo.com',
        role: 'Marketing Department',
        employeeId: 'MKT2024001',
        userType: 'user'
      }
    },
    medical: {
      email: 'medical@demo.com',
      password: 'medical123',
      data: {
        id: '3',
        name: 'Medical Officer',
        email: 'medical@demo.com',
        role: 'Medical Department',
        employeeId: 'MED2024001',
        userType: 'user'
      }
    },
    operations: {
      email: 'operations@demo.com',
      password: 'operations123',
      data: {
        id: '4',
        name: 'Operations Manager',
        email: 'operations@demo.com',
        role: 'Operations Department',
        employeeId: 'OPS2024001',
        userType: 'user'
      }
    },
    accounts: {
      email: 'accounts@demo.com',
      password: 'accounts123',
      data: {
        id: '5',
        name: 'Accounts Manager',
        email: 'accounts@demo.com',
        role: 'Accounts Department',
        employeeId: 'ACC2024001',
        userType: 'user'
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
    // Check all demo accounts
    for (const accountKey in this.DEMO_ACCOUNTS) {
      const account = this.DEMO_ACCOUNTS[accountKey];
      if (email === account.email && password === account.password) {
        localStorage.setItem('user', JSON.stringify(account.data));
        return account.data;
      }
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
