import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { omit } from 'radash';
import { compareSync } from 'bcryptjs';
import { UserService } from '@/modules/user/user.service';
import { UserSchema } from '@/schema';
import { JWTPayload } from '@typings/index';
import { ConfigService } from '@nestjs/config';
import {
  BUSINESS_ERROR_CODE,
  BUSINESS_ERROR_MESSAGE,
} from '@/constants/errCode.enum';

@Injectable()
export class AuthService {
  private tokenKeyPrefix = 'user_tokens:';

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async login(payload: JWTPayload) {
    const token = this.signJWT(payload);

    await this.saveTokenToRedis(token, payload);

    return token;
  }

  async saveTokenToRedis(
    token: string,
    payload: JWTPayload,
    expiredTime?: number,
  ) {
    const key = this.generateRedisKey(payload);

    const { ttl }: { ttl: string } = this.configService.get('REDIS_CONFIG');

    await this.redis.set(key, token);
    await this.redis.expire(key, expiredTime ?? ttl);
  }

  generateRedisKey(payload: JWTPayload) {
    return `${this.tokenKeyPrefix}${payload.id}-${payload.userName}`;
  }

  async queryRedisByPayload(payload: JWTPayload) {
    const key = this.generateRedisKey(payload);

    return this.redis.get(key);
  }

  async resetTokenInRedis() {
    const keys = await this.redis.keys(`${this.tokenKeyPrefix}*`);

    await Promise.all(keys.map((key) => this.redis.del(key)));
  }

  /**
   * 生成jwt的token
   * @param payload
   */
  signJWT(payload: JWTPayload) {
    return this.jwtService.sign(payload);
  }

  /**
   * 检验用户输入的账号和密码是否匹配
   * @param inputUserName
   * @param inputPassword
   */
  async validateUser(inputUserName: string, inputPassword: string) {
    const existUser = await this.userService.findUserByName(
      inputUserName,
      true,
    );

    if (!existUser) {
      return null;
    }

    const isValid = compareSync(inputPassword, existUser.password);

    if (!isValid) {
      return null;
    }

    return omit(existUser, ['password']);
  }

  async buildReqUser(user: Omit<UserSchema, 'password'>) {
    const payload: JWTPayload = {
      id: user.id,
      userName: user.userName,
    };

    return payload;
  }

  async validateJWTToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT').secret,
      });

      return {
        payload,
        msg: 'success',
        success: true,
      };
    } catch (e) {
      let msg: string;
      if (e.name === 'TokenExpiredError') {
        msg = BUSINESS_ERROR_MESSAGE[BUSINESS_ERROR_CODE.TOKEN_EXPIRED];
      } else {
        msg = BUSINESS_ERROR_MESSAGE[BUSINESS_ERROR_CODE.TOKEN_INVALID];
      }

      return {
        payload: null,
        success: false,
        msg,
      };
    }
  }
}
