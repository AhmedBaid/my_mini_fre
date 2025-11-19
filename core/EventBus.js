export class EventBus {
    constructor() {
        this.events = {};
    }

    on(event, handler) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(handler);
    }

    emit(event, payload) {
        if (this.events[event]) {
            this.events[event].forEach(h => h(payload));
        }
    }
}

export const bus = new EventBus();
