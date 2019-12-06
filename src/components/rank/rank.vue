<template>
    <div class="rank" ref="rank">
        <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright" class="rank" ref="wapper">
            <scroll @scroll="scroll" class="toplist" ref="toplist" :data="topList" :listen-scroll="listenScroll"
                    :probe-type="probeType">
                <ul>
                    <li v-for="(group,index) in topList" :key="index" ref="listGroup">
                        <h2 class="list-group-title">{{group.groupName}}</h2>
                        <ul>
                            <li class="item" v-for="(item,index) in group.topList" :key="index"
                                @click="selectItem(item)">
                                <div class="icon">
                                    <img width="100" height="100" v-lazy="item.picUrl" style="border-radius: 5px"/>
                                </div>
                                <ul class="songlist">
                                    <li class="song" v-for="(song,index) in item.rankSong" :key="index">
                                        <span>{{index + 1}} 、</span>
                                        <span>{{song.songName}}-{{song.singerName}}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="list-fixed" ref="fixed" v-show="fixedTitle">
                    <div class="fixed-title">{{fixedTitle}}</div>
                </div>
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
import { mapGetters, mapMutations } from 'vuex'

const TITLE_HEIGHT = 45
export default {
  mixins: [playlistMixin],
  components: { Scroll, Loading },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      topList: [],
      diff: -1
    }
  },
  created () {
    this._getTopList()
    this.probeType = 3
    this.listenScroll = true
    this.listHeight = []
  },
  computed: {
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.topList[this.currentIndex] ? this.topList[this.currentIndex].groupName : ''
    },
    ...mapGetters([
      'fullScreen'
    ])
  },
  beforeRouteLeave (to, from, next) {
    if (this.fullScreen) {
      next(false)
    } else {
      next()
    }
  },
  methods: {
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = this._normalizeTopList(res.topGroup)
        }
      })
    },
    _normalizeTopList (topGroup) {
      let map = {}
      topGroup.forEach(item => {
        map[item.groupId] = {
          groupName: item.groupName,
          topList: item.topList
        }
      })
      let topList = []
      for (let key in map) {
        let val = map[key]
        topList.push(val)
      }
      return topList
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.wapper.$el.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem (item) {
      this.flag = true
      this.$router.push({
        path: `/rank/${item.topId}`
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
  },
  watch: {
    topList () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
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
        overflow: hidden

        .toplist
            height: 100%

            .list-group-title
                text-align center
                height: 45px
                line-height: 45px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background

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
                    color: $color-text-d
                    font-size: $font-size-small

                    .song
                        no-wrap()
                        line-height: 26px

        .list-fixed
            position: absolute
            top: 0
            left: 0
            width: 100%

            .fixed-title
                height: 45px
                line-height: 45px
                padding-left: 20px
                text-align center
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background

        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>
