import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { authService } from './firebase/config'

import '@/assets/main.css'

let app

authService.onAuthStateChanged(() => {
	if (!app) {
		app = createApp(App).use(router).mount('#app')
	}
})
