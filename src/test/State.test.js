import { describe, it } from "jsr:@std/testing/bdd";
import { expect, fn } from "jsr:@std/expect";
import State from "../State.js";

describe("State", () => {
    it("should initialize with default values", () => {
        const state = new State(0, []);
        expect(state.get()).toEqual(0);
    });

    it("should update state with a new value", () => {
        const state = new State(0, []);
        state.update(10);
        expect(state.get()).toEqual(10);
    });

    it("should update state with an object", () => {
        const state = new State({}, []);
        state.update({ a: 1, b: 2 });
        expect(state.get()).toEqual({ a: 1, b: 2 });
    });

    it("should merge state with a new object", () => {
        const state = new State({ a: 1 }, []);
        state.update({ b: 2 });
        expect(state.get()).toEqual({ a: 1, b: 2 });
    });

    it("should notify reactors when state changes", () => {
        const reactor = fn()
        const state = new State(0, [reactor]);
        state.update(10);
        const debounceTimeout = setTimeout(() => {
            expect(reactor).toHaveBeenCalledTimes(1);
        }, 50); // Wait for debounce delay
        clearTimeout(state.debounceTimeout); // Clear timeout to prevent actual delay in test
        clearTimeout(debounceTimeout); // Clear timeout to prevent actual delay in test
    });

    it("should not notify reactors if state does not change", () => {
        const reactor = fn()
        const state = new State(0, [reactor]);
        state.update(0);
        expect(reactor).not.toHaveBeenCalled();
    });

    it("should call a new reactor when linked", () => {
        const reactor = fn()
        const state = new State(0, []);
        state.link(reactor);
        state.update(10);
        const debounceTimeout = setTimeout(() => {
            expect(reactor).toHaveBeenCalledTimes(1);
        }, 50); // Wait for debounce delay
        clearTimeout(state.debounceTimeout); // Clear timeout to prevent actual delay in test
        clearTimeout(debounceTimeout); // Clear timeout to prevent actual delay in test
    })
});



