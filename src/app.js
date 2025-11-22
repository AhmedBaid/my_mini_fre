import { render, store } from "../core/framework.js";

const routes = {
    '/': () => { store.set({ filter: 'all' }); render(); },
    '/active': () => { store.set({ filter: 'active' }); render(); },
    '/completed': () => { store.set({ filter: 'completed' }); render(); },
    '/notfound': () => { notfound() }
};
function handleRouteChange() {
    const route = window.location.hash.slice(1) || '/';
    if (routes[route]) {
        routes[route]();
    } else {
        routes['/notfound']();
    }
}
function startTransition() {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
}

startTransition();