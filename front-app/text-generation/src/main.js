import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router/router.js';
import en from './locale/en.json';
import ru from './locale/ru.json';
import './assets/style.css';
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const i18n = createI18n({
    locale: localStorage.getItem('lang') || 'en',
    fallbackLocale: 'en',
    messages: {
      en,
      ru
    }
  });
  
  const app = createApp(App);
  app.use(i18n);
  app.use(router);
  app.use(Toast, {
    position: POSITION.TOP_RIGHT, // Уведомления будут справа сверху
    timeout: 3000, // Закроются через 3 секунды
  });
  app.mount('#app');
  