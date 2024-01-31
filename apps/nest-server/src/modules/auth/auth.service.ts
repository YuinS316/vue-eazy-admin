import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from '@/types/auth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('REDIS')
    private redisClient: Redis,
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(payload: JwtPayload) {
    const token = this.generateJwtToken(payload);
    await this.setRedisToken(payload, token);
    return token;
  }

  async logout(payload: JwtPayload) {
    const redisKey = this.generateRedisKey(payload);
    return this.redisClient.del(redisKey);
  }

  /**
   * jwt生成token
   * @param payload
   * @returns
   */
  generateJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async setRedisToken(payload: JwtPayload, token: string) {
    const redisKey = this.generateRedisKey(payload);
    return this.redisClient.set(redisKey, token);
  }

  generateRedisKey(payload: JwtPayload) {
    return `${payload.id}/${payload.userName}`;
  }

  /**
   * 校验传入的用户信息与数据库是否匹配
   * @param userName
   * @param password
   * @returns
   */
  async validateUser(userName: string, userPassword: string) {
    const user = await this.userService.findUserByName(userName, true);
    if (user && compareSync(userPassword, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  buildReqUser(user: Omit<User, 'password'>): JwtPayload {
    const newUser: JwtPayload = {
      id: user.id,
      userName: user.userName,
      currentRoleCode: user.roles?.[0]?.code || '',
      roleCodeList: user.roles.map((role) => role.code),
    };

    return newUser;
  }
}
