import { LoginForm } from '@/typings/login';
import { storageLocal } from '@/utils';

/**
 * 从缓存中获取记住密码的用户信息
 * @param loginForm
 * @returns
 */
export function useLoginInfo(loginForm: Ref<LoginForm>) {
  const loginInfoKey = 'loginInfo';
  function loadLoginInfo() {
    const info = storageLocal.getItem(loginInfoKey) as {
      userName: string;
      password: string;
    } | null;
    if (info) {
      loginForm.value.userName = info.userName;
      loginForm.value.password = info.password;
    }
  }

  function saveLoginInfo() {
    storageLocal.setItem(loginInfoKey, {
      userName: loginForm.value.userName,
      password: loginForm.value.password,
    });
  }

  onMounted(() => {
    loadLoginInfo();
  });

  return {
    loadLoginInfo,
    saveLoginInfo,
  };
}
