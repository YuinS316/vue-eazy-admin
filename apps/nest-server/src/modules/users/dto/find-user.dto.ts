import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { User } from '../entities/user.entity';
import { Role } from '@/modules/role/entities/role.entity';

export class GetUserDetailResDTO extends PickType(User, [
  'id',
  'userName',
  'enable',
  'profile',
  'roles',
] as const) {
  currentRole: Role;
}
