import { Permission } from '@/modules/permission/entities/permission.entity';

//  这边注册了的表才可以访问
export const PermissionProviders = [
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Permission),
    inject: ['MYSQL'],
  },
];
