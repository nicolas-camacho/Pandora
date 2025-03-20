/**
 * A simple state management class that allows you to store and update a state, and link functions to it.
 * @class State
 * @param {any} initialState - The initial state value.
 * @param {function[]} reactors - An array of functions to call when the state changes.
 */
class State {
    constructor(initialState = {}, reactors = []) {
        this.state = initialState;

        if (!Array.isArray(reactors) || !reactors.every(fn => typeof fn === 'function')) {
            throw new Error('Reactors must be an array of functions.');
        }

        this.reactors = reactors;
    }

    /**
     * Updates the state with the provided value. If the current state and the new value are objects,
     * they will be merged. If the state changes, reactors will be notified after a debounce delay.
     * @param {any} value - The new state value to set. Can be an object or any other type.
     * @returns {any} - The updated state.
     */
    set(value) {
        if (typeof value === 'object' && typeof this.state === 'object') {
            const newObject = { ...this.state, ...value };
            if (JSON.stringify(newObject) !== JSON.stringify(this.state)) {
                this.state = newObject;
                if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.reactors.forEach(reactor => reactor(this.state));
                }, 50);
            }
        } else {
            if (value !== this.state) {
                this.state = value;
                this.reactors.forEach(reactor => reactor(this.state));
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
        if (typeof reactor === 'function') {
            this.reactors.push(reactor);
        } else if (Array.isArray(reactor) && reactor.every(fn => typeof fn === 'function')) {
            this.reactors.push(...reactor);
        } else {
            throw new Error('Reactor must be a function or an array of functions.');
        }
    }
}