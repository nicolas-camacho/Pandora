import { isValidReactor, isValidState } from "./libs/Validators.js";

/**
 * A simple state management class that allows you to store and update a state, and link functions to it.
 * @class State
 * @param {any} initialState - The initial state value.
 * @param {function[]|function} reactors - An array of functions to call when the state changes.
 */
class State {
    constructor(initialState = {}, reactors = []) {
        this.state = isValidState(initialState);
        this.reactors = isValidReactor(reactors);
    }

    /**
     * Updates the state with the provided value. If the current state and the new value are objects,
     * they will be merged. If the state changes, reactors will be notified after a debounce delay.
     * @param {any} value - The new state value to set. Can be an object or any other type.
     * @returns {any} - The updated state.
     */
    update(value) {
        const newState = isValidState(value);

        if (typeof newState === 'object' && typeof this.state === 'object') {
            let isDiff = false;
            for (const key in newState) {
                if (this.state[key] !== newState[key] && this.state[key] !== undefined) isDiff = true;
                this.state[key] = newState[key]
            }
            if (isDiff && this.reactors.length > 0) {
                if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.reactors.forEach(reactor => reactor(this.state));
                }, 50);
            }
        } else {
            if (newState !== this.state) {
                this.state = newState;
                if (this.reactors.length > 0) {
                    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
                    this.debounceTimeout = setTimeout(() => {
                        this.reactors.forEach(reactor => reactor(this.state));
                    }, 50);
                }
            }
        }

        return this.state;
    }

    /**
     * Return the current state.
     * @returns {any} - The current state.
     */
    get() {
        return this.state;
    }

    /**
     * Links a function or an array of functions to the state. The function(s) will be called every time the state changes.
     * @param {function|function[]} reactor - The function or array of functions to call when the state changes.
     */
    link(reactor) {
        if (isValidReactor(reactor)) {
            if (typeof reactor === 'function') {
                this.reactors.push(reactor);
            } else {
                this.reactors.push(...reactor);
            }
        }
    }
}

export default State;