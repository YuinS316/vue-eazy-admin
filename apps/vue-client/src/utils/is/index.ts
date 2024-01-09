//  ======= null / undefined ======
export function isDef<T>(target: T | undefined): target is T {
  return target !== undefined;
}

export function isUndef(target: unknown): target is undefined {
  return target === undefined;
}

//  ======= common =======

export function isEmpty(target: unknown) {
  if (isNull(target) || isUndef(target)) {
    return true;
  }

  if (isArray(target)) {
    return target.length === 0;
  }

  if (isObject(target)) {
    return Object.keys(target).length === 0;
  }

  if (target instanceof Map || target instanceof Set) {
    return target.size === 0;
  }

  return false;
}

export function is<T>(target: unknown, type: string): target is T {
  return Object.prototype.toString.call(target) === `[object ${type}]`;
}

export function isNumber(target: unknown): target is number {
  return !Object.is(target, NaN) && is(target, 'Number');
}

export function isString(target: unknown): target is string {
  return is(target, 'String');
}

export function isBoolean(target: unknown): target is boolean {
  return is(target, 'Boolean');
}

export function isArray(target: unknown): target is any[] {
  return Array.isArray(target);
}

export function isNull(target: unknown): target is null {
  return target === null;
}

export function isObject(target: unknown): target is object {
  return is(target, 'Object') && !isNull(target);
}
