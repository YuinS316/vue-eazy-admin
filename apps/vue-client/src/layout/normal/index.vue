<template>
  <div class="wh-full flex">
    <aside class="w-220 h-full">
      <Sidebar></Sidebar>
    </aside>
    <main class="flex-1 h-full flex flex-col">
      <div class="h-48 ez-border-b px-12 flex-shrink-0">
        <div class="inline-block cursor-pointer" @click="handleClickCollapse">
          <n-icon size="18">
            <SlidersH></SlidersH>
          </n-icon>
        </div>
      </div>

      <div class="bg-[#f9f9f9] flex-1 overflow-hidden">
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
