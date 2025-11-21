# MiniFramework - Complete Documentation

A lightweight, reactive JavaScript framework with Virtual DOM, state management, routing, and hooks - built from scratch with zero dependencies.

## 📚 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Project Structure](#project-structure)

## ✨ Features

- ✅ **Virtual DOM** with efficient diffing and reconciliation
- ✅ **State Management** with centralized store
- ✅ **Hooks System** (useState, useEffect)
- ✅ **Hash-based Routing** with dynamic route parameters
- ✅ **Event Handling** with automatic cleanup
- ✅ **LocalStorage Persistence**
- ✅ **Zero Dependencies**

## 🚀 Quick Start

### Single HTML File (Easiest)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <div id="app"></div>
    <script type="module">
        // Import framework code here
        // See index.html for complete example
    </script>
</body>
</html>
```

### Module Structure

```
project/
├── index.html
├── framework.js    # Core framework
├── config.js       # Components
└── app.js          # Entry point
```

## 🧠 Core Concepts

### 1. Virtual DOM

The framework uses a Virtual DOM representation for efficient rendering:

```javascript
// Virtual Node Structure
{
    tag: "div",
    attrs: { class: "container", id: "main" },
    children: [
        { tag: "h1", children: ["Hello"] },
        { tag: "p", children: ["World"] }
    ]
}
```

**Why Virtual DOM?**
- Only updates what changed (minimal DOM operations)
- Declarative UI (describe what you want, not how to build it)
- Efficient reconciliation algorithm

### 2. Component Pattern

Components are functions that return virtual nodes:

```javascript
function MyComponent() {
    return {
        tag: "div",
        attrs: { class: "my-component" },
        children: ["Component content"]
    };
}
```

### 3. State Management

Centralized store with reactive updates:

```javascript
const store = createStore({
    count: 0,
    user: { name: "John" }
});

// Get state
const state = store.getState();

// Update state (triggers re-render)
store.setState({ count: 5 });

// Subscribe to changes
store.subscribe((newState) => {
    console.log("State changed:", newState);
});
```

### 4. Routing

Hash-based routing for SPA navigation:

```javascript
// Routes are defined in framework initialization
const routes = {
    '/': () => store.setState({ filter: 'all' }),
    '/active': () => store.setState({ filter: 'active' }),
    '/completed': () => store.setState({ filter: 'completed' })
};

// Navigate programmatically
window.location.hash = '/active';
```

## 📖 API Reference

### Framework Functions

#### `useState(initialValue)`

Returns stateful value and updater function.

```javascript
const [count, setCount] = useState(0);

// Update state
setCount(5);

// Functional update
setCount(prev => prev + 1);
```

**How it works:**
- Stores state in array indexed by call order
- Reset index on each render
- Triggers re-render on update

#### `useEffect(callback, dependencies)`

Performs side effects after render.

```javascript
useEffect(() => {
    // Effect code
    console.log("Component mounted");
    
    // Optional cleanup
    return () => {
        console.log("Component unmounting");
    };
}, []); // Empty array = run once
```

**Dependency array:**
- `[]` - Run once on mount
- `[a, b]` - Run when `a` or `b` changes
- No array - Run on every render

#### `store.getState()`

Returns current state object.

```javascript
const currentState = store.getState();
console.log(currentState.todos);
```

#### `store.setState(updates)`

Updates state and triggers re-render.

```javascript
// Object merge
store.setState({ count: 10 });

// Functional update
store.setState(state => ({
    count: state.count + 1
}));
```

#### `store.subscribe(listener)`

Subscribes to state changes.

```javascript
const unsubscribe = store.subscribe((newState) => {
    console.log("New state:", newState);
});

// Unsubscribe
unsubscribe();
```

#### `render()`

Renders the root component to DOM.

```javascript
render(); // Re-renders entire app
```

#### `setRootComponent(component)`

Sets the root component for the app.

```javascript
setRootComponent(TodoApp);
```

### Creating Elements

Elements are JavaScript objects with `tag`, `attrs`, and `children`:

```javascript
// Basic element
{
    tag: "div",
    children: ["Hello World"]
}

