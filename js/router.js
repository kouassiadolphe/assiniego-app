// Router simple pour l'application
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const route = this.routes[hash];
        
        if (route) {
            this.currentRoute = hash;
            route();
        } else {
            this.navigateTo('home');
        }
    }

    navigateTo(route, pushState = true) {
        if (pushState) {
            window.location.hash = route;
        }
        
        const routeHandler = this.routes[route];
        if (routeHandler) {
            this.currentRoute = route;
            routeHandler();
        }
    }
}