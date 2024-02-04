<template>
  <div
    class="w-full h-48 flex items-center ez-border-b cursor-pointer"
    @click="handleClickLogo"
  >
    <img src="@/assets/images/logo.webp" class="h-full" />
    <span v-show="!isCollapsed" class="flex flex-shrink-0 max-w-100">
      Eazy Admin
    </span>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const { isCollapsed } = storeToRefs(appStore);

const router = useRouter();

function handleClickLogo() {
  router.push('/');
}
</script>

<style scoped></style>
