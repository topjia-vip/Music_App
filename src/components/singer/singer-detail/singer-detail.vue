<template>
    <transition name="slide">
        <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '../../../api/singer'
import { ERR_OK } from '../../../api/config'
import { createSong } from '../../../common/js/song'
import MusicList from '../../music-list/music-list'
import { getSongPurl } from '../../../api/getSongPurl'

export default {
  name: 'singer-detail',
  components: { MusicList },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      const singer = this.singer
      if (!singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      let midurlinfo = []
      getSongPurl(list).then(res => {
        if (res.code === ERR_OK) {
          midurlinfo = res.req_0.data.midurlinfo
        }
        for (let i = 0; i < midurlinfo.length; i++) {
          let { musicData } = list[i]
          let purl = midurlinfo[i].purl
          if (purl) {
            ret.push(createSong(musicData, purl))
          }
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>
