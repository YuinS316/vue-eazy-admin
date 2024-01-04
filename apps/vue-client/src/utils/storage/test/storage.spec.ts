import {
  it,
  expect,
  describe,
  beforeEach,
  vitest,
  vi,
  afterEach,
} from 'vitest';
import { IStorage } from '../storage';

describe('Storage', () => {
  let storage: IStorage;
  const key = 'foo';
  const value = 'bar';

  beforeEach(() => {
    vi.useFakeTimers();
    storage = new IStorage({
      storage: localStorage,
      prefix: 'vitest',
      namespace: 'default',
    });
    localStorage.clear();
    vitest.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should getItem retrieve a valid value within the available duration', () => {
    storage.setItem(key, value);
    expect(storage.getItem(key)).toBe(value);
  });

  it('should getItem retrieve null when target is expired', () => {
    const now = new Date('2024/01/01').getTime();
    const expired = 100;

    //  固定时间
    vi.setSystemTime(now);
    storage.setItem(key, value, expired);

    //  expired*1000 是因为单位是秒
    vi.setSystemTime(now + expired * 1000);

    expect(storage.getItem(key)).toBe(null);
  });

  it('should getItem with default value will return default value', () => {
    expect(storage.getItem(key)).toBe(null);
    expect(storage.getItem(key, value)).toBe(value);
  });

  it('should removeItem work', () => {
    storage.setItem(key, value);
    storage.removeItem(key);
    expect(storage.getItem(key)).toBe(null);
  });

  it('should clear work', () => {
    const key1 = key + '1';
    const key2 = key + '2';
    storage.setItem(key, value);
    storage.setItem(key1, value);
    storage.setItem(key2, value);

    storage.clear();

    expect(storage.getItem(key)).toBe(null);
    expect(storage.getItem(key1)).toBe(null);
    expect(storage.getItem(key2)).toBe(null);
  });
});
