// Application principale
class AssinieGoApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    async init() {
        await this.hideSplash();
        this.setupEventListeners();
        this.registerServiceWorker();
        this.loadUserData();
        this.startScrollAnimations();
        this.setupPullToRefresh();
    }

    hideSplash() {
        return new Promise((resolve) => {
            const splash = document.getElementById('splash-screen');
            setTimeout(() => {
                splash.classList.add('hide');
                setTimeout(() => {
                    document.getElementById('app').classList.remove('hidden');
                    resolve();
                }, 800);
            }, 2000);
        });
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });

        // Floating Action Button
        const fab = document.getElementById('fab');
        fab.addEventListener('click', () => {
            this.navigateTo('booking');
            this.showToast('Prêt à réserver ?', 'info');
        });

        // Back button handling
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.navigateTo(page, false);
        });
    }

    navigateTo(page, pushState = true) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.page === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active-page');
        });
        document.getElementById(`${page}-page`).classList.add('active-page');

        // Load page content if needed
        this.loadPageContent(page);

        // Update URL
        if (pushState) {
            history.pushState({ page }, '', `#${page}`);
        }

        this.currentPage = page;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Animate new page
        this.animatePageTransition();
    }

    async loadPageContent(page) {
        const pageElement = document.getElementById(`${page}-page`);
        
        // Add loading skeleton
        pageElement.innerHTML = this.getSkeletonLoader();
        
        try {
            let content = '';
            switch(page) {
                case 'home':
                    content = await this.renderHome();
                    break;
                case 'activities':
                    content = await this.renderActivities();
                    break;
                case 'booking':
                    content = await this.renderBooking();
                    break;
                case 'profile':
                    content = await this.renderProfile();
                    break;
            }
            
            pageElement.innerHTML = content;
            this.attachPageEvents(page);
            this.initScrollAnimations();
            
        } catch (error) {
            console.error('Error loading page:', error);
            pageElement.innerHTML = this.getErrorState();
        }
    }

    getSkeletonLoader() {
        return `
            <div class="skeleton-card" style="padding: 20px;">
                <div class="skeleton skeleton-title" style="height: 30px; width: 60%; margin-bottom: 20px;"></div>
                <div class="skeleton skeleton-text" style="height: 80px;"></div>
                <div class="skeleton skeleton-text" style="height: 80px;"></div>
                <div class="skeleton skeleton-text" style="height: 80px;"></div>
            </div>
        `;
    }

    getErrorState() {
        return `
            <div class="empty-state animate-fadeIn">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Oups !</h3>
                <p>Une erreur est survenue</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-sync-alt"></i> Réessayer
                </button>
            </div>
        `;
    }

    async renderHome() {
        const popularActivities = getPopularActivities().slice(0, 4);
        
        return `
            <div class="home-container">
                <!-- Hero Section -->
                <div class="hero-section glass" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); border-radius: var(--radius-xl); padding: 30px; margin-bottom: 30px; color: white;">
                    <div class="hero-content animate-fadeInUp">
                        <h1 style="font-size: 2rem; margin-bottom: 10px;">Bienvenue sur<br><span style="color: var(--secondary);">AssinieGo</span></h1>
                        <p style="opacity: 0.9;">Votre week-end à Assinie commence ici</p>
                    </div>
                    <div class="hero-stats" style="display: flex; gap: 20px; margin-top: 30px;">
                        <div class="stat">
                            <div class="stat-value" style="font-size: 1.5rem; font-weight: 800;">+500</div>
                            <div class="stat-label" style="font-size: 0.8rem;">Réservations</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" style="font-size: 1.5rem; font-weight: 800;">9</div>
                            <div class="stat-label" style="font-size: 0.8rem;">Expériences</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" style="font-size: 1.5rem; font-weight: 800;">4.8</div>
                            <div class="stat-label" style="font-size: 0.8rem;">⭐ Note</div>
                        </div>
                    </div>
                </div>

                <!-- Popular Activities -->
                <div class="section scroll-reveal">
                    <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="font-size: 1.5rem;">🔥 Populaires</h2>
                        <button class="btn-outline" style="padding: 8px 16px;" onclick="app.navigateTo('activities')">Voir tout <i class="fas fa-arrow-right"></i></button>
                    </div>
                    <div class="activities-grid" style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                        ${popularActivities.map(activity => this.renderActivityCard(activity)).join('')}
                    </div>
                </div>

                <!-- Categories -->
                <div class="section scroll-reveal">
                    <h2 style="font-size: 1.5rem; margin-bottom: 20px;">Catégories</h2>
                    <div class="categories-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                        <div class="category-card" onclick="app.navigateTo('activities')" style="text-align: center; padding: 20px; background: white; border-radius: var(--radius-lg); cursor: pointer;">
                            <i class="fas fa-water" style="font-size: 2rem; color: var(--secondary);"></i>
                            <h3 style="margin-top: 10px; font-size: 0.9rem;">Nautique</h3>
                        </div>
                        <div class="category-card" onclick="app.navigateTo('activities')" style="text-align: center; padding: 20px; background: white; border-radius: var(--radius-lg); cursor: pointer;">
                            <i class="fas fa-motorcycle" style="font-size: 2rem; color: var(--secondary);"></i>
                            <h3 style="margin-top: 10px; font-size: 0.9rem;">Terrestre</h3>
                        </div>
                        <div class="category-card" onclick="app.navigateTo('activities')" style="text-align: center; padding: 20px; background: white; border-radius: var(--radius-lg); cursor: pointer;">
                            <i class="fas fa-leaf" style="font-size: 2rem; color: var(--secondary);"></i>
                            <h3 style="margin-top: 10px; font-size: 0.9rem;">Nature</h3>
                        </div>
                    </div>
                </div>

                <!-- Testimonials -->
                <div class="section scroll-reveal">
                    <h2 style="font-size: 1.5rem; margin-bottom: 20px;">💬 Ils ont adoré</h2>
                    <div class="testimonials" style="display: grid; gap: 16px;">
                        <div class="testimonial-card" style="background: white; padding: 20px; border-radius: var(--radius-lg);">
                            <div class="rating" style="margin-bottom: 10px;">
                                ${'★'.repeat(5)}
                            </div>
                            <p>"Super expérience avec AssinieGo ! Réservation rapide et paiement sécurisé. Je recommande !"</p>
                            <div class="author" style="margin-top: 10px; font-weight: 600;">- Marie, Abidjan</div>
                        </div>
                        <div class="testimonial-card" style="background: white; padding: 20px; border-radius: var(--radius-lg);">
                            <div class="rating" style="margin-bottom: 10px;">
                                ${'★'.repeat(5)}
                            </div>
                            <p>"Le jet-ski était incroyable ! Organisation parfaite. Merci AssinieGo !"</p>
                            <div class="author" style="margin-top: 10px; font-weight: 600;">- Jean, Paris</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderActivityCard(activity) {
        return `
            <div class="card hover-lift" onclick="app.showActivityDetail(${activity.id})">
                <div class="card-image">
                    <img src="${activity.image}" alt="${activity.name}" loading="lazy">
                    <span class="card-badge">${activity.rating} ★</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${activity.name}</h3>
                    <p class="card-description">${activity.description}</p>
                    <div class="card-price">${activity.price.toLocaleString()} FCFA <small>/pers</small></div>
                    <div class="card-footer">
                        <span><i class="fas fa-clock"></i> ${activity.duration}</span>
                        <button class="btn btn-primary" style="padding: 8px 16px;" onclick="event.stopPropagation(); app.bookActivity(${activity.id})">
                            Réserver
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async renderActivities() {
        return `
            <div class="activities-container">
                <div class="search-bar" style="margin-bottom: 20px;">
                    <div class="input-icon">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" class="input-field" placeholder="Rechercher une activité..." onkeyup="app.filterActivities(this.value)">
                    </div>
                </div>
                
                <div class="tabs">
                    <div class="tab active" data-category="all" onclick="app.filterByCategory('all')">Tous</div>
                    <div class="tab" data-category="nautique" onclick="app.filterByCategory('nautique')">Nautique</div>
                    <div class="tab" data-category="terrestre" onclick="app.filterByCategory('terrestre')">Terrestre</div>
                    <div class="tab" data-category="nature" onclick="app.filterByCategory('nature')">Nature</div>
                </div>
                
                <div id="activitiesList" class="activities-grid" style="display: grid; gap: 16px;">
                    ${activities.map(activity => this.renderActivityCard(activity)).join('')}
                </div>
            </div>
        `;
    }

    async renderBooking() {
        return `
            <div class="booking-container">
                <form id="bookingForm" class="booking-form" style="background: white; border-radius: var(--radius-xl); padding: 24px;">
                    <h2 style="margin-bottom: 20px;">Nouvelle réservation</h2>
                    
                    <div class="input-group">
                        <label class="input-label">Activité *</label>
                        <select id="activitySelect" class="input-field select-field" required>
                            <option value="">Sélectionnez une activité</option>
                            ${activities.map(a => `<option value="${a.id}">${a.name} - ${a.price.toLocaleString()} FCFA</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Date *</label>
                        <input type="date" id="date" class="input-field" min="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Horaire *</label>
                        <select id="time" class="input-field select-field" required>
                            <option value="">Sélectionnez un horaire</option>
                            <option value="09:00">09:00 - Matin</option>
                            <option value="11:00">11:00 - Début de journée</option>
                            <option value="14:00">14:00 - Après-midi</option>
                            <option value="16:00">16:00 - Fin d'après-midi</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Nombre de personnes *</label>
                        <input type="number" id="people" class="input-field" min="1" max="20" value="2" required>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Prix total</label>
                        <div id="totalPrice" class="price-display" style="font-size: 1.5rem; font-weight: 800; color: var(--secondary);">0 FCFA</div>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Prénom *</label>
                        <div class="input-icon">
                            <i class="fas fa-user"></i>
                            <input type="text" id="firstName" class="input-field" placeholder="Votre prénom" required>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Nom *</label>
                        <div class="input-icon">
                            <i class="fas fa-user"></i>
                            <input type="text" id="lastName" class="input-field" placeholder="Votre nom" required>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Email *</label>
                        <div class="input-icon">
                            <i class="fas fa-envelope"></i>
                            <input type="email" id="email" class="input-field" placeholder="votre@email.com" required>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Téléphone *</label>
                        <div class="input-icon">
                            <i class="fas fa-phone"></i>
                            <input type="tel" id="phone" class="input-field" placeholder="05 XX XX XX XX" required>
                        </div>
                    </div>
                    
                    <div class="payment-section" style="margin: 20px 0;">
                        <h3 style="margin-bottom: 15px;">Mode de paiement</h3>
                        <div class="payment-methods" style="display: flex; gap: 16px;">
                            <label class="payment-option" style="flex: 1; cursor: pointer;">
                                <input type="radio" name="paymentMethod" value="wave" checked hidden>
                                <div class="payment-card" style="text-align: center; padding: 12px; border: 2px solid var(--light); border-radius: var(--radius-md);">
                                    <i class="fas fa-mobile-alt" style="font-size: 1.5rem; color: var(--secondary);"></i>
                                    <div>Wave</div>
                                </div>
                            </label>
                            <label class="payment-option" style="flex: 1; cursor: pointer;">
                                <input type="radio" name="paymentMethod" value="orange" hidden>
                                <div class="payment-card" style="text-align: center; padding: 12px; border: 2px solid var(--light); border-radius: var(--radius-md);">
                                    <i class="fas fa-money-bill-wave" style="font-size: 1.5rem; color: var(--secondary);"></i>
                                    <div>Orange Money</div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block btn-large" style="margin-top: 20px;">
                        <i class="fas fa-lock"></i> Payer et réserver
                    </button>
                </form>
            </div>
        `;
    }

    async renderProfile() {
        const userBookings = getBookings();
        
        return `
            <div class="profile-container">
                <div class="profile-header" style="background: var(--gradient-primary); border-radius: var(--radius-xl); padding: 30px; color: white; text-align: center; margin-bottom: 20px;">
                    <div class="profile-avatar" style="width: 80px; height: 80px; background: var(--secondary); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <i class="fas fa-user" style="font-size: 2rem;"></i>
                    </div>
                    <h2>Bonjour, Visiteur</h2>
                    <p>Connectez-vous pour plus de fonctionnalités</p>
                    <button class="btn btn-outline" style="margin-top: 15px; background: white;">
                        <i class="fas fa-sign-in-alt"></i> Se connecter
                    </button>
                </div>
                
                <div class="profile-stats" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 30px;">
                    <div class="stat-card" style="background: white; padding: 20px; border-radius: var(--radius-lg); text-align: center;">
                        <div class="stat-value" style="font-size: 2rem; font-weight: 800; color: var(--secondary);">${userBookings.length}</div>
                        <div class="stat-label">Réservations</div>
                    </div>
                    <div class="stat-card" style="background: white; padding: 20px; border-radius: var(--radius-lg); text-align: center;">
                        <div class="stat-value" style="font-size: 2rem; font-weight: 800; color: var(--secondary);">0</div>
                        <div class="stat-label">Points fidélité</div>
                    </div>
                </div>
                
                <div class="profile-bookings">
                    <h3 style="margin-bottom: 20px;">📋 Mes réservations</h3>
                    ${userBookings.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-calendar-alt"></i>
                            <p>Aucune réservation pour le moment</p>
                            <button class="btn btn-primary" onclick="app.navigateTo('booking')">
                                Réserver maintenant
                            </button>
                        </div>
                    ` : `
                        <div class="bookings-list" style="display: grid; gap: 16px;">
                            ${userBookings.map(booking => `
                                <div class="booking-card" style="background: white; border-radius: var(--radius-lg); padding: 16px;">
                                    <div style="display: flex; justify-content: space-between; align-items: start;">
                                        <div>
                                            <h4>${booking.activityName}</h4>
                                            <p><i class="fas fa-calendar"></i> ${new Date(booking.date).toLocaleDateString('fr-FR')} à ${booking.time}</p>
                                            <p><i class="fas fa-users"></i> ${booking.people} personne(s)</p>
                                            <p class="booking-price" style="color: var(--secondary); font-weight: 800;">${booking.totalPrice.toLocaleString()} FCFA</p>
                                        </div>
                                        <span class="badge badge-success">Confirmé</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    attachPageEvents(page) {
        if (page === 'booking') {
            const activitySelect = document.getElementById('activitySelect');
            const peopleInput = document.getElementById('people');
            const form = document.getElementById('bookingForm');
            
            if (activitySelect) activitySelect.addEventListener('change', () => this.updatePrice());
            if (peopleInput) peopleInput.addEventListener('input', () => this.updatePrice());
            if (form) form.addEventListener('submit', (e) => this.handleBooking(e));
            
            this.updatePrice();
        }
        
        if (page === 'activities') {
            // Initialisation des filtres
        }
    }

    updatePrice() {
        const activityId = document.getElementById('activitySelect')?.value;
        const people = parseInt(document.getElementById('people')?.value || 1);
        const priceDisplay = document.getElementById('totalPrice');
        
        if (activityId && priceDisplay) {
            const activity = getActivityById(parseInt(activityId));
            if (activity) {
                const total = activity.price * people;
                priceDisplay.textContent = `${total.toLocaleString()} FCFA`;
            }
        }
    }

    async handleBooking(e) {
        e.preventDefault();
        
        const activityId = document.getElementById('activitySelect')?.value;
        const date = document.getElementById('date')?.value;
        const time = document.getElementById('time')?.value;
        const people = parseInt(document.getElementById('people')?.value);
        const firstName = document.getElementById('firstName')?.value;
        const lastName = document.getElementById('lastName')?.value;
        const email = document.getElementById('email')?.value;
        const phone = document.getElementById('phone')?.value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        
        if (!activityId || !date || !time || !people || !firstName || !lastName || !email || !phone) {
            this.showToast('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        const activity = getActivityById(parseInt(activityId));
        const totalPrice = activity.price * people;
        
        const booking = {
            activityId: activity.id,
            activityName: activity.name,
            date: date,
            time: time,
            people: people,
            totalPrice: totalPrice,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            paymentMethod: paymentMethod,
            status: 'confirmed'
        };
        
        saveBooking(booking);
        
        this.showToast(`Réservation confirmée ! ${totalPrice.toLocaleString()} FCFA`, 'success');
        
        setTimeout(() => {
            this.navigateTo('profile');
        }, 1500);
    }

    showActivityDetail(activityId) {
        const activity = getActivityById(activityId);
        this.showModal(`
            <div class="modal-header">
                <h2>${activity.name}</h2>
                <i class="fas fa-times" onclick="app.closeModal()" style="cursor: pointer;"></i>
            </div>
            <div class="modal-body">
                <img src="${activity.image}" style="width: 100%; border-radius: var(--radius-md); margin-bottom: 16px;">
                <p>${activity.description}</p>
                <div class="details" style="margin-top: 16px;">
                    <p><i class="fas fa-clock"></i> Durée: ${activity.duration}</p>
                    <p><i class="fas fa-map-marker-alt"></i> Lieu: ${activity.location}</p>
                    <p><i class="fas fa-star"></i> Note: ${activity.rating} (${activity.reviews} avis)</p>
                </div>
                <div class="price" style="font-size: 2rem; font-weight: 800; color: var(--secondary); margin: 20px 0;">
                    ${activity.price.toLocaleString()} FCFA
                </div>
                <button class="btn btn-primary btn-block" onclick="app.bookActivity(${activity.id}); app.closeModal();">
                    Réserver maintenant
                </button>
            </div>
        `);
    }

    bookActivity(activityId) {
        this.navigateTo('booking');
        setTimeout(() => {
            const select = document.getElementById('activitySelect');
            if (select) {
                select.value = activityId;
                this.updatePrice();
            }
        }, 100);
    }

    filterActivities(searchTerm) {
        const filtered = activities.filter(a => 
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const container = document.getElementById('activitiesList');
        if (container) {
            container.innerHTML = filtered.map(a => this.renderActivityCard(a)).join('');
        }
    }

    filterByCategory(category) {
        const filtered = category === 'all' ? activities : activities.filter(a => a.category === category);
        const container = document.getElementById('activitiesList');
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        if (container) {
            container.innerHTML = filtered.map(a => this.renderActivityCard(a)).join('');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showModal(content) {
        let modal = document.getElementById('dynamicModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dynamicModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                ${content}
            </div>
        `;
        
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('dynamicModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered');
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }

    loadUserData() {
        // Charger les données utilisateur
    }

    startScrollAnimations() {
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => observer.observe(el));
    }

    animatePageTransition() {
        const page = document.querySelector('.page.active-page');
        page.style.animation = 'none';
        page.offsetHeight;
        page.style.animation = 'fadeInUp 0.4s ease';
    }

    setupPullToRefresh() {
        let startY = 0;
        let refreshing = false;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].pageY;
        });
        
        document.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].pageY;
            const scrollTop = window.scrollY;
            
            if (scrollTop === 0 && currentY > startY + 50 && !refreshing) {
                refreshing = true;
                this.refresh();
            }
        });
    }

    refresh() {
        this.showToast('Actualisation...', 'info');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Initialisation
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AssinieGoApp();
    window.app = app;
});