# MiniFlux Framework Documentation

## Overview

MiniFlux is a lightweight, reactive JavaScript framework that provides Virtual DOM, state management, routing, and event handling capabilities. It's built from scratch without any external dependencies.

## Core Concepts

### 1. Virtual DOM

MiniFlux uses a Virtual DOM (VDOM) for efficient rendering. Instead of directly manipulating the DOM, you describe what you want using JavaScript objects, and MiniFlux handles the actual DOM operations.

### 2. Component System

Components are the building blocks of your application. They can be either functions or classes that return virtual nodes.

### 3. State Management

MiniFlux provides a centralized store for managing application state with reactive updates.

### 4. Routing

Built-in hash-based routing system for single-page applications.

## Installation & Setup

Create an HTML file with the framework script:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <div id="app"></div>
    <script src="miniflux.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

## Creating Elements

### Basic Element Creation

Use the `h()` function (hyperscript) to create virtual nodes:

```javascript
// h(tag, attributes, children)
const element = h('div', { class: 'container' }, 'Hello World');
```

### With Multiple Children

```javascript
const element = h('div', { class: 'container' }, [
    h('h1', {}, 'Title'),
    h('p', {}, 'Paragraph text'),
    h('button', { id: 'myBtn' }, 'Click me')
]);
```

### Nested Elements

```javascript
const navbar = h('nav', { class: 'navbar' }, [
    h('div', { class: 'logo' }, 'MyApp'),
    h('ul', { class: 'menu' }, [
        h('li', {}, h('a', { href: '#home' }, 'Home')),
        h('li', {}, h('a', { href: '#about' }, 'About'))
    ])
]);
```

## Adding Attributes

Attributes are passed as the second parameter to `h()`:

```javascript
const input = h('input', {
    type: 'text',
    placeholder: 'Enter name',
    class: 'form-control',
    id: 'nameInput',
    value: 'Default value'
});
```

### Special Attributes

- `class` or `className`: CSS classes
- `style`: Inline styles (object or string)
- Event handlers: `onclick`, `oninput`, etc.

```javascript
const styledDiv = h('div', {
    class: 'card',
    style: { backgroundColor: 'blue', padding: '20px' }
});
```

## Event Handling

### Inline Event Handlers

```javascript
const button = h('button', {
    onclick: (e) => {
        console.log('Button clicked!');
    }
}, 'Click Me');
```

### Common Events

```javascript
const input = h('input', {
    oninput: (e) => console.log(e.target.value),
    onkeydown: (e) => {
        if (e.key === 'Enter') {
            console.log('Enter pressed');
        }
    },
    onfocus: () => console.log('Input focused'),
    onblur: () => console.log('Input blurred')
});
```

## State Management with Store

### Creating a Store

```javascript
const store = MiniFlux.createStore({
    // Initial state
    count: 0,
    user: { name: 'John' }
});
```

### Reading State

```javascript
const currentCount = store.getState().count;
```

### Updating State

```javascript
// Update returns new state
store.setState({ count: store.getState().count + 1 });

// Or use a function
store.setState(state => ({ count: state.count + 1 }));
```

### Subscribing to Changes

```javascript
store.subscribe((newState) => {
    console.log('State changed:', newState);
    // Re-render your app
    MiniFlux.render(App(), document.getElementById('app'));
});
```

## Components

### Functional Components

```javascript
function Counter() {
    const state = store.getState();
    
    return h('div', { class: 'counter' }, [
        h('h2', {}, `Count: ${state.count}`),
        h('button', {
            onclick: () => store.setState({ count: state.count + 1 })
        }, 'Increment')
    ]);
}
```

### Component with Props

```javascript
function UserCard({ name, email }) {
    return h('div', { class: 'user-card' }, [
        h('h3', {}, name),
        h('p', {}, email)
    ]);
}

// Usage
const card = UserCard({ name: 'Alice', email: 'alice@example.com' });
```

## Hooks

### useState Hook

```javascript
function Counter() {
    const [count, setCount] = MiniFlux.useState(0);
    
    return h('div', {}, [
        h('p', {}, `Count: ${count}`),
        h('button', { onclick: () => setCount(count + 1) }, '+')
    ]);
}
```

### useEffect Hook

```javascript
function DataFetcher() {
    const [data, setData] = MiniFlux.useState(null);
    
    MiniFlux.useEffect(() => {
        // This runs after component mounts
        fetch('/api/data')
            .then(r => r.json())
            .then(setData);
            
        // Cleanup function (optional)
        return () => {
            console.log('Component unmounting');
        };
    }, []); // Empty array = run once
    
    return h('div', {}, data ? data.title : 'Loading...');
}
```

### Effect Dependencies

```javascript
function UserProfile({ userId }) {
    const [user, setUser] = MiniFlux.useState(null);
    
    // Re-run when userId changes
    MiniFlux.useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then(r => r.json())
            .then(setUser);
    }, [userId]);
    
    return h('div', {}, user ? user.name : 'Loading...');
}
```

