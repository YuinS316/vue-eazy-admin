import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from '@/types/auth';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('REDIS')
    private redisClient: Redis,
    private jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly userService: UsersService,
    @Inject(BusinessThrownService)
    private thrownService: BusinessThrownService,
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

  async switchRole(payload: JwtPayload, roleCode: string) {
    const user = await this.userService.findUserByName(payload.userName);
    if (!user) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_NOT_EXIST);
      return;
    }

    const currentRole = await this.roleService.getRoleByCode(roleCode);
    if (!currentRole) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    const newUser = this.buildReqUser(user, currentRole.code);
    const token = await this.login(newUser);

    return token;
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

  buildReqUser(
    user: Omit<User, 'password'>,
    currentRoleCode?: string,
  ): JwtPayload {
    const newUser: JwtPayload = {
      id: user.id,
      userName: user.userName,
      currentRoleCode: currentRoleCode ?? (user.roles?.[0]?.code || ''),
      roleCodeList: user.roles.map((role) => role.code),
    };

    return newUser;
  }
}
