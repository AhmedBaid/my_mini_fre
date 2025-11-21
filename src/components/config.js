import { useState } from "../../core/framework.js";

export function TodoApp(state, store) {
    const [newTodo, setNewTodo] = useState("");
    const todos = (state && state.todos) ? state.todos : [];
    const filter = (state && state.filter) ? state.filter : 'all';

    const displayed = todos.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });

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
                                    placeholder: "What needs to be done?",
                                    value: newTodo,
                                    onchange: (e) => setNewTodo(e.target.value),
                                    onkeydown: (e) => {
                                        if (e.key === "Enter" && newTodo.trim()) {
                                            // add a new todo object
                                            store.update(prev => {
                                                const prevTodos = (prev && prev.todos) || [];
                                                return { ...prev, todos: [...prevTodos, { text: newTodo.trim(), completed: false }] };
                                            });
                                            setNewTodo("");
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
                        children: displayed.map((todo, index) => {
                            // compute real index in todos array
                            const realIndex = todos.indexOf(todo);
                            return {
                                tag: "li",
                                attrs: { class: todo.completed ? 'todo-item completed' : 'todo-item', id: realIndex },
                                children: [
                                    { tag: "input", attrs: { type: "checkbox", class: "toggle", onclick: () => {
                                        store.update(prev => {
                                            const prevTodos = (prev && prev.todos) || [];
                                            const next = prevTodos.map((t, i) => i === realIndex ? { ...t, completed: !t.completed } : t);
                                            return { ...prev, todos: next };
                                        });
                                    } } },
                                    { tag: "label", children: [todo.text] },
                                    { tag: "button", attrs: { class: "destroy", onclick: () => {
                                        store.update(prev => {
                                            const prevTodos = (prev && prev.todos) || [];
                                            const next = prevTodos.filter((_, i) => i !== realIndex);
                                            return { ...prev, todos: next };
                                        });
                                    } }, children: [] }
                                ]
                            };
                        })
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
// helper removed; operations now use `store.update` directly