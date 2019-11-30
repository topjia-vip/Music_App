import { getLyric } from '../../api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor ({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve) => {
      getLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.data.lyric)
          resolve(this.lyric)
        }
      })
    })
  }
}

export function createSong (song) {
  return new Song({
    id: song.id,
    mid: song.mid,
    singer: song.singer,
    name: song.name,
    album: song.album,
    duration: song.duration,
    image: song.image,
    url: song.url
  })
}
