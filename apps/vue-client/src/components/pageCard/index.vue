<template>
  <div class="p-16 overflow-hidden h-full overflow-hidden">
    <n-card
      style="height: 100%"
      content-class="h-full overflow-hidden"
      size="small"
    >
      <n-scrollbar style="max-height: 100%">
        <slot></slot>
      </n-scrollbar>
    </n-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
