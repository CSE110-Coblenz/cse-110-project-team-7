import { evaluate } from '../../src/utils/equationSolver'

describe('evaluate()', () => {
  test('should handle single numbers', () => {
    expect(evaluate('3')).toBe(3);
    expect(evaluate('42')).toBe(42);
  });

  test('should handle addition', () => {
    expect(evaluate('1+2')).toBe(3);
    expect(evaluate('10+20+30')).toBe(60);
  });

  test('should handle subtraction', () => {
    expect(evaluate('5-2')).toBe(3);
    expect(evaluate('10-5-2')).toBe(3);
  });

  test('should handle multiplication', () => {
    expect(evaluate('2x3')).toBe(6);
    expect(evaluate('2+3x4')).toBe(14);
  });

  test('should handle division', () => {
    expect(evaluate('8/2')).toBe(4);
    expect(evaluate('10/2+3')).toBe(8);
  });

  test('should handle mixed operations', () => {
    expect(evaluate('3+2x2')).toBe(7);
    expect(evaluate('10+2x6')).toBe(22);
    expect(evaluate('100x2+12')).toBe(212);
  });

  test('should handle sequential operations correctly', () => {
    expect(evaluate('14-3/2')).toBe(12.5);
    expect(evaluate('3+5/2')).toBe(5.5);
  });
});
