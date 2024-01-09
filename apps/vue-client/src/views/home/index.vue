<template>
  <div>home</div>
</template>

<script setup lang="ts">
window.$message.loading('加载中', {
  key: 'login',
  duration: 1000,
  onAfterLeave() {
    console.log('after1');
  },
});
setTimeout(() => {
  window.$message.success('加载完成', {
    key: 'login',
    duration: 1000,
    onAfterLeave() {
      console.log('after2');
    },
  });
}, 500);
</script>

<style scoped></style>
