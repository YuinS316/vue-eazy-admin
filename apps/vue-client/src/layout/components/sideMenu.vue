<template>
  <div class="h-full">
    <n-menu
      ref="menuRef"
      :options="menuTree"
      accordion
      :indent="18"
      :collapsed="isCollapsed"
      :collapsed-icon-size="22"
      :collapsed-width="64"
      :value="activeKey"
      @update-value="handleClickMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';
const permissionStore = usePermissionStore();
const { menuTree } = storeToRefs(permissionStore);

const appStore = useAppStore();
const { isCollapsed } = storeToRefs(appStore);

const menuRef = ref();
const router = useRouter();
const route = useRoute();

const activeKey = computed(() => route.name! as string);

watch(
  () => route.path,
  () => {
    menuRef.value?.showOption();
  },
);

function handleClickMenu(_: string, item: any) {
  if (item.path) {
    router.push(item.path);
  }
}
</script>

<style scoped></style>
