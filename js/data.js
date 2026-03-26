// Données des activités
const activities = [
    {
        id: 1,
        name: "Jet-Ski Extrême",
        category: "nautique",
        description: "Sensation forte sur l'océan avec nos jet-skis dernier cri 300CV",
        price: 25000,
        duration: "30 min",
        image: "https://images.pexels.com/photos/163743/jet-ski-jet-skiing-speed-sport-163743.jpeg",
        rating: 4.8,
        reviews: 234,
        popular: true,
        location: "Plage de La Passe"
    },
    {
        id: 2,
        name: "Quad Aventure",
        category: "terrestre",
        description: "Explorez les 17 km de sable blanc d'Assinie en quad tout-terrain",
        price: 35000,
        duration: "1 heure",
        image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg",
        rating: 4.9,
        reviews: 187,
        popular: true,
        location: "Plage d'Assinie"
    },
    {
        id: 3,
        name: "Bateau VIP",
        category: "nautique",
        description: "Croisière privée sur la lagune avec champagne et tapas",
        price: 150000,
        duration: "2 heures",
        image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
        rating: 5.0,
        reviews: 89,
        popular: true,
        location: "Lagune Aby"
    },
    {
        id: 4,
        name: "Pêche Traditionnelle",
        category: "nautique",
        description: "Découvrez les techniques de pêche locales avec les pêcheurs",
        price: 15000,
        duration: "2 heures",
        image: "https://images.pexels.com/photos/1681188/pexels-photo-1681188.jpeg",
        rating: 4.5,
        reviews: 56,
        popular: false,
        location: "Village de pêcheurs"
    },
    {
        id: 5,
        name: "Parc National Ehotilé",
        category: "nature",
        description: "Découverte des îles et de la biodiversité exceptionnelle",
        price: 10000,
        duration: "3 heures",
        image: "https://images.pexels.com/photos/2490487/pexels-photo-2490487.jpeg",
        rating: 4.7,
        reviews: 123,
        popular: false,
        location: "Îles Ehotilé"
    },
    {
        id: 6,
        name: "Coucher de Soleil Magique",
        category: "nature",
        description: "Moment magique à La Passe avec cocktail et tapas",
        price: 8000,
        duration: "1 heure",
        image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
        rating: 4.9,
        reviews: 312,
        popular: true,
        location: "La Passe"
    },
    {
        id: 7,
        name: "Kayak Mangrove",
        category: "nautique",
        description: "Balade tranquille à travers les mangroves",
        price: 5000,
        duration: "1 heure",
        image: "https://images.pexels.com/photos/1609581/pexels-photo-1609581.jpeg",
        rating: 4.6,
        reviews: 78,
        popular: false,
        location: "Mangroves"
    },
    {
        id: 8,
        name: "Massage Plage",
        category: "terrestre",
        description: "Massage relaxant face à l'océan avec huiles essentielles",
        price: 20000,
        duration: "45 min",
        image: "https://images.pexels.com/photos/4198572/pexels-photo-4198572.jpeg",
        rating: 4.8,
        reviews: 145,
        popular: false,
        location: "Plage d'Assinie"
    },
    {
        id: 9,
        name: "Dîner Romantique",
        category: "terrestre",
        description: "Dîner aux chandelles sur la plage",
        price: 45000,
        duration: "Soirée",
        image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
        rating: 4.9,
        reviews: 98,
        popular: true,
        location: "Plage privée"
    }
];

// Stockage des réservations
let bookings = JSON.parse(localStorage.getItem('assiniego_bookings') || '[]');

function saveBooking(booking) {
    booking.id = Date.now();
    booking.createdAt = new Date().toISOString();
    bookings.unshift(booking);
    localStorage.setItem('assiniego_bookings', JSON.stringify(bookings));
    return booking;
}

function getBookings() {
    return bookings;
}

function cancelBooking(bookingId) {
    bookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('assiniego_bookings', JSON.stringify(bookings));
}

function getActivityById(id) {
    return activities.find(a => a.id == id);
}

function getPopularActivities() {
    return activities.filter(a => a.popular);
}

function getActivitiesByCategory(category) {
    if (category === 'all') return activities;
    return activities.filter(a => a.category === category);
}