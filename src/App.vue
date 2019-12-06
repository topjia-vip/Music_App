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
import { mapGetters, mapMutations } from 'vuex'

import 'vue2-animate/dist/vue2-animate.min.css'
import { getSongPlayVkey } from './api/song'
import { ERR_OK } from './api/config'

export default {
  components: {
    Tab,
    MHeader,
    Player
  },
  mounted () {
    // 初始化我喜欢和历史播放记录中歌曲的播放链接，因为qq音乐vkey有时间限制
    this._initSongList()
  },
  methods: {
    getSongMids (songs) {
      let songMids = '['
      for (let i = 0; i < songs.length; i++) {
        if (i !== songs.length - 1) {
          songMids += '"' + songs[i].mid + '",'
        } else {
          songMids += '"' + songs[i].mid + '"]'
        }
      }
      if (songMids === '[') {
        return ''
      }
      return songMids
    },
    _initSongList () {
      let favoriteListSongMids = this.getSongMids(this.favoriteList)
      let playHistorySongMids = this.getSongMids(this.playHistory)
      if (this.favoriteList.length > 0) {
        this.isShow = true
        getSongPlayVkey(favoriteListSongMids).then(res => {
          this.isShow = false
          if (res.code === ERR_OK) {
            this.setFavoriteList(res.data)
          }
        })
      }
      if (this.playHistory.length > 0) {
        getSongPlayVkey(playHistorySongMids).then(res => {
          if (res.code === ERR_OK) {
            this.setPlayHistory(res.data)
          }
        })
      }
    },
    ...mapMutations({
      setFavoriteList: 'MODIFY_FAVORITE_LIST_SONG_PLAY_URL',
      setPlayHistory: 'MODIFY_PLAY_HISTORY_SONG_PLAY_URL'
    })
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    #app
        margin-top 30px
        color: $color-theme
</style>
