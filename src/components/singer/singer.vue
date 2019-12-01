<template>
    <!--歌手页面模块-->
    <div class="singer" ref="singers">
        <list-view @select="selectSinger" :data="singers" ref="list"/>
        <router-view/>
    </div>
</template>

<script>
import { getSingerList } from '../../api/singer'
import { ERR_OK } from '../../api/config'
import Singer from '../../common/js/singer'
import ListView from '../../base/listview/listview'
import { mapMutations } from 'vuex'
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
  mounted () {
    this._initTouch()
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _initTouch () {
      var router = this.$router
      this.$refs.singers.addEventListener('touchstart', (e) => {
        this.startX = e.touches[0].pageX
      })
      this.$refs.singers.addEventListener('touchmove', (e) => {
        var moveEndX = e.changedTouches[0].pageX
        this.X = moveEndX - this.startX
        // var X = moveEndX - this.startX
        // if (X < -50 || X > 50) {
        //   this.$refs.singers.style.left = X + 'px'
        // } else {
        //   this.$refs.singers.style.left = 0 + 'px'
        // }
      })
      this.$refs.singers.addEventListener('touchend', (e) => {
        // if (this.$refs.singers.offsetLeft < -100) {
        //   router.push('/rank')
        // }
        // if (this.$refs.singers.offsetLeft > 100) {
        //   router.push('/recommend')
        // }
        if (this.X < -100) {
          router.push('/rank')
        }
        if (this.X > 100) {
          router.push('/recommend')
        }
      })
    },
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
      this.$refs.singers.style.bottom = bottom
      this.$refs.list.refresh()
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
        top: 88px
        bottom: 0
        width: 100%
</style>
