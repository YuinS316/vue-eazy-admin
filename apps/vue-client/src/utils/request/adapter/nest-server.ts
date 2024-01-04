import { Request } from '../request';
import type { AxiosResponse } from 'axios';
import { NestResSuccess } from './types';

//  处理业务错误响应码
function handleBusinessResponse(code: number, message: string) {
  // switch(code) {
  //   case 100003: {
  //     window.
  //     break;
  //   }
  //   default: {
  //     window.$message.info(message);
  //     break;
  //   }
  // }

  window.$message.warning(message);
}

//  处理后端主动抛出的401, 403等错误
function handleHttpException(statusCode: number, message: string) {
  // switch (statusCode) {
  //   case 401:
  //   case 403: {
  //     window.$message.error('抱歉，您暂无权限访问');
  //     break;
  //   }
  //   default: {
  //     window.$message.error(message);
  //     break;
  //   }
  // }
  window.$message.error(message);
}

//  针对nest-server的请求方法
export function createNestServerRequest() {
  const req = new Request({
    baseURL: '/api',
    interceptors: {
      requestInterceptors(config) {
        return config;
      },
      responseInterceptors(res) {
        const data = res.data as NestResSuccess;

        const successCode = 0;
        if (data.code !== successCode) {
          handleBusinessResponse(data.code, data.message);
        }

        return data as unknown as AxiosResponse;
      },
      responseInterceptorsCatch(err) {
        const statusCode = err.response.data?.statusCode || 500;
        const message =
          err.response.data?.message || '抱歉，出现未知错误，请通知管理员处理';
        handleHttpException(statusCode, message);
        return err;
      },
    },
  });
  return req;
}
