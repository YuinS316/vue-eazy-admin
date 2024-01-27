import { Router } from 'vue-router';
import { routeMap } from '@/constants';
import { useAuthStore } from '@/store/modules/auth';

//  路由白名单
const whiteList = [routeMap.login, routeMap.noAuth, routeMap.noPath];

/**
 * 权限相关的路由守卫
 * @param router
 */
export function setupPermissionGuard(router: Router) {
  router.beforeEach((to) => {
    const { isLogin } = useAuthStore();

    //  没有token的情况，请去登录吧
    if (!isLogin()) {
      //  白名单就不用管了
      const isInWhiteList = whiteList.includes(to.path);
      if (isInWhiteList) {
        return true;
      }
      return {
        path: routeMap.login,
      };
    }

    //  如果已经登陆的情况再访问login，就重定向到首页
    if (to.path === routeMap.login) {
      return {
        path: routeMap.home,
      };
    }

    //  如果没找到routes的情况下，重定向到404
    const isRouteDefined = router
      .getRoutes()
      .find((route) => route.name === to.name);

    if (isRouteDefined) {
      return true;
    }

    return {
      path: routeMap.noPath,
    };
  });
}
