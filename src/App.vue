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
  components: {
    Tab,
    MHeader,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    #app
        margin-top 30px
        color: $color-theme
</style>
