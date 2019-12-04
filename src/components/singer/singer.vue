<template>
    <!--歌手页面模块-->
    <div class="singer" ref="singers">
        <v-touch v-on:swipeleft="swiperleft" v-on:swiperight="swiperright" class="singer" ref="wapper">
            <list-view @select="selectSinger" :data="singers" ref="list"/>
        </v-touch>
        <router-view/>
    </div>
</template>

<script>
import { getSingerList } from '../../api/singer'
import { ERR_OK } from '../../api/config'
import Singer from '../../common/js/singer'
import ListView from '../../base/listview/listview'
import { mapGetters, mapMutations } from 'vuex'
import { playlistMixin } from '../../common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'singer',
  mixins: [playlistMixin],
  data () {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  created () {
    this._getSingerList()
  },
  computed: {
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
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data)
        }
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            name: item.singerName,
            id: item.singerMid
          }))
        }
        const key = item.index
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.singerName,
          id: item.singerMid
        }))
      })
      // 处理map 得到有序列表
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.wapper.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    swiperleft: function () {
      this.$router.push({ 'path': '/rank' })
    },
    swiperright: function () {
      this.$router.push({ 'path': '/recommend' })
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
        position: fixed
        top: 118px
        bottom: 0
        width: 100%
</style>
