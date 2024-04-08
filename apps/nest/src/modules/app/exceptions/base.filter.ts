import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response } from 'express';

//  用于捕获一些程序无法处理的错误，例如500
@Catch()
export class BaseFilter implements ExceptionFilter {
  private logger = new Logger(BaseFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    if (!host) {
      // 如果 host 参数为 undefined 或 null，则直接记录错误信息并返回
      this.logger.error('ArgumentsHost is undefined or null');
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(exception.message);

    response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
