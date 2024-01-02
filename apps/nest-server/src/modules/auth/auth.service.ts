import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { LoginReqDTO, RegisterReqDTO } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('REDIS')
    private redisClient: Redis,
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  register(body: RegisterReqDTO) {}

  login(body: LoginReqDTO) {}

  async validateUser(userName: string, password: string) {
    const user = await this.userService.findUserByName(userName);
    if (user && compareSync(password, user.password)) {
      const { password: pass, ...result } = user;
      return result;
    }

    return null;
  }
}
