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
      'singer',
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
          this.songs = this._normalizeSongs(res.data)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((song) => {
        ret.push(createSong(song))
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
