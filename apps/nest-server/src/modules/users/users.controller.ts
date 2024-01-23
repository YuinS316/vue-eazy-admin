import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/guards/jwt-auth/public.decorator';

@ApiTags('用户相关')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('getUserByName')
  @Public()
  async getUserById(@Query('name') name: string) {
    return await this.usersService.findUserByName(name);
  }
}
