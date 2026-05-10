import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'

// 1. Import router từ thư mục bạn vừa tạo
// (Nếu file tên là index.js thì chỉ cần trỏ đến thư mục router là Vue tự hiểu)
import router from './router' 

const app = createApp(App)

// 2. Bắt buộc phải có dòng này để Vue nhận diện được thẻ <router-view> và <router-link>
app.use(router) 

app.mount('#app')