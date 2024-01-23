import { Permission } from '@/modules/permission/entities/permission.entity';
import { Role } from '../entities/role.entity';
import { User } from '@/modules/users/entities/user.entity';

export const RoleProvider = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(User),
    inject: ['MYSQL'],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Role),
    inject: ['MYSQL'],
  },
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Permission),
    inject: ['MYSQL'],
  },
];
