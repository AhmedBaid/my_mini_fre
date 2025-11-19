import { h } from "../../core/dom.js";
import { TodoList } from "./TodoList.js";

export function App(store) {
  const state = store.get();

  return h("div", { class: "todo-app" }, [
    h("h1", {}, ["TodoMVC"]),
    h("input", {
      id: "newTodo",
      placeholder: "What needs to be done?",
      onkeydown: (e) => {
        if (e.key === "Enter") {
          const value = e.target.value.trim();
          if (value) {
            store.set({
              todos: [...state.todos, { text: value, completed: false }]
            });
            e.target.value = "";
          }
        }
      }
    }),
    TodoList({
      todos: state.todos,
      toggleTodo: i => {
        const copy = [...state.todos];
        copy[i].completed = !copy[i].completed;
        store.set({ todos: copy });
      },
      deleteTodo: i => {
        const copy = state.todos.filter((_, idx) => idx !== i);
        store.set({ todos: copy });
      }
    })
  ]);
}
