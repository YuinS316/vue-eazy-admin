import type { AxiosRequestConfig } from 'axios';

export interface CachedItem {
  status: 'pending' | 'complete';
  data: any;
  callback: {
    resolve: (data: any) => void;
    reject: (err: any) => void;
  }[];
}

export class Cached {
  private cachedMap = new Map<string, CachedItem>();

  getCachedKey(config: AxiosRequestConfig) {
    if (config.params) {
      return [config.method, config.url, ...Object.keys(config.params)].join(
        '&',
      );
    } else if (config.data) {
      return [config.method, config.url, ...Object.keys(config.data)].join('&');
    }
    return [config.method, config.url].join('&');
  }

  getItem(config: AxiosRequestConfig) {
    const key = this.getCachedKey(config);

    const cache = this.cachedMap.get(key);

    if (cache) {
      if (cache.status === 'pending') {
        return new Promise((resolve, reject) => {
          cache.callback.push({
            resolve,
            reject,
          });
        });
      } else {
        return Promise.resolve(cache.data);
      }
    }

    this.cachedMap.set(key, {
      status: 'pending',
      data: null,
      callback: [],
    });
  }

  setItem(config: AxiosRequestConfig, data: any, isSuccess: boolean) {
    const key = this.getCachedKey(config);

    const cache = this.cachedMap.get(key);

    if (cache) {
      if (isSuccess) {
        cache.data = data;
        cache.status = 'complete';
        for (let i = 0; i < cache.callback.length; i++) {
          cache.callback[i].resolve(data);
        }
        cache.callback = [];
      } else {
        for (let i = 0; i < cache.callback.length; i++) {
          cache.callback[i].reject(data);
        }
        cache.callback = [];
        this.cachedMap.delete(key);
      }
    }
  }

  clearItem(config: AxiosRequestConfig) {
    const key = this.getCachedKey(config);

    const cache = this.cachedMap.get(key);
    if (cache) {
      //  先判断一下是否有pending的情况
      //  不然会导致之前的promise一直被挂起
      if (cache.status === 'complete') {
        cache.callback = [];
        this.cachedMap.delete(key);
      }
    }
  }
}
