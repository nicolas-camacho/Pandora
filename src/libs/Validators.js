/**
 * Validates the reactor(s).
 * @param {function|function[]} reactors - The reactor(s) to validate.
 * @returns {boolean} - Returns true if the reactor(s) are valid.
 * @throws {Error} - Throws an error if the reactor(s) are invalid
 */
const isValidReactor = (reactors) => {
    if (typeof reactors === 'function') {
        return true;
    }

    const isFunction = (fn) => typeof fn === 'function';
    if (Array.isArray(reactors) && reactors.every(isFunction)) {
        return true;
    }

    throw new Error(`Reactors must be a function or an array of functions. Received: ${typeof reactors}`);
};

export {
    isValidReactor
};