<template>
  <n-config-provider
    class="w-full h-screen"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <router-view v-if="renderLayout" #default="{ Component, route: curRoute }">
      <component :is="renderLayout">
        <component :is="Component" :key="curRoute.fullPath"></component>
      </component>
    </router-view>
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';

//  缓存layout组件，防止重新加载导致页面闪烁
const layoutCacheMap = new Map();

function getLayout(name: string) {
  if (layoutCacheMap.has(name)) {
    return layoutCacheMap.get(name);
  }
  const layout = markRaw(
    defineAsyncComponent(() => import(`@/layout/${name}/index.vue`)),
  );
  layoutCacheMap.set(name, layout);
  return layout;
}

const route = useRoute();
const appStore = useAppStore();
const { layout } = storeToRefs(appStore);

const renderLayout = computed(() => {
  //  加载权限路由的时候可能匹配不到
  if (!route.matched?.length) {
    return null;
  }
  return getLayout(route.meta?.layout ?? layout.value);
});
</script>

<style scoped></style>
