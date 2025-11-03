/// <reference types="jest" />
import { validate } from '../../src/utils/validateEquation';

describe("validate()", () => {
    test("valid equations", () => {
        expect(validate("1+2")).toBe(true);
        expect(validate("3-4")).toBe(true);
        expect(validate("2*3")).toBe(true);
        expect(validate("8/4")).toBe(true);
        expect(validate("1+2*3-4")).toBe(true);
    });

    test("invalid: too short", () => {
        expect(validate("1")).toBe(false);
        expect(validate("1+")).toBe(false);
    });

    test("invalid: starts or ends with operator", () => {
        expect(validate("+1")).toBe(false);
        expect(validate("1+")).toBe(false);
        expect(validate("-3")).toBe(false);
        expect(validate("3*")).toBe(false);
    });

    test("invalid: consecutive digits (multi-digit numbers)", () => {
        expect(validate("12+3")).toBe(false);
        expect(validate("1+23")).toBe(false);
        expect(validate("123+4")).toBe(false);
    });

    test("invalid: consecutive operators", () => {
        expect(validate("1++2")).toBe(false);
        expect(validate("3--1")).toBe(false);
        expect(validate("4**2")).toBe(false);
        expect(validate("6//3")).toBe(false);
    });

    test("invalid: illegal characters", () => {
        expect(validate("1a2")).toBe(false);
        expect(validate("2$3")).toBe(false);
        expect(validate("4_5")).toBe(false);
    });

    test("invalid: whitespace", () => {
        expect(validate("1 + 2")).toBe(false);
        expect(validate(" 1+2")).toBe(false);
        expect(validate("1+2 ")).toBe(false);
    });

    test("valid long alternating sequence", () => {
        expect(validate("1+2-3*4/5+6")).toBe(true);
    });
});
