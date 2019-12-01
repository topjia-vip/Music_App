import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import VueTouch from 'vue-touch'
import './common/stylus/index.styl'

/* eslint-disable no-new */
Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: require('common/image/loading.gif')
})

Vue.use(VueTouch, { name: 'v-touch' })
VueTouch.config.swipe = {
  // 设置左右滑动的距离
  threshold: 50
}
// 快速点击（移动端没有300ms的延迟）
fastclick.attach(document.body)

new Vue(
  {
    render: h => h(App),
    store,
    router
  }
).$mount('#app')
