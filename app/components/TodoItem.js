import { h } from "../../core/dom.js";

export function TodoItem({ text, completed, onToggle, onDelete }) {
  return h("li", {}, [
    h("input", {
      type: "checkbox",
      checked: completed ? "checked" : "",
      onclick: onToggle
    }),
    h("span", {}, [text]),
    h("button", { onclick: onDelete }, ["X"])
  ]);
}
