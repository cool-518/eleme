import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App';
import router from './router/index.js';

import './common/stylus/index.styl';

Vue.use(VueResource);
// 主页的js
/* eslint-disable no-new */
// 将App挂载到index页面,并渲染
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
