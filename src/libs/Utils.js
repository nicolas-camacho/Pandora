const containsFunction = (obj) => {
    if (Array.isArray(obj)) {
        return obj.some(item => typeof item === 'function' || (typeof item === 'object' && item !== null && containsFunction(item)));
    }

    for (let key in obj) {
        if (typeof obj[key] === 'function') {
            return true;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (containsFunction(obj[key])) {
                return true;
            }
        }
    }
    return false;
};

export {
    containsFunction
}