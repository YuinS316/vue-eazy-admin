import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UserService } from '@/modules/user/user.service';
import { LoginReqDTO } from '@/modules/auth/dto/login.dto';
import { LoginGuard } from '@/modules/auth/login.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }

  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req['user']);
  }
}
