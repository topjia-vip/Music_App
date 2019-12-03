<template>
    <!--推荐页面模块-->
    <div class="recommend" ref="recommend">
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
            <sliber>
                <div v-for="(item,index) in recommends" :key="index">
                    <a :href="item.jumpInfo">
                        <img @load="loadImage" class="needsclick" :src="item.picInfo" style="height: 150px">
                    </a>
                </div>
            </sliber>
        </div>
        <h1 style="height: 65px" class="list-title" @click="changeSongList" ref="list">
            {{this.isHotSongList?'热门':'最新'}}歌单推荐</h1>
        <scroll ref="scroll" class="recommend-content" style="height: 100%" :data="discList">
            <div>
                <v-touch v-on:swipeleft="swiperleft">
                    <div class="recommend-list" ref="recommend_list">
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
                                        <h2 class="name" v-html="item.name"></h2>
                                        <p class="desc" v-html="item.dissName"></p>
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
import { mapMutations } from 'vuex'

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
      isHandleMini: false
    }
  },
  components: {
    Sliber,
    Scroll,
    Loading
  },
  created () {
    this._getRecommend()
    this._getDiscList(5)
  },
  mounted () {
    this.handleHeight()
    window.addEventListener('resize', () => {
      this.handleHeight()
    })
  },
  methods: {
    changeSongList () {
      this.isShow = false
      this.isHotSongList = !this.isHotSongList
      const sortId = this.isHotSongList ? 5 : 2
      setTimeout(() => {
        this.$refs.scroll.scrollTo(0, 0, 0)
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
      const listHeight = this.$refs.list.clientHeight
      // this.$refs.sliderWrapper.height = Math.floor(baseHeight * 0.20718)
      // const sliderWrapperHeight = this.$refs.sliderWrapper.height
      this.$refs.scroll.$el.style.height = `${(baseHeight - listHeight - 162.8)}px`
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

        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>
