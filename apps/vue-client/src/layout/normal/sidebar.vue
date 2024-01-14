<template>
  <div
    class="wh-full border border-solid border-ezGrey border-t-0 flex flex-col"
  >
    <Logo></Logo>
    <SideMenu class="flex-1"></SideMenu>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/layout/components/logo.vue';
import SideMenu from '@/layout/components/sideMenu.vue';
</script>

<style scoped></style>
