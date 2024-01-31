<template>
  <Modal ref="modalRef" :title="'切换角色'" width="360px">
    <div>
      <n-radio-group v-model:value="selectedRole" class="w-full">
        <n-space vertical :size="24" class="mx-12">
          <n-radio-button
            class="w-full h-36 text-center leading-36 text-16"
            v-for="role in user?.roles"
            :key="role.code"
            :value="role.code"
            :label="role.name"
          />
        </n-space>
      </n-radio-group>
    </div>

    <template #footer>
      <div class="f-c-c">
        <n-button class="mr-16">退出登录</n-button>
        <n-button
          type="primary"
          :disabled="selectedRole === user?.currentRole.code"
          @click="handleSwitchRole"
          :loading="loading"
          >确认切换</n-button
        >
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/modal/index.vue';
import { useModal } from '@/composables';
import { useAuthStore } from '@/store/modules/auth';
import authApi from '@/api/auth/index';
import { initUserPermission } from '@/router';

const authStore = useAuthStore();
const { setToken } = authStore;
const { user } = storeToRefs(authStore);

const selectedRole = ref(user.value?.currentRole.code);

const [modalRef] = useModal();

const loading = ref(false);
async function handleSwitchRole() {
  loading.value = true;
  window.$message.loading('正在切换角色中请稍后', { key: 'loading' });
  try {
    if (selectedRole.value) {
      const token = await authApi.switchRole(selectedRole.value);
      //  重新设置token
      setToken(token);

      //  重新获取权限
      initUserPermission();

      //  提示他切换成功
      const duration = 300;
      window.$message.success('切换角色成功', {
        key: 'loading',
        duration,
        onAfterLeave() {
          modalRef.value?.close();
        },
      });
    }
  } catch (error) {
    console.error('切换失败', error);
  } finally {
    loading.value = false;
  }
}

defineExpose({
  open() {
    modalRef.value?.open();
  },
});
</script>

<style scoped></style>
