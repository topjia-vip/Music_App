import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

// 获取歌手列表
export function getSingerList () {
  const url = `${BASE_URL}/getSingerList`
  return axios.post(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail (singerId) {
  const url = `${BASE_URL}/getSingerDetail`
  const data = {
    singermid: singerId
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
