<template>
  <div class="wh-full flex">
    <aside class="w-220 h-full">
      <Sidebar></Sidebar>
    </aside>
    <main class="flex-1 h-full flex flex-col">
      <Header></Header>

      <div class="bg-[#f9f9f9] flex-1 overflow-hidden">
        <n-scrollbar style="max-height: 100%">
          <slot></slot>
        </n-scrollbar>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './sidebar.vue';
import Header from './header.vue';
</script>

<style scoped></style>
