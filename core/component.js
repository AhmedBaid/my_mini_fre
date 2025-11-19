import { mount } from "./dom.js";

export class Component {
    constructor(props = {}) {
        this.props = props;
    }

    mountTo(selector) {
        mount(this.render(), document.querySelector(selector));
    }
}
