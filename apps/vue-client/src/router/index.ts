import type { App } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { routeMap } from '@/constants';
import { setupRouterGuards } from './guards';

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

export function setupRouter(app: App) {
  app.use(router);
  setupRouterGuards(router);
}
