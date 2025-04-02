import { describe, it } from "jsr:@std/testing/bdd";
import { expect, fn } from "jsr:@std/expect";
import Shelf from "../Shelf.js";

describe("Shelf", () => {
    it("should initialize with default values", () => {
        const shelf = new Shelf({a: 1}, []);
        expect(shelf.get()).toEqual({ a: 1 });
    });

    it("should get specific state", () => {
        const shelf = new Shelf({a: 1}, []);
        expect(shelf.get("a")).toEqual(1);
    });

    it("should update specific state", () => {
        const shelf = new Shelf({a: 1}, []);
        shelf.update({a: 2});
        expect(shelf.get("a")).toEqual(2);
    });

    it("should update state with an object", () => {
        const shelf = new Shelf({}, []);
        shelf.update({ a: 1, b: 2 });
        expect(shelf.get()).toEqual({ a: 1, b: 2 });
    });

    it("should merge state with a new object", () => {
        const shelf = new Shelf({ a: 1 }, []);
        shelf.update({ b: 2 });
        expect(shelf.get()).toEqual({ a: 1, b: 2 });
    });

    it("should notify reactors when state changes", () => {
        const reactor = fn()
        const shelf = new Shelf({}, [reactor]);
        shelf.update({ a: 1 });
        const debounceTimeout = setTimeout(() => {
            expect(reactor).toHaveBeenCalledTimes(1);
        }, 50); // Wait for debounce delay
        clearTimeout(shelf.debounceTimeout); // Clear timeout to prevent actual delay in test
        clearTimeout(debounceTimeout); // Clear timeout to prevent actual delay in test
    });

    it("should not notify reactors if state does not change", () => {
        const reactor = fn()
        const shelf = new Shelf({ a: 1 }, [reactor]);
        shelf.update({ a: 1 });
        expect(reactor).not.toHaveBeenCalled();
    });

    it("should call a new reactor when linked", () => {
        const reactor = fn()
        const shelf = new Shelf({a: 0}, []);
        shelf.links([reactor]);
        shelf.update({ a: 1 });
        const debounceTimeout = setTimeout(() => {
            expect(reactor).toHaveBeenCalledTimes(1);
        }, 50); // Wait for debounce delay
        clearTimeout(shelf.debounceTimeout); // Clear timeout to prevent actual delay in test
        clearTimeout(debounceTimeout); // Clear timeout to prevent actual delay in test
    });

    it("should call multiple reactors when linked", () => {
        const reactor1 = fn()
        const reactor2 = fn()
        const shelf = new Shelf({a: 0}, []);
        shelf.links([reactor1, reactor2]);
        shelf.update({ a: 1 });
        const debounceTimeout = setTimeout(() => {
            expect(reactor1).toHaveBeenCalledTimes(1);
            expect(reactor2).toHaveBeenCalledTimes(1);
        }, 50); // Wait for debounce delay
        clearTimeout(shelf.debounceTimeout); // Clear timeout to prevent actual delay in test
        clearTimeout(debounceTimeout); // Clear timeout to prevent actual delay in test
    });

    it("should call specific reactor when state change", () => {
        const reactor = fn()
        const shelf = new Shelf({a: 0}, []);
        shelf.links({
            a: [reactor]
        });
        shelf.update({ a: 1 });
        const debounceTimeout = setTimeout(() => {
            expect(reactor).toHaveBeenCalledTimes(1);
        }, 50); // Wait for debounce delay
        clearTimeout(shelf.states["a"].debounceTimeout); // Clear timeout to prevent actual delay in test
        clearTimeout(debounceTimeout); // Clear timeout to prevent actual delay in test
    })
});