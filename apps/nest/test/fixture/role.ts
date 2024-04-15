import { PermissionType } from '@typings/permission';

export const createPermission = (code?: string) => {
  const type: PermissionType = 'menu';
  return {
    type,
    code: code ?? 'test_menu',
    name: '测试',
    createdBy: 'admin',
    updatedBy: 'admin',
    path: '/profile',
    component: '@/views/profile/index.vue',
    layout: 'normal',
    keepAlive: true,
    show: true,
    order: 0,
  };
};

export const createRole = (code?: string, permissionIdList?: number[]) => {
  return {
    code: code ?? 'test_code',
    name: '测试',
    createdBy: 'admin',
    updatedBy: 'admin',
    permissionIdList: permissionIdList ?? [],
  };
};
