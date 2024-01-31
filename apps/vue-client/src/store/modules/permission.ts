import { Permission } from '@/api/role/model';
import { MenuItem } from '@/typings/permission';
import { isArray } from '@/utils';
import { NIcon } from 'naive-ui';
import * as IconMap from '@vicons/fa';

export const usePermissionStore = defineStore('permission', () => {
  const menuTree = ref<MenuItem[]>([]);
  const permissionList = ref<Permission[]>([]);

  const iconOptions = Object.keys(IconMap) as (keyof typeof IconMap)[];

  function setPermissions(permissions: Permission[]) {
    permissionList.value = permissions;
  }

  function setupMenuTree(permissions: Permission[]) {
    const permissionTree = buildPermissionTree(permissions);
    menuTree.value = buildMenuTree(permissionTree);
  }

  /**
   * 构建树形权限树
   * @param permissions
   * @returns
   */
  function buildPermissionTree(permissions: Permission[]) {
    const idToRouteMap: Record<number, Permission> = {};

    permissions.forEach((item) => {
      idToRouteMap[item.id] = item;
    });

    permissions.forEach((item) => {
      if (item.parentId) {
        const parent = idToRouteMap[item.parentId];
        if (!isArray(parent.children)) {
          parent.children = [];
        }
        parent.children.push(item);
      }
    });

    const tree = permissions.filter((item) => item.parentId === null);

    return tree;
  }

  function buildMenuTree(permissionTree: Permission[]) {
    const result = permissionTree.map((item) => buildMenuItem(item));

    return result;
  }

  function buildMenuItem(permission: Permission) {
    const menu: MenuItem = {
      label: permission.name,
      key: permission.code,
      path: permission.path,
      order: permission.order ?? 0,
      icon: () =>
        h(NIcon, null, {
          default: () =>
            h(IconMap[(permission.icon || 'Th') as keyof typeof IconMap]),
        }),
      children: [],
    };
    const children = buildMenuTree(permission.children || []);
    children.sort((a, b) => a.order - b.order);
    menu.children = children;
    if (!menu.children?.length) {
      delete menu.children;
    }
    return menu;
  }

  return {
    menuTree,
    setupMenuTree,
    iconOptions,
    permissionList,
    setPermissions,
  };
});
