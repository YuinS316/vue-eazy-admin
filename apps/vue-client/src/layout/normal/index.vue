<template>
  <div class="wh-full flex">
    <aside class="w-220 h-full">
      <Sidebar></Sidebar>
    </aside>
    <main class="flex-1 h-full">
      <div class="h-48 ez-border-b px-12">
        <n-icon size="18" @click="handleClickCollapse">
          <SlidersH></SlidersH>
        </n-icon>
      </div>

      <div class="bg-[#f9f9f9] h-[calc(100%-48px)]">
        <n-scrollbar style="max-height: 100%">
          <slot></slot>
        </n-scrollbar>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { SlidersH } from '@vicons/fa';
import Sidebar from './sidebar.vue';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const { setCollapsed } = appStore;
const { isCollapsed } = storeToRefs(appStore);

function handleClickCollapse() {
  setCollapsed(!isCollapsed.value);
}
</script>

<style scoped></style>
