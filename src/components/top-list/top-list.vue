<template>
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'

import MusicList from '../../components/music-list/music-list'
import { getMusicList } from '../../api/rank'
import { ERR_OK } from '../../api/config'
import { createSong } from '../../common/js/song'
import { getSongPurl } from '../../api/getSongPurl'

export default {
  name: 'toplist',
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
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
          let { data } = list[i]
          let purl = midurlinfo[i].purl
          if (purl) {
            ret.push(createSong(data, purl))
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
        transition: all 0.3s ease

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>
