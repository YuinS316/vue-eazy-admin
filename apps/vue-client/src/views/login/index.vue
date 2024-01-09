<template>
  <div class="wh-full bg-[url(@/assets/images/login_bg.webp)] bg-cover">
    <div class="f-c-c flex-col h-full">
      <div class="max-w-700 min-w-320 mx-24">
        <n-card
          :bordered="false"
          style="
            background-color: rgba(255, 255, 255, 0.5);
            box-shadow: var(--n-box-shadow);
          "
        >
          <div class="f-c-c">
            <div class="h-350 hidden md:block">
              <img src="@/assets/images/login_pic.webp" class="h-full" />
            </div>
            <div class="w-auto md:pl-48">
              <div class="mb-24 font-bold text-20">欢迎登录</div>
              <n-input
                class="mb-24"
                v-model:value="loginForm.userName"
                placeholder="请输入用户名"
                :clearable="true"
              ></n-input>
              <n-input
                class="mb-24"
                v-model:value="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :clearable="true"
              ></n-input>
              <div class="mb-24 flex items-center">
                <n-input
                  v-model:value="loginForm.captcha"
                  placeholder="请输入验证码"
                  :clearable="true"
                ></n-input>
                <Captcha ref="captchaRef" class="ml-8"></Captcha>
              </div>
              <div class="mb-16">
                <n-checkbox
                  v-model:checked="isRemember"
                  label="记住密码"
                ></n-checkbox>
              </div>
              <n-button type="primary" block class="mb-8" @click="login"
                >登录</n-button
              >
              <n-button block>注册</n-button>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import Captcha from './components/captcha.vue';
import authApi from '@/api/auth';

const { setToken, goLogin } = useAuthStore();

const loginForm = ref<{
  userName: string;
  password: string;
  captcha: string;
}>({
  userName: '',
  password: '',
  captcha: '',
});

//  是否记住密码
const isRemember = ref(true);

//  Captcha组件实例
const captchaRef = ref();

function login() {
  serverLogin();
}

async function serverLogin() {
  window.$message.loading('登录中, 请稍等', { key: 'login' });
  const token = await authApi.login(loginForm.value);
  if (token) {
    setToken(token);

    const duration = 3000;
    //  有个坑点，后续的onAfterLeave无法更改
    window.$message.success('登录成功, 3s后跳转至首页', {
      key: 'login',
      duration,
    });
    setTimeout(() => {
      goLogin();
    }, duration);
  } else {
    window.$message.destroy('login', 0);
    captchaRef.value?.getCaptchaUrl();
  }
}
</script>

<style scoped></style>
