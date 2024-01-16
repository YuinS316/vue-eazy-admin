<template>
  <div
    class="w-full h-48 flex items-center ez-border-b cursor-pointer"
    @click="handleClickLogo"
  >
    <img src="@/assets/images/logo.webp" class="h-full" />
    <span> Eazy Admin </span>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

function handleClickLogo() {
  router.push('/');
}
</script>

<style scoped></style>
