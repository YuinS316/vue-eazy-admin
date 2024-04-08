import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoginReqDTO } from '@/modules/auth/dto/login.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { BusinessThrownService } from '@/modules/global/providers/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/constants/errCode.enum';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly thrownService: BusinessThrownService,
  ) {}
  async canActivate(context: ExecutionContext) {
    //  header中提取token
    const request = context.switchToHttp().getRequest();

    // 从请求体中获取用户名和密码
    const { userName, password } = request.body as LoginReqDTO;

    //  如果验证不通过就会抛出exception，所以这个user通过就会继续往下走
    const user = await this.validate(userName, password);

    const payload = await this.authService.buildReqUser(user);

    request['user'] = payload;

    return true;
  }

  async validate(userName: string, password: string) {
    const user = await this.authService.validateUser(userName, password);
    if (!user) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_VALID_FAIL);
      return;
    }

    return user;
  }
}
