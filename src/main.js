import Vue from 'vue';
import App from './App.vue';
import router from './router';

import '@/assets/styles/app.css';

// Import custom directives and plugins
import { Storage } from '@/shared/plugins';
import { clickOutside, Modal } from '@/shared/directives';

Vue.config.productionTip = false;

Vue.use(Storage, {
  storage: 'idb',
  dbName: 'ithaka-gallery-db',
  storeName: 'ithaka-gallery-store',
});

// Directives
Vue.directive('click-outside', clickOutside);
Vue.directive('modal', Modal);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
