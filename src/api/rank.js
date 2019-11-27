import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getTopList () {
  const url = `${BASE_URL}/getTopList`

  const data = {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMusicList (topid) {
  const url = `${BASE_URL}/getTopMusicList`

  const data = {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
