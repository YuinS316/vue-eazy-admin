import { PersistancePlugin } from '@/utils/piniaPlugin/persistance';
import type { App } from 'vue';

export function setupStore(app: App) {
  const pinia = createPinia();
  //  持久化插件
  pinia.use(PersistancePlugin);
  app.use(pinia);
}
