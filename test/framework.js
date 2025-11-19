import { todoApp } from "./config.js";

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



    // hna build the dom
    function buildDOM(node) {
        console.log(node);
        
        if (typeof node === "string" || typeof node === "number") {
            return document.createTextNode(String(node));
        }

        const el = document.createElement(node.tag);
        if (node.attrs) {
            for (const [attr, value] of Object.entries(node.attrs)) {
                el.setAttribute(attr, value);
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
    // function Store(initialState) {
    //     let state = initialState || null;
    //     const listeners = [];

    //     const get = () => state;

    //     const set = (newState) => {
    //         state = { ...state, ...newState };
    //         listeners.forEach(fn => fn(state));
    //     };

    //     const subscribe = (fn) => {
    //         listeners.push(fn);
    //     };

    //     return { get, set, subscribe };
    // }
    function render() {
        const appContainer = document.getElementById("app");
        appContainer.innerHTML = "";
        const domTree = buildDOM(todoApp);
        appContainer.appendChild(domTree);
    }
    return { useState, useEffect, Router, render };
};
export const { useState, useEffect, Router, render } = miniframework();