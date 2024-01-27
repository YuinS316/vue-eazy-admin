import { Controller, Get, ParseIntPipe, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/guards/jwt-auth/public.decorator';
import { JwtPayload } from '@/types/auth';

@ApiTags('用户相关')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('getUserDetail')
  async getUserDetail(@Req() req) {
    const payload: JwtPayload = req['user'];

    const result = await this.usersService.getUserDetail(payload);
    return result;
  }

  @Get('getUserByName')
  @Public()
  async getUserById(@Query('name') name: string) {
    return await this.usersService.findUserByName(name);
  }
}
