import { routeMap } from '@/constants';
import { router } from '@/router';
import { storageLoc } from './storage';
import { useAuthStore } from '@/store/modules/auth';

//* ================= 重定向 =================

/**
 * 重定向到首页
 */
export function goHome() {
  router.replace({
    path: routeMap.home,
  });
}

/**
 * 重定向到登录页
 */
export function goLogin() {
  router.replace({
    path: routeMap.login,
  });
}

//* ================= token =================

/**
 * 清空local和pinia的token
 */
export function clearToken() {
  storageLoc.pinia.auth.removeItem('token');
  const { setToken } = useAuthStore();
  setToken('');
}

/**
 * 获取token
 * @returns
 */
export function getToken() {
  const token = storageLoc.pinia.auth.getItem<string>('token');
  return token;
}
