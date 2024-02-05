import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { InstanceConfig, RequestConfig } from './types';
import { Cached } from './cached';

export class Request {
  public instance: AxiosInstance;
  public config: InstanceConfig;
  public cachedMap: Cached;

  constructor(config: InstanceConfig) {
    this.config = config;
    //  缓存表
    this.cachedMap = new Cached();
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  //  初始化实例拦截器
  setupInterceptors() {
    //  请求拦截
    this.instance.interceptors.request.use(
      this.config.interceptors?.requestInterceptors,
      this.config.interceptors?.requestInterceptorsCatch,
    );

    //  响应拦截
    this.instance.interceptors.response.use(
      this.config.interceptors?.responseInterceptors,
      this.config.interceptors?.responseInterceptorsCatch,
    );

    //  全局拦截，主要是解构掉axios默认返回的data
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => res.data,
      (err: any) => {
        // if (isAxiosError(err))
        //   return err;
        return Promise.reject(err);
      },
    );
  }

  request<T>(config: RequestConfig<T>): Promise<T> {
    if (config.interceptors?.requestInterceptors)
      config = config.interceptors.requestInterceptors(config as any);

    return new Promise((resolve, reject) => {
      //  判断是否开启了缓存
      if (config?.cache) {
        const cacheData = this.cachedMap.getItem(config);

        //  cacheData存在，说明已经正在pending
        if (cacheData !== undefined) {
          try {
            return resolve(cacheData);
          } catch (e) {
            return reject(e);
          }
        }
      }

      //  擦除缓存
      if (config?.clearCache) {
        this.cachedMap.clearItem(config);
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptors)
            res = config.interceptors.responseInterceptors(res);

          if (config?.cache) {
            this.cachedMap.setItem(config, res, true);
          }

          if (config?.clearCache) {
            this.cachedMap.clearItem(config);
          }

          resolve(res);
        })
        .catch((err: any) => {
          if (config?.cache) {
            this.cachedMap.setItem(config, err, false);
          }

          reject(err);
        });
    });
  }

  get<T>(
    url: string,
    params?: Record<string, string>,
    config?: RequestConfig<T>,
  ): Promise<T> {
    return this.request<T>({
      url,
      params,
      method: 'get',
      ...config,
    });
  }

  post<T>(
    url: string,
    data?: Record<string, any>,
    config?: RequestConfig<T>,
  ): Promise<T> {
    return this.request<T>({
      url,
      data,
      method: 'post',
      ...config,
    });
  }

  delete<T>(
    url: string,
    params?: Record<string, any>,
    config?: RequestConfig<T>,
  ): Promise<T> {
    return this.request<T>({
      url,
      params,
      method: 'delete',
      ...config,
    });
  }
}
