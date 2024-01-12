import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { isAxiosError } from 'axios';
import { mockGetFail, mockGetSuccess, mockRandom, server } from './mock/server';
import { Request } from '../request';

describe('Axios', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should return data normally', () => {
    mockGetSuccess();

    const fetch = new Request({
      baseURL: 'http://localhost',
    });
    const res = fetch.get('/api/abc');

    expect(res).to.resolves.toEqual({ data: 'abc' });
  });

  it('should return axiosError', () => {
    mockGetFail();

    const fetch = new Request({
      baseURL: 'http://localhost',
    });
    const res = fetch.get('/api/fail');

    expect(res).to.rejects.toSatisfy(isAxiosError);
  });

  describe('test interceptor', () => {
    it('should instance request interceptor work', async () => {
      const reqFn = vi.fn((config) => config);
      const resFn = vi.fn((res) => res);
      mockGetSuccess();

      const fetch = new Request({
        baseURL: 'http://localhost',
        interceptors: {
          requestInterceptors: reqFn,
          responseInterceptors: resFn,
        },
      });
      const res = await fetch.get('/api/abc');

      expect(res).toEqual({ data: 'abc' });
      expect(reqFn).toBeCalled();
      expect(resFn).toBeCalled();
    });

    it('should specified request interceptor work', async () => {
      const reqFn = vi.fn((config) => config);
      const resFn = vi.fn((res) => res);
      mockGetSuccess();

      const fetch = new Request({
        baseURL: 'http://localhost',
      });
      const res = await fetch.get(
        '/api/abc',
        {},
        {
          interceptors: {
            requestInterceptors: reqFn,
            responseInterceptors: resFn,
          },
        },
      );

      expect(res).toEqual({ data: 'abc' });
      expect(reqFn).toBeCalled();
      expect(resFn).toBeCalled();
    });
  });

  describe('test cache', () => {
    it('should cache work', async () => {
      mockRandom();

      const fetch = new Request({
        baseURL: 'http://localhost',
      });

      const res1 = fetch.get(
        '/api/random',
        {},
        {
          cache: true,
        },
      );

      const res2 = fetch.get(
        '/api/random',
        {},
        {
          cache: true,
        },
      );

      //  这个接口每次调用会返回不同的内容，比如abc0 -> abc1 -> abc2
      //  如果axios缓存生效，那么每次都只会返回同一个内容
      expect(res1).resolves.toEqual({ data: 'abc0' });
      expect(res2).resolves.toEqual({ data: 'abc0' });
    });

    it('should clearCache work', async () => {
      mockRandom();

      const fetch = new Request({
        baseURL: 'http://localhost',
      });

      const res1 = fetch.get(
        '/api/random',
        {},
        {
          cache: true,
        },
      );

      const res2 = fetch.get(
        '/api/random',
        {},
        {
          cache: true,
        },
      );

      const res3 = fetch.get(
        '/api/random',
        {},
        {
          clearCache: true,
        },
      );

      expect(res1).resolves.toEqual({ data: 'abc0' });
      expect(res2).resolves.toEqual({ data: 'abc0' });
      expect(res3).resolves.toEqual({ data: 'abc1' });
    });
  });
});
