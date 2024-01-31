<template>
  <n-dropdown
    trigger="hover"
    :options="options"
    :show-arrow="false"
    @select="handleSelect"
  >
    <div class="f-c-c ml-12 cursor-pointer">
      <n-image
        width="32"
        :src="avatarUrl"
        style="border-radius: 50%"
        :preview-disabled="true"
      ></n-image>

      <div class="ml-12">
        <div class="line-height-[1] mb-4 text-center">
          {{ user?.userName }}
        </div>
        <div class="text-12 text-gray line-height-[1]">
          [{{ user?.currentRole?.name }}]
        </div>
      </div>
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';
import { UserCircle, ExchangeAlt, SignOutAlt } from '@vicons/fa';
import { NIcon } from 'naive-ui';
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import authApi from '@/api/auth';
import { clearToken, goLogin } from '@/utils';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const permissionStore = usePermissionStore();
const { permissionList } = storeToRefs(permissionStore);

const router = useRouter();

const defaultUrl = `https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg`;

const avatarUrl = computed(() => user.value?.profile?.avatarUrl || defaultUrl);

function renderIcon(icon: Component, props = {}) {
  return () => {
    return h(NIcon, props, {
      default: () => h(icon),
    });
  };
}

//  查询出个人资料的权限
const profilePermission = computed(() =>
  permissionList.value.find((item) => item.code === 'userProfile'),
);

//  是否有多个角色
const hasMultipleRoles = computed(() =>
  user.value !== null ? user.value.roles.length > 1 : false,
);

const options = ref<DropdownMixedOption[]>([
  {
    label: '个人资料',
    key: 'profile',
    icon: renderIcon(UserCircle),
    show: profilePermission.value !== undefined,
  },
  {
    label: '切换权限',
    key: 'switchRole',
    icon: renderIcon(ExchangeAlt),
    show: hasMultipleRoles.value,
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(SignOutAlt),
  },
]);

async function handleSelect(key: string) {
  switch (key) {
    case 'profile': {
      router.push({
        path: profilePermission.value!.path!,
      });
      break;
    }

    case 'switchRole': {
      break;
    }

    case 'logout': {
      await authApi.logout();
      clearToken();
      goLogin();
      break;
    }

    default: {
      break;
    }
  }
}
</script>

<style scoped></style>
