import { it, expect, describe, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { Router, RouterView, createRouter, createWebHistory } from 'vue-router';
import { setupPermissionGuard } from '../guards/permission';
import { useAuthStore } from '@/store/modules/auth';
// import Home from '@/views/home/index.vue';
// import Login from '@/views/login/index.vue';
// import NotFound from '@/views/error/404.vue';
import { routeMap } from '@/constants';

describe('router', () => {
  const TestApp = defineComponent({
    render() {
      return h(RouterView, {});
    },
  });

  const Home = defineComponent({
    render() {
      return h('div');
    },
  });

  const Login = defineComponent({
    render() {
      return h('div');
    },
  });

  const NotFound = defineComponent({
    render() {
      return h('div');
    },
  });

  let router: Router;

  beforeEach(() => {
    setActivePinia(createPinia());

    router = createRouter({
      history: createWebHistory('/'),
      routes: [
        {
          name: 'Login',
          path: routeMap.login,
          component: Login,
          meta: {
            layout: 'empty',
          },
        },
        {
          name: 'Home',
          path: routeMap.home,
          component: Home,
        },
        {
          name: '404',
          path: routeMap.noPath,
          component: NotFound,
          meta: {
            layout: 'empty',
          },
        },
      ],
    });
  });

  it('happy path', async () => {
    router.push('/');
    await router.isReady();
    const wrapper = await mount(TestApp, {
      global: {
        plugins: [router],
      },
    });
    expect(wrapper.findComponent(Home).exists()).toBe(true);
  });

  describe('test permission guard', () => {
    beforeEach(() => {
      setupPermissionGuard(router);
    });

    it('should redirect to Login when no token', async () => {
      router.push('/');
      await router.isReady();

      const wrapper = await mount(TestApp, {
        global: {
          plugins: [router],
        },
      });
      expect(wrapper.findComponent(Login).exists()).toBe(true);
    });

    it('should not redirect to Login when has token', async () => {
      const { setToken } = useAuthStore();
      setToken('123');

      router.push('/');
      await router.isReady();

      const wrapper = await mount(TestApp, {
        global: {
          plugins: [router],
        },
      });
      expect(wrapper.findComponent(Home).exists()).toBe(true);
    });

    it('should redirect to 404 when page is not found', async () => {
      const { setToken } = useAuthStore();
      setToken('123');

      router.push('/qwer');

      await router.isReady();

      const wrapper = await mount(TestApp, {
        global: {
          plugins: [router],
        },
      });
      expect(wrapper.findComponent(NotFound).exists()).toBe(true);
    });
  });
});
