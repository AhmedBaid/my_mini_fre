const routes = {
    '/': () => storeInstance.setState({ filter: 'all' }),
    '/active': () => storeInstance.setState({ filter: 'active' }),
    '/completed': () => storeInstance.setState({ filter: 'completed' })
};
function handleRouteChange() {
    const route = window.location.hash.slice(1) || '/';
    if (routes[route]) {
        routes[route]();
    } else {
        window.location.hash = '/';
    }
}
function startTransition() {
    console.log("Transition started");

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();

}

startTransition();