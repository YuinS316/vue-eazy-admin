import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import { AuthService } from '@/modules/auth/auth.service';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';

@Injectable()
export class LocalGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authSerevice: AuthService,
    private readonly thrownService: BusinessThrownService,
  ) {}

  async canActivate(context: ExecutionContext) {
    //  header中提取token
    const request = context.switchToHttp().getRequest();

    // 从请求体中获取用户名和密码
    const { userName, password } = request.body;

    // 调用 validate 方法
    const user = await this.validate(userName, password);

    request['user'] = this.authSerevice.buildReqUser(user);

    return !!user;
  }

  async validate(userName: string, password: string): Promise<any> {
    const user = await this.authSerevice.validateUser(userName, password);
    if (!user) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_VALID_FAIL);
    }
    return user;
  }
}
