import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Req,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/guards/jwt-auth/public.decorator';
import { LoginReqDTO, RegisterReqDTO } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LocalGuard } from '@/common/guards/local/local.guard';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';

@ApiTags('登录授权相关')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly thrownService: BusinessThrownService,
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
  login(@Request() req, @Body() body: LoginReqDTO) {
    //  校验验证码是否正确
    if (req.session?.code?.toLocaleLowerCase() !== body.captcha.toLowerCase()) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.CAPTCHA_FAIL);
    }

    return this.authService.login(req.user);

    // return req.user;
  }

  @ApiOperation({ summary: '退出登录' })
  @Get('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  @ApiOperation({ summary: '生成验证码' })
  @Public()
  @Get('captcha')
  createCaptcha(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 40,
      width: 80,
      height: 40,
      background: '#fff',
      color: true,
    });

    req.session.code = captcha.text || '';
    res.type('image/svg+xml');
    res.send(captcha.data);
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

  @Get('testFail')
  @Public()
  testFail() {
    throw new HttpException(
      'You do not have permission to access this resource',
      HttpStatus.FORBIDDEN,
    );
  }
}
