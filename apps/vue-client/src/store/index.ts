import type { App } from 'vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export function setupStore(app: App) {
  const pinia = createPinia();
  //  持久化插件
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);
}
