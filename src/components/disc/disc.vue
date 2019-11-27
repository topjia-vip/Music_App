<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '../../components/music-list/music-list'
import { getSongList } from '../../api/recommend'
import { ERR_OK } from '../../api/config'
import { mapGetters } from 'vuex'
import { createCdSong } from '../../common/js/song'
import { getSongPurl } from '../../api/getSongPurl'

export default {
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs (list) {
      // 与歌手歌单返回的数据结构不同，做特殊处理
      let ret = []
      let midurlinfo = []
      getSongPurl(list).then(res => {
        if (res.code === ERR_OK) {
          midurlinfo = res.req_0.data.midurlinfo
        }
        for (let i = 0; i < midurlinfo.length; i++) {
          let musicData = list[i]
          let purl = midurlinfo[i].purl
          if (purl) {
            ret.push(createCdSong(musicData, purl))
          }
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>
