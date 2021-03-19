
import request from '@/utils/request'
import qs from 'qs'

export function gameCodeLists() {
  return request({
    url: 'api/gmPayGameYearReport/getGameList',
    method: 'get'
  })
}
export function gameCodeList() {
  return request({
    url: 'api/gmPayGameYearReport/reportList',
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: '/api/gmPayGameYearReport/download' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { gameCodeList, download }
