import { commonParams, BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getRecommend () {
  const url = `${BASE_URL}/getRecommend`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getDiscList () {
  const url = `${BASE_URL}/getDiscList`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList (disstid) {
  const url = `${BASE_URL}/getCDInfo`

  const data = Object.assign({}, commonParams, {
    disstid
  })

  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}
