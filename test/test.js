/**
 * MiniFramework - Complete Implementation
 * Includes: State, Effects, Store, Router, and DOM rendering
 */

const miniframework = () => {
    // ---------- STATE ----------
    let states = [];
    let stateIndex = 0;

    function useState(initialValue) {
        const idx = stateIndex;
        states[idx] = states[idx] !== undefined ? states[idx] : initialValue;

        const setState = (v) => {
            states[idx] = typeof v === 'function' ? v(states[idx]) : v;
            render();
        };

        stateIndex++;
        return [states[idx], setState];
    }

    // ---------- EFFECT ----------
    let effects = [];
    let effectIndex = 0;

    function useEffect(cb, deps) {
        const old = effects[effectIndex];
        let changed = true;

        if (old) {
            changed = !deps || deps.some((d, i) => d !== old[i]);
        }
        if (changed) {
            const cleanup = cb();
            if (typeof cleanup === 'function') {
                effects[effectIndex] = { deps, cleanup };
            } else {
                effects[effectIndex] = { deps };
            }
        }

        effectIndex++;
    }

    // ---------- STORE ----------
    let store = {
        todos: [],
        filter: 'all'
    };

    const listeners = [];

    function createStore(initialState) {
        store = { ...initialState };
        return {
            getState: () => store,
            setState: (updates) => {
                store = { ...store, ...updates };
                listeners.forEach(listener => listener(store));
                render();
            },
            subscribe: (listener) => {
                listeners.push(listener);
                return () => {
                    const idx = listeners.indexOf(listener);
                    if (idx > -1) listeners.splice(idx, 1);
                };
            }
        };
    }

    // Initialize store with localStorage
    const storeInstance = createStore({
        todos: loadTodosFromStorage(),
        filter: 'all',
        editingId: null
    });

    // ---------- STORAGE HELPERS ----------
    function loadTodosFromStorage() {
        try {
            const stored = localStorage.getItem('todos-miniframework');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    function saveTodosToStorage(todos) {
        try {
            localStorage.setItem('todos-miniframework', JSON.stringify(todos));
        } catch (e) {
            console.error('Failed to save todos:', e);
        }
    }

    // ---------- TODO ACTIONS ----------
    const todoActions = {
        addTodo(text) {
            if (!text.trim()) return;
            
            const state = storeInstance.getState();
            const newTodos = [...state.todos, {
                id: Date.now(),
                text: text.trim(),
                completed: false
            }];
            
            storeInstance.setState({ todos: newTodos });
            saveTodosToStorage(newTodos);
        },

        toggleTodo(id) {
            const state = storeInstance.getState();
            const newTodos = state.todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            
            storeInstance.setState({ todos: newTodos });
            saveTodosToStorage(newTodos);
        },

        toggleAll() {
            const state = storeInstance.getState();
            const allCompleted = state.todos.every(t => t.completed);
            const newTodos = state.todos.map(todo => ({
                ...todo,
                completed: !allCompleted
            }));
            
            storeInstance.setState({ todos: newTodos });
            saveTodosToStorage(newTodos);
        },

        deleteTodo(id) {
            const state = storeInstance.getState();
            const newTodos = state.todos.filter(todo => todo.id !== id);
            
            storeInstance.setState({ todos: newTodos });
            saveTodosToStorage(newTodos);
        },

        editTodo(id, text) {
            const state = storeInstance.getState();
            
            if (!text.trim()) {
                this.deleteTodo(id);
                return;
            }
            
            const newTodos = state.todos.map(todo =>
                todo.id === id ? { ...todo, text: text.trim() } : todo
            );
            
            storeInstance.setState({ todos: newTodos, editingId: null });
            saveTodosToStorage(newTodos);
        },

        startEditing(id) {
            storeInstance.setState({ editingId: id });
        },

        cancelEditing() {
            storeInstance.setState({ editingId: null });
        },

        clearCompleted() {
            const state = storeInstance.getState();
            const newTodos = state.todos.filter(todo => !todo.completed);
            
            storeInstance.setState({ todos: newTodos });
            saveTodosToStorage(newTodos);
        }
    };

    // ---------- ROUTER ----------
    let currentRoute = window.location.hash.slice(1) || '/';

    const routes = {
        '/': () => storeInstance.setState({ filter: 'all' }),
        '/active': () => storeInstance.setState({ filter: 'active' }),
        '/completed': () => storeInstance.setState({ filter: 'completed' })
    };

    function handleRouteChange() {
        currentRoute = window.location.hash.slice(1) || '/';
        const handler = routes[currentRoute];
        
        if (handler) {
            handler();
        }
        
        render();
    }

    function navigate(path) {
        window.location.hash = path;
    }

    function getRoute() {
        return currentRoute;
    }

    // Initialize router
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();

    // ---------- BUILD DOM ----------
    function buildDOM(node) {
        if (node === null || node === undefined || node === false) {
            return document.createTextNode('');
        }

        if (typeof node === "string" || typeof node === "number") {
            return document.createTextNode(String(node));
        }

        if (Array.isArray(node)) {
            const fragment = document.createDocumentFragment();
            node.forEach(child => fragment.appendChild(buildDOM(child)));
            return fragment;
        }

        const el = document.createElement(node.tag);

        if (node.attrs) {
            for (const [k, v] of Object.entries(node.attrs)) {
                if (k.startsWith("on")) {
                    el.addEventListener(k.slice(2).toLowerCase(), v);
                } else if (k === "class" || k === "className") {
                    el.className = v;
                } else if (k === "style" && typeof v === "object") {
                    Object.assign(el.style, v);
                } else if (k === "checked" || k === "disabled") {
                    el[k] = v;
                } else if (k === "value") {
                    el.value = v;
                } else if (v !== false && v !== null && v !== undefined) {
                    el.setAttribute(k, v);
                }
            }
        }

        if (node.children) {
            node.children.forEach(c => {
                const child = buildDOM(c);
                if (child) el.appendChild(child);
            });
        }

        return el;
    }

    // ---------- RENDER ----------
    function render() {
        stateIndex = 0;
        effectIndex = 0;

        const app = document.getElementById("app");
        if (!app) return;

        app.innerHTML = "";

        // Get the root component (must be set externally)
        if (render.rootComponent) {
            const vdom = render.rootComponent();
            app.appendChild(buildDOM(vdom));
        }
    }

    // Allow setting root component
    render.rootComponent = null;

    function setRootComponent(component) {
        render.rootComponent = component;
    }

    // ---------- EXPORTS ----------
    return {
        useState,
        useEffect,
        render,
        setRootComponent,
        store: storeInstance,
        todoActions,
        navigate,
        getRoute
    };
};

export const {
    useState,
    useEffect,
    render,
    setRootComponent,
    store,
    todoActions,
    navigate,
    getRoute
} = miniframework();