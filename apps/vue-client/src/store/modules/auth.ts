import { routeMap } from '@/constants';
import { router } from '@/router';
import { storageLocal } from '@/utils';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref('');

    function setToken(value: string) {
      token.value = value;
    }

    function goLogin() {
      router.replace({
        path: routeMap.home,
      });
    }

    return {
      token,
      setToken,
      goLogin,
    };
  },
  {
    persist: {
      key: storageLocal.getKey('auth'),
    },
  },
);
