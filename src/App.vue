<template>
    <div id="app">
        <m-header/>
        <tab/>

        <transition
                name="fade"
        >
            <keep-alive>
                <router-view style="animation-duration: 0.8s"></router-view>
            </keep-alive>
        </transition>
        <player/>
    </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from './components/tab/tab'
import Player from './components/player/player'

import 'vue2-animate/dist/vue2-animate.min.css'

export default {
  data () {
    return {
      // 路由顺序，用与控制改变动画效果
      routerArr: ['/recommend', '/singer', '/rank', '/search'],
      isRight: false
    }
  },
  components: {
    Tab,
    MHeader,
    Player
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    '$route': 'getPath'
  },
  methods: {
    getPath (to, from) {
      const toIndex = this.routerArr.indexOf(to.path)
      const fromIndex = this.routerArr.indexOf(from.path)
      if (toIndex > fromIndex) {
        this.isRight = true
      } else {
        this.isRight = false
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    #app
        margin-top 30px
        color: $color-theme
</style>
