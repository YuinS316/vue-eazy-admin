// nest-server 正确响应的结构体
export interface NestResSuccess {
  data: any;
  code: number;
  extra: {};
  message: string;
  success: boolean;
}

//  nest-server 错误响应的结构体
export interface NestResFail {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}
