import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import './style/index.scss';
import 'element-ui/lib/theme-chalk/index.css';
import bcComponent from './components/index';
import './assets/icon/index';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(bcComponent);

new Vue({
  render: h => h(App)
}).$mount('#app')
