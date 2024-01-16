import { Permission } from '@/modules/permission/entities/permission.entity';
import { Role } from '../entities/role.entity';

export const RoleProvider = [
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
