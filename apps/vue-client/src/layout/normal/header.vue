<template>
  <div class="h-48 ez-border-b px-12 flex flex-shrink-0">
    <div class="cursor-pointer f-c-c" @click="handleClickCollapse">
      <n-icon size="18">
        <Indent v-if="isCollapsed"></Indent>
        <Outdent v-else></Outdent>
      </n-icon>
    </div>

    <!-- 缓存页面 -->
    <div class="flex-1 mx-8"></div>

    <div class="bg-ezGrey h-[60%] w-1 mt-auto mb-auto mx-8"></div>

    <div class="cursor-pointer f-c-c">
      <n-icon size="18">
        <Github></Github>
      </n-icon>
    </div>

    <div class="bg-ezGrey h-[60%] w-1 mt-auto mb-auto mx-8"></div>

    <UserAvatar></UserAvatar>

    <div></div>
  </div>
</template>

<script setup lang="ts">
import { Indent, Outdent, Github } from '@vicons/fa';
import { useAppStore } from '@/store/modules/app';
import UserAvatar from '../components/userAvatar.vue';

const appStore = useAppStore();
const { setCollapsed } = appStore;
const { isCollapsed } = storeToRefs(appStore);

function handleClickCollapse() {
  setCollapsed(!isCollapsed.value);
}
</script>

<style scoped></style>
