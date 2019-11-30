import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getTopList () {
  const url = `${BASE_URL}/getTopList`
  return axios.post(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMusicList (topid) {
  const url = `${BASE_URL}/getTopMusicList`

  const data = {
    topid
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
