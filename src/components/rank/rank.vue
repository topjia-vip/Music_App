<template>
    <div class="rank" ref="rank">
        <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright" class="rank" ref="wapper">
            <scroll class="toplist" ref="toplist" :data="topList">
                <ul>
                    <li class="item" v-for="(item,index) in topList" :key="index" @click="selectItem(item)">
                        <div class="icon">
                            <img width="100" height="100" v-lazy="item.picUrl"/>
                        </div>
                        <ul class="songlist">
                            <li class="song" v-for="(song,index) in item.songList" :key="index">
                                <span>{{index + 1}}</span>
                                <span>{{song.songname}}-{{song.singername}}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="loading-container" v-show="!topList.length">
                    <loading/>
                </div>
            </scroll>
        </v-touch>
        <router-view/>
    </div>
</template>

<script type="text/ecmascript-6">
import { getTopList } from '../../api/rank'
import { ERR_OK } from '../../api/config'
import Loading from '../../base/loading/loading'
import Scroll from '../../base/scroll/scroll'
import { playlistMixin } from '../../common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  components: { Scroll, Loading },
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.topList
        }
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.wapper.$el.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem (item) {
      this.flag = true
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    swiperleft: function () {
      this.$router.push({ 'path': '/search' })
    },
    swiperright: function () {
      this.$router.push({ 'path': '/singer' })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

    .rank
        position: fixed
        width: 100%
        top: 118px
        bottom: 0

        .toplist
            height: 100%
            overflow: hidden

            .item
                display: flex
                margin: 0 20px
                padding-top: 20px
                height: 100px

                &:last-child
                    padding-bottom: 20px

                .icon
                    flex: 0 0 100px
                    width: 100px
                    height: 100px

                .songlist
                    flex: 1
                    display: flex
                    flex-direction: column
                    justify-content: center
                    padding: 0 20px
                    height: 100px
                    overflow: hidden
                    background: $color-highlight-background
                    color: $color-text-d
                    font-size: $font-size-small

                    .song
                        no-wrap()
                        line-height: 26px

            .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)
</style>
