export const todoApp = {
    tag: "section",
    attrs: { class: "todoapp", id: "app" },
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
                                placeholder: "What needs to be done?"
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
                    children: [
                        {
                            tag: "li",
                            attrs: { class: "todo-item" },
                            children: [
                                {
                                    tag: "input",
                                    attrs: {
                                        type: "checkbox",
                                        class: "toggle"
                                    }
                                },
                                {
                                    tag: "label",
                                    children: ["dzd"]
                                }
                            ]
                        }
                    ]
                },
                {
                    tag: "footer",
                    attrs: { class: "footer" },
                    children: [
                        {
                            tag: "span",
                            attrs: { class: "todo-count" },
                            children: ["1 item left!"]
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
        }
    ]
}
