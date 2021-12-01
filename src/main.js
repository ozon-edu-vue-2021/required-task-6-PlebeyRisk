import Vue from 'vue';
import App from './App.vue';
import VTooltipPlugin from 'v-tooltip';
import NotifyErrorPlugin from './plugins/notifyErrorPlugin';
import { RecycleScroller } from 'vue-virtual-scroller';

import 'normalize.css';
import './assets/css/global.css';
import 'v-tooltip/dist/v-tooltip.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

Vue.config.productionTip = false;

Vue.component('RecycleScroller', RecycleScroller);
Vue.use(VTooltipPlugin);
Vue.use(NotifyErrorPlugin);

new Vue({
  render: h => h(App),
}).$mount('#app');
