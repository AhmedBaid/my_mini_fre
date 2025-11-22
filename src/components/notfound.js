import { buildDOM } from "../../core/framework.js";
export function notFound() {
    return {
        tag: "div",
        attrs: { class: "not-found" },
        children: [
            {
                tag: "h2",
                children: ["404 - Page Not Found"]
            },
            {
                tag: "p",
                children: ["The page you are looking for does not exist."]
            }
        ]
    }
}
export function rendering() {
    const app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(buildDOM(notFound()));
}