export function h(tag, attrs = {}, children = []) {
    return { tag, attrs, children };
}

export function render(vnode) {
    if (typeof vnode === "string") return document.createTextNode(vnode);

    const el = document.createElement(vnode.tag);

    for (const [key, value] of Object.entries(vnode.attrs)) {
        el.setAttribute(key, value);
    }

    vnode.children.forEach(child => {
        el.appendChild(render(child));
    });

    return el;
}

export function mount(vnode, container) {
    container.innerHTML = "";
    container.appendChild(render(vnode));
}
