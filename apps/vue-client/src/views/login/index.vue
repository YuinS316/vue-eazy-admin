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
              >
                <template #prefix>
                  <n-icon :component="User" :depth="2" class="pr-8"></n-icon>
                </template>
              </n-input>
              <n-input
                class="mb-24"
                v-model:value="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :clearable="true"
              >
                <template #prefix>
                  <n-icon :component="Lock" :depth="2" class="pr-4"></n-icon>
                </template>
              </n-input>
              <div class="mb-24 flex items-center">
                <n-input
                  v-model:value="loginForm.captcha"
                  placeholder="请输入验证码"
                  :clearable="true"
                >
                  <template #prefix>
                    <n-icon
                      :component="Fingerprint"
                      :depth="2"
                      class="pr-4"
                    ></n-icon>
                  </template>
                </n-input>
                <Captcha ref="captchaRef" class="ml-8"></Captcha>
              </div>
              <div class="mb-16">
                <n-checkbox
                  v-model:checked="isRemember"
                  label="记住密码"
                ></n-checkbox>
              </div>
              <n-button
                type="primary"
                block
                class="mb-8"
                @click="login"
                :disabled="isLock"
                >登录</n-button
              >
              <!-- <n-button :disabled="isLock" block>注册</n-button> -->
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock, Fingerprint } from '@vicons/fa';
import { useAuthStore } from '@/store/modules/auth';
import Captcha from './components/captcha.vue';
import authApi from '@/api/auth';
import { LoginForm } from '@/typings/login';
import { useLoginInfo } from './hooks';
import { initUserPermission } from '@/router';
import { goHome } from '@/utils';

const { setToken } = useAuthStore();

// setToken('234234');

const loginForm = ref<LoginForm>({
  userName: '',
  password: '',
  captcha: '',
});

//  是否记住密码
const isRemember = ref(true);

//  登录中或者注册中禁止操作
const isLock = ref(false);

//  Captcha组件实例
const captchaRef = ref();

//  从缓存中获取记住密码的用户信息
const { saveLoginInfo } = useLoginInfo(loginForm);

function login() {
  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  serverLogin();
}

//  校验输入的值是否符合
function validateForm() {
  const validList: Array<{
    field: keyof LoginForm;
    tips: string;
  }> = [
    { field: 'userName', tips: '用户名不能为空' },
    { field: 'password', tips: '密码不能为空' },
    { field: 'captcha', tips: '验证码不能为空' },
  ];

  let isSuccess = true;

  validList.forEach(({ field, tips }) => {
    if (!loginForm.value[field]) {
      window.$message.warning(tips);
      isSuccess = false;
    }
  });

  return isSuccess;
}

async function serverLogin() {
  isLock.value = true;
  window.$message.loading('登录中, 请稍等', { key: 'login' });
  const token = await authApi.login(loginForm.value);
  if (token) {
    setToken(token);

    //  如果选择了记住密码，则保存
    if (isRemember.value) {
      saveLoginInfo();
    }

    //  初始化权限
    await initUserPermission();

    const duration = 3000;
    window.$message.success('登录成功, 即将跳转至首页', {
      key: 'login',
      duration,
      onAfterLeave() {
        goHome();
      },
    });
  } else {
    window.$message.destroy('login', 0);
    captchaRef.value?.getCaptchaUrl();
  }
  isLock.value = false;
}
</script>

<style scoped></style>