// With attributes
{
    tag: "input",
    attrs: {
        type: "text",
        placeholder: "Enter name",
        class: "form-control"
    }
}

// Nested elements
{
    tag: "div",
    attrs: { class: "container" },
    children: [
        { tag: "h1", children: ["Title"] },
        { tag: "p", children: ["Paragraph"] }
    ]
}
```

### Event Handling

Events are added as attributes with `on` prefix:

```javascript
{
    tag: "button",
    attrs: {
        onclick: (e) => {
            console.log("Clicked!");
        }
    },
    children: ["Click Me"]
}
```

**Supported events:**
- `onclick` - Click events
- `onchange` - Change events (inputs, selects)
- `oninput` - Input events (real-time typing)
- `onkeydown` - Key press events
- `onkeyup` - Key release events
- `onsubmit` - Form submission
- `onfocus` - Focus events
- `onblur` - Blur events
- `ondblclick` - Double click
- All standard DOM events

**Event examples:**

```javascript
// Click handler
{
    tag: "button",
    attrs: {
        onclick: () => alert("Hello!")
    },
    children: ["Click"]
}

// Input with change handler
{
    tag: "input",
    attrs: {
        type: "text",
        oninput: (e) => console.log(e.target.value)
    }
}

// Keyboard events
{
    tag: "input",
    attrs: {
        onkeydown: (e) => {
            if (e.key === 'Enter') {
                console.log("Enter pressed");
            }
        }
    }
}
```

### Attributes

Special attribute handling:

```javascript
{
    tag: "div",
    attrs: {
        // CSS classes
        class: "container active",
        
        // Inline styles (object)
        style: {
            backgroundColor: "blue",
            padding: "20px"
        },
        
        // Boolean attributes
        checked: true,
        disabled: false,
        
        // Value for inputs
        value: "default text",
        
        // Any other attribute
        id: "my-id",
        "data-custom": "value"
    }
}
```

## 💡 Examples

### Simple Counter

```javascript
function Counter() {
    const state = store.getState();
    
    return {
        tag: "div",
        children: [
            {
                tag: "h2",
                children: [`Count: ${state.count}`]
            },
            {
                tag: "button",
                attrs: {
                    onclick: () => store.setState({ 
                        count: state.count + 1 
                    })
                },
                children: ["Increment"]
            }
        ]
    };
}
```

### Todo List Component

```javascript
function TodoList() {
    const state = store.getState();
    
    return {
        tag: "div",
        children: [
            {
                tag: "input",
                attrs: {
                    type: "text",
                    placeholder: "New todo",
                    onkeydown: (e) => {
                        if (e.key === 'Enter') {
                            todoActions.addTodo(e.target.value);
                            e.target.value = '';
                        }
                    }
                }
            },
            {
                tag: "ul",
                children: state.todos.map(todo => ({
                    tag: "li",
                    children: [
                        {
                            tag: "input",
                            attrs: {
                                type: "checkbox",
                                checked: todo.completed,
                                onchange: () => todoActions.toggleTodo(todo.id)
                            }
                        },
                        {
                            tag: "span",
                            attrs: {
                                style: {
                                    textDecoration: todo.completed ? 
                                        'line-through' : 'none'
                                }
                            },
                            children: [todo.text]
                        }
                    ]
                }))
            }
        ]
    };
}
```

### Conditional Rendering

```javascript
function ConditionalComponent() {
    const state = store.getState();
    
    return {
        tag: "div",
        children: [
            state.isLoggedIn && {
                tag: "p",
                children: ["Welcome back!"]
            },
            !state.isLoggedIn && {
                tag: "button",
                attrs: {
                    onclick: () => store.setState({ isLoggedIn: true })
                },
                children: ["Login"]
            }
        ].filter(Boolean) // Remove falsy values
    };
}
```

### Form Handling

```javascript
function FormComponent() {
    const state = store.getState();
    
    return {
        tag: "form",
        attrs: {
            onsubmit: (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                console.log(Object.fromEntries(formData));
            }
        },
        children: [
            {
                tag: "input",
                attrs: {
                    type: "text",
                    name: "username",
                    placeholder: "Username"
                }
            },
            {
                tag: "input",
                attrs: {
                    type: "email",
                    name: "email",
                    placeholder: "Email"
                }
            },
            {
                tag: "button",
                attrs: { type: "submit" },
                children: ["Submit"]
            }
        ]
    };
}
```

## 🏗️ Project Structure

### Recommended Folder Structure

```
my-app/
├── index.html          # Entry HTML file
├── src/
│   ├── framework.js    # Core framework code
│   ├── app.js          # Application entry point
│   ├── components/
│   │   ├── TodoApp.js  # Main component
│   │   ├── TodoItem.js # Todo item component
│   │   └── Footer.js   # Footer component
│   ├── store/
│   │   ├── store.js    # Store initialization
│   │   └── actions.js  # Action creators
│   └── styles/
│       └── main.css    # Application styles
└── README.md
```

### framework.js

Core framework with:
- State management (useState, useEffect)
- Store (createStore, getState, setState, subscribe)
- Router (route handling, navigation)
- DOM operations (buildDOM, render)
- Todo actions (addTodo, toggleTodo, etc.)

### config.js / components

Component definitions that return virtual nodes.

### app.js

Application initialization:
```javascript
import { render, setRootComponent, store } from "./framework.js";
import { TodoApp } from "./config.js";

