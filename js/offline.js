// Gestion du mode hors ligne
class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        this.showStatus();
    }

    handleOnline() {
        this.isOnline = true;
        this.showToast('Connexion rétablie', 'success');
        this.syncData();
    }

    handleOffline() {
        this.isOnline = false;
        this.showToast('Mode hors ligne - Certaines fonctionnalités sont limitées', 'warning');
    }

    showStatus() {
        if (!this.isOnline) {
            this.showToast('Vous êtes hors ligne', 'warning');
        }
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }

    async syncData() {
        // Synchroniser les réservations en attente
        const pendingBookings = JSON.parse(localStorage.getItem('pending_bookings') || '[]');
        
        if (pendingBookings.length > 0) {
            for (const booking of pendingBookings) {
                try {
                    await this.sendBooking(booking);
                    this.showToast('Réservation synchronisée', 'success');
                } catch (error) {
                    console.error('Sync failed:', error);
                }
            }
            
            localStorage.removeItem('pending_bookings');
        }
    }

    async sendBooking(booking) {
        // Simuler l'envoi au serveur
        return new Promise((resolve) => {
            setTimeout(() => {
                saveBooking(booking);
                resolve();
            }, 1000);
        });
    }
}

// Initialisation
const offlineManager = new OfflineManager();