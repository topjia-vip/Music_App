function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function initSongMid (list) {
  if (list.length === 0) {
    return
  }
  const songmids = []
  if (list[0] && list[0].mid) {
    // 处理普通歌单
    list.forEach((item) => {
      songmids.push(item.mid)
    })
  } else if (list[0].musicData && list[0].musicData.songmid) {
    // 处理歌手歌单
    list.forEach((item) => {
      let { musicData } = item
      songmids.push(musicData.songmid)
    })
  } else if (list[0].data && list[0].data.songmid) {
    // 处理排行榜歌单
    list.forEach(item => {
      let { data } = item
      songmids.push(data.songmid)
    })
  } else {
    // 处理搜索歌曲
    list.forEach(item => {
      songmids.push(item.songmid)
    })
  }
  return songmids
}
