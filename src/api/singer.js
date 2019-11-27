import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

// 获取歌手列表
export function getSingerList () {
  const url = `${BASE_URL}/getSingerList`

  const data = {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail (singerId) {
  const url = `${BASE_URL}/getSingerDetail`

  const data = {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
