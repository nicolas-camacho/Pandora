import { containsFunction } from './Utils.js';

/**
 * Validates the state.
 * @param {any} state - The state object to validate.
 * @returns {any} - Returns the state object if valid.
 * @throws {Error} - Throws an error if the state object is invalid.
 */
const isValidState = (state) => {
    if (
        (typeof state === 'object' && containsFunction(state)) ||
        typeof state === 'function' ||
        (Array.isArray(state) && containsFunction(state))
    ) {
        throw new Error(`State cannot be a function, contain functions, or be an array containing functions. Received: ${typeof state}`);
    }

    return state;
};

/**
 * Validates the reactor(s).
 * @param {function|function[]} reactors - The reactor(s) to validate.
 * @returns {function|function[]} - Returns the reactor(s) if valid.
 * @throws {Error} - Throws an error if the reactor(s) are invalid
 */
const isValidReactor = (reactors) => {
    if (typeof reactors === 'function') {
        return reactors;
    };

    const isFunction = (fn) => typeof fn === 'function';
    if (Array.isArray(reactors) && reactors.every(isFunction)) {
        return reactors;
    }

    throw new Error(`Reactors must be a function or an array of functions. Received: ${typeof reactors}`);
};

/**
 * Validates the shelf object.
 * @param {object} shelf - The shefl object to validate.
 * @returns {object} - Returns the shelf object if valid.
 * @throws {Error} - Throws an error if the shelf object is invalid.
 */
const isValidShelf = (shelf) => {
    if (typeof shelf === 'object' && shelf !== null && !Array.isArray(shelf)) {
        return isValidState(shelf);
    } else {
        throw new Error(`The shelf must be an object, if you are trying to create a single state consider using the State class. Received: ${typeof obj}`);
    }
};

/**
 * Validates the reactors object.
 * @param {object} shelf - The shelf object.
 * @param {object} reactors - The reactors object to validate.
 * @returns {object} - Returns the reactors object if valid.
 * @throws {Error} - Throws an error if the reactors object is invalid.
 */
const isValidReactorsObject = (shelf, reactors) => {
    const shelfKeys = Object.keys(shelf);
    const reactorKeys = Object.keys(reactors);
    const shelfKeysSet = new Set(shelfKeys);
    const missingKeys = reactorKeys.filter(key => !shelfKeysSet.has(key));
    if (missingKeys.length) {
        throw new Error(`The reactors object contains the following states that are not in the shelf object: ${missingKeys.join(', ')}`);
    }

    for (const key of reactorKeys) {
        try {
            isValidReactor(reactors[key]);
        } catch (error) {
            throw new Error(`Invalid reactor at key "${key}": ${error.message}`);
        }
    }

    return reactors;
}

export {
    isValidState,
    isValidReactor,
    isValidShelf,
    isValidReactorsObject
};