import '@/styles/index.scss';
import 'uno.css';
import { createApp } from 'vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupDiscreteApi } from './utils/navie-tools';
import { setupVxeTable } from './utils/vxe-tools';
import { setupRouter } from './router';

async function bootstrap() {
  const app = createApp(App);
  setupStore(app);
  setupDiscreteApi();
  setupVxeTable(app);
  await setupRouter(app);
  app.mount('#app');
}

bootstrap();
