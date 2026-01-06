// ============================================
// UTILITY FUNCTIONS
// Helper functions for common operations
// ============================================

const Utils = {
    /**
     * Format date to readable string
     * @param {Date|string} date 
     * @param {string} format - 'short', 'long', 'time'
     * @returns {string}
     */
    formatDate(date, format = 'short') {
        const d = typeof date === 'string' ? new Date(date) : date;

        if (format === 'time') {
            return d.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } else if (format === 'long') {
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    },

    /**
     * Format currency in AED
     * @param {number} amount 
     * @returns {string}
     */
    formatCurrency(amount) {
        return `AED ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    },

    /**
     * Generate unique ID
     * @returns {string}
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },

    /**
     * Debounce function
     * @param {Function} func 
     * @param {number} wait 
     * @returns {Function}
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Get geolocation
     * @returns {Promise}
     */
    getGeolocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },

    /**
     * Show toast notification
     * @param {string} message 
     * @param {string} type - 'success', 'error', 'warning', 'info'
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Add to body
        document.body.appendChild(toast);

        // Show with animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Validate email format
     * @param {string} email 
     * @returns {boolean}
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Truncate text
     * @param {string} text 
     * @param {number} maxLength 
     * @returns {string}
     */
    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    /**
     * Get status badge class
     * @param {string} status 
     * @returns {string}
     */
    getStatusBadgeClass(status) {
        const statusMap = {
            'Pending': 'badge-warning',
            'Completed': 'badge-success',
            'On Hold': 'badge-default',
            'Cancelled': 'badge-default',
            'Approved': 'badge-success',
            'Rejected': 'badge-danger'
        };
        return statusMap[status] || 'badge-default';
    },

    /**
     * Get priority badge class
     * @param {string} priority 
     * @returns {string}
     */
    getPriorityBadgeClass(priority) {
        const priorityMap = {
            'High': 'badge-danger',
            'Medium': 'badge-warning',
            'Low': 'badge-default'
        };
        return priorityMap[priority] || 'badge-default';
    },

    /**
     * Save to localStorage with error handling
     * @param {string} key 
     * @param {any} data 
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            this.showToast('Failed to save data', 'error');
            return false;
        }
    },

    /**
     * Load from localStorage with error handling
     * @param {string} key 
     * @param {any} defaultValue 
     * @returns {any}
     */
    loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return defaultValue;
        }
    },

    /**
     * Export data to CSV
     * @param {Array} data 
     * @param {string} filename 
     */
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            this.showToast('No data to export', 'warning');
            return;
        }

        // Get headers from first object
        const headers = Object.keys(data[0]);

        // Create CSV content
        let csv = headers.join(',') + '\n';

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            });
            csv += values.join(',') + '\n';
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showToast('Export successful', 'success');
    },

    /**
     * Initialize modals
     */
    initModals() {
        // Close modal when clicking overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.add('hidden');
            }
        });

        // Close modal when clicking close button
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal-overlay');
                if (modal) modal.classList.add('hidden');
            });
        });
    },

    /**
     * Show modal
     * @param {string} modalId 
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    },

    /**
     * Hide modal
     * @param {string} modalId 
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }
};

// Export for use in other modules
window.Utils = Utils;
