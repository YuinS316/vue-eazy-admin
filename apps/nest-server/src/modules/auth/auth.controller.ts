import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/guards/jwt-auth/public.decorator';
import { RegisterReqDTO } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LocalGuard } from '@/common/guards/local/local.guard';

@ApiTags('登录授权相关')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: '用户注册' })
  @Public()
  @Post('register')
  async create(@Body() user: RegisterReqDTO) {
    return await this.userService.createUser(user);
  }

  @ApiOperation({ summary: '用户登录' })
  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Request() req) {
    // return this.authService.login(loginBody);
    return req.user;
  }

  @Get('testNoToken')
  testNoToken() {
    return 'test';
  }

  @Get('testPublic')
  @Public()
  testPublic() {
    return 'succcess';
  }
}
