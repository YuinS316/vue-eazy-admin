import { Request } from '../request';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { NestResSuccess } from './types';
import { storageLoc } from '@/utils';

//  业务请求
function handleBusinessRequest(config: InternalAxiosRequestConfig) {
  //  启动时，此时pinia还没初始化，所以只能通过localStorage获取
  const token = storageLoc.pinia.auth.getItem<string>('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

//  处理业务错误响应码
function handleBusinessResponse(code: number, message: string) {
  // switch(code) {
  //   case 100001: {
  //    //  提醒他是否要重新登录
  //   }
  //   default: {
  //     window.$message.warning(message);
  //     break;
  //   }
  // }
  window.$message.warning(message);
}

//  处理后端主动抛出的401, 403等错误
function handleHttpException(statusCode: number, message: string) {
  window.$message.error(message);
}

//  针对nest-server的请求方法
export function createNestServerRequest() {
  const req = new Request({
    baseURL: '/api',
    interceptors: {
      requestInterceptors(config) {
        handleBusinessRequest(config);
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
          err.response.data?.message?.message ||
          '抱歉，出现未知错误，请通知管理员处理';
        handleHttpException(statusCode, message);
        return err;
      },
    },
  });
  return req;
}
