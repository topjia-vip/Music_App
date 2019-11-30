import { commonParams, BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getRecommend () {
  const url = `${BASE_URL}/getRecommend`
  const data = {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      'focus': {
        'module': 'QQMusic.MusichallServer',
        'method': 'GetFocus',
        'param': {}
      }
    }
  }
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getDiscList () {
  const url = `${BASE_URL}/getDiscList`

  const data = {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  }

  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList (disstid) {
  const url = `${BASE_URL}/getCDInfo`

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })

  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}
