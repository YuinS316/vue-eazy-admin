import { createApp } from 'vue';
import App from './App.vue';
import 'uno.css';
import { setupStore } from './store';
import { setupDiscreteApi } from './utils/navie-tools';
import { setupRouter } from './router';

async function bootstrap() {
  const app = createApp(App);
  setupStore(app);
  setupRouter(app);
  setupDiscreteApi();
  app.mount('#app');
}

bootstrap();
