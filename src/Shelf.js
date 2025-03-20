import { isValidShelf, isValidReactorsObject, isValidReactor } from "./libs/Validators";
import State from "./State";

class Shelf {
    constructor(states = {}, reactors = {}) {
        const incomingStates = isValidShelf(states);

        if (!Array.isArray(reactors) || typeof reactors !== 'object') {
            throw new Error(`Reactors must be an object or an array. Received: ${typeof reactors}`);
        } else if (Array.isArray(reactors)) {
            this.reactors = isValidReactor(reactors);
        } else {
            this.reactors = isValidReactorsObject(initialStates, reactors);
            let initialStates = {};
            for (let state in incomingStates) {
                initialStates[state] = new State(incomingStates[state], this.reactors[state]);
            };
            this.states = initialStates;
        };
    };

    /**
     * Returns the current state of the shelf or the state with the provided name.
     * @param {string | undefined} stateName - The name of the state to return or undefined to return all states.
     * @returns {any} - The shelf or the state with the provided name.
     * @throws {Error} - Throws an error if the state name is not a string.
     */
    get(stateNames) {
        const currentState = {};
        if (stateNames === undefined) {
            for (let state in this.states) {
                currentState[state] = this.states[state].get();
            };
            return currentState; 
        } else if (typeof stateNames === 'string') {
            return this.states[stateNames].get();
        } else if (Array.isArray(stateNames)) {
            if (stateNames.every(state => typeof state === 'string')) {
                for (let state of stateNames) {
                    currentState[state] = this.states[state].get();
                }
                return currentState;
            } else {
                throw new Error(`State names must be strings. Received: ${typeof stateNames}`);
            };
        };

        throw new Error(`State name must be a string or an Array. Received: ${typeof stateNames}`);
    };

    /**
     * Updates the state with the provided value. If the current state and the new value are objects,
     * they will be merged. If the state changes, reactors will be notified after a debounce delay.
     * @param {object} updates - An object with the states to update and their new values.
     * @returns {object} - The updated states.
     * @throws {Error} - Throws an error if the updates are not an object.
     */
    update(updates = {}) {
        if (typeof updates !== 'object') {
            throw new Error(`Updates must be an object. Received: ${typeof updates}`);
        };

        const updatedStates = {};

        for (let state in updates) {
            if (this.states[state]) {
                this.states[state].update(states[state]);
                updatedStates[state] = this.states[state].get();
            } else {
                const newState = new State(updates[state]);
                this.states[state] = newState;
                updatedStates[state] = newState.get();            
            };
        };

        return updatedStates;
    };
};

export default Shelf;