import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/guards/jwt-auth/public.decorator';

@ApiTags('用户相关')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
