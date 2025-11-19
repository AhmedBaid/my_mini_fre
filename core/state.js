export class Store {
    constructor(initialState) {
        this.state = initialState;
        this.listeners = [];
    }

    get() {
        return this.state;
    }

    set(newState) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach(fn => fn(this.state));
    }

    subscribe(fn) {
        this.listeners.push(fn);
    }
}
