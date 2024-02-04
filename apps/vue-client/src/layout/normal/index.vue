<template>
  <div class="wh-full flex">
    <aside class="h-full">
      <Sidebar></Sidebar>
    </aside>
    <main class="flex-1 h-full flex flex-col">
      <Header></Header>

      <div class="flex items-center space-x-8 pl-16 py-8">
        <div class="w-4 h-[50%] bg-[#18a058]"></div>
        <div class="text-18">{{ route.meta.title }}</div>
      </div>

      <div class="bg-[#f9f9f9] flex-1 overflow-hidden">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './sidebar.vue';
import Header from './header.vue';

const route = useRoute();
</script>

<style scoped></style>
