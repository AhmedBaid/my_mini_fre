import { h } from "../../core/dom.js";
import { TodoItem } from "./TodoItem.js";

export function TodoList({ todos, toggleTodo, deleteTodo }) {
  return h("ul", {}, [
    ...todos.map((t, i) =>
      TodoItem({
        text: t.text,
        completed: t.completed,
        onToggle: () => toggleTodo(i),
        onDelete: () => deleteTodo(i)
      })
    )
  ]);
}
