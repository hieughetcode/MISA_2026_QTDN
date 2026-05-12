import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'
import router from './router'
import 'devextreme/dist/css/dx.light.css';

const app = createApp(App)

app.use(router) 
app.mount('#app')