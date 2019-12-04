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
import { createSong } from '../../common/js/song'

export default {
  computed: {
    title () {
      return this.disc.dissName
    },
    bgImage () {
      return this.disc.imgUrl
    },
    ...mapGetters([
      'disc',
      'fullScreen'
    ])
  },
  data () {
    return {
      songs: []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.fullScreen) {
      next(false)
    } else {
      next()
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissId) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissId).then((res) => {
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
