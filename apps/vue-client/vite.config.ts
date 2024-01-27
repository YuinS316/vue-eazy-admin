/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import VueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, cwd());
  const { VITE_PROXY_URL } = viteEnv;

  return {
    test: {
      globals: true, // required
      setupFiles: ['vitest-localstorage-mock'],
      mockReset: false,
      environmentMatchGlobs: [['**/*.dom.spec.ts', 'happy-dom']],
    },
    plugins: [
      vue(),
      // VueDevTools(),
      Unocss(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './src/typings/auto-imports.d.ts',
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        dts: './src/typings/components.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(process.cwd(), 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            // 配置此项可在响应头中看到请求的真实地址
            proxy.on('proxyRes', (proxyRes, req) => {
              proxyRes.headers['x-real-url'] =
                new URL(req.url || '', options.target as string)?.href || '';
            });
          },
        },
      },
    },
    build: {
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          entryFileNames: `assets/entry/[name][hash].js`,
          chunkFileNames: `assets/chunk/[name][hash].js`,
          assetFileNames: `assets/file/[name][hash].[ext]`,
          //  手动拆包
          // manualChunks(id) {
          //   if (id.includes("node_modules")) {
          //     return "vendor" //代码分割为第三方包
          //   }
          //   if (id.includes("views/modules")) {
          //     return "views-modules" //代码分割为业务视图
          //   }
          //   if (id.includes("views/common")) {
          //     return "views-common" //代码分割为common页面登录页
          //   }
          // }
        },
      },
    },
  };
});
