import { generateEquation } from '../../src/utils/generateEquation'
import { evaluate } from '../../src/utils/equationSolver'

describe("generateEquation", () => {
    test("generates correct number of equations", () => {
        const result = generateEquation(5, 3, 5);
        expect(result.length).toBe(5);
    });

    test("all generated equations are correct length", () => {
        const target = 10;
        const length = 5;
        const count = 6;

        const result = generateEquation(target, length, count);

        result.forEach(eq => {
            expect(eq.length).toBe(length);
        });
    });

    test("all generated equations evaluate to target", () => {
        const target = 7;
        const length = 3;
        const count = 10;

        const result = generateEquation(target, length, count);

        result.forEach(expr => {
            // eval is safe here because the generator produces digits/operators only
            expect(eval(expr)).toBe(target);
        });
    });

    test("different targets produce different equations", () => {
        const r1 = generateEquation(5, 3, 3);
        const r2 = generateEquation(9, 3, 3);

        // Should not be exactly equal
        expect(r1).not.toEqual(r2);
    });

    test("length must be odd and ≥ 3", () => {
        const res1 = generateEquation(5, 1, 3);  // invalid length
        const res2 = generateEquation(5, 2, 3);  // even length
        const res3 = generateEquation(5, 0, 3);  // zero length

        expect(res1.length).toBe(0);
        expect(res2.length).toBe(0);
        expect(res3.length).toBe(0);
    });

    test("stops early when count reached", () => {
        const target = 6;
        const length = 3;
        const count = 2;

        const result = generateEquation(target, length, count);
        expect(result.length).toBe(2);  // Confirm it doesn't over-generate
    });

    test("produces valid math characters only", () => {
        const result = generateEquation(8, 5, 10);

        const validChars = /^[0-9+\-*/]+$/;

        result.forEach(expr => {
            expect(validChars.test(expr)).toBe(true);
        });
    });
    
    test("length 7 — multiple operations, all evaluate to target", () => {
        const target = 12;
        const length = 7;  // digit op digit op digit op digit (4 digits, 3 ops)
        const count = 8;

        const results = generateEquation(target, length, count);

        expect(results.length).toBe(count);

        results.forEach(expr => {
            expect(expr.length).toBe(length);
            expect(evaluate(expr)).toBe(target);
        });
    });

    test("length 9 — more complex equations", () => {
        const target = 20;
        const length = 9;  // 5 numbers, 4 operators
        const count = 6;

        const results = generateEquation(target, length, count);

        expect(results.length).toBe(count);

        results.forEach(expr => {
            expect(expr.length).toBe(length);
            expect(evaluate(expr)).toBe(target);
        });
    });

    test("length 9 returns fewer than requested when target is hard to reach", () => {
        const target = 97; // Hard to reach with only digits 1–9
        const length = 9;
        const count = 10;

        const results = generateEquation(target, length, count);

        results.forEach(expr => {
            expect(evaluate(expr)).toBe(target);
        });

        // It's valid for there to be fewer than `count` results
        expect(results.length).toBeLessThanOrEqual(count);
    });

    test("all characters in long equations are valid digits/operators", () => {
        const target = 15;
        const length = 9;
        const count = 7;

        const results = generateEquation(target, length, count);

        const validPattern = /^[0-9+\-*/]+$/;

        results.forEach(expr => {
            expect(expr.length).toBe(length);
            expect(validPattern.test(expr)).toBe(true);
            expect(evaluate(expr)).toBe(target);
        });
    });
});
