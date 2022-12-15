import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@/assets/css/tailwind.css'
import mitt from 'mitt'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import Loading from '@/components/common/Loading.vue'

const emitter = mitt()
const app = createApp(App)
app.config.globalProperties.emitter = emitter
app.use(store).use(router).mount('#app')
app.use(VueVirtualScroller)
app.component('loading', Loading)
