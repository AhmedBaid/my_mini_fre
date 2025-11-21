import { useState } from "./framework.js";

export function TodoApp({ todos }) {
    const [newTodo, setNewTodo] = useState("");
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
                                    onchange: (e) => setNewTodo(e.target.value),
                                    value: newTodo
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
                        children: todos.map(t => ({
                            tag: "li",
                            attrs: { class: "todo-item" },
                            children: [
                                { tag: "input", attrs: { type: "checkbox", class: "toggle" } },
                                { tag: "label", children: [t] }
                            ]
                        }))
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