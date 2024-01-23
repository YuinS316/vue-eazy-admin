import type { App } from 'vue';
import { to } from 'await-to-js';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import roleApi from '@/api/role';
import { routeMap } from '@/constants';
import { setupRouterGuards } from './guards';
import { Permission } from '@/api/role/model';
import { usePermissionStore } from '@/store/modules/permission';

export const basicRoutes: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: routeMap.login,
    component: () => import('@/views/login/index.vue'),
    meta: {
      layout: 'empty',
    },
  },
  {
    name: 'Home',
    path: routeMap.home,
    component: () => import('@/views/home/index.vue'),
  },
  {
    name: '404',
    path: routeMap.noPath,
    component: () => import('@/views/error/404.vue'),
    meta: {
      layout: 'empty',
    },
  },
  {
    name: '403',
    path: routeMap.noAuth,
    component: () => import('@/views/error/404.vue'),
    meta: {
      layout: 'empty',
    },
  },
];

export const router = createRouter({
  history: createWebHistory('/'),
  routes: basicRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export async function setupRouter(app: App) {
  const [err] = await to(initUserPermission());

  if (err) {
    window.$message.error('初始化角色权限路由失败');
    console.error(`初始化角色权限路由失败--`, err);
  }

  app.use(router);
  setupRouterGuards(router);
}

async function initUserPermission() {
  const res = await roleApi.getRoleByCode('superAdmin');

  const { setupMenuTree } = usePermissionStore();

  if (res) {
    const { permissions } = res;

    setupMenuTree(permissions);

    setupRoutes(permissions);
  }
}

async function setupRoutes(permissions: Permission[]) {
  const routeComponents = import.meta.glob('@/views/**/*.vue');
  const result = permissions
    .filter((item) => item.path && item.component)
    .map((item) => buildRouteItem(item));

  result.forEach((item) => {
    const route: RouteRecordRaw = {
      ...(item as any),
      component: routeComponents[item.component!] as any,
    };

    if (!router.hasRoute(route.name!)) {
      router.addRoute(route);
    }
  });

  return;
}

/**
 * 构建路由
 * @param permission
 * @returns
 */
function buildRouteItem(permission: Permission) {
  const { code, path, redirect, component, icon, name, layout, keepAlive } =
    permission;

  const routeItem = {
    name: code,
    path,
    redirect,
    component,
    meta: {
      icon,
      title: name,
      layout,
      keepAlive: !!keepAlive,
    },
  };

  return routeItem;
}
