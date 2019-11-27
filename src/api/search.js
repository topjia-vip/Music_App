import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getHotKey () {
  const url = `${BASE_URL}/getHotKey`
  const data = {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  }

  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function search (query, page, zhida, perpage) {
  const url = `${BASE_URL}/search`

  const data = {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 0,
    platform: 'yqq.json'
  }

  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
