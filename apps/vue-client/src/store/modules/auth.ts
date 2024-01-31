import { GetUserDetailResDTO } from '@/api/user/model';
import { routeMap } from '@/constants';
import { router } from '@/router';
import { storageLoc } from '@/utils';

export const useAuthStore = defineStore(
  'auth',
  () => {
    //  ===== token ======
    const token = ref<Nullable<string>>('');

    function isLogin() {
      return token.value !== null && token.value !== '';
    }

    function setToken(value: string) {
      token.value = value;
    }

    //  ===== user =====
    const user = ref<GetUserDetailResDTO | null>(null);

    function setUser(value: any) {
      user.value = value;
    }

    //  ===== utils =====

    return {
      isLogin,
      token,
      setToken,
      user,
      setUser,
    };
  },
  {
    persist: {
      storage: storageLoc.pinia.auth,
      cacheKey: {
        token: true,
      },
    },
  },
);
