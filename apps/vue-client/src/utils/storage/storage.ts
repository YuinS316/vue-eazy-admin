export interface IStorageOptions {
  storage: Storage;
  prefix: string;
  namespace: string;
}

export interface IStorageValue<T = any> {
  value: T;
  timestamp: number;
  expire: number;
}

export class IStorage {
  private instance: Storage;
  private prefix: string;
  private namespace: string;

  constructor(options: IStorageOptions) {
    this.instance = options.storage;
    this.prefix = options.prefix;
    this.namespace = options.namespace;
  }

  getKey(key: string) {
    return `${this.namespace}::${this.prefix}::${key}`;
  }

  getItem<T>(key: string, defaultValue?: T): T | null {
    const k = this.getKey(key);

    const target = this.instance.getItem(k);
    if (!target) {
      return defaultValue ?? null;
    }

    const value = this.parseJSONValue(target);
    if (value === null) {
      this.removeItem(k);
    }

    return value;
  }

  /**
   * 设置值
   * @param key 键
   * @param value 值
   * @param expire 过期时间，单位(s)
   */
  setItem(key: string, value: any, expire?: number) {
    const k = this.getKey(key);
    const v = JSON.stringify({
      value,
      timestamp: this.getNow(),
      expire: this.calcExpireTime(expire),
    });
    this.instance.setItem(k, v);
  }

  removeItem(key: string) {
    const k = this.getKey(key);
    this.instance.removeItem(k);
  }

  clear() {
    this.instance.clear();
  }

  private calcExpireTime(expire?: number) {
    if (expire !== undefined) {
      return new Date().getTime() + expire * 1000;
    }
    return null;
  }

  private getNow() {
    return new Date().getTime();
  }

  private parseJSONValue(val: string) {
    try {
      const target: IStorageValue = JSON.parse(val);
      const { value, expire } = target;
      if (expire === null || expire > this.getNow()) {
        return value;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
