import { useState } from "../../core/framework.js";

export function TodoApp(state, store) {
    const todos = state.todos.map(t => t.text);
    const [newTodo, setNewTodo] = useState("");
    const itemleft = state.todos.filter(t => !t.completed).length;
    function deleteTodo(index) {
        const updatedTodos = todos.filter((_, i) => {
            return i !== index;
        });
        store.set({ todos: updatedTodos });
    }
    function ToggleTodoCompleted(todo) {
        const updatedTodos = state.todos.map(t => {
            if (t.text === todo) {
                return { ...t, completed: !t.completed };
            }
            return t;
        });
        store.set({ todos: updatedTodos });
    }
    return {
        tag: "section",
        attrs: { class: "todoapp" },
        children: [
            {
                tag: "header",
                attrs: { class: "header" },
                children: [
                    { tag: "h1", children: ["todos"] },
                    {
                        tag: "div",
                        attrs: { class: "input-container" },
                        children: [
                            {
                                tag: "input",
                                attrs: {
                                    class: "new-todo",
                                    id: "todo-input",
                                    type: "text",
                                    autofocus: true,
                                    placeholder: "What needs to be done?",
                                    value: newTodo,
                                    onchange: (e) => setNewTodo(e.target.value),
                                    onkeydown: (e) => {
                                        const neww = e.target.value.trim();
                                        if (e.key === "Enter" && neww.length >= 2) {
                                            store.set({
                                                todos: [
                                                    ...store.get().todos,
                                                    { text: neww, completed: false }
                                                ]
                                            });
                                            setNewTodo("");
                                        } else {
                                            return;
                                        }
                                    }
                                }
                            },
                            {
                                tag: "label",
                                attrs: {
                                    class: "visually-hidden",
                                    for: "todo-input"
                                },
                                children: ["New Todo Input"]
                            }
                        ]
                    }
                ]
            },

            {
                tag: "main",
                attrs: { class: "main" },
                children: [
                    {
                        tag: "ul",
                        attrs: { class: "todo-list" },
                        children: todos.map((t, index) => ({
                            tag: "li",
                            attrs: { class: "todo-item" },
                            children: [
                                { tag: "input", attrs: { type: "checkbox", class: "toggle", onclick: () => ToggleTodoCompleted(t) } },
                                { tag: "label", children: [t] },
                                {
                                    tag: "button",
                                    attrs: {
                                        class: "destroy",
                                        onclick: () => {
                                            deleteTodo(index)
                                        }
                                    }
                                }
                            ]
                        }))
                    }
                ]
            },
            todos.length > 0 && {
                tag: "footer",
                attrs: { class: "footer" },
                children: [
                    {
                        tag: "span",
                        attrs: { class: "todo-count" },
                        children: [itemleft + " items left"]
                    },
                    {
                        tag: "ul",
                        attrs: { class: "filters" },
                        children: [
                            { tag: "li", children: [{ tag: "a", attrs: { class: "selected", href: "#/" }, children: ["All"] }] },
                            { tag: "li", children: [{ tag: "a", attrs: { href: "#/active" }, children: ["Active"] }] },
                            { tag: "li", children: [{ tag: "a", attrs: { href: "#/completed" }, children: ["Completed"] }] }
                        ]
                    },
                    {
                        tag: "button",
                        attrs: { class: "clear-completed" },
                        children: ["Clear completed"]
                    }
                ]
            }
        ]
    };
}

export const footer = {
    tag: "footer",
    attrs: { class: "info" },
    children: [
        {
            tag: "p",
            children: ["Double-click to edit a todo"],
        },
        {
            tag: "p",
            children: ["Created by the Abaid family"],
        },
        {
            tag: "p",
            children: [
                "Part of ",
                {
                    tag: "a",
                    attrs: { href: "https://github.com/AhmedBaid" },
                    children: ["Zone01"]
                }
            ],
        }
    ]
}