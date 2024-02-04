<template>
  <div
    class="h-full transition-width border border-solid border-ezGrey border-t-0 flex flex-col"
    :class="isCollapsed ? 'w-64' : 'w-220'"
  >
    <Logo></Logo>
    <SideMenu class="flex-1"></SideMenu>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/layout/components/logo.vue';
import SideMenu from '@/layout/components/sideMenu.vue';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const { isCollapsed } = storeToRefs(appStore);
</script>

<style scoped></style>
