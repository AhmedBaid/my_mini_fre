import { Store } from "../core/state.js";
import { Router } from "../core/router.js";
import { mount } from "../core/dom.js";
import { App } from "./components/App.js";

const store = new Store({
    todos: []
});

store.subscribe(() => {
    mount(App(store), document.querySelector("#app"));
});

mount(App(store), document.querySelector("#app"));

new Router({
    "/": () => mount(App(store), document.querySelector("#app"))
}).resolve();
