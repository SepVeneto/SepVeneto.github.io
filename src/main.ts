import { createApp,  } from 'vue'
import App from './layout.vue'
import Router from '@/router';
import Store from '@/store';
import './styles/index.css';
import BcComponent from './components/index';

const app = createApp(App)
app.use(BcComponent)
app.use(Router);
app.use(Store);
app.mount('#app')
