import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getLyric (mid) {
  const url = `${BASE_URL}/getLyric`

  const data = {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date()
  }

  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
