<template>
  <div>
    <n-spin size="small" :show="loading">
      <div class="w-68 h-34 ez-border">
        <img
          v-if="captchaUrl"
          :src="captchaUrl"
          alt="验证码"
          class="h-full cursor-pointer"
          @click="getCaptchaUrl"
        />
        <div v-else class="wh-full"></div>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
const captchaUrl = ref('');
const loading = ref(true);

function getCaptchaUrl() {
  loading.value = true;
  const img = new Image();
  const url = `/api/auth/captcha?timestamp=${new Date().getTime()}`;
  img.src = url;
  img.onload = function () {
    loading.value = false;
    captchaUrl.value = url;
  };
}

getCaptchaUrl();

defineExpose({
  getCaptchaUrl,
});
</script>

<style scoped></style>
