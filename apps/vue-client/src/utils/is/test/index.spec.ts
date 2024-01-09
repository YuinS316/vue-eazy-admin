import { it, expect, describe } from 'vitest';
import { isDef, isEmpty, isNumber, isObject } from '..';

describe('is', () => {
  it('test isEmpty', () => {
    [{}, [], new Map(), new Set()].forEach((item) => {
      expect(isEmpty(item)).toBe(true);
    });
  });

  it('test isNumber', () => {
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber('1')).toBe(false);
    expect(isNumber(1234)).toBe(true);
  });

  it('test isDef', () => {
    let a: string | undefined;

    expect(isDef(a)).toBe(false);

    a = 'a';

    expect(isDef(a)).toBe(true);
  });

  it('test isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
  });
});
