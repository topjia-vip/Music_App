<template>
    <scroll ref="suggest"
            class="suggest"
            :data="result"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll"
    >
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title="加载中，请稍后"/>
        </ul>
        <div class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果" v-show="!hasMore && !result.length"/>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
import { search } from '../../api/search'
import { ERR_OK } from '../../api/config'
import { getSongPurl } from '../../api/getSongPurl'
import { createSong } from '../../common/js/song'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import Singer from '../../common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import NoResult from '../../base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  components: { NoResult, Loading, Scroll },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      page: 1,
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      result: [],
      showSinger: true
    }
  },
  methods: {
    search () {
      if (!this.query) {
        return
      }
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(r => {
            this.result = r
            this._checkMore(res.data)
          })
        }
      })
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(r => {
            this.result = this.result = this.result.concat(r)
            this._checkMore(res.data)
          })
        }
      })
    },
    _checkMore (data) {
      const song = data.song
      if ((!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum)) {
        this.hasMore = false
      }
    },
    _genResult: async function (data) {
      let ret = []
      if (data.zhida && data.zhida.zhida_singer) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        const res = await this._normalizeSongs(data.song.list)
        ret = ret.concat(res)
      }
      return ret
    },
    listScroll () {
      this.$emit('listScroll')
    },
    _normalizeSongs: async function (list) {
      let ret = []
      let midurlinfo = []
      const res = await getSongPurl(list)
      if (res.code === ERR_OK) {
        midurlinfo = res.req_0.data.midurlinfo
      }
      for (let i = 0; i < midurlinfo.length; i++) {
        let purl = midurlinfo[i].purl
        ret.push(createSong(list[i], purl))
      }
      return ret
    },
    getIconCls (item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    getDisplayName (item) {
      return item.type === TYPE_SINGER ? item.zhida_singer.singerName : `${item.name}-${item.singer}`
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singerData = {
          id: item.zhida_singer.singerMID,
          name: item.zhida_singer.singerName
        }
        const singer = new Singer(singerData)
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query () {
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

    .suggest
        height: 100%
        overflow: hidden

        .suggest-list
            padding: 0 30px

            .suggest-item
                display: flex
                align-items: center
                padding-bottom: 20px

            .icon
                flex: 0 0 30px
                width: 30px

                [class^="icon-"]
                    font-size: 14px
                    color: $color-text-d

            .name
                flex: 1
                font-size: $font-size-medium
                color: $color-text-d
                overflow: hidden

                .text
                    no-wrap()

        .no-result-wrapper
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>
