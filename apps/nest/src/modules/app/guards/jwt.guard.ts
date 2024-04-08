import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessThrownService } from '@/modules/global/providers/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/constants/errCode.enum';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private thrownService: BusinessThrownService,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    //  没有token，提示用户没有登陆
    if (!token) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_NO_LOGIN);
      return;
    }

    //  有token，但是jwt到期或者校验失败
    const { payload, success, msg } = await this.authService.validateJWTToken(
      token,
    );
    if (!success) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_EXPIRED, msg);
      return;
    }

    //  校验token在redis中是否到期
    const isExist = await this.authService.queryRedisByPayload(payload);
    if (!isExist) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_EXPIRED);
      return;
    }

    //  如果token还合法，延长token的过期时间
    await this.authService.saveTokenToRedis(token, payload);

    request['user'] = payload;

    return true;
  }

  //  从header中提取token
  public extractTokenFromHeader(request: Request): string | undefined {
    const authorization =
      request.headers.authorization || request.headers.Authorization || '';
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
