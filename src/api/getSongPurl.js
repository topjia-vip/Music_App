import axios from 'axios'
import { initSongMid } from '../common/js/util'
import { BASE_URL } from './config'

// 获取qq音乐播放地址
export function getSongPurl (list) {
  const songmids = initSongMid(list)

  const url = `${BASE_URL}/getSongPurl`
  let data = {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      'req': {
        'module': 'CDN.SrfCdnDispatchServer',
        'method': 'GetCdnDispatch',
        'param': { 'guid': '7275231575', 'calltype': 0, 'userip': '' }
      },
      'req_0': {
        'module': 'vkey.GetVkeyServer',
        'method': 'CgiGetVkey',
        'param': {
          'guid': '7275231575',
          'songmid': songmids,
          'songtype': [0],
          'uin': '1256957450',
          'loginflag': 1,
          'platform': '20'
        }
      },
      'comm': {
        'uin': 1256957450,
        'format': 'json',
        'ct': 24,
        'cv': 0
      }
    }
  }
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}
