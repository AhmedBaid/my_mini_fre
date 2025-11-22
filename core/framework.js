import { footer, TodoApp } from "../src/components/config.js";

const miniframework = () => {
    // hna usestate
    let states = [];
    let stateIndex = 0;

    function useState(initialValue) {
        const currentIndex = stateIndex;
        states[currentIndex] = states[currentIndex] !== undefined ? states[currentIndex] : initialValue;

        function setState(newValue) {
            states[currentIndex] = newValue;
            render();
        }

        stateIndex++;

        return [states[currentIndex], setState];
    }

    // hna useeffect
    let effects = [];
    let effectIndex = 0;
    function areDepsChanged(oldDeps, newDeps) {
        if (!oldDeps) return true;
        if (oldDeps.length !== newDeps.length) return true;

        for (let i = 0; i < newDeps.length; i++) {
            if (oldDeps[i] !== newDeps[i]) return true;
        }
        return false;
    }

    function useEffect(callback, dependencies) {
        const oldDependencies = effects[effectIndex];
        const hasChanged = areDepsChanged(oldDependencies, dependencies);

        if (hasChanged) {
            callback();
        }

        effects[effectIndex] = dependencies;
        effectIndex++;
    }



    function buildDOM(node) {
        if (typeof node === "string" || typeof node === "number") {
            return document.createTextNode(String(node));
        }

        const el = document.createElement(node.tag);

        if (node.attrs) {
            for (const [attr, value] of Object.entries(node.attrs)) {
                if (attr.startsWith("on") && typeof value === "function") {
                    el.addEventListener(attr.slice(2).toLowerCase(), value);
                }
                else if (attr === "class") {
                    el.className = value;
                }
                else if (attr === "for") {
                    el.htmlFor = value;
                }
                else if (attr in el) {
                    el[attr] = value;
                }
                else {
                    el.setAttribute(attr, value);
                }
            }
        }

        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => {
                el.appendChild(buildDOM(child));
            });
        }

        return el;
    }


    function Router() {
    }
    function Store(initialState) {

        let state = initialState === undefined ? null : initialState;

        const get = () => state;

        const set = (newState) => {

            state = { ...state, ...newState };
            render();
        };

        // const update = (updater) => {
        //     const next = typeof updater === 'function' ? updater(state) : updater;
        //     set(next);
        // };

        return { get, set };
    }

    const store = Store({ todos: [] });

    function render() {
        const appContainer = document.getElementById("app");
        appContainer.innerHTML = "";
        const section = buildDOM(TodoApp(store.get(), store));
        const footersection = buildDOM(footer);
        appContainer.appendChild(section);
        appContainer.appendChild(footersection);
    }
    return { useState, useEffect, Router, render, store, buildDOM };
};
export const { useState, useEffect, Router, render, store, buildDOM } = miniframework();