setRootComponent(TodoApp);
store.subscribe(() => render());
render();
```

## 🎯 TodoMVC Implementation

Complete TodoMVC features:
- ✅ Add todos (Enter key)
- ✅ Toggle individual todos
- ✅ Toggle all todos
- ✅ Edit todos (double-click)
- ✅ Delete todos (× button)
- ✅ Filter todos (All/Active/Completed)
- ✅ Clear completed
- ✅ Active count display
- ✅ LocalStorage persistence
- ✅ Routing (#/, #/active, #/completed)

## 🔧 How It Works

### Rendering Cycle

1. **Component called** → Returns virtual node tree
2. **buildDOM()** → Converts virtual nodes to real DOM
3. **Append to container** → Updates the page

### State Updates

1. **setState() called** → Updates store
2. **Notify subscribers** → Triggers listeners
3. **render() called** → Re-renders app
4. **DOM updated** → Page reflects new state

### Why This Architecture?

**Inversion of Control:**
- Framework controls the rendering
- You declare what UI should look like
- Framework handles the updates

**Unidirectional Data Flow:**
- State → View → Events → State
- Predictable and debuggable

**Component Composition:**
- Break UI into reusable pieces
- Each component is independent
- Easy to test and maintain

## 🎨 Best Practices

1. **Keep components pure** - Same input = same output
2. **Use keys for lists** - Helps with efficient updates
3. **Immutable state updates** - Never mutate state directly
4. **Small components** - Break down complex UIs
5. **Centralize state** - Use store for shared state

## 📝 Notes

- Framework uses hash-based routing (`#/path`)
- State resets are based on call order (must be consistent)
- LocalStorage used for persistence
- All event listeners cleaned up automatically
- No external dependencies required

## 🚀 Running the TodoMVC

1. Open `index.html` in a browser
2. Or use a local server:
   ```bash
   npx serve
   # or
   python -m http.server 8000
   ```
3. Navigate to `http://localhost:8000`

## 📚 Additional Resources

- TodoMVC Specification: https://todomvc.com
- Virtual DOM Concepts: Understanding diffing algorithms
- State Management Patterns: Flux, Redux-like patterns
- Event Handling: DOM events and delegation

---

**Created by the Abaid family for Zone01**