import { createApp,  } from 'vue'
import App from './App.vue'
import Router from '@/router';
import './styles/index.css';
import BcComponent from './components/index';

const app = createApp(App)
app.use(BcComponent)
app.use(Router);
app.mount('#app')
