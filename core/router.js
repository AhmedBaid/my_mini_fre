export class Router {
    constructor(routes) {
        this.routes = routes;

        window.addEventListener("hashchange", () => this.resolve());
    }

    resolve() {
        const path = location.hash.slice(1) || "/";
        const screen = this.routes[path];

        if (screen) screen();
    }
}