## Routing System

### Setting Up Routes

```javascript
const router = MiniFlux.createRouter({
    '/': HomePage,
    '/about': AboutPage,
    '/users/:id': UserPage
});
```

### Route Components

```javascript
function HomePage() {
    return h('div', {}, [
        h('h1', {}, 'Home Page'),
        h('a', { href: '#/about' }, 'Go to About')
    ]);
}

function UserPage({ params }) {
    return h('div', {}, [
        h('h1', {}, `User ID: ${params.id}`)
    ]);
}
```

### Navigation

```javascript
// Using links
h('a', { href: '#/about' }, 'About')

// Programmatic navigation
router.navigate('/users/123');

// Get current route
const currentRoute = router.getCurrentRoute();
```

### Route Parameters

Routes can have dynamic segments:

```javascript
// Route: '/users/:id/posts/:postId'
// URL: #/users/42/posts/99
// params = { id: '42', postId: '99' }
```

## Rendering

### Initial Render

```javascript
const app = h('div', { class: 'app' }, [
    h('h1', {}, 'My Application')
]);

MiniFlux.render(app, document.getElementById('app'));
```

### Re-rendering

The framework automatically handles re-rendering when state changes if you use the store's subscribe method:

```javascript
store.subscribe(() => {
    MiniFlux.render(App(), document.getElementById('app'));
});
```

## Complete Example

```javascript
// Create store
const store = MiniFlux.createStore({
    todos: [],
    filter: 'all'
});

// Todo component
function TodoApp() {
    const state = store.getState();
    
    const addTodo = () => {
        const input = document.getElementById('todoInput');
        if (input.value.trim()) {
            store.setState({
                todos: [...state.todos, {
                    id: Date.now(),
                    text: input.value,
                    completed: false
                }]
            });
            input.value = '';
        }
    };
    
    return h('div', { class: 'todo-app' }, [
        h('h1', {}, 'Todo List'),
        h('div', { class: 'input-group' }, [
            h('input', {
                id: 'todoInput',
                type: 'text',
                placeholder: 'What needs to be done?',
                onkeydown: (e) => e.key === 'Enter' && addTodo()
            }),
            h('button', { onclick: addTodo }, 'Add')
        ]),
        h('ul', { class: 'todo-list' },
            state.todos.map(todo =>
                h('li', { key: todo.id }, [
                    h('input', {
                        type: 'checkbox',
                        checked: todo.completed,
                        onchange: () => {
                            store.setState({
                                todos: state.todos.map(t =>
                                    t.id === todo.id
                                        ? { ...t, completed: !t.completed }
                                        : t
                                )
                            });
                        }
                    }),
                    h('span', {
                        style: {
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }
                    }, todo.text)
                ])
            )
        )
    ]);
}

// Subscribe to state changes
store.subscribe(() => {
    MiniFlux.render(TodoApp(), document.getElementById('app'));
});

// Initial render
MiniFlux.render(TodoApp(), document.getElementById('app'));
```

## How It Works

### Virtual DOM Reconciliation

1. **Create VDOM**: Components return virtual node objects
2. **Diffing**: Compare new VDOM with previous VDOM
3. **Patch**: Apply minimal changes to real DOM

### Diffing Algorithm

The framework compares nodes by:
- Tag name changes → replace node
- Attribute changes → update attributes only
- Children changes → recursively diff children
- Key-based reconciliation for lists

### State Updates

1. `setState()` called with new state
2. State is merged with current state
3. Subscribers are notified
4. Components re-render
5. VDOM diff is performed
6. DOM is updated efficiently

### Event System

Events are attached directly to DOM elements during rendering. The framework:
1. Detects event handler attributes (onclick, oninput, etc.)
2. Adds event listeners to actual DOM elements
3. Removes old listeners during updates
4. Ensures proper cleanup

## Best Practices

1. **Use keys for lists**: Always provide unique keys when rendering lists
2. **Immutable updates**: Never mutate state directly, always create new objects
3. **Component composition**: Break UI into small, reusable components
4. **Minimize re-renders**: Use proper dependency arrays in useEffect
5. **Event delegation**: For large lists, consider event delegation patterns

## API Reference

### Core Functions

- `h(tag, attrs, children)` - Create virtual node
- `MiniFlux.render(vnode, container)` - Render to DOM
- `MiniFlux.createStore(initialState)` - Create state store
- `MiniFlux.createRouter(routes)` - Create router
- `MiniFlux.useState(initialValue)` - State hook
- `MiniFlux.useEffect(callback, deps)` - Effect hook

### Store Methods

- `store.getState()` - Get current state
- `store.setState(updates)` - Update state
- `store.subscribe(listener)` - Subscribe to changes

### Router Methods

- `router.navigate(path)` - Navigate to route
- `router.getCurrentRoute()` - Get current route info
- `router.start()` - Start listening to hash changes