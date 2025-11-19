// =============================================
// LiteFrame Mini + TodoMVC en UN SEUL OBJET
// =============================================

const h = (tag, attrs = {}, ...children) => ({
    tag,
    attrs,
    children: children.flat()
});

let state = {
    todos: JSON.parse(localStorage.getItem("todos") || "[]"),
    filter: location.hash.slice(2) || "all", // #/active → "active"
    editing: null
};

// Simple store-like dispatch
const dispatch = (action) => {
    switch (action.type) {
        case "ADD":
            if (!action.text.trim()) return;
            state.todos.push({ id: Date.now(), text: action.text.trim(), completed: false });
            break;

        case "TOGGLE":
            const t = state.todos.find(x => x.id === action.id);
            if (t) t.completed = !t.completed;
            break;

        case "DELETE":
            state.todos = state.todos.filter(x => x.id !== action.id);
            break;

        case "EDIT":
            state.editing = action.id;
            break;

        case "SAVE":
            const todo = state.todos.find(x => x.id === action.id);
            if (todo) todo.text = action.text.trim() || " ";
            state.editing = null;
            break;

        case "CANCEL_EDIT":
            state.editing = null;
            break;

        case "TOGGLE_ALL":
            const allDone = state.todos.every(t => t.completed);
            state.todos.forEach(t => t.completed = !allDone);
            break;

        case "CLEAR_COMPLETED":
            state.todos = state.todos.filter(t => !t.completed);
            break;

        case "SET_FILTER":
            state.filter = action.filter;
            location.hash = "#/" + action.filter;
            break;
    }

    localStorage.setItem("todos", JSON.stringify(state.todos));
    render();
};

// Sync hash → filter
window.addEventListener("hashchange", () => {
    const f = location.hash.slice(2) || "all";
    if (["all", "active", "completed"].includes(f)) {
        state.filter = f;
        render();
    }
});

// =============================================
// UN SEUL OBJET QUI REPRÉSENTE TOUT LE TodoMVC
// =============================================

const createTodoMVC = () => {
    const visibleTodos = state.todos.filter(todo => {
        if (state.filter === "active") return !todo.completed;
        if (state.filter === "completed") return todo.completed;
        return true;
    });

    const activeCount = state.todos.filter(t => !t.completed).length;
    const completedCount = state.todos.length - activeCount;

    return h("section", { class: "todoapp" },
        h("header", { class: "header" },
            h("h1", {}, "todos"),
            h("input", {
                class: "new-todo",
                placeholder: "What needs to be done?",
                autofocus: true,
                onkeydown: e => e.key === "Enter" && dispatch({ type: "ADD", text: e.target.value }) && (e.target.value = "")
            })
        ),

        state.todos.length > 0 && h("section", { class: "main" },
            h("input", {
                id: "toggle-all",
                class: "toggle-all",
                type: "checkbox",
                checked: activeCount === 0,
                onclick: () => dispatch({ type: "TOGGLE_ALL" })
            }),
            h("label", { for: "toggle-all" }, "Mark all as complete"),
            h("ul", { class: "todo-list" },
                visibleTodos.map(todo =>
                    h("li", {
                        key: todo.id,
                        class: `${todo.completed ? "completed" : ""} ${state.editing === todo.id ? "editing" : ""}`
                    },
                        h("div", { class: "view" },
                            h("input", {
                                class: "toggle",
                                type: "checkbox",
                                checked: todo.completed,
                                onchange: () => dispatch({ type: "TOGGLE", id: todo.id })
                            }),
                            h("label", { ondblclick: () => dispatch({ type: "EDIT", id: todo.id }) }, todo.text),
                            h("button", {
                                class: "destroy",
                                onclick: () => dispatch({ type: "DELETE", id: todo.id })
                            })
                        ),
                        state.editing === todo.id && h("input", {
                            class: "edit",
                            value: todo.text,
                            autofocus: true,
                            onblur: e => dispatch({ type: "SAVE", id: todo.id, text: e.target.value }),
                            onkeydown: e => {
                                if (e.key === "Enter") dispatch({ type: "SAVE", id: todo.id, text: e.target.value });
                                if (e.key === "Escape") dispatch({ type: "CANCEL_EDIT" });
                            }
                        })
                    )
                )
            )
        ),

        state.todos.length > 0 && h("footer", { class: "footer" },
            h("span", { class: "todo-count" },
                h("strong", {}, activeCount),
                ` item${activeCount !== 1 ? "s" : ""} left`
            ),
            h("ul", { class: "filters" },
                ["all", "active", "completed"].map(f =>
                    h("li", {}, h("a", {
                        href: `#/${f}`,
                        class: state.filter === f ? "selected" : "",
                        onclick: e => { e.preventDefault(); dispatch({ type: "SET_FILTER", filter: f }); }
                    }, f.charAt(0).toUpperCase() + f.slice(1)))
                )
            ),
            completedCount > 0 && h("button", {
                class: "clear-completed",
                onclick: () => dispatch({ type: "CLEAR_COMPLETED" })
            }, "Clear completed")
        )
    );
};

// =============================================
// Mini Virtual DOM + render (très simple mais fonctionnel)
// =============================================

let oldVnode = null;
const app = document.getElementById("app");

const render = () => {
    const newVnode = createTodoMVC();

    if (!oldVnode) {
        app.appendChild(createElement(newVnode));
    } else {
        patch(app.firstChild, newVnode, oldVnode);
    }
    oldVnode = newVnode;
};

const createElement = (node) => {
    if (typeof node === "string") return document.createTextNode(node);
    const el = document.createElement(node.tag);

    Object.entries(node.attrs || {}).forEach(([key, value]) => {
        if (key.startsWith("on") && typeof value === "function") {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === "class") {
            el.className = value;
        } else if (key === "checked" || key === "autofocus" || key === "value") {
            el[key] = value;
        } else {
            el.setAttribute(key, value);
        }
    });

    (node.children || []).forEach(child => el.appendChild(createElement(child)));
    return el;
};

const patch = (dom, newNode, oldNode) => {
    if (!oldNode) {
        dom.appendChild(createElement(newNode));
        return;
    }
    if (!newNode) {
        dom.remove();
        return;
    }
    if (typeof newNode === "string" || typeof oldNode === "string") {
        if (newNode !== oldNode) dom.nodeValue = newNode;
        return;
    }
    if (newNode.tag !== oldNode.tag) {
        dom.replaceWith(createElement(newNode));
        return;
    }

    // Update attributes
    const newAttrs = newNode.attrs || {};
    const oldAttrs = oldNode.attrs || {};
    Object.keys({ ...oldAttrs, ...newAttrs }).forEach(key => {
        if (newAttrs[key] !== oldAttrs[key]) {
            if (key.startsWith("on")) {
                const event = key.slice(2).toLowerCase();
                if (oldAttrs[key]) dom.removeEventListener(event, oldAttrs[key]);
                if (newAttrs[key]) dom.addEventListener(event, newAttrs[key]);
            } else if (key === "value") {
                dom.value = newAttrs[key] ?? "";
            } else if (key === "checked") {
                dom.checked = !!newAttrs[key];
            } else {
                if (newAttrs[key] == null) dom.removeAttribute(key);
                else dom.setAttribute(key, newAttrs[key]);
            }
        }
    });

    // Simple children reconciliation (no keys needed ici car li a key)
    const newChildren = newNode.children || [];
    const oldChildren = oldNode.children || [];
    const max = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < max; i++) {
        patch(dom.childNodes[i] || dom.appendChild(document.createTextNode("")),
            newChildren[i], oldChildren[i]);
    }
};

// Démarrage
render();