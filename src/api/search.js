import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getHotKey () {
  const url = `${BASE_URL}/getHotKey`
  return axios.post(url).then(res => {
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
    catZhida: zhida ? 1 : 0
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
