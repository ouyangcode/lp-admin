
import request from '@/utils/request'
import qs from 'qs'

export function gameCodeList() {
  return request({
    url: '/api/gmDateRetainedReport/getGameList',
    method: 'get'
  })
}
// export function gameCodeList() {
//   return request({
//     url: 'api/gmDateLoseRateReport/reportList',
//     method: 'get'
//   })
// }
export function download(params) {
  return request({
    url: '/api/gmDateLoseRateReport/download' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function todownForPage() {
  return request({
    url: '/api/gmDateLoseRateReport/download',
    method: 'get'
  })
}

export default { gameCodeList, download }
