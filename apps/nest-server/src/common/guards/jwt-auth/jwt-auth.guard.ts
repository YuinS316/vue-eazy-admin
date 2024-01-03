import {
  ExecutionContext,
  Injectable,
  CanActivate,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import Redis from 'ioredis';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private thrownService: BusinessThrownService,
    @Inject('REDIS')
    private redisClient: Redis,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果标记为公开路由，则不进行JWT认证拦截
    if (isPublic) {
      return true;
    }

    //  header中提取token
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.thrownService.throwNoLogin();
    }

    //  校验token与redis是否匹配
    const payload = await this.validateTokenMatch(token);

    //  延长redis中token的持续时间
    await this.extendTokenDuration(payload, token);

    request['user'] = payload;

    return true;
  }

  //  校验token与redis的记录是否匹配
  private async validateTokenMatch(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT').secret,
      });

      //  校验跟redis中存的的token是否符合
      const redisKey = this.authService.generateRedisKey(payload);
      const exsistToken = await this.redisClient.get(redisKey);
      if (token !== exsistToken) {
        await this.redisClient.del(redisKey);
        this.thrownService.throwTokenFail();
      }

      return payload;
    } catch (e) {
      //  这种情况是jwt过期了，而不是redis过期，所以此时无法获取payload
      //  等redis那边自动过期回收掉即可，或者用户再次登录覆盖掉redis那边的记录

      this.thrownService.throwTokenFail();
    }
  }

  //  延长redis中对应token的持续时间
  async extendTokenDuration(payload: any, token: string) {
    const redisKey = this.authService.generateRedisKey(payload);
    await this.redisClient.set(redisKey, token);
  }

  //  从header中提取token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as { authorization?: string }).authorization?.split(
        ' ',
      ) ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
