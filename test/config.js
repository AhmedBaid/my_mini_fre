export const todoApp = {
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
                        value: ""
                    }
                },
                {
                    tag: "label",
                    attrs: { class: "visually-hidden", for: "todo-input" },
                    children: ["New Todo Input"]
                }
            ]
        }
    ], tag: "main",
    attrs: { class: "main" },
    children: [
        {
            tag: "ul",
            attrs: { class: "todo-list" },
            children: []
        }
    ]
}
