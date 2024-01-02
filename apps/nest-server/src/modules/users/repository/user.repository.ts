import { Role } from '@/modules/role/entities/role.entity';
import { User } from '../entities/user.entity';
import { Permission } from '@/modules/permission/entities/permission.entity';
import { Profile } from '../entities/profile.entity';

//  这边注册了的表才可以访问
export const UserProviders = [
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
  {
    provide: 'PROFILE_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Profile),
    inject: ['MYSQL'],
  },
];
