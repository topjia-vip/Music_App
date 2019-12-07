<template>
    <!--推荐页面模块-->
    <div class="recommend" ref="recommend">
        <scroll ref="scroll" class="recommend-content" style="height: 100%" :listenScroll="listenScroll"
                :probe-type="probetype"
                :data="discList"
                @scroll="nowScrollY">
            <div>
                <div v-if="recommends.length" class="slider-wrapper" ref="slider_wrapper">
                    <sliber ref="sliderWrapper" :list="recommends"></sliber>
                </div>
                <v-touch v-on:swipeleft="swiperleft">
                    <div class="recommend-list" ref="recommend_list">
                        <h1 style="height: 65px" class="list-title" @click="changeSongList" ref="list">
                            {{this.isHotSongList?'热门':'最新'}}歌单推荐</h1>
                        <transition
                                name="fade"
                                enter-active-class="fadeInRight"
                                leave-active-class="fadeOutLeft"
                        >
                            <ul v-show="isShow">
                                <li @click="selectItem(item)" v-for="(item,index) in discList" :key="index"
                                    class="item">
                                    <div class="icon">
                                        <img width="60" height="60" v-lazy="item.imgUrl" style="border-radius: 5px"/>
                                    </div>
                                    <div class="text">
                                        <h2 class="name" v-html="item.dissName"></h2>
                                        <p class="desc" v-html="item.name"></p>
                                    </div>
                                </li>
                                <p v-show="discList.length" class="tip-title">😔已经到底了哦，没有更多歌单了</p>
                            </ul>
                        </transition>
                    </div>
                </v-touch>
            </div>
            <div class="loading-container" v-show="!discList.length">
                <loading/>
            </div>
        </scroll>
        <h1 v-show="showTitle" style="height: 65px" class="title" @click="changeSongList" ref="list">
            {{this.isHotSongList?'热门':'最新'}}歌单推荐</h1>
        <router-view></router-view>
    </div>
</template>

<script>
import { getRecommend, getDiscList } from '../../api/recommend'
import { ERR_OK } from '../../api/config'
import Sliber from '../../base/sliber/sliber'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import { playlistMixin } from '../../common/js/mixin'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'recommend',
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: [],
      isHotSongList: true,
      isShow: true,
      height: 0,
      isHandleMini: false,
      showTitle: false,
      scrollY: 0
    }
  },
  components: {
    Sliber,
    Scroll,
    Loading
  },
  created () {
    this.probetype = 3
    this.listenScroll = true
    this._getRecommend()
    this._getDiscList(5)
  },
  mounted () {
    this.handleHeight()
    window.addEventListener('resize', () => {
      this.handleHeight()
    })
  },
  computed: {
    ...mapGetters([
      'fullScreen'
    ])
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$refs.sliderWrapper) {
        vm.$refs.sliderWrapper.swiper.autoplay.start()
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.fullScreen) {
      next(false)
    } else {
      this.$refs.sliderWrapper.swiper.autoplay.stop()
      next()
    }
  },
  methods: {
    nowScrollY (pos) {
      this.scrollY = pos.y
    },
    changeSongList () {
      this.$refs.scroll.stop()
      this.isShow = false
      this.isHotSongList = !this.isHotSongList
      const sortId = this.isHotSongList ? 5 : 2
      setTimeout(() => {
        if (Math.abs(this.scrollY) < this.$refs.slider_wrapper.clientHeight) {
          this.$refs.scroll.scrollTo(0, this.scrollY, 300)
        } else {
          this.$refs.scroll.scrollTo(0, -(this.$refs.slider_wrapper.clientHeight), 300)
        }
        this._getDiscList(sortId)
      }, 500)
      setTimeout(() => {
        this.isShow = true
      }, 1000)
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data
        }
      })
    },
    _getDiscList (sortId) {
      getDiscList(sortId).then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.list
        }
      })
    },
    loadImage () {
      if (!this.checkLoading) {
        this.$refs.scroll.refresh()
        this.checkLoading = true
      }
    },
    handlePlaylist (playlist) {
      if (playlist.length > 0) {
        const bottom = '60px'
        this.$refs.recommend.style.bottom = bottom
        if (!this.isHandleMini) {
          this.isHandleMini = true
          const old = parseInt(this.$refs.scroll.$el.style.height.split('p')[0])
          this.$refs.scroll.$el.style.height = `${old - 60}px`
        }
        this.$refs.scroll.refresh()
      } else {
        this.$refs.recommend.style.bottom = ''
        if (this.isHandleMini) {
          this.isHandleMini = false
          const old = parseInt(this.$refs.scroll.$el.style.height.split('p')[0])
          this.$refs.scroll.$el.style.height = `${old + 60}px`
        }
        this.$refs.scroll.refresh()
      }
    },
    handleHeight () {
      const baseHeight = this.$refs.recommend.clientHeight
      this.$refs.scroll.$el.style.height = `${(baseHeight - 12.8)}px`
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissId}`
      })
      this.setDisc(item)
    },
    swiperleft: function () {
      this.$router.push({ 'path': '/singer' })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  watch: {
    scrollY (newY) {
      if (newY < 0) {
        if (Math.abs(newY) >= parseFloat(this.$refs.slider_wrapper.clientHeight)) {
          this.showTitle = true
        } else {
          this.showTitle = false
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"

    .recommend
        position: fixed
        width: 100%
        top: 118px
        bottom: 0

        .slider-wrapper
            position relative
            width: 100%
            overflow: hidden

        .list-title
            position relative
            height 65px
            line-height: 65px
            text-align: center
            font-size: $font-size-medium
            color: $color-theme

        .recommend-content
            height 100%
            overflow hidden

            .recommend-list
                .item
                    display: flex
                    box-sizing: border-box
                    align-items: center
                    padding: 0 20px 20px 20px

                .icon
                    flex: 0 0 60px
                    width: 60px
                    height: 60px
                    padding-right: 20px

                .text
                    display: flex
                    flex-direction: column
                    justify-content: center
                    flex: 1
                    line-height: 20px
                    overflow: hidden
                    font-size: $font-size-medium

                .name
                    margin-bottom: 10px
                    color: $color-text

                .desc
                    color: $color-text-d

                .tip-title
                    text-align: center;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.5);

        .title
            top 0px
            position absolute
            width 100%
            height 65px
            line-height: 65px
            text-align: center
            font-size: $font-size-medium
            color: $color-theme
            background $color-background

        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>